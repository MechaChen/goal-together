from fastapi import APIRouter
from src.api.progress_get import router as progress_router
from src.api.todos_create import router as todos_create_router
from src.api.todos_delete import router as todos_delete_router
from src.api.todos_list import router as todos_list_router
from src.api.todos_toggle import router as todos_toggle_router
from src.api.todos_update import router as todos_update_router

router = APIRouter()
router.include_router(todos_create_router)
router.include_router(todos_list_router)
router.include_router(todos_update_router)
router.include_router(todos_toggle_router)
router.include_router(todos_delete_router)
router.include_router(progress_router)
