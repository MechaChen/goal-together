from __future__ import annotations

import sys
from pathlib import Path

import pytest
from sqlalchemy import select
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


@pytest.mark.asyncio
async def test_subgoal_rewards_grant_30_at_60_to_99_and_50_at_100() -> None:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with session_factory() as session:
        main_goal = await create_main_goal(session, "Main Goal")
        sub_goal = await create_sub_goal(session, main_goal.id, "Sub Goal")

        task_ids: list[str] = []
        for index in range(4):
            task = await create_draft_task(session, sub_goal.id, f"Task {index + 1}")
            task = await confirm_task(session, task.id)
            task_ids.append(task.id)

        first = await complete_task(session, task_ids[0])
        second = await complete_task(session, task_ids[1])
        third = await complete_task(session, task_ids[2])
        fourth = await complete_task(session, task_ids[3])

        assert first["extra_reward"] == 0
        assert first["extra_reward_type"] is None
        assert second["extra_reward"] == 0
        assert second["extra_reward_type"] is None

        assert third["extra_reward"] == 30
        assert third["extra_reward_type"] == "SUBGOAL_NEAR_COMPLETE"
        assert third["extra_reward_message"] == "Almost there! Enjoy a treat."

        assert fourth["extra_reward"] == 50
        assert fourth["extra_reward_type"] == "SUBGOAL_COMPLETE"
        assert fourth["extra_reward_message"] == "You Snailed it! Awesome job"

        refreshed_sub_goal = await session.get(SubGoal, sub_goal.id)
        assert refreshed_sub_goal is not None
        assert refreshed_sub_goal.is_completed is True
        assert refreshed_sub_goal.completed_at is not None

        reward_events = (
            await session.execute(
                select(RewardEvent).where(RewardEvent.event_type == "SUBGOAL_MANUAL_COMPLETE")
            )
        ).scalars().all()
        assert len(reward_events) == 0

    await engine.dispose()
