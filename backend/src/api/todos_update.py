from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.api.todo_create_schema import UpdateTodoRequest
from src.services.db import get_db
from src.services.todo_repository import ValidationError
from src.services.todo_repository import update_todo

router = APIRouter(prefix="/todos", tags=["todos"])


@router.patch("/{todo_id}")
async def patch_todo(todo_id: str, payload: UpdateTodoRequest, session: AsyncSession = Depends(get_db)):
    if payload.main_target is None and payload.is_completed is None:
        raise ValidationError("at least one field must be provided")
    todo = await update_todo(session, todo_id, payload.main_target, payload.is_completed)
    return {
        "id": todo.id,
        "main_target": todo.main_target,
        "is_completed": todo.is_completed,
        "created_at": todo.created_at.isoformat(),
        "updated_at": todo.updated_at.isoformat(),
    }
