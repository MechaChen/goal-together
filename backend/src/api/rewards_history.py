from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import RewardHistoryResponse
from src.services.db import get_db
from src.services.reward_ledger import get_reward_history

router = APIRouter(tags=["rewards"])


@router.get("/rewards/history", response_model=RewardHistoryResponse)
async def rewards_history(session: AsyncSession = Depends(get_db)):
    items = await get_reward_history(session)
    return {
        "items": [
            {
                "id": item.id,
                "event_type": item.event_type,
                "token_amount": item.token_amount,
                "task_id": item.task_id,
                "rewarded_completion_counter": item.rewarded_completion_counter,
                "created_at": item.created_at.isoformat(),
            }
            for item in items
        ]
    }
