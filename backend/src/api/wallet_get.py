from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import WalletSummaryResponse
from src.services.db import get_db
from src.services.reward_ledger import get_wallet_summary

router = APIRouter(tags=["wallet"])


@router.get("/wallet", response_model=WalletSummaryResponse)
async def wallet_get(session: AsyncSession = Depends(get_db)):
    return await get_wallet_summary(session)
