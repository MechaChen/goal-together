# Data Model: Navigation Split and Token Reward Modal

## Entity: SectionPageState

Purpose:
- Represents navigation-level state for one dedicated page.

Fields:
- `page_key` (enum: `main_goals`, `sub_goals`, `tasks`, `reward_history`)
- `is_active` (boolean)
- `selected_main_goal_id` (string, nullable)
- `selected_sub_goal_id` (string, nullable)

Rules:
- `sub_goals` page requires `selected_main_goal_id`.
- `tasks` page requires `selected_sub_goal_id`.
- Invalid parent context must produce a request-to-select state.

## Entity: TokenIcon

Purpose:
- Reusable visual token representation for reward UI.

Fields:
- `variant` (enum, default: `lego`)
- `size` (number)
- `aria_label` (string)

Rules:
- Must render consistently in modal and history-related UI contexts.
- Must remain visible in light backgrounds with sufficient contrast.

## Entity: RewardModalQueueItem

Purpose:
- One queued reward feedback event shown in modal overlay.

Fields:
- `queue_id` (string)
- `reward_type` (enum: `TASK_COMPLETE`, `MILESTONE_5X`)
- `token_amount` (integer)
- `created_at` (datetime)
- `display_duration_ms` (integer; fixed `3000`)

Rules:
- Queue ordering is FIFO.
- Item remains visible for `3000ms` once displayed.
- Navigation MUST NOT remove the active modal before timer expiry.

State transitions:
- `queued` -> `visible` -> `dismissed`
- Auto-transition to `dismissed` at timer expiry only.

## Entity: RewardHistoryViewItem

Purpose:
- Read-model for reward history page rendering.

Fields:
- `event_id` (string)
- `event_type` (string)
- `token_amount` (integer)
- `event_time` (datetime)

Rules:
- Empty dataset must produce explicit empty-state UI.
- Values mirror backend reward history contract fields without transformation loss.
