from __future__ import annotations

import sys
from pathlib import Path
from typing import AsyncIterator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.main import app
from src.models.main_goal import MainGoal  # noqa: F401
from src.models.reward_audio_settings import RewardAudioSettings  # noqa: F401
from src.models.reward_event import RewardEvent  # noqa: F401
from src.models.sub_goal import SubGoal  # noqa: F401
from src.models.task_item import TaskItem  # noqa: F401
from src.models.todo_item import TodoItem  # noqa: F401
from src.models.token_wallet import TokenWallet  # noqa: F401
from src.services.db import Base, get_db


@pytest.fixture
async def api_client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> AsyncIterator[AsyncClient]:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async def override_get_db():
        async with session_factory() as session:
            yield session

    monkeypatch.setenv("REWARD_AUDIO_UPLOAD_DIR", str(tmp_path / "uploads"))
    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client

    app.dependency_overrides.clear()
    await engine.dispose()


@pytest.mark.asyncio
async def test_upload_reward_audio_returns_metadata_and_streams_file(api_client: AsyncClient) -> None:
    response = await api_client.put(
        "/reward-audio/normal",
        files={"file": ("coin.mp3", b"mock-mp3-data", "audio/mpeg")},
    )

    assert response.status_code == 200
    payload = response.json()
    normal_slot = next(slot for slot in payload["slots"] if slot["kind"] == "normal")
    assert normal_slot["has_custom_audio"] is True
    assert normal_slot["original_filename"] == "coin.mp3"
    assert normal_slot["mime_type"] == "audio/mpeg"
    assert normal_slot["file_size_bytes"] == len(b"mock-mp3-data")
    assert normal_slot["file_url"].startswith("/reward-audio/normal/file")

    file_response = await api_client.get("/reward-audio/normal/file")
    assert file_response.status_code == 200
    assert file_response.content == b"mock-mp3-data"
    assert file_response.headers["content-type"] == "audio/mpeg"


@pytest.mark.asyncio
async def test_upload_reward_audio_rejects_unsupported_type(api_client: AsyncClient) -> None:
    response = await api_client.put(
        "/reward-audio/bonus",
        files={"file": ("coin.webm", b"mock-webm-data", "audio/webm")},
    )

    assert response.status_code == 400
    assert response.json()["message"] == "reward audio must be an mp3 or wav file"


@pytest.mark.asyncio
async def test_upload_reward_audio_rejects_large_files(api_client: AsyncClient) -> None:
    response = await api_client.put(
        "/reward-audio/bonus",
        files={"file": ("coin.wav", b"a" * (5 * 1024 * 1024 + 1), "audio/wav")},
    )

    assert response.status_code == 400
    assert response.json()["message"] == "reward audio file must be 5 MB or smaller"


@pytest.mark.asyncio
async def test_delete_reward_audio_clears_slot_and_missing_file_returns_404(api_client: AsyncClient) -> None:
    await api_client.put(
        "/reward-audio/bonus",
        files={"file": ("bonus.wav", b"mock-wav-data", "audio/wav")},
    )

    delete_response = await api_client.delete("/reward-audio/bonus")
    assert delete_response.status_code == 200
    payload = delete_response.json()
    bonus_slot = next(slot for slot in payload["slots"] if slot["kind"] == "bonus")
    assert bonus_slot["has_custom_audio"] is False
    assert bonus_slot["file_url"] is None

    file_response = await api_client.get("/reward-audio/bonus/file")
    assert file_response.status_code == 404
