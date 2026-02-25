import datetime as dt

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.main_goal import MainGoal
from src.models.reward_event import RewardEvent
from src.models.sub_goal import SubGoal
from src.models.task_item import TaskItem
from src.models.token_wallet import TokenWallet
from src.services.service_errors import ConflictError, NotFoundError

DEFAULT_USER_ID = "default-user"
TASK_REWARD = 10
SUBGOAL_NEAR_COMPLETE_THRESHOLD = 0.6
SUBGOAL_NEAR_COMPLETE_REWARD = 30
SUBGOAL_COMPLETE_REWARD = 50
SUBGOAL_MANUAL_COMPLETE_REWARD = 200
MAIN_GOAL_MANUAL_COMPLETE_REWARD = 500


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


def _progress_from_counts(completed_count: int, total_count: int) -> dict[str, int]:
    percentage = int((completed_count / total_count) * 100) if total_count > 0 else 0
    return {
        "completed_count": completed_count,
        "total_count": total_count,
        "percentage": percentage,
    }


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

    await session.flush()
    total_tasks_result = await session.execute(
        select(func.count()).select_from(TaskItem).where(TaskItem.sub_goal_id == task.sub_goal_id)
    )
    completed_tasks_result = await session.execute(
        select(func.count()).select_from(TaskItem).where(
            TaskItem.sub_goal_id == task.sub_goal_id,
            TaskItem.is_completed.is_(True),
        )
    )
    total_tasks = int(total_tasks_result.scalar_one())
    completed_tasks = int(completed_tasks_result.scalar_one())
    progress = (completed_tasks / total_tasks) if total_tasks > 0 else 0.0

    extra_reward = 0
    extra_reward_type: str | None = None
    extra_reward_message: str | None = None

    if progress >= 1.0:
        bonus_key = f"SUBGOAL_COMPLETE:{task.sub_goal_id}"
        if not await _event_exists(session, bonus_key):
            extra_reward = SUBGOAL_COMPLETE_REWARD
            extra_reward_type = "SUBGOAL_COMPLETE"
            extra_reward_message = "You Snailed it! Awesome job"
    elif progress >= SUBGOAL_NEAR_COMPLETE_THRESHOLD:
        bonus_key = f"SUBGOAL_NEAR_COMPLETE:{task.sub_goal_id}"
        if not await _event_exists(session, bonus_key):
            extra_reward = SUBGOAL_NEAR_COMPLETE_REWARD
            extra_reward_type = "SUBGOAL_NEAR_COMPLETE"
            extra_reward_message = "Almost there! Enjoy a treat."

    if extra_reward_type and extra_reward > 0:
        wallet.balance += extra_reward
        bonus_event = RewardEvent(
            user_id=user_id,
            task_id=task.id,
            event_type=extra_reward_type,
            token_amount=extra_reward,
            rewarded_completion_counter=wallet.rewarded_completion_count,
            idempotency_key=f"{extra_reward_type}:{task.sub_goal_id}",
        )
        session.add(bonus_event)

    await session.commit()
    await session.refresh(wallet)
    await session.refresh(task)

    return {
        "task_reward": TASK_REWARD,
        "extra_reward": extra_reward,
        "extra_reward_type": extra_reward_type,
        "extra_reward_message": extra_reward_message,
        "rewarded_completion_count": wallet.rewarded_completion_count,
        "wallet_balance": wallet.balance,
        "task": task,
    }


async def complete_sub_goal(session: AsyncSession, sub_goal_id: str, user_id: str = DEFAULT_USER_ID) -> dict[str, object]:
    sub_goal = await session.get(SubGoal, sub_goal_id)
    if not sub_goal:
        raise NotFoundError("sub goal not found")
    if sub_goal.is_completed:
        raise ConflictError("sub goal already completed previously")

    total_tasks_result = await session.execute(
        select(func.count()).select_from(TaskItem).where(TaskItem.sub_goal_id == sub_goal_id)
    )
    completed_tasks_result = await session.execute(
        select(func.count()).select_from(TaskItem).where(
            TaskItem.sub_goal_id == sub_goal_id,
            TaskItem.is_completed.is_(True),
        )
    )
    total_tasks = int(total_tasks_result.scalar_one())
    completed_tasks = int(completed_tasks_result.scalar_one())
    progress = _progress_from_counts(completed_tasks, total_tasks)
    if total_tasks == 0 or completed_tasks < total_tasks:
        raise ConflictError(
            f"cannot complete sub goal yet: {progress['percentage']}% ({completed_tasks}/{total_tasks}) tasks completed"
        )

    reward_key = f"SUBGOAL_MANUAL_COMPLETE:{sub_goal_id}"
    if await _event_exists(session, reward_key):
        raise ConflictError("sub goal already completed previously")

    wallet = await _get_or_create_wallet(session, user_id=user_id)
    now = dt.datetime.now(dt.timezone.utc)
    sub_goal.is_completed = True
    sub_goal.completed_at = now
    wallet.balance += SUBGOAL_MANUAL_COMPLETE_REWARD
    reward_event = RewardEvent(
        user_id=user_id,
        task_id=None,
        event_type="SUBGOAL_MANUAL_COMPLETE",
        token_amount=SUBGOAL_MANUAL_COMPLETE_REWARD,
        rewarded_completion_counter=wallet.rewarded_completion_count,
        idempotency_key=reward_key,
    )
    session.add(reward_event)
    await session.commit()
    await session.refresh(wallet)
    await session.refresh(sub_goal)
    return {
        "sub_goal_id": sub_goal.id,
        "is_completed": sub_goal.is_completed,
        "completed_at": sub_goal.completed_at,
        "reward_granted": True,
        "reward_amount": SUBGOAL_MANUAL_COMPLETE_REWARD,
        "wallet_balance": wallet.balance,
        "progress": progress,
    }


async def complete_main_goal(session: AsyncSession, main_goal_id: str, user_id: str = DEFAULT_USER_ID) -> dict[str, object]:
    main_goal = await session.get(MainGoal, main_goal_id)
    if not main_goal:
        raise NotFoundError("main goal not found")
    if main_goal.is_completed:
        raise ConflictError("main goal already completed previously")

    total_sub_goals_result = await session.execute(
        select(func.count()).select_from(SubGoal).where(SubGoal.main_goal_id == main_goal_id)
    )
    completed_sub_goals_result = await session.execute(
        select(func.count()).select_from(SubGoal).where(
            SubGoal.main_goal_id == main_goal_id,
            SubGoal.is_completed.is_(True),
        )
    )
    total_sub_goals = int(total_sub_goals_result.scalar_one())
    completed_sub_goals = int(completed_sub_goals_result.scalar_one())
    progress = _progress_from_counts(completed_sub_goals, total_sub_goals)
    if total_sub_goals == 0 or completed_sub_goals < total_sub_goals:
        raise ConflictError(
            f"cannot complete main goal yet: {progress['percentage']}% ({completed_sub_goals}/{total_sub_goals}) sub goals completed"
        )

    reward_key = f"MAIN_GOAL_MANUAL_COMPLETE:{main_goal_id}"
    if await _event_exists(session, reward_key):
        raise ConflictError("main goal already completed previously")

    wallet = await _get_or_create_wallet(session, user_id=user_id)
    now = dt.datetime.now(dt.timezone.utc)
    main_goal.is_completed = True
    main_goal.completed_at = now
    wallet.balance += MAIN_GOAL_MANUAL_COMPLETE_REWARD
    reward_event = RewardEvent(
        user_id=user_id,
        task_id=None,
        event_type="MAIN_GOAL_MANUAL_COMPLETE",
        token_amount=MAIN_GOAL_MANUAL_COMPLETE_REWARD,
        rewarded_completion_counter=wallet.rewarded_completion_count,
        idempotency_key=reward_key,
    )
    session.add(reward_event)
    await session.commit()
    await session.refresh(wallet)
    await session.refresh(main_goal)
    return {
        "main_goal_id": main_goal.id,
        "is_completed": main_goal.is_completed,
        "completed_at": main_goal.completed_at,
        "reward_granted": True,
        "reward_amount": MAIN_GOAL_MANUAL_COMPLETE_REWARD,
        "wallet_balance": wallet.balance,
        "progress": progress,
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
