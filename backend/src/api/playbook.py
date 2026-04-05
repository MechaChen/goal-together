from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import LifePlaybookRequest, LifePlaybookResponse
from src.services.db import get_db
from src.services.life_playbook_services import get_or_create_playbook, save_playbook

router = APIRouter(tags=["playbook"])


@router.get("/playbook", response_model=LifePlaybookResponse)
async def playbook_get(session: AsyncSession = Depends(get_db)):
    playbook = await get_or_create_playbook(session)
    return {
        "content": playbook.content,
        "updated_at": playbook.updated_at.isoformat(),
    }


@router.put("/playbook", response_model=LifePlaybookResponse)
async def playbook_put(
    payload: LifePlaybookRequest,
    session: AsyncSession = Depends(get_db),
):
    playbook = await save_playbook(session, payload.content)
    return {
        "content": playbook.content,
        "updated_at": playbook.updated_at.isoformat(),
    }