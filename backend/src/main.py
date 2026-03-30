from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.errors import register_error_handlers
from src.api.router import router
from src.services.db import init_db
from src.services.reward_audio_service import ensure_reward_audio_storage

app = FastAPI(title="Todo App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
register_error_handlers(app)


@app.on_event("startup")
async def on_startup() -> None:
    ensure_reward_audio_storage()
    await init_db()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
