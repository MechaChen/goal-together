from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.todo_item import TodoItem


async def get_progress(session: AsyncSession) -> dict[str, int | str]:
    total_result = await session.execute(select(func.count()).select_from(TodoItem))
    completed_result = await session.execute(
        select(func.count()).select_from(TodoItem).where(TodoItem.is_completed.is_(True))
    )
    total = int(total_result.scalar_one())
    completed = int(completed_result.scalar_one())
    percentage = 0 if total == 0 else int((completed / total) * 100)
    return {
        "total_count": total,
        "completed_count": completed,
        "percentage": percentage,
        "label": f"{completed}/{total}",
    }
