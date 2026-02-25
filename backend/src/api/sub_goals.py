from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import (
    CompleteSubGoalResponse,
    SubGoalCreateRequest,
    SubGoalResponse,
    SubGoalUpdateRequest,
)
from src.services.db import get_db
from src.services.hierarchy_repository import (
    create_sub_goal,
    delete_sub_goal,
    list_sub_goals,
    update_sub_goal,
)
from src.services.reward_ledger import complete_sub_goal

router = APIRouter(tags=["sub-goals"])


@router.get("/main-goals/{main_goal_id}/sub-goals", response_model=list[SubGoalResponse])
async def get_sub_goals(main_goal_id: str, session: AsyncSession = Depends(get_db)):
    items = await list_sub_goals(session, main_goal_id=main_goal_id)
    return [
        {
            "id": item.id,
            "main_goal_id": item.main_goal_id,
            "title": item.title,
            "is_completed": item.is_completed,
            "completed_at": item.completed_at.isoformat() if item.completed_at else None,
        }
        for item in items
    ]


@router.post("/main-goals/{main_goal_id}/sub-goals", response_model=SubGoalResponse, status_code=status.HTTP_201_CREATED)
async def post_sub_goal(main_goal_id: str, payload: SubGoalCreateRequest, session: AsyncSession = Depends(get_db)):
    item = await create_sub_goal(session, main_goal_id=main_goal_id, title=payload.title)
    return {
        "id": item.id,
        "main_goal_id": item.main_goal_id,
        "title": item.title,
        "is_completed": item.is_completed,
        "completed_at": item.completed_at.isoformat() if item.completed_at else None,
    }


@router.patch("/sub-goals/{sub_goal_id}", response_model=SubGoalResponse)
async def patch_sub_goal(
    sub_goal_id: str,
    payload: SubGoalUpdateRequest,
    session: AsyncSession = Depends(get_db),
):
    item = await update_sub_goal(session, sub_goal_id=sub_goal_id, title=payload.title)
    return {
        "id": item.id,
        "main_goal_id": item.main_goal_id,
        "title": item.title,
        "is_completed": item.is_completed,
        "completed_at": item.completed_at.isoformat() if item.completed_at else None,
    }


@router.post("/sub-goals/{sub_goal_id}/complete", response_model=CompleteSubGoalResponse)
async def post_sub_goal_complete(sub_goal_id: str, session: AsyncSession = Depends(get_db)):
    result = await complete_sub_goal(session, sub_goal_id=sub_goal_id)
    completed_at = result["completed_at"]
    return {
        "sub_goal_id": result["sub_goal_id"],
        "is_completed": result["is_completed"],
        "completed_at": completed_at.isoformat() if completed_at else None,
        "reward_granted": result["reward_granted"],
        "reward_amount": result["reward_amount"],
        "wallet_balance": result["wallet_balance"],
        "progress": result["progress"],
    }


@router.delete("/sub-goals/{sub_goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_sub_goal(sub_goal_id: str, session: AsyncSession = Depends(get_db)):
    await delete_sub_goal(session, sub_goal_id=sub_goal_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
