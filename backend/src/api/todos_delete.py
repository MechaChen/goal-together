from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.services.db import get_db
from src.services.todo_repository import delete_todo

router = APIRouter(prefix="/todos", tags=["todos"])


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_todo(todo_id: str, session: AsyncSession = Depends(get_db)):
    await delete_todo(session, todo_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
