from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.services.db import get_db
from src.services.progress_service import get_progress

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("")
async def progress(session: AsyncSession = Depends(get_db)):
    return await get_progress(session)
