# Contract Regression Note: Navigation Split and Token Modal

Feature: `003-separate-pages-token-modal`

## Scope

The feature introduces frontend-only navigation/page partitioning and reward modal presentation.
Backend API contracts are intentionally unchanged.

## Verified Endpoints (unchanged)

- `GET /main-goals`
- `GET /main-goals/{mainGoalId}/sub-goals`
- `GET /sub-goals/{subGoalId}/tasks`
- `POST /tasks/{taskId}/complete`
- `GET /rewards/history`

## Validation

- Existing response shapes remain consumable by frontend services.
- No new required request fields were introduced.
- No route removals or renames were introduced.
