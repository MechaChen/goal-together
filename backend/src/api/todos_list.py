from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.services.db import get_db
from src.services.todo_repository import list_todos

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("")
async def get_todos(session: AsyncSession = Depends(get_db)):
    todos = await list_todos(session)
    return {
        "items": [
            {
                "id": t.id,
                "main_target": t.main_target,
                "is_completed": t.is_completed,
                "created_at": t.created_at.isoformat(),
                "updated_at": t.updated_at.isoformat(),
            }
            for t in todos
        ]
    }
