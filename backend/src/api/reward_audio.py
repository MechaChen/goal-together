from fastapi import APIRouter, Depends, File, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import RewardAudioSettingsResponse
from src.services.db import get_db
from src.services.reward_audio_service import (
    delete_reward_audio,
    get_reward_audio_file_response,
    get_reward_audio_settings,
    serialize_reward_audio_settings,
    upload_reward_audio,
)

router = APIRouter(tags=["reward-audio"])


@router.get("/reward-audio", response_model=RewardAudioSettingsResponse)
async def reward_audio_settings(session: AsyncSession = Depends(get_db)):
    settings = await get_reward_audio_settings(session)
    return serialize_reward_audio_settings(settings)


@router.put("/reward-audio/normal", response_model=RewardAudioSettingsResponse, status_code=status.HTTP_200_OK)
async def upload_normal_reward_audio(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
):
    settings = await upload_reward_audio(session, "normal", file)
    return serialize_reward_audio_settings(settings)


@router.put("/reward-audio/bonus", response_model=RewardAudioSettingsResponse, status_code=status.HTTP_200_OK)
async def upload_bonus_reward_audio(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
):
    settings = await upload_reward_audio(session, "bonus", file)
    return serialize_reward_audio_settings(settings)


@router.delete("/reward-audio/normal", response_model=RewardAudioSettingsResponse)
async def delete_normal_reward_audio(session: AsyncSession = Depends(get_db)):
    settings = await delete_reward_audio(session, "normal")
    return serialize_reward_audio_settings(settings)


@router.delete("/reward-audio/bonus", response_model=RewardAudioSettingsResponse)
async def delete_bonus_reward_audio(session: AsyncSession = Depends(get_db)):
    settings = await delete_reward_audio(session, "bonus")
    return serialize_reward_audio_settings(settings)


@router.get("/reward-audio/normal/file", response_class=FileResponse)
async def normal_reward_audio_file(session: AsyncSession = Depends(get_db)):
    return await get_reward_audio_file_response(session, "normal")


@router.get("/reward-audio/bonus/file", response_class=FileResponse)
async def bonus_reward_audio_file(session: AsyncSession = Depends(get_db)):
    return await get_reward_audio_file_response(session, "bonus")
