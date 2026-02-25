from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import (
    CompleteMainGoalResponse,
    MainGoalCreateRequest,
    MainGoalResponse,
    MainGoalUpdateRequest,
    TreeResponse,
)
from src.services.db import get_db
from src.services.hierarchy_repository import (
    create_main_goal,
    delete_main_goal,
    get_hierarchy_tree,
    update_main_goal,
)
from src.services.reward_ledger import complete_main_goal

router = APIRouter(prefix="/main-goals", tags=["main-goals"])


@router.get("", response_model=TreeResponse)
async def list_main_goals(session: AsyncSession = Depends(get_db)):
    items = await get_hierarchy_tree(session)
    return {"items": items}


@router.post("", response_model=MainGoalResponse, status_code=status.HTTP_201_CREATED)
async def post_main_goal(payload: MainGoalCreateRequest, session: AsyncSession = Depends(get_db)):
    item = await create_main_goal(session, title=payload.title, description=payload.description)
    return {
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "is_completed": item.is_completed,
        "completed_at": item.completed_at.isoformat() if item.completed_at else None,
    }


@router.patch("/{main_goal_id}", response_model=MainGoalResponse)
async def patch_main_goal(
    main_goal_id: str,
    payload: MainGoalUpdateRequest,
    session: AsyncSession = Depends(get_db),
):
    item = await update_main_goal(
        session,
        main_goal_id=main_goal_id,
        title=payload.title,
        description=payload.description,
    )
    return {
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "is_completed": item.is_completed,
        "completed_at": item.completed_at.isoformat() if item.completed_at else None,
    }


@router.post("/{main_goal_id}/complete", response_model=CompleteMainGoalResponse)
async def post_main_goal_complete(main_goal_id: str, session: AsyncSession = Depends(get_db)):
    result = await complete_main_goal(session, main_goal_id=main_goal_id)
    completed_at = result["completed_at"]
    return {
        "main_goal_id": result["main_goal_id"],
        "is_completed": result["is_completed"],
        "completed_at": completed_at.isoformat() if completed_at else None,
        "reward_granted": result["reward_granted"],
        "reward_amount": result["reward_amount"],
        "wallet_balance": result["wallet_balance"],
        "progress": result["progress"],
    }


@router.delete("/{main_goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_main_goal(main_goal_id: str, session: AsyncSession = Depends(get_db)):
    await delete_main_goal(session, main_goal_id=main_goal_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
