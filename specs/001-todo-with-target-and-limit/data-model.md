# Data Model: Todo With Target and Limit + Progress Bar

## Entity: TodoItem

Fields:
- `id` (string, UUID): unique identifier.
- `main_target` (string): required, trimmed, non-empty.
- `is_completed` (boolean): completion state.
- `created_at` (datetime): creation timestamp.
- `updated_at` (datetime): last update timestamp.

Validation rules:
- `main_target` MUST be non-empty after trimming whitespace.
- `main_target` length SHOULD be capped (e.g., 200 chars) to prevent abuse.
- Create operation MUST fail if total todo count is already 5.

State transitions:
- `active` (`is_completed=false`) -> `completed` (`is_completed=true`) via toggle/update status.
- `completed` -> `active` via toggle/update status.
- `active|completed` -> `deleted` via delete operation.

## Aggregate: TodoList

Definition:
- Bounded collection of `TodoItem` with max cardinality of 5 records.

Rules:
- Capacity rule: total records (`active + completed`) MUST NOT exceed 5.
- Delete frees a slot for subsequent creates.

## Derived View: ProgressSummary

Fields:
- `total_count` (integer, 0..5)
- `completed_count` (integer, 0..5)
- `percentage` (integer, 0..100)
- `label` (string, format `X/Y`)

Derivation:
- If `total_count = 0`, then `completed_count = 0`, `percentage = 0`, `label = "0/0"`.
- Else `percentage = floor((completed_count / total_count) * 100)`.

Consistency constraints:
- `completed_count <= total_count`
- `total_count <= 5`
