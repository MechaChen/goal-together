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
from src.services.hierarchy_repository import (
    confirm_all_draft_tasks,
    confirm_task,
    create_draft_task,
    create_main_goal,
    create_sub_goal,
    delete_main_goal,
    delete_sub_goal,
)
from src.services.service_errors import ConflictError


@pytest.mark.asyncio
async def test_delete_sub_goal_is_blocked_when_confirmed_task_exists() -> None:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with session_factory() as session:
        main_goal = await create_main_goal(session, "Main Goal")
        sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal")
        task = await create_draft_task(session, sub_goal.id, "Task 1")
        await confirm_task(session, task.id)
        with pytest.raises(ConflictError, match="sub goal with confirmed tasks cannot be deleted"):
            await delete_sub_goal(session, sub_goal.id)

    await engine.dispose()


@pytest.mark.asyncio
async def test_delete_main_goal_is_blocked_when_descendants_have_confirmed_tasks() -> None:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with session_factory() as session:
        main_goal = await create_main_goal(session, "Main Goal")
        sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal")
        task = await create_draft_task(session, sub_goal.id, "Task 1")
        await confirm_task(session, task.id)
        with pytest.raises(ConflictError, match="main goal with confirmed tasks cannot be deleted"):
            await delete_main_goal(session, main_goal.id)

    await engine.dispose()


@pytest.mark.asyncio
async def test_confirm_all_draft_tasks_returns_expected_counts() -> None:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with session_factory() as session:
        main_goal = await create_main_goal(session, "Main Goal")
        sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal")
        first = await create_draft_task(session, sub_goal.id, "Task 1")
        second = await create_draft_task(session, sub_goal.id, "Task 2")
        await confirm_task(session, second.id)

        result = await confirm_all_draft_tasks(session, sub_goal.id)

        assert result["sub_goal_id"] == sub_goal.id
        assert result["confirmed_count"] == 1
        assert result["already_confirmed_count"] == 1
        assert result["total_tasks_count"] == 2
        assert first.id != second.id

    await engine.dispose()
