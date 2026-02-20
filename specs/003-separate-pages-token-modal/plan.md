# Implementation Plan: Navigation Split and Token Reward Modal

**Branch**: `003-separate-pages-token-modal` | **Date**: 2026-02-20 | **Spec**: `/Users/tomobenson/Desktop/Benson/goal-together/specs/003-separate-pages-token-modal/spec.md`
**Input**: Feature specification from `/Users/tomobenson/Desktop/Benson/goal-together/specs/003-separate-pages-token-modal/spec.md`

## Summary

Split the current combined hierarchy view into dedicated pages for Main Goals, Sub Goals,
Tasks, and Reward History. Add a lego-style SVG token icon and a global queued reward modal
with spinning animation that auto-dismisses after 3 seconds, including persistence across
page navigation.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Python 3.12+ (backend baseline unchanged)  
**Primary Dependencies**: React 19, Vite, Tailwind CSS 4, FastAPI existing API contracts  
**Storage**: SQLite (unchanged)  
**Testing**: Vitest + Testing Library (frontend), pytest/async backend regression checks, contract validation  
**Target Platform**: Modern desktop/mobile browsers on local web app runtime  
**Project Type**: web  
**Performance Goals**: Route/page transitions under 300ms perceived delay; reward modal render under 1s; queued modal timing within 3s ±0.3s  
**Constraints**: Modal queue order must be deterministic; modal remains visible during navigation; parent-context gating for Sub Goals and Tasks pages  
**Scale/Scope**: Single-user UI flow; four dedicated pages; reward event burst handling for short sequential queues

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
/Users/tomobenson/Desktop/Benson/goal-together/specs/003-separate-pages-token-modal/
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
│   ├── services/
│   └── main.tsx
└── tests/

/Users/tomobenson/Desktop/Benson/goal-together/tests/
└── contract/
```

**Structure Decision**: Keep the existing split web architecture; implement this feature as
frontend-first page and UX orchestration work, while preserving backend contracts and adding
contract verification artifacts for explicit non-breaking confirmation.

## Phase 0: Research Outcomes

- Created `/Users/tomobenson/Desktop/Benson/goal-together/specs/003-separate-pages-token-modal/research.md`.
- No unresolved technical clarifications remain.

## Phase 1: Design & Contracts Outputs

- Data model: `/Users/tomobenson/Desktop/Benson/goal-together/specs/003-separate-pages-token-modal/data-model.md`
- API contract: `/Users/tomobenson/Desktop/Benson/goal-together/specs/003-separate-pages-token-modal/contracts/openapi.yaml`
- Quickstart: `/Users/tomobenson/Desktop/Benson/goal-together/specs/003-separate-pages-token-modal/quickstart.md`

## Post-Design Constitution Check

- [x] Architecture boundaries remain explicit and enforceable.
- [x] Frontend stack remains TypeScript + Vite + pnpm (+ Tailwind CSS 4).
- [x] Backend stack remains Python async-compatible and unchanged in this feature scope.
- [x] Contract-first artifacts are present and indicate non-breaking/unchanged API behavior.
- [x] Test strategy includes navigation coverage, queue/modal timing checks, and history page states.
- [x] Reproducible setup and verification commands are documented.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Implementation Notes

- Frontend route split is hash-based and does not require new routing dependencies.
- Reward modal queue is implemented as global FIFO state to survive page navigation.
- Backend contract surface remains unchanged; regression note is tracked in
  `tests/contract/navigation-split-contract.md`.

## Quality Check Commands

### Frontend

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/frontend
pnpm lint
pnpm test --run
```

### Backend

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/backend
uv run pytest
```
