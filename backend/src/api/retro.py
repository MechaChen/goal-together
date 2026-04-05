import datetime as dt

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.reward_hierarchy_schema import (
    RetroCreateRequest,
    RetroCreateResponse,
    RetroListResponse,
    RetroResponse,
    RetroUpdateRequest,
)
from src.services.db import get_db
from src.services.retro_services import (
    create_retro,
    update_retro,
    list_retros,
    get_retro_by_id,
)

router = APIRouter(tags=["retro"])

def _serialize_retro(entry) -> dict[str, object]:
    return {
        "id": entry.id,
        "date": entry.entry_date.isoformat(),
        "content": entry.content,
        "rewarded": entry.rewarded,
        "created_at": entry.created_at.isoformat(),
        "updated_at": entry.updated_at.isoformat(),
    }


@router.post("/retros", response_model=RetroCreateResponse)
async def retro_create(
    payload: RetroCreateRequest,
    session: AsyncSession = Depends(get_db),
):
    try:
        entry_date = dt.date.fromisoformat(payload.date)
        result = await create_retro(session, entry_date, payload.content)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {
        "item": _serialize_retro(result["entry"]),
        "reward": result["reward"],
        "wallet_balance": result["wallet_balance"],
    }


@router.get("/retros", response_model=RetroListResponse)
async def retros_list(
    limit: int = Query(20, ge=1, le=50),
    cursor: str | None = Query(None),
    session: AsyncSession = Depends(get_db),
):
    result = await list_retros(session, limit=limit, cursor=cursor)
    return {
        "items": [_serialize_retro(item) for item in result["items"]],
        "next_cursor": result["next_cursor"],
        "has_more": result["has_more"],
    }


@router.get("/retros/{retro_id}", response_model=RetroResponse)
async def retro_get(
    retro_id: str,
    session: AsyncSession = Depends(get_db),
):
    entry = await get_retro_by_id(session, retro_id)
    if not entry:
        raise HTTPException(status_code=404, detail="retro not found")
    return _serialize_retro(entry)


@router.put("/retros/{retro_id}", response_model=RetroResponse)
async def retro_update(
    retro_id: str,
    payload: RetroUpdateRequest,
    session: AsyncSession = Depends(get_db),
):
    try:
        entry = await update_retro(session, retro_id, payload.content)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if not entry:
        raise HTTPException(status_code=404, detail="retro not found")

    return _serialize_retro(entry)