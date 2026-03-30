from fastapi import APIRouter
from src.api.main_goals import router as main_goals_router
from src.api.reward_audio import router as reward_audio_router
from src.api.rewards_history import router as rewards_history_router
from src.api.sub_goals import router as sub_goals_router
from src.api.tasks_complete import router as tasks_complete_router
from src.api.tasks_confirm import router as tasks_confirm_router
from src.api.tasks_draft import router as tasks_draft_router
from src.api.wallet_get import router as wallet_get_router

router = APIRouter()
router.include_router(main_goals_router)
router.include_router(sub_goals_router)
router.include_router(tasks_draft_router)
router.include_router(tasks_confirm_router)
router.include_router(tasks_complete_router)
router.include_router(wallet_get_router)
router.include_router(rewards_history_router)
router.include_router(reward_audio_router)
