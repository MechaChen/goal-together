# Implementation Plan: Toggleable Navbar and Last Opened Tasks Landing

**Branch**: `001-toggle-navbar-last-tasks` | **Date**: 2026-02-21 | **Spec**: `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-toggle-navbar-last-tasks/spec.md`  
**Input**: Feature specification from `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-toggle-navbar-last-tasks/spec.md`

## Summary

Implement a header-left toggle that controls navigation visibility (hidden by default on every launch), and restore users to the last opened tasks page only when entering via root/home. Preserve explicit deep-link routes, existing page behavior, and existing backend/API contracts.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Python 3.12+ (backend unchanged)  
**Primary Dependencies**: React 19, React Router, Vite, Tailwind CSS 4, Vitest  
**Storage**: Browser local storage for last opened tasks context; backend SQLite unchanged  
**Testing**: Vitest + Testing Library (frontend), pytest unchanged (backend)  
**Target Platform**: Modern desktop/mobile browsers  
**Project Type**: Web application with separate `frontend/` and `backend/`  
**Performance Goals**: Navigation toggle response < 100ms perceived; startup route resolution completed before first meaningful paint of routed page  
**Constraints**: Navbar must be hidden on every launch; explicit non-root routes must not be overridden; no backend API changes  
**Scale/Scope**: Single-app navigation behavior affecting all primary pages; expected single-user browser session state

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

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

### Post-Phase 1 Design Re-Check

- [x] Architecture boundaries remain explicit with frontend-only implementation and unchanged backend contracts.
- [x] Frontend toolchain remains TypeScript + Vite + `pnpm`.
- [x] Backend scope remains unchanged and compliant.
- [x] Contract artifacts are produced under `specs/001-toggle-navbar-last-tasks/contracts/`.
- [x] Test strategy includes route-launch behavior, toggle behavior, and fallback handling coverage.
- [x] Quickstart includes reproducible verification commands.

## Project Structure

### Documentation (this feature)

```text
/Users/tomobenson/Desktop/Benson/goal-together/specs/001-toggle-navbar-last-tasks/
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
│   ├── api/
│   ├── models/
│   └── services/
└── tests/

/Users/tomobenson/Desktop/Benson/goal-together/frontend/
├── src/
│   ├── components/
│   │   └── layout/
│   ├── pages/
│   ├── services/
│   ├── app.tsx
│   └── main.tsx
└── tests/
```

**Structure Decision**: Use the existing web application split (`frontend/` + `backend/`) with implementation work isolated to frontend routing/layout/state behavior and no backend code changes.

## Phase 0: Research Plan

1. Research durable and safe route restoration patterns for hash-based routing.
2. Research toggleable navigation UX and accessibility behavior when default state is hidden.
3. Research invalid saved-context fallback behavior for deleted or unavailable tasks contexts.

## Phase 1: Design Plan

1. Define data model for navigation visibility session state and persisted last-opened tasks context.
2. Define contract artifact for launch route resolution and persisted context schema.
3. Define quickstart validation covering startup routing precedence, toggle behavior, and regression checks.
4. Update agent context with current plan technologies and constraints.

## Phase 2: Implementation Planning Scope

1. Header/layout updates: add left toggle control and conditional navigation rendering.
2. Routing startup logic: root/home restoration to last tasks context with explicit-route precedence.
3. State persistence: store/update last opened tasks context on qualifying route transitions.
4. Fallback handling: invalid context recovery to default tasks page.
5. Test coverage: add/adjust frontend tests for launch behavior and toggle interactions.

## Complexity Tracking

No constitution violations requiring justification.
