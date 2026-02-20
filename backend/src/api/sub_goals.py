from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import SubGoalCreateRequest, SubGoalResponse, SubGoalUpdateRequest
from src.services.db import get_db
from src.services.hierarchy_repository import (
    create_sub_goal,
    delete_sub_goal,
    list_sub_goals,
    update_sub_goal,
)

router = APIRouter(tags=["sub-goals"])


@router.get("/main-goals/{main_goal_id}/sub-goals", response_model=list[SubGoalResponse])
async def get_sub_goals(main_goal_id: str, session: AsyncSession = Depends(get_db)):
    items = await list_sub_goals(session, main_goal_id=main_goal_id)
    return [
        {"id": item.id, "main_goal_id": item.main_goal_id, "title": item.title}
        for item in items
    ]


@router.post("/main-goals/{main_goal_id}/sub-goals", response_model=SubGoalResponse, status_code=status.HTTP_201_CREATED)
async def post_sub_goal(main_goal_id: str, payload: SubGoalCreateRequest, session: AsyncSession = Depends(get_db)):
    item = await create_sub_goal(session, main_goal_id=main_goal_id, title=payload.title)
    return {
        "id": item.id,
        "main_goal_id": item.main_goal_id,
        "title": item.title,
    }


@router.patch("/sub-goals/{sub_goal_id}", response_model=SubGoalResponse)
async def patch_sub_goal(
    sub_goal_id: str,
    payload: SubGoalUpdateRequest,
    session: AsyncSession = Depends(get_db),
):
    item = await update_sub_goal(session, sub_goal_id=sub_goal_id, title=payload.title)
    return {"id": item.id, "main_goal_id": item.main_goal_id, "title": item.title}


@router.delete("/sub-goals/{sub_goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_sub_goal(sub_goal_id: str, session: AsyncSession = Depends(get_db)):
    await delete_sub_goal(session, sub_goal_id=sub_goal_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
