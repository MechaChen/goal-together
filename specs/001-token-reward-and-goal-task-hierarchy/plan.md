# Implementation Plan: Token Reward and Goal-Task Hierarchy

**Branch**: `001-token-reward-and-goal-task-hierarchy` | **Date**: 2026-02-20 | **Spec**: `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-token-reward-and-goal-task-hierarchy/spec.md`
**Input**: Feature specification from `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-token-reward-and-goal-task-hierarchy/spec.md`

## Summary

Implement a three-layer hierarchy (`main goal -> sub goals -> tasks`) with a token reward system:
+10 tokens on first-ever completion of a confirmed task and +50 milestone bonus at each multiple
of 5 cumulative first-time rewarded completions of confirmed tasks. Draft tasks are editable/deletable;
confirmed tasks are immutable and reward-eligible.

## Technical Context

**Language/Version**: Python 3.12+ (backend), TypeScript 5.x (frontend)  
**Primary Dependencies**: FastAPI, Pydantic, SQLAlchemy + aiosqlite, React 19, Vite, Tailwind CSS 4, pnpm  
**Storage**: SQLite  
**Testing**: pytest + pytest-asyncio (backend), Vitest + Testing Library (frontend), contract validation checks  
**Target Platform**: Local web app for modern desktop/mobile browsers  
**Project Type**: web  
**Performance Goals**: Completion/reward updates reflected in UI under 1 second for normal usage  
**Constraints**: Single-user; immutable confirmed tasks; no duplicate rewards; milestone every 5 first-time confirmed completions  
**Scale/Scope**: Single user workspace with nested hierarchy and reward ledger; low volume/high correctness

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Architecture boundaries are explicit: frontend scope in `frontend/`, backend scope in
      `backend/`, and shared contracts are versioned.
- [x] Frontend toolchain is compliant: TypeScript + Vite + `pnpm` (no `npm`/`bun` frontend
      lockfiles or scripts introduced).
- [x] Backend runtime is compliant: Python `asyncio` for I/O-bound concurrency and async-safe
      dependency choices documented.
- [x] Contract-first delivery is defined: API contract changes identified before coding.
- [x] Test strategy is complete: frontend tests, backend async tests, and contract validation
      included for impacted stories.
- [x] Reproducible workflow is defined: deterministic setup, CI commands, and verification steps.

## Project Structure

### Documentation (this feature)

```text
/Users/tomobenson/Desktop/Benson/goal-together/specs/001-token-reward-and-goal-task-hierarchy/
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

**Structure Decision**: Keep split web architecture; isolate reward logic in backend services and expose deterministic contract endpoints consumed by frontend hierarchy/reward views.

## Goal-Task ASCII Architecture Chart

```text
[Main Goal]
    |
    +--> [Sub Goal]
             |
             +--> [Task: draft] --(edit/delete allowed)--> [Task: draft]
             |
             +--> [Confirm Task]
                         |
                         v
                   [Task: confirmed] --(delete blocked)--> [immutable]
                         |
                         v
                    [Eligible for rewards]
```

## Token-Reward ASCII Architecture Chart

```text
[Complete Task Request]
          |
          v
[Task state == confirmed?] --no--> [No reward]
          |
         yes
          v
[First-ever completion?] --no--> [Show "already completed previously" hint]
          |
         yes
          v
[Grant +10 TASK_COMPLETE]
          |
          v
[Increment rewarded completion counter]
          |
[count % 5 == 0 ?] --yes--> [Grant +50 MILESTONE_5X]
          | no
          v
[Persist RewardEvent(s) + TokenWallet]
          |
          v
[Return updated balance + history]
```

## Phase 0: Research Outcomes

- Created `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-token-reward-and-goal-task-hierarchy/research.md`
- All technical unknowns and clarifications are resolved in this plan.

## Phase 1: Design & Contracts Outputs

- Data model: `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-token-reward-and-goal-task-hierarchy/data-model.md`
- API contract: `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-token-reward-and-goal-task-hierarchy/contracts/openapi.yaml`
- Quickstart: `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-token-reward-and-goal-task-hierarchy/quickstart.md`

## Post-Design Constitution Check

- [x] Architecture boundaries remain explicit and enforceable.
- [x] Frontend stack remains TypeScript + Vite + pnpm (+ Tailwind CSS 4).
- [x] Backend stack remains Python async-compatible.
- [x] Contract-first artifacts are present (`openapi.yaml`).
- [x] Test strategy explicitly includes idempotency, milestone, and draft/confirmed lifecycle rules.
- [x] Reproducible setup is documented.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Quality Check Commands

### Backend

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/backend
uv run python -m compileall src
uv run pytest
```

### Frontend

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/frontend
pnpm lint
pnpm test --run --passWithNoTests
```
