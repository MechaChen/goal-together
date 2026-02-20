from pydantic import BaseModel, ConfigDict


class MainGoalCreateRequest(BaseModel):
    title: str
    description: str | None = None


class MainGoalUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None


class SubGoalCreateRequest(BaseModel):
    title: str


class SubGoalUpdateRequest(BaseModel):
    title: str


class TaskCreateRequest(BaseModel):
    title: str


class TaskUpdateRequest(BaseModel):
    title: str


class MainGoalResponse(BaseModel):
    id: str
    title: str
    description: str | None = None


class SubGoalResponse(BaseModel):
    id: str
    main_goal_id: str
    title: str


class TaskResponse(BaseModel):
    id: str
    sub_goal_id: str
    title: str
    lifecycle_state: str
    is_completed: bool
    first_rewarded_completion_at: str | None = None


class CompleteTaskResponse(BaseModel):
    task_reward: int
    milestone_reward: int
    milestone_applied: bool
    rewarded_completion_count: int
    wallet_balance: int
    hint: str | None = None
    task: TaskResponse


class WalletSummaryResponse(BaseModel):
    user_id: str
    balance: int
    rewarded_completion_count: int


class RewardEventResponse(BaseModel):
    id: str
    event_type: str
    token_amount: int
    task_id: str | None = None
    rewarded_completion_counter: int | None = None
    created_at: str


class RewardHistoryResponse(BaseModel):
    items: list[RewardEventResponse]


class TreeTaskResponse(BaseModel):
    id: str
    sub_goal_id: str
    title: str
    lifecycle_state: str
    is_completed: bool
    first_rewarded_completion_at: str | None = None


class TreeSubGoalResponse(BaseModel):
    id: str
    main_goal_id: str
    title: str
    tasks: list[TreeTaskResponse]


class TreeMainGoalResponse(BaseModel):
    id: str
    title: str
    description: str | None = None
    sub_goals: list[TreeSubGoalResponse]


class TreeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: list[TreeMainGoalResponse]
