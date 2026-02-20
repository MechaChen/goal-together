from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from src.services.todo_repository import CapacityError, NotFoundError, ValidationError


class ErrorResponse(BaseModel):
    code: str
    message: str


def _err(code: str, message: str, status_code: int) -> JSONResponse:
    return JSONResponse(status_code=status_code, content=ErrorResponse(code=code, message=message).model_dump())


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ValidationError)
    async def handle_validation(_: Request, exc: ValidationError) -> JSONResponse:
        return _err("VALIDATION_ERROR", str(exc), 400)

    @app.exception_handler(CapacityError)
    async def handle_capacity(_: Request, exc: CapacityError) -> JSONResponse:
        return _err("MAX_TODOS_REACHED", str(exc), 409)

    @app.exception_handler(NotFoundError)
    async def handle_not_found(_: Request, exc: NotFoundError) -> JSONResponse:
        return _err("TODO_NOT_FOUND", str(exc), 404)
