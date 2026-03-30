from __future__ import annotations

import datetime as dt
import os
from pathlib import Path
from typing import Literal

from fastapi import UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.reward_audio_settings import RewardAudioSettings
from src.services.service_errors import NotFoundError, ValidationError

RewardAudioSlot = Literal["normal", "bonus"]

DEFAULT_REWARD_AUDIO_PROFILE_ID = "default"
REWARD_AUDIO_MAX_BYTES = 5 * 1024 * 1024
SUPPORTED_AUDIO_TYPES: dict[str, tuple[str, ...]] = {
    ".mp3": ("audio/mpeg", "audio/mp3"),
    ".wav": ("audio/wav", "audio/x-wav", "audio/wave", "audio/vnd.wave"),
}


def _reward_audio_upload_root() -> Path:
    configured = os.getenv("REWARD_AUDIO_UPLOAD_DIR", "./uploads/reward-audio")
    return Path(configured)


def ensure_reward_audio_storage() -> None:
    _reward_audio_upload_root().joinpath(DEFAULT_REWARD_AUDIO_PROFILE_ID).mkdir(parents=True, exist_ok=True)


def _profile_upload_dir() -> Path:
    return _reward_audio_upload_root() / DEFAULT_REWARD_AUDIO_PROFILE_ID


def _slot_path_field(slot: RewardAudioSlot) -> str:
    return f"{slot}_storage_path"


def _slot_filename_field(slot: RewardAudioSlot) -> str:
    return f"{slot}_original_filename"


def _slot_mime_field(slot: RewardAudioSlot) -> str:
    return f"{slot}_mime_type"


def _slot_size_field(slot: RewardAudioSlot) -> str:
    return f"{slot}_file_size_bytes"


def _slot_updated_at_field(slot: RewardAudioSlot) -> str:
    return f"{slot}_updated_at"


def _to_iso(value: dt.datetime | None) -> str | None:
    if value is None:
        return None
    return value.astimezone(dt.timezone.utc).isoformat()


def _build_file_url(slot: RewardAudioSlot, updated_at: dt.datetime | None) -> str | None:
    if updated_at is None:
        return None
    return f"/reward-audio/{slot}/file?ts={updated_at.astimezone(dt.timezone.utc).isoformat()}"


def serialize_reward_audio_slot(settings: RewardAudioSettings, slot: RewardAudioSlot) -> dict[str, str | int | bool | None]:
    updated_at = getattr(settings, _slot_updated_at_field(slot))
    return {
        "kind": slot,
        "has_custom_audio": getattr(settings, _slot_path_field(slot)) is not None,
        "file_url": _build_file_url(slot, updated_at),
        "original_filename": getattr(settings, _slot_filename_field(slot)),
        "mime_type": getattr(settings, _slot_mime_field(slot)),
        "file_size_bytes": getattr(settings, _slot_size_field(slot)),
        "updated_at": _to_iso(updated_at),
    }


def serialize_reward_audio_settings(settings: RewardAudioSettings) -> dict[str, list[dict[str, str | int | bool | None]]]:
    return {
        "slots": [
            serialize_reward_audio_slot(settings, "normal"),
            serialize_reward_audio_slot(settings, "bonus"),
        ]
    }


async def get_reward_audio_settings(session: AsyncSession) -> RewardAudioSettings:
    settings = await session.get(RewardAudioSettings, DEFAULT_REWARD_AUDIO_PROFILE_ID)
    if settings is not None:
        return settings

    settings = RewardAudioSettings(id=DEFAULT_REWARD_AUDIO_PROFILE_ID)
    session.add(settings)
    await session.commit()
    await session.refresh(settings)
    return settings


async def upload_reward_audio(
    session: AsyncSession,
    slot: RewardAudioSlot,
    upload: UploadFile,
) -> RewardAudioSettings:
    filename = upload.filename or ""
    suffix = Path(filename).suffix.lower()
    if suffix not in SUPPORTED_AUDIO_TYPES:
        raise ValidationError("reward audio must be an mp3 or wav file")

    content_type = (upload.content_type or "").lower()
    if content_type not in SUPPORTED_AUDIO_TYPES[suffix]:
        raise ValidationError("reward audio content type must match the uploaded mp3 or wav file")

    payload = await upload.read()
    if not payload:
        raise ValidationError("reward audio file cannot be empty")
    if len(payload) > REWARD_AUDIO_MAX_BYTES:
        raise ValidationError("reward audio file must be 5 MB or smaller")

    ensure_reward_audio_storage()
    settings = await get_reward_audio_settings(session)
    previous_path = getattr(settings, _slot_path_field(slot))
    target_path = _profile_upload_dir() / f"{slot}{suffix}"
    target_path.write_bytes(payload)

    setattr(settings, _slot_filename_field(slot), filename)
    setattr(settings, _slot_mime_field(slot), content_type)
    setattr(settings, _slot_size_field(slot), len(payload))
    setattr(settings, _slot_path_field(slot), str(target_path.resolve()))
    setattr(settings, _slot_updated_at_field(slot), dt.datetime.now(dt.timezone.utc))

    await session.commit()
    await session.refresh(settings)

    if previous_path and previous_path != str(target_path.resolve()):
        old_file = Path(previous_path)
        if old_file.exists():
            old_file.unlink()

    return settings


async def delete_reward_audio(session: AsyncSession, slot: RewardAudioSlot) -> RewardAudioSettings:
    settings = await get_reward_audio_settings(session)
    storage_path = getattr(settings, _slot_path_field(slot))
    if storage_path:
        file_path = Path(storage_path)
        if file_path.exists():
            file_path.unlink()

    setattr(settings, _slot_filename_field(slot), None)
    setattr(settings, _slot_mime_field(slot), None)
    setattr(settings, _slot_size_field(slot), None)
    setattr(settings, _slot_path_field(slot), None)
    setattr(settings, _slot_updated_at_field(slot), None)

    await session.commit()
    await session.refresh(settings)
    return settings


async def get_reward_audio_file_response(session: AsyncSession, slot: RewardAudioSlot) -> FileResponse:
    settings = await get_reward_audio_settings(session)
    storage_path = getattr(settings, _slot_path_field(slot))
    if not storage_path:
        raise NotFoundError(f"{slot} reward audio not found")

    file_path = Path(storage_path)
    if not file_path.exists():
        raise NotFoundError(f"{slot} reward audio not found")

    media_type = getattr(settings, _slot_mime_field(slot)) or "application/octet-stream"
    filename = getattr(settings, _slot_filename_field(slot)) or file_path.name
    return FileResponse(path=file_path, media_type=media_type, filename=filename)
