from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.main_goal import MainGoal
from src.models.sub_goal import SubGoal
from src.models.task_item import TaskItem
from src.services.service_errors import CapacityError, ConflictError, NotFoundError, ValidationError


DRAFT = "draft"
CONFIRMED = "confirmed"
MAX_TASKS_PER_SUB_GOAL = 5


def _normalize_title(value: str) -> str:
    title = value.strip()
    if not title:
        raise ValidationError("title is required")
    if len(title) > 200:
        raise ValidationError("title must be <= 200 chars")
    return title


async def list_main_goals(session: AsyncSession) -> list[MainGoal]:
    result = await session.execute(select(MainGoal).order_by(MainGoal.created_at.asc()))
    return list(result.scalars().all())


async def get_main_goal(session: AsyncSession, main_goal_id: str) -> MainGoal:
    goal = await session.get(MainGoal, main_goal_id)
    if not goal:
        raise NotFoundError("main goal not found")
    return goal


async def create_main_goal(session: AsyncSession, title: str, description: str | None = None) -> MainGoal:
    goal = MainGoal(title=_normalize_title(title), description=description)
    session.add(goal)
    await session.commit()
    await session.refresh(goal)
    return goal


async def update_main_goal(
    session: AsyncSession,
    main_goal_id: str,
    title: str | None = None,
    description: str | None = None,
) -> MainGoal:
    goal = await get_main_goal(session, main_goal_id)
    if title is not None:
        goal.title = _normalize_title(title)
    if description is not None:
        goal.description = description
    await session.commit()
    await session.refresh(goal)
    return goal


async def delete_main_goal(session: AsyncSession, main_goal_id: str) -> None:
    goal = await get_main_goal(session, main_goal_id)
    confirmed_task_count_result = await session.execute(
        select(func.count())
        .select_from(TaskItem)
        .join(SubGoal, TaskItem.sub_goal_id == SubGoal.id)
        .where(SubGoal.main_goal_id == main_goal_id, TaskItem.lifecycle_state == CONFIRMED)
    )
    if int(confirmed_task_count_result.scalar_one()) > 0:
        raise ConflictError("main goal with confirmed tasks cannot be deleted")
    await session.delete(goal)
    await session.commit()


async def list_sub_goals(session: AsyncSession, main_goal_id: str) -> list[SubGoal]:
    await get_main_goal(session, main_goal_id)
    result = await session.execute(
        select(SubGoal).where(SubGoal.main_goal_id == main_goal_id).order_by(SubGoal.created_at.asc())
    )
    return list(result.scalars().all())


async def get_sub_goal(session: AsyncSession, sub_goal_id: str) -> SubGoal:
    sub_goal = await session.get(SubGoal, sub_goal_id)
    if not sub_goal:
        raise NotFoundError("sub goal not found")
    return sub_goal


async def create_sub_goal(session: AsyncSession, main_goal_id: str, title: str) -> SubGoal:
    await get_main_goal(session, main_goal_id)
    sub_goal = SubGoal(main_goal_id=main_goal_id, title=_normalize_title(title))
    session.add(sub_goal)
    await session.commit()
    await session.refresh(sub_goal)
    return sub_goal


async def update_sub_goal(session: AsyncSession, sub_goal_id: str, title: str) -> SubGoal:
    sub_goal = await get_sub_goal(session, sub_goal_id)
    sub_goal.title = _normalize_title(title)
    await session.commit()
    await session.refresh(sub_goal)
    return sub_goal


async def delete_sub_goal(session: AsyncSession, sub_goal_id: str) -> None:
    sub_goal = await get_sub_goal(session, sub_goal_id)
    confirmed_task_count_result = await session.execute(
        select(func.count())
        .select_from(TaskItem)
        .where(TaskItem.sub_goal_id == sub_goal_id, TaskItem.lifecycle_state == CONFIRMED)
    )
    if int(confirmed_task_count_result.scalar_one()) > 0:
        raise ConflictError("sub goal with confirmed tasks cannot be deleted")
    await session.delete(sub_goal)
    await session.commit()


async def list_tasks(session: AsyncSession, sub_goal_id: str) -> list[TaskItem]:
    await get_sub_goal(session, sub_goal_id)
    result = await session.execute(select(TaskItem).where(TaskItem.sub_goal_id == sub_goal_id).order_by(TaskItem.created_at.asc()))
    return list(result.scalars().all())


async def get_task(session: AsyncSession, task_id: str) -> TaskItem:
    task = await session.get(TaskItem, task_id)
    if not task:
        raise NotFoundError("task not found")
    return task


async def create_draft_task(session: AsyncSession, sub_goal_id: str, title: str) -> TaskItem:
    await get_sub_goal(session, sub_goal_id)
    task_count_result = await session.execute(
        select(func.count()).select_from(TaskItem).where(TaskItem.sub_goal_id == sub_goal_id)
    )
    if int(task_count_result.scalar_one()) >= MAX_TASKS_PER_SUB_GOAL:
        raise CapacityError(f"maximum of {MAX_TASKS_PER_SUB_GOAL} tasks reached for this sub goal")
    task = TaskItem(sub_goal_id=sub_goal_id, title=_normalize_title(title), lifecycle_state=DRAFT)
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def update_draft_task(session: AsyncSession, task_id: str, title: str) -> TaskItem:
    task = await get_task(session, task_id)
    if task.lifecycle_state != DRAFT:
        raise ConflictError("confirmed task is immutable for edits")
    task.title = _normalize_title(title)
    await session.commit()
    await session.refresh(task)
    return task


async def confirm_task(session: AsyncSession, task_id: str) -> TaskItem:
    task = await get_task(session, task_id)
    task.lifecycle_state = CONFIRMED
    await session.commit()
    await session.refresh(task)
    return task


async def confirm_all_draft_tasks(session: AsyncSession, sub_goal_id: str) -> dict[str, int | str]:
    tasks = await list_tasks(session, sub_goal_id=sub_goal_id)
    confirmed_count = 0
    already_confirmed_count = 0
    for task in tasks:
        if task.lifecycle_state == DRAFT:
            task.lifecycle_state = CONFIRMED
            confirmed_count += 1
        else:
            already_confirmed_count += 1
    await session.commit()
    return {
        "sub_goal_id": sub_goal_id,
        "confirmed_count": confirmed_count,
        "already_confirmed_count": already_confirmed_count,
        "total_tasks_count": len(tasks),
    }


async def delete_draft_task(session: AsyncSession, task_id: str) -> None:
    task = await get_task(session, task_id)
    if task.lifecycle_state != DRAFT:
        raise ConflictError("confirmed task deletion is forbidden")
    await session.delete(task)
    await session.commit()


async def get_hierarchy_tree(session: AsyncSession) -> list[dict[str, object]]:
    goals = await list_main_goals(session)
    sub_goal_rows = await session.execute(select(SubGoal).order_by(SubGoal.created_at.asc()))
    task_rows = await session.execute(select(TaskItem).order_by(TaskItem.created_at.asc()))

    sub_goals = list(sub_goal_rows.scalars().all())
    tasks = list(task_rows.scalars().all())

    tasks_by_sub_goal: dict[str, list[TaskItem]] = {}
    for task in tasks:
        tasks_by_sub_goal.setdefault(task.sub_goal_id, []).append(task)

    sub_goals_by_goal: dict[str, list[SubGoal]] = {}
    for sub_goal in sub_goals:
        sub_goals_by_goal.setdefault(sub_goal.main_goal_id, []).append(sub_goal)

    tree: list[dict[str, object]] = []
    for goal in goals:
        goal_sub_goals = []
        for sub_goal in sub_goals_by_goal.get(goal.id, []):
            sub_tasks = [
                {
                    "id": task.id,
                    "sub_goal_id": task.sub_goal_id,
                    "title": task.title,
                    "lifecycle_state": task.lifecycle_state,
                    "is_completed": task.is_completed,
                    "first_rewarded_completion_at": task.first_rewarded_completion_at.isoformat()
                    if task.first_rewarded_completion_at
                    else None,
                }
                for task in tasks_by_sub_goal.get(sub_goal.id, [])
            ]
            goal_sub_goals.append(
                {
                    "id": sub_goal.id,
                    "main_goal_id": sub_goal.main_goal_id,
                    "title": sub_goal.title,
                    "is_completed": sub_goal.is_completed,
                    "completed_at": sub_goal.completed_at.isoformat() if sub_goal.completed_at else None,
                    "tasks": sub_tasks,
                }
            )
        tree.append(
            {
                "id": goal.id,
                "title": goal.title,
                "description": goal.description,
                "is_completed": goal.is_completed,
                "completed_at": goal.completed_at.isoformat() if goal.completed_at else None,
                "sub_goals": goal_sub_goals,
            }
        )
    return tree
