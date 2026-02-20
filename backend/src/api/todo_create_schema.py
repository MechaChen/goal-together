from pydantic import BaseModel, ConfigDict, Field


class CreateTodoRequest(BaseModel):
    main_target: str = Field(min_length=1, max_length=200)


class UpdateTodoRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    main_target: str | None = Field(default=None, min_length=1, max_length=200)
    is_completed: bool | None = None


class TodoResponse(BaseModel):
    id: str
    main_target: str
    is_completed: bool
    created_at: str
    updated_at: str
