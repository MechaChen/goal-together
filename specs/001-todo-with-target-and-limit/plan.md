# Implementation Plan: Todo With Target and Limit + Progress Bar

**Branch**: `001-todo-with-target-and-limit` | **Date**: 2026-02-20 | **Spec**: `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-todo-with-target-and-limit/spec.md`
**Input**: Feature specification from `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-todo-with-target-and-limit/spec.md`

## Summary

Deliver a single-user todo app that enforces a required main target, hard-caps the list at
5 total todos, and renders a real-time progress bar for current completion state only.
Implementation uses an async Python backend with SQLite persistence and a TypeScript/Vite
frontend styled with Tailwind CSS 4.

## Technical Context

**Language/Version**: Python 3.12+ (backend), TypeScript 5.x (frontend)  
**Primary Dependencies**: FastAPI, Pydantic, SQLAlchemy + aiosqlite, React 19, Vite, Tailwind CSS 4, pnpm  
**Storage**: SQLite  
**Testing**: pytest + pytest-asyncio (backend), Vitest + Testing Library (frontend), contract checks  
**Target Platform**: Local web app for modern desktop/mobile browsers  
**Project Type**: web  
**Performance Goals**: CRUD and progress responses p95 < 200ms in local single-user usage  
**Constraints**: 5 total todos max; main target required; progress is current-state-only; single-user scope  
**Scale/Scope**: 1 user, 1 list, max 5 records, 1 primary UI screen

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Architecture boundaries are explicit: frontend scope in `frontend/`, backend scope in
      `backend/`, and shared contracts are versioned.
- [x] Frontend toolchain is compliant: TypeScript + Vite + `pnpm` (no `npm`/`bun` frontend
      lockfiles or scripts introduced).
- [x] Backend runtime is compliant: Python `asyncio` for I/O-bound concurrency and async-safe
      dependency choices documented.
- [x] Contract-first delivery is defined: API/event contract changes identified before coding.
- [x] Test strategy is complete: frontend tests, backend async tests, and contract validation
      included for impacted stories.
- [x] Reproducible workflow is defined: deterministic setup, CI commands, and verification steps.

## Project Structure

### Documentation (this feature)

```text
/Users/tomobenson/Desktop/Benson/goal-together/specs/001-todo-with-target-and-limit/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
/Users/tomobenson/Desktop/Benson/goal-together/backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

/Users/tomobenson/Desktop/Benson/goal-together/frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

/Users/tomobenson/Desktop/Benson/goal-together/tests/
└── contract/
```

**Structure Decision**: Web app split with explicit backend/frontend boundaries to satisfy
constitution constraints and keep contracts testable in isolation.

## ASCII Delivery Chart

```text
Phase 0 (Research)  -->  Phase 1 (Design + Contracts)  -->  Phase 2 (Task Planning)
       |                          |                               |
       v                          v                               v
[Decisions locked]      [Data model + OpenAPI + QS]      [Story-based task breakdown]

User Flow and Progress Logic

[Open App]
    |
    v
[Load Todos] ----> [0 items?] --yes--> [Show 0% bar (0/0)]
    | no
    v
[Render List + Progress Bar (Tailwind CSS 4)]
    |
    +--> [Add Todo] --if total==5--> [Reject with limit message]
    |                 else
    |                 v
    |             [Persist + Recompute Progress]
    |
    +--> [Toggle Complete / Edit / Delete]
                      |
                      v
              [Persist + Recompute Progress]
```

## Phase 0: Research Outcomes

- Created `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-todo-with-target-and-limit/research.md`
- All technical unknowns resolved; no `NEEDS CLARIFICATION` remains.

## Phase 1: Design & Contracts Outputs

- Data model: `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-todo-with-target-and-limit/data-model.md`
- API contract: `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-todo-with-target-and-limit/contracts/openapi.yaml`
- Quickstart: `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-todo-with-target-and-limit/quickstart.md`

## Post-Design Constitution Check

- [x] Architecture boundaries remain explicit (backend/frontend separation retained).
- [x] Frontend stack remains TypeScript + Vite + pnpm (with Tailwind CSS 4).
- [x] Backend stack remains Python async-compatible.
- [x] Contract-first artifacts are present (OpenAPI spec created).
- [x] Test strategy is mapped for frontend, backend, and contract layers.
- [x] Reproducible setup is documented in quickstart.

## Manual Verification Evidence

- Backend static validation: `python3 -m compileall backend/src` completed without syntax errors.
- Frontend lint: `pnpm lint` passed in `frontend/`.
- Frontend tests: `pnpm test --run --passWithNoTests` passed in `frontend/`.
- Backend dependency install via pip was blocked by offline package index access, so runtime
  backend tests were not executed in this environment.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
