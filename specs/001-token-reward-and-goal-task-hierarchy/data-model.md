# Data Model: Token Reward and Goal-Task Hierarchy

## Entity: MainGoal

Fields:
- `id` (string, UUID)
- `title` (string, required)
- `description` (string, optional)
- `created_at` (datetime)
- `updated_at` (datetime)

Rules:
- One main goal has many sub goals.

## Entity: SubGoal

Fields:
- `id` (string, UUID)
- `main_goal_id` (string, FK -> MainGoal.id)
- `title` (string, required)
- `created_at` (datetime)
- `updated_at` (datetime)

Rules:
- One sub goal belongs to exactly one main goal.
- One sub goal has many tasks.

## Entity: Task

Fields:
- `id` (string, UUID)
- `sub_goal_id` (string, FK -> SubGoal.id)
- `title` (string, required)
- `lifecycle_state` (enum: `draft`, `confirmed`)
- `is_completed` (boolean)
- `first_rewarded_completion_at` (datetime, nullable)
- `created_at` (datetime)
- `updated_at` (datetime)

Rules:
- Draft tasks: editable and deletable.
- Confirmed tasks: non-deletable (immutable for deletion).
- Rewards apply only when `lifecycle_state=confirmed` and first rewarded completion is null.

State transitions:
- `draft` -> `confirmed` via confirm action.
- `draft` -> deleted via delete action.
- `confirmed` -> deleted: forbidden.
- completion transition rewardable only for first-ever confirmed completion.

## Entity: TokenWallet

Fields:
- `user_id` (string)
- `balance` (integer, non-negative)
- `updated_at` (datetime)

Rules:
- Balance equals sum of reward events for user.

## Entity: RewardEvent

Fields:
- `id` (string, UUID)
- `user_id` (string)
- `task_id` (string, nullable FK -> Task.id)
- `event_type` (enum: `TASK_COMPLETE`, `MILESTONE_5X`)
- `token_amount` (integer)
- `rewarded_completion_counter` (integer, nullable)
- `idempotency_key` (string, unique)
- `created_at` (datetime)

Rules:
- `TASK_COMPLETE` = +10 for first-ever completion of confirmed task.
- `MILESTONE_5X` = +50 at every multiple-of-5 rewarded completion counter.
- Unique idempotency key prevents duplicate reward grants.
