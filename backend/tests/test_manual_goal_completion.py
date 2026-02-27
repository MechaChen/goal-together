from __future__ import annotations

import sys
from pathlib import Path
from contextlib import asynccontextmanager

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.models.main_goal import MainGoal  # noqa: F401
from src.models.reward_event import RewardEvent  # noqa: F401
from src.models.sub_goal import SubGoal  # noqa: F401
from src.models.task_item import TaskItem  # noqa: F401
from src.models.token_wallet import TokenWallet  # noqa: F401
from src.services.complete_task_service import complete_task
from src.services.db import Base
from src.services.hierarchy_repository import confirm_task, create_draft_task, create_main_goal, create_sub_goal
from src.services.reward_ledger import complete_main_goal, complete_sub_goal
from src.services.service_errors import ConflictError


@asynccontextmanager
async def new_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with session_factory() as session:
        yield session
    await engine.dispose()


@pytest.mark.asyncio
async def test_complete_sub_goal_requires_all_tasks_completed() -> None:
    async with new_session() as session:
        main_goal = await create_main_goal(session, "Main Goal")
        sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal")
        first = await create_draft_task(session, sub_goal.id, "Task 1")
        second = await create_draft_task(session, sub_goal.id, "Task 2")
        await confirm_task(session, first.id)
        await confirm_task(session, second.id)
        await complete_task(session, first.id)

        with pytest.raises(ConflictError, match=r"cannot complete sub goal yet: 50% \(1/2\) tasks completed"):
            await complete_sub_goal(session, sub_goal.id)


@pytest.mark.asyncio
async def test_manual_complete_sub_goal_conflicts_after_auto_completion() -> None:
    async with new_session() as session:
        main_goal = await create_main_goal(session, "Main Goal")
        sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal")
        task = await create_draft_task(session, sub_goal.id, "Task 1")
        await confirm_task(session, task.id)
        await complete_task(session, task.id)

        with pytest.raises(ConflictError, match="sub goal already completed previously"):
            await complete_sub_goal(session, sub_goal.id)


@pytest.mark.asyncio
async def test_complete_main_goal_requires_all_sub_goals_completed() -> None:
    async with new_session() as session:
        main_goal = await create_main_goal(session, "Main Goal")
        first_sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal 1")
        await create_sub_goal(session, main_goal.id, "Sub Goal 2")
        first_task = await create_draft_task(session, first_sub_goal.id, "Task 1")
        await confirm_task(session, first_task.id)
        await complete_task(session, first_task.id)

        with pytest.raises(ConflictError, match=r"cannot complete main goal yet: 50% \(1/2\) sub goals completed"):
            await complete_main_goal(session, main_goal.id)


@pytest.mark.asyncio
async def test_complete_main_goal_grants_500_tokens() -> None:
    async with new_session() as session:
        main_goal = await create_main_goal(session, "Main Goal")
        first_sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal 1")
        second_sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal 2")
        first_task = await create_draft_task(session, first_sub_goal.id, "Task 1")
        second_task = await create_draft_task(session, second_sub_goal.id, "Task 2")
        await confirm_task(session, first_task.id)
        await confirm_task(session, second_task.id)
        await complete_task(session, first_task.id)
        await complete_task(session, second_task.id)

        result = await complete_main_goal(session, main_goal.id)

        assert result["reward_granted"] is True
        assert result["reward_amount"] == 500
        assert result["is_completed"] is True
        assert result["progress"] == {"completed_count": 2, "total_count": 2, "percentage": 100}


@pytest.mark.asyncio
async def test_create_task_fails_when_sub_goal_is_auto_completed() -> None:
    async with new_session() as session:
        main_goal = await create_main_goal(session, "Main Goal")
        sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal")
        task = await create_draft_task(session, sub_goal.id, "Task 1")
        await confirm_task(session, task.id)
        await complete_task(session, task.id)

        with pytest.raises(ConflictError, match="completed sub goal cannot add tasks"):
            await create_draft_task(session, sub_goal.id, "Task 2")
