from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import TaskResponse
from src.services.db import get_db
from src.services.hierarchy_repository import confirm_task

router = APIRouter(tags=["tasks"])


@router.post("/tasks/{task_id}/confirm", response_model=TaskResponse)
async def post_task_confirm(task_id: str, session: AsyncSession = Depends(get_db)):
    item = await confirm_task(session, task_id=task_id)
    return {
        "id": item.id,
        "sub_goal_id": item.sub_goal_id,
        "title": item.title,
        "lifecycle_state": item.lifecycle_state,
        "is_completed": item.is_completed,
        "first_rewarded_completion_at": item.first_rewarded_completion_at.isoformat()
        if item.first_rewarded_completion_at
        else None,
    }
