from __future__ import annotations

import sys
from pathlib import Path
from contextlib import asynccontextmanager

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.models.main_goal import MainGoal  # noqa: F401
from src.models.sub_goal import SubGoal  # noqa: F401
from src.models.task_item import TaskItem  # noqa: F401
from src.services.db import Base
from src.services.hierarchy_repository import (
    create_draft_task,
    create_main_goal,
    create_sub_goal,
    get_hierarchy_tree,
    list_main_goals,
    list_sub_goals,
    list_tasks,
)


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
async def test_list_main_goals_sorts_completed_to_end() -> None:
    async with new_session() as session:
        first = await create_main_goal(session, "Main Goal 1")
        second = await create_main_goal(session, "Main Goal 2")
        third = await create_main_goal(session, "Main Goal 3")
        second.is_completed = True
        await session.commit()

        items = await list_main_goals(session)
        assert [item.id for item in items] == [first.id, third.id, second.id]


@pytest.mark.asyncio
async def test_list_sub_goals_sorts_completed_to_end() -> None:
    async with new_session() as session:
        goal = await create_main_goal(session, "Main Goal")
        first = await create_sub_goal(session, goal.id, "Sub Goal 1")
        second = await create_sub_goal(session, goal.id, "Sub Goal 2")
        third = await create_sub_goal(session, goal.id, "Sub Goal 3")
        second.is_completed = True
        await session.commit()

        items = await list_sub_goals(session, goal.id)
        assert [item.id for item in items] == [first.id, third.id, second.id]


@pytest.mark.asyncio
async def test_list_tasks_sorts_completed_to_end() -> None:
    async with new_session() as session:
        goal = await create_main_goal(session, "Main Goal")
        sub_goal = await create_sub_goal(session, goal.id, "Sub Goal")
        first = await create_draft_task(session, sub_goal.id, "Task 1")
        second = await create_draft_task(session, sub_goal.id, "Task 2")
        third = await create_draft_task(session, sub_goal.id, "Task 3")
        second.is_completed = True
        await session.commit()

        items = await list_tasks(session, sub_goal.id)
        assert [item.id for item in items] == [first.id, third.id, second.id]


@pytest.mark.asyncio
async def test_hierarchy_tree_sorts_completed_sub_goals_and_tasks_to_end() -> None:
    async with new_session() as session:
        goal = await create_main_goal(session, "Main Goal")
        first_sub_goal = await create_sub_goal(session, goal.id, "Sub Goal 1")
        second_sub_goal = await create_sub_goal(session, goal.id, "Sub Goal 2")
        third_sub_goal = await create_sub_goal(session, goal.id, "Sub Goal 3")
        second_sub_goal.is_completed = True

        first_task = await create_draft_task(session, first_sub_goal.id, "Task 1")
        second_task = await create_draft_task(session, first_sub_goal.id, "Task 2")
        third_task = await create_draft_task(session, first_sub_goal.id, "Task 3")
        second_task.is_completed = True
        await session.commit()

        tree = await get_hierarchy_tree(session)
        assert len(tree) == 1
        root = tree[0]
        assert [item["id"] for item in root["sub_goals"]] == [
            first_sub_goal.id,
            third_sub_goal.id,
            second_sub_goal.id,
        ]
        first_sub_goal_tasks = root["sub_goals"][0]["tasks"]
        assert [item["id"] for item in first_sub_goal_tasks] == [
            first_task.id,
            third_task.id,
            second_task.id,
        ]
