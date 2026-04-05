import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection, AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


def _database_url() -> str:
    return os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./todo.db")


engine = create_async_engine(_database_url(), future=True, echo=False)
SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session


async def init_db() -> None:
    from src.models.main_goal import MainGoal  # noqa: F401
    from src.models.reward_audio_settings import RewardAudioSettings  # noqa: F401
    from src.models.reward_event import RewardEvent  # noqa: F401
    from src.models.sub_goal import SubGoal  # noqa: F401
    from src.models.task_item import TaskItem  # noqa: F401
    from src.models.token_wallet import TokenWallet  # noqa: F401
    from src.models.todo_item import TodoItem  # noqa: F401
    from src.models.retro_entry import RetroEntry  # noqa: F401
    from src.models.life_playbook import LifePlaybook  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        if engine.url.drivername.startswith("sqlite"):
            await _ensure_sqlite_hierarchy_columns(conn)


async def _ensure_sqlite_hierarchy_columns(conn: AsyncConnection) -> None:
    await _ensure_sqlite_column(conn, "main_goals", "is_completed", "ALTER TABLE main_goals ADD COLUMN is_completed BOOLEAN NOT NULL DEFAULT 0")
    await _ensure_sqlite_column(conn, "main_goals", "completed_at", "ALTER TABLE main_goals ADD COLUMN completed_at DATETIME")
    await _ensure_sqlite_column(conn, "sub_goals", "is_completed", "ALTER TABLE sub_goals ADD COLUMN is_completed BOOLEAN NOT NULL DEFAULT 0")
    await _ensure_sqlite_column(conn, "sub_goals", "completed_at", "ALTER TABLE sub_goals ADD COLUMN completed_at DATETIME")


async def _ensure_sqlite_column(conn: AsyncConnection, table: str, column: str, ddl: str) -> None:
    pragma_result = await conn.execute(text(f"PRAGMA table_info({table})"))
    existing_columns = {str(row[1]) for row in pragma_result.fetchall()}
    if column in existing_columns:
        return
    await conn.execute(text(ddl))
