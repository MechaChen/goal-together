from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.services.db import get_db
from src.services.todo_repository import toggle_todo

router = APIRouter(prefix="/todos", tags=["todos"])


@router.post("/{todo_id}/toggle")
async def post_toggle(todo_id: str, session: AsyncSession = Depends(get_db)):
    todo = await toggle_todo(session, todo_id)
    return {
        "id": todo.id,
        "main_target": todo.main_target,
        "is_completed": todo.is_completed,
        "created_at": todo.created_at.isoformat(),
        "updated_at": todo.updated_at.isoformat(),
    }
