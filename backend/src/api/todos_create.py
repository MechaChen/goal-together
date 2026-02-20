from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.api.todo_create_schema import CreateTodoRequest
from src.services.db import get_db
from src.services.todo_repository import create_todo

router = APIRouter(prefix="/todos", tags=["todos"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def post_todo(payload: CreateTodoRequest, session: AsyncSession = Depends(get_db)):
    todo = await create_todo(session, payload.main_target)
    return {
        "id": todo.id,
        "main_target": todo.main_target,
        "is_completed": todo.is_completed,
        "created_at": todo.created_at.isoformat(),
        "updated_at": todo.updated_at.isoformat(),
    }
