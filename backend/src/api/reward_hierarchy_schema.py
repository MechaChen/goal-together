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
    is_completed: bool = False
    completed_at: str | None = None


class SubGoalResponse(BaseModel):
    id: str
    main_goal_id: str
    title: str
    is_completed: bool = False
    completed_at: str | None = None


class TaskResponse(BaseModel):
    id: str
    sub_goal_id: str
    title: str
    lifecycle_state: str
    is_completed: bool
    first_rewarded_completion_at: str | None = None


class BulkConfirmDraftTasksResponse(BaseModel):
    sub_goal_id: str
    confirmed_count: int
    already_confirmed_count: int
    total_tasks_count: int


class CompletionProgressResponse(BaseModel):
    completed_count: int
    total_count: int
    percentage: int


class CompleteSubGoalResponse(BaseModel):
    sub_goal_id: str
    is_completed: bool
    completed_at: str | None = None
    reward_granted: bool
    reward_amount: int
    wallet_balance: int
    progress: CompletionProgressResponse


class CompleteMainGoalResponse(BaseModel):
    main_goal_id: str
    is_completed: bool
    completed_at: str | None = None
    reward_granted: bool
    reward_amount: int
    wallet_balance: int
    progress: CompletionProgressResponse


class CompleteTaskResponse(BaseModel):
    task_reward: int
    extra_reward: int
    extra_reward_type: str | None = None
    extra_reward_message: str | None = None
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


class RewardAudioSlotResponse(BaseModel):
    kind: str
    has_custom_audio: bool
    file_url: str | None = None
    original_filename: str | None = None
    mime_type: str | None = None
    file_size_bytes: int | None = None
    updated_at: str | None = None


class RewardAudioSettingsResponse(BaseModel):
    slots: list[RewardAudioSlotResponse]


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
    is_completed: bool = False
    completed_at: str | None = None
    tasks: list[TreeTaskResponse]


class TreeMainGoalResponse(BaseModel):
    id: str
    title: str
    description: str | None = None
    is_completed: bool = False
    completed_at: str | None = None
    sub_goals: list[TreeSubGoalResponse]


class TreeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: list[TreeMainGoalResponse]
