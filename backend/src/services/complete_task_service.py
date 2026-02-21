from sqlalchemy.ext.asyncio import AsyncSession

from src.services.hierarchy_repository import get_task
from src.services.reward_ledger import grant_completion_reward


async def complete_task(session: AsyncSession, task_id: str) -> dict[str, object]:
    task = await get_task(session, task_id)
    return await grant_completion_reward(session, task)
