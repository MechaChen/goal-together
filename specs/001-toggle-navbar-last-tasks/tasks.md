# Tasks: Toggleable Navbar and Last Opened Tasks Landing

**Input**: Design documents from `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-toggle-navbar-last-tasks/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`

**Tests**: Include frontend tests because the spec explicitly requires validation coverage for startup behavior, toggle behavior, and fallback handling.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on unfinished tasks)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared scaffolding for feature-specific routing/state tests and services.

- [X] T001 Create feature test utility helpers in `frontend/tests/navigation-launch.utils.ts`
- [X] T002 [P] Add launch-state constants for storage keys in `frontend/src/services/navigation-launch.constants.ts`
- [X] T003 [P] Add launch-state shared types in `frontend/src/services/navigation-launch.types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared launch-resolution and persistence primitives used across all user stories.

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [X] T004 Implement localStorage read/write and validation helpers in `frontend/src/services/navigation-launch.storage.ts`
- [X] T005 [P] Implement tasks-route detection and normalization helpers in `frontend/src/services/navigation-launch.routes.ts`
- [X] T006 Implement launch-route resolver (root vs explicit route precedence) in `frontend/src/services/navigation-launch.resolver.ts`
- [X] T007 Align client navigation contract schema with finalized field names in `specs/001-toggle-navbar-last-tasks/contracts/openapi.yaml`

**Checkpoint**: Foundational route/state utilities are complete and ready for story implementation.

---

## Phase 3: User Story 1 - Resume Where I Left Off (Priority: P1) 🎯 MVP

**Goal**: Restore users to their last opened tasks context when entering from root/home while preserving explicit deep links.

**Independent Test**: Open a tasks context, reload from root/home, verify restoration; open explicit non-root route, verify no override.

### Tests for User Story 1

- [X] T008 [P] [US1] Add root-home launch restoration test in `frontend/tests/startup-last-tasks-root.spec.tsx`
- [X] T009 [P] [US1] Add explicit non-root route precedence test in `frontend/tests/startup-explicit-route-precedence.spec.tsx`
- [X] T010 [P] [US1] Add invalid saved-context fallback test in `frontend/tests/startup-invalid-last-tasks-fallback.spec.tsx`

### Implementation for User Story 1

- [X] T011 [US1] Integrate launch-route resolver into initial app routing flow in `frontend/src/app.tsx`
- [X] T012 [US1] Persist last opened tasks context on tasks-route transitions in `frontend/src/app.tsx`
- [X] T013 [US1] Add saved-context validation using route helpers in `frontend/src/services/navigation-launch.resolver.ts`
- [X] T014 [US1] Add invalid-context cleanup behavior in `frontend/src/services/navigation-launch.storage.ts`

**Checkpoint**: User Story 1 works independently and satisfies root/home restoration plus explicit-route precedence.

---

## Phase 4: User Story 2 - Start with Navigation Hidden (Priority: P2)

**Goal**: Ensure navigation is hidden by default on every app launch and does not persist visibility state across reloads.

**Independent Test**: Reload app and verify navigation is hidden on initial render every time.

### Tests for User Story 2

- [X] T015 [P] [US2] Add default-hidden navigation test in `frontend/tests/navbar-default-hidden.spec.tsx`
- [X] T016 [P] [US2] Add launch-reset visibility test (no persisted visibility) in `frontend/tests/navbar-reset-hidden-on-reload.spec.tsx`

### Implementation for User Story 2

- [X] T017 [US2] Add session-only navigation visibility state with hidden default in `frontend/src/components/layout/app-shell.tsx`
- [X] T018 [US2] Remove/avoid persisted visibility writes in `frontend/src/services/navigation-launch.storage.ts`
- [X] T019 [US2] Add hidden navigation layout styles for collapsed menu state in `frontend/src/index.css`

**Checkpoint**: User Story 2 works independently with hidden-by-default behavior on all launches.

---

## Phase 5: User Story 3 - Toggle Navigation from Header Left (Priority: P3)

**Goal**: Provide a header-left toggle control to show/hide navigation without changing current route.

**Independent Test**: Click header-left toggle to open/close navigation; current route remains unchanged.

### Tests for User Story 3

- [X] T020 [P] [US3] Add toggle open/close interaction test in `frontend/tests/navbar-toggle-button.spec.tsx`
- [X] T021 [P] [US3] Add no-route-change-on-toggle test in `frontend/tests/navbar-toggle-no-navigation.spec.tsx`
- [X] T022 [P] [US3] Add accessibility label/state test for toggle button in `frontend/tests/navbar-toggle-accessibility.spec.tsx`

### Implementation for User Story 3

- [X] T023 [US3] Add header-left toggle button and accessible label/state in `frontend/src/components/layout/app-shell.tsx`
- [X] T024 [US3] Render primary navigation conditionally from toggle state in `frontend/src/components/layout/app-shell.tsx`
- [X] T025 [US3] Ensure toggle interaction does not trigger route changes in `frontend/src/components/layout/app-shell.tsx`

**Checkpoint**: User Story 3 works independently with discoverable, accessible toggle behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration verification and documentation updates across stories.

- [X] T026 [P] Update manual verification flow for launch/toggle behaviors in `specs/001-toggle-navbar-last-tasks/quickstart.md`
- [X] T027 Run and stabilize frontend test suite for all new scenarios via `frontend/tests/*.spec.tsx`
- [X] T028 Run frontend quality checks and resolve regressions in `frontend/src/app.tsx`
- [X] T029 Perform final contract/spec consistency pass in `specs/001-toggle-navbar-last-tasks/spec.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2; MVP slice.
- **Phase 4 (US2)**: Depends on Phase 2; can run parallel with US1 if staffed.
- **Phase 5 (US3)**: Depends on Phase 2 and benefits from US2 state structure.
- **Phase 6 (Polish)**: Depends on completion of selected user stories.

### User Story Dependencies

- **US1 (P1)**: Independent after foundational work.
- **US2 (P2)**: Independent after foundational work.
- **US3 (P3)**: Depends on navigation visibility state introduced in US2 but can be prepared in parallel.

### Within Each User Story

- Story tests first (fail-first validation intent), then implementation, then integration verification.

## Parallel Opportunities

- Phase 1: `T002` and `T003` can run in parallel.
- Phase 2: `T005` can run in parallel with `T004` before `T006`.
- US1: `T008`, `T009`, and `T010` can run in parallel.
- US2: `T015` and `T016` can run in parallel.
- US3: `T020`, `T021`, and `T022` can run in parallel.
- Polish: `T026` and `T027` can run in parallel.

## Parallel Example: User Story 1

```bash
# Parallel test authoring for US1
Task: "T008 [US1] Add root-home launch restoration test in frontend/tests/startup-last-tasks-root.spec.tsx"
Task: "T009 [US1] Add explicit non-root route precedence test in frontend/tests/startup-explicit-route-precedence.spec.tsx"
Task: "T010 [US1] Add invalid saved-context fallback test in frontend/tests/startup-invalid-last-tasks-fallback.spec.tsx"
```

## Parallel Example: User Story 3

```bash
# Parallel test authoring for US3
Task: "T020 [US3] Add toggle open/close interaction test in frontend/tests/navbar-toggle-button.spec.tsx"
Task: "T021 [US3] Add no-route-change-on-toggle test in frontend/tests/navbar-toggle-no-navigation.spec.tsx"
Task: "T022 [US3] Add accessibility label/state test for toggle button in frontend/tests/navbar-toggle-accessibility.spec.tsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently using `T008`-`T014`.
4. Demo/deploy MVP behavior (root/home restore + explicit-route precedence).

### Incremental Delivery

1. Deliver US1 (MVP).
2. Deliver US2 (hidden-by-default startup behavior).
3. Deliver US3 (header-left toggle control).
4. Finish Phase 6 polish and regression checks.

### Parallel Team Strategy

1. One developer completes foundational services (`T004`-`T007`).
2. After foundation:
   - Developer A: US1 (`T008`-`T014`)
   - Developer B: US2 (`T015`-`T019`)
   - Developer C: US3 tests (`T020`-`T022`) then implementation (`T023`-`T025`)
