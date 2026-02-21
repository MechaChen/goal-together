from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import CompleteTaskResponse
from src.services.complete_task_service import complete_task
from src.services.db import get_db

router = APIRouter(tags=["tasks"])


@router.post("/tasks/{task_id}/complete", response_model=CompleteTaskResponse)
async def post_task_complete(task_id: str, session: AsyncSession = Depends(get_db)):
    result = await complete_task(session, task_id=task_id)
    task = result["task"]
    return {
        "task_reward": result["task_reward"],
        "milestone_reward": result["milestone_reward"],
        "milestone_applied": result["milestone_applied"],
        "rewarded_completion_count": result["rewarded_completion_count"],
        "wallet_balance": result["wallet_balance"],
        "hint": None,
        "task": {
            "id": task.id,
            "sub_goal_id": task.sub_goal_id,
            "title": task.title,
            "lifecycle_state": task.lifecycle_state,
            "is_completed": task.is_completed,
            "first_rewarded_completion_at": task.first_rewarded_completion_at.isoformat()
            if task.first_rewarded_completion_at
            else None,
        },
    }
