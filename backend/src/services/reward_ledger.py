import datetime as dt

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.reward_event import RewardEvent
from src.models.task_item import TaskItem
from src.models.token_wallet import TokenWallet
from src.services.reward_milestone_service import MILESTONE_REWARD, should_grant_milestone
from src.services.service_errors import ConflictError

DEFAULT_USER_ID = "default-user"
TASK_REWARD = 10


async def _get_or_create_wallet(session: AsyncSession, user_id: str = DEFAULT_USER_ID) -> TokenWallet:
    wallet = await session.get(TokenWallet, user_id)
    if wallet:
        return wallet
    wallet = TokenWallet(user_id=user_id, balance=0, rewarded_completion_count=0)
    session.add(wallet)
    await session.flush()
    return wallet


async def _event_exists(session: AsyncSession, idempotency_key: str) -> bool:
    result = await session.execute(
        select(RewardEvent.id).where(RewardEvent.idempotency_key == idempotency_key)
    )
    return result.scalar_one_or_none() is not None


async def grant_completion_reward(session: AsyncSession, task: TaskItem, user_id: str = DEFAULT_USER_ID) -> dict[str, object]:
    if task.lifecycle_state != "confirmed":
        raise ConflictError("only confirmed tasks can earn token rewards")
    if task.first_rewarded_completion_at is not None:
        raise ConflictError("already completed previously")

    wallet = await _get_or_create_wallet(session, user_id=user_id)

    completion_key = f"TASK_COMPLETE:{task.id}"
    if await _event_exists(session, completion_key):
        raise ConflictError("already completed previously")

    now = dt.datetime.now(dt.timezone.utc)
    task.first_rewarded_completion_at = now
    task.is_completed = True

    wallet.balance += TASK_REWARD
    wallet.rewarded_completion_count += 1

    completion_event = RewardEvent(
        user_id=user_id,
        task_id=task.id,
        event_type="TASK_COMPLETE",
        token_amount=TASK_REWARD,
        rewarded_completion_counter=wallet.rewarded_completion_count,
        idempotency_key=completion_key,
    )
    session.add(completion_event)

    milestone_event = None
    if should_grant_milestone(wallet.rewarded_completion_count):
        milestone_key = f"MILESTONE_5X:{wallet.rewarded_completion_count}"
        if not await _event_exists(session, milestone_key):
            wallet.balance += MILESTONE_REWARD
            milestone_event = RewardEvent(
                user_id=user_id,
                task_id=task.id,
                event_type="MILESTONE_5X",
                token_amount=MILESTONE_REWARD,
                rewarded_completion_counter=wallet.rewarded_completion_count,
                idempotency_key=milestone_key,
            )
            session.add(milestone_event)

    await session.commit()
    await session.refresh(wallet)
    await session.refresh(task)

    return {
        "task_reward": TASK_REWARD,
        "milestone_reward": MILESTONE_REWARD if milestone_event else 0,
        "milestone_applied": milestone_event is not None,
        "rewarded_completion_count": wallet.rewarded_completion_count,
        "wallet_balance": wallet.balance,
        "task": task,
    }


async def get_wallet_summary(session: AsyncSession, user_id: str = DEFAULT_USER_ID) -> dict[str, int | str]:
    wallet = await _get_or_create_wallet(session, user_id=user_id)
    await session.commit()
    return {
        "user_id": wallet.user_id,
        "balance": wallet.balance,
        "rewarded_completion_count": wallet.rewarded_completion_count,
    }


async def get_reward_history(session: AsyncSession, user_id: str = DEFAULT_USER_ID) -> list[RewardEvent]:
    result = await session.execute(
        select(RewardEvent)
        .where(RewardEvent.user_id == user_id)
        .order_by(RewardEvent.created_at.desc())
    )
    return list(result.scalars().all())
