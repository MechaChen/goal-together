from __future__ import annotations

import sys
from pathlib import Path
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.models.main_goal import MainGoal  # noqa: F401
from src.models.sub_goal import SubGoal  # noqa: F401
from src.models.task_item import TaskItem  # noqa: F401
from src.services.db import Base
from src.services.hierarchy_repository import create_draft_task, create_main_goal, create_sub_goal
from src.services.service_errors import CapacityError


@pytest.mark.asyncio
async def test_task_limit_is_enforced_per_sub_goal() -> None:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with session_factory() as session:
        main_goal = await create_main_goal(session, "Main Goal 1")
        sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal 1")

        for idx in range(5):
            await create_draft_task(session, sub_goal.id, f"Task {idx + 1}")

        with pytest.raises(CapacityError, match="maximum of 5 tasks reached for this sub goal"):
            await create_draft_task(session, sub_goal.id, "Task 6")

    await engine.dispose()
