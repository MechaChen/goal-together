# Research: Todo With Target and Limit + Progress Bar

## Decision 1: Async Python API with SQLite for single-user persistence
- Decision: Use async FastAPI handlers with SQLite-backed persistence.
- Rationale: Matches project constitution backend standard and keeps the stack minimal for
  low-volume CRUD with reliable local persistence.
- Alternatives considered:
  - In-memory storage only: rejected because restart persistence is required by the spec.
  - External DB service: rejected as unnecessary complexity for max-5 todo scope.

## Decision 2: Enforce list cap at write boundary
- Decision: Validate the 5-total-todos rule before create operations and return a clear
  domain-level rejection when cap is reached.
- Rationale: Prevents invalid state at the source and keeps behavior deterministic.
- Alternatives considered:
  - Enforce only in UI: rejected because backend integrity must hold regardless of client.
  - Soft limit warning: rejected because spec requires hard blocking behavior.

## Decision 3: Progress derived from current list state only
- Decision: Compute progress as `completed_count / total_count` from current persisted list;
  for empty list, return/display `0%` and `0/0`.
- Rationale: Aligns with clarifications and keeps the indicator transparent and testable.
- Alternatives considered:
  - Historical trend metrics: rejected as out of scope for this feature.
  - Weighted progress: rejected because it introduces non-specified complexity.

## Decision 4: Contract-first endpoint design
- Decision: Define REST endpoints for list/create/update/toggle/delete plus a dedicated
  progress summary endpoint.
- Rationale: Explicit contracts reduce integration ambiguity and support layered tests.
- Alternatives considered:
  - Embed progress only in list response: valid, but dedicated endpoint keeps client polling
    and UI updates explicit and independently testable.

## Decision 5: Use Tailwind CSS 4 for frontend styling
- Decision: Use Tailwind CSS 4 as the primary styling system for todo UI and progress bar.
- Rationale: Provides fast utility-based styling with consistent spacing/typography and low
  overhead for a small single-screen app.
- Alternatives considered:
  - Plain CSS modules: rejected to avoid duplicated style tokens and manual utility creation.
  - Component library theme system: rejected as unnecessary for this scope.
