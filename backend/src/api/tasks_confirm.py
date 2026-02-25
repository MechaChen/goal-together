from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import BulkConfirmDraftTasksResponse, TaskResponse
from src.services.db import get_db
from src.services.hierarchy_repository import confirm_all_draft_tasks, confirm_task

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


@router.post("/sub-goals/{sub_goal_id}/tasks/confirm-drafts", response_model=BulkConfirmDraftTasksResponse)
async def post_sub_goal_confirm_drafts(sub_goal_id: str, session: AsyncSession = Depends(get_db)):
    return await confirm_all_draft_tasks(session, sub_goal_id=sub_goal_id)
