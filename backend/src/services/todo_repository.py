from typing import Sequence
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.todo_item import TodoItem


class ValidationError(ValueError):
    pass


class NotFoundError(LookupError):
    pass


class CapacityError(RuntimeError):
    pass


def _normalize_target(main_target: str) -> str:
    value = main_target.strip()
    if not value:
        raise ValidationError("main_target is required")
    if len(value) > 200:
        raise ValidationError("main_target must be <= 200 chars")
    return value


async def list_todos(session: AsyncSession) -> Sequence[TodoItem]:
    result = await session.execute(select(TodoItem).order_by(TodoItem.created_at.asc()))
    return result.scalars().all()


async def count_todos(session: AsyncSession) -> int:
    result = await session.execute(select(func.count()).select_from(TodoItem))
    return int(result.scalar_one())


async def create_todo(session: AsyncSession, main_target: str) -> TodoItem:
    if await count_todos(session) >= 5:
        raise CapacityError("maximum of 5 todos reached")
    todo = TodoItem(main_target=_normalize_target(main_target), is_completed=False)
    session.add(todo)
    await session.commit()
    await session.refresh(todo)
    return todo


async def get_todo(session: AsyncSession, todo_id: str) -> TodoItem:
    todo = await session.get(TodoItem, todo_id)
    if not todo:
        raise NotFoundError("todo not found")
    return todo


async def update_todo(session: AsyncSession, todo_id: str, main_target: str | None = None, is_completed: bool | None = None) -> TodoItem:
    todo = await get_todo(session, todo_id)
    if main_target is not None:
        todo.main_target = _normalize_target(main_target)
    if is_completed is not None:
        todo.is_completed = is_completed
    await session.commit()
    await session.refresh(todo)
    return todo


async def toggle_todo(session: AsyncSession, todo_id: str) -> TodoItem:
    todo = await get_todo(session, todo_id)
    todo.is_completed = not todo.is_completed
    await session.commit()
    await session.refresh(todo)
    return todo


async def delete_todo(session: AsyncSession, todo_id: str) -> None:
    todo = await get_todo(session, todo_id)
    await session.delete(todo)
    await session.commit()
