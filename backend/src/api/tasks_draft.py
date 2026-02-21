from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import TaskCreateRequest, TaskResponse, TaskUpdateRequest
from src.services.db import get_db
from src.services.hierarchy_repository import create_draft_task, delete_draft_task, list_tasks, update_draft_task

router = APIRouter(tags=["tasks"])


@router.get("/sub-goals/{sub_goal_id}/tasks", response_model=list[TaskResponse])
async def get_tasks(sub_goal_id: str, session: AsyncSession = Depends(get_db)):
    items = await list_tasks(session, sub_goal_id=sub_goal_id)
    return [
        {
            "id": item.id,
            "sub_goal_id": item.sub_goal_id,
            "title": item.title,
            "lifecycle_state": item.lifecycle_state,
            "is_completed": item.is_completed,
            "first_rewarded_completion_at": item.first_rewarded_completion_at.isoformat()
            if item.first_rewarded_completion_at
            else None,
        }
        for item in items
    ]


@router.post("/sub-goals/{sub_goal_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def post_task(sub_goal_id: str, payload: TaskCreateRequest, session: AsyncSession = Depends(get_db)):
    item = await create_draft_task(session, sub_goal_id=sub_goal_id, title=payload.title)
    return {
        "id": item.id,
        "sub_goal_id": item.sub_goal_id,
        "title": item.title,
        "lifecycle_state": item.lifecycle_state,
        "is_completed": item.is_completed,
        "first_rewarded_completion_at": None,
    }


@router.patch("/tasks/{task_id}", response_model=TaskResponse)
async def patch_task(task_id: str, payload: TaskUpdateRequest, session: AsyncSession = Depends(get_db)):
    item = await update_draft_task(session, task_id=task_id, title=payload.title)
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


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_task(task_id: str, session: AsyncSession = Depends(get_db)):
    await delete_draft_task(session, task_id=task_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
