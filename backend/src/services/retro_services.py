import datetime as dt

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, or_, select

from src.models.retro_entry import RetroEntry
from src.models.life_playbook import LifePlaybook
from src.models.reward_event import RewardEvent
from src.models.token_wallet import TokenWallet
from src.services.reward_ledger import DEFAULT_USER_ID


DAILY_RETRO_REWARD = 100
DEFAULT_PAGE_SIZE = 5
MAX_PAGE_SIZE = 50

# Daily Retro services

async def _get_or_create_wallet(session: AsyncSession, user_id: str = DEFAULT_USER_ID) -> TokenWallet:
    wallet = await session.get(TokenWallet, user_id)
    if wallet:
        return wallet

    wallet = TokenWallet(user_id=user_id, balance=0, rewarded_retro_count=0)
    session.add(wallet)
    await session.flush()
    return wallet


async def get_retro_by_id(session: AsyncSession, retro_id: str) -> RetroEntry | None:
    return await session.get(RetroEntry, retro_id)


async def create_retro(
    session: AsyncSession,
    entry_date: dt.date,
    content: str,
    user_id: str = DEFAULT_USER_ID,
) -> dict[str, object]:
    # 1. normalize content
    # 2. get or create wallet
    # 3. get retro entry
    # 4. check if retro entry already exists
        # 4-1. if exists, update content
        # 4-2. if not exists, create new retro entry, and create reward event
    # 5. commit and refresh the session
    # 6. return the response
    normalized_content = content.strip()
    if not normalized_content:
        return ValueError("retro content cannot be empty")

    existing_entry = await get_daily_retro(session, entry_date)
    if existing_entry:
        raise ValueError("retro for this date already exists")

    wallet = await _get_or_create_wallet(session, user_id)
    
    entry = RetroEntry(
        entry_date=entry_date,
        content=normalized_content,
        rewarded=True,
    )
    session.add(entry)

    wallet.balance += DAILY_RETRO_REWARD
    wallet.rewarded_completion_count += 1

    reward_event = RewardEvent(
        user_id=user_id,
        task_id=None,
        event_type="DAILY_RETRO",
        token_amount=DAILY_RETRO_REWARD,
        rewarded_completion_counter=wallet.rewarded_completion_count,
        idempotency_key=f"DAILY_RETRO:{entry_date.isoformat()}",
    )
    session.add(reward_event)

    await session.commit()
    await session.refresh(wallet)
    await session.refresh(entry)

    return {
        "entry": entry,
        "reward": {
            "granted": True,
            "amount": reward_amount,
        },
        "wallet_balance": wallet.balance,
    }

async def update_retro(
    session: AsyncSession,
    entry_date: dt.date,
    content: str,
) -> dict[str, object]:
    normalized_content = content.strip()
    if not normalized_content:
        raise ValueError("retro content cannot be empty")

    entry = await session.get(RetroEntry, retro_id)
    if not entry:
        return None

    entry.content = normalized_content
    await session.commit()
    await session.refresh(entry)
    return entry

# Retro History services

def _decode_cursor(cursor: str) -> tuple[dt.date, str]:
    date_part, entry_id = cursor.split("|", 1)
    return dt.date.fromisoformat(date_part), entry_id


def _encode_cursor(entry_date: dt.date, entry_id: str) -> str:
    return f"{entry_date.isoformat()}|{entry_id}"


async def list_retros(
    session: AsyncSession,
    cursor: str | None = None,
    limit: int = DEFAULT_PAGE_SIZE,
) -> dict[str, object]:
    # 1. decode cursor
    # 2. get retro entries
    # 3. return the response
    normalized_limit = max(1, min(limit, MAX_PAGE_SIZE))

    query = select(RetroEntry)

    if cursor:
        cursor_date, cursor_id = _decode_cursor(cursor)

        is_earlier_date = RetroEntry.entry_date < cursor_date
        is_same_date_but_earlier_id = and_(
            RetroEntry.entry_date == cursor_date,
            RetroEntry.id < cursor_id,
        )

        query = query.where(
            or_(
                is_earlier_date,
                is_same_date_but_earlier_id,
            )
        )

    query = (
        query.order_by(RetroEntry.entry_date.desc(), RetroEntry.id.desc())
        .limit(normalized_limit + 1)
    )

    result = await session.execute(query)
    items = list(result.scalars().all())

    has_more = len(items) > normalized_limit
    page_items = items[:normalized_limit]
    next_cursor = _encode_cursor(page_items[-1]) if has_more else None

    return {
        "items": page_items,
        "next_cursor": next_cursor,
        "has_more": has_more,
    }