import datetime as dt

from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.life_playbook import LifePlaybook

async def get_or_create_playbook(session: AsyncSession) -> LifePlaybook:
    playbook = await session.get(LifePlaybook, 1)
    if playbook:
        return playbook

    playbook = LifePlaybook(id=1, content="")
    session.add(playbook)
    await session.commit()
    await session.refresh(playbook)
    return playbook


async def save_playbook(session: AsyncSession, content: str) -> LifePlaybook:
    playbook = await get_or_create_playbook(session)
    playbook.content = content
    await session.commit()
    await session.refresh(playbook)
    return playbook