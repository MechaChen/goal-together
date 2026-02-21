---

description: "Task list for navigation split and token reward modal feature"

---

# Tasks: Navigation Split and Token Reward Modal

**Input**: Design documents from `/Users/tomobenson/Desktop/Benson/goal-together/specs/003-separate-pages-token-modal/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include frontend tests and contract verification tasks because the plan requires navigation, modal timing, and history rendering validation.

**Organization**: Tasks are grouped by user story to support independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Task can be executed in parallel (different files, no unfinished dependencies)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare page-level shell and shared UI infrastructure

- [X] T001 Create page route file shells in `frontend/src/pages/main-goals-page.tsx`, `frontend/src/pages/sub-goals-page.tsx`, `frontend/src/pages/tasks-page.tsx`, and `frontend/src/pages/reward-history-page.tsx`
- [X] T002 Create global app layout with top navigation container in `frontend/src/components/layout/app-shell.tsx`
- [X] T003 [P] Create shared route constants and labels in `frontend/src/services/navigation.routes.ts`
- [X] T004 [P] Add reward modal state shell store in `frontend/src/services/reward-modal-queue.store.ts`
- [X] T005 [P] Add token icon asset/component shell in `frontend/src/components/rewards/token-icon.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core navigation context and modal queue foundations required by all stories

**⚠️ CRITICAL**: Complete before user story implementation

- [X] T006 Implement app router composition for dedicated pages in `frontend/src/main.tsx`
- [X] T007 Implement active page + parent-context state model in `frontend/src/services/section-page-state.ts`
- [X] T008 Implement parent-context selectors for main goal and sub goal in `frontend/src/components/layout/context-selectors.tsx`
- [X] T009 Implement reusable reward modal frame with auto-dismiss timer support in `frontend/src/components/rewards/reward-modal.tsx`
- [X] T010 Implement FIFO queue controller for reward modal events in `frontend/src/services/reward-modal-queue.service.ts`
- [X] T011 Implement reward event-to-modal adapter using existing API payloads in `frontend/src/services/reward-event-adapter.ts`
- [X] T012 Add non-breaking API contract verification note updates in `specs/003-separate-pages-token-modal/contracts/openapi.yaml`

**Checkpoint**: Route structure, parent-context state, and queued reward modal foundation are ready

---

## Phase 3: User Story 1 - Navigate Work Sections by Page (Priority: P1) 🎯 MVP

**Goal**: Separate Main Goals, Sub Goals, Tasks, and Reward History into dedicated pages

**Independent Test**: Navigate among all pages, verify page-specific content, and confirm parent-context prompts on Sub Goals and Tasks pages

### Tests for User Story 1

- [X] T013 [P] [US1] Add navigation route rendering test in `frontend/tests/navigation-pages.spec.tsx`
- [X] T014 [P] [US1] Add Sub Goals context-required behavior test in `frontend/tests/sub-goals-context.spec.tsx`
- [X] T015 [P] [US1] Add Tasks context-required behavior test in `frontend/tests/tasks-context.spec.tsx`

### Implementation for User Story 1

- [X] T016 [US1] Implement Main Goals dedicated page composition in `frontend/src/pages/main-goals-page.tsx`
- [X] T017 [US1] Implement Sub Goals dedicated page with main-goal gating in `frontend/src/pages/sub-goals-page.tsx`
- [X] T018 [US1] Implement Tasks dedicated page with sub-goal gating in `frontend/src/pages/tasks-page.tsx`
- [X] T019 [US1] Implement page-level navigation links and active state rendering in `frontend/src/components/layout/app-shell.tsx`
- [X] T020 [US1] Connect parent-context selectors to routing and page guards in `frontend/src/services/section-page-state.ts`

**Checkpoint**: Dedicated page navigation and hierarchy context gating work independently

---

## Phase 4: User Story 3 - Receive Reward Celebration Modal (Priority: P1)

**Goal**: Show spinning token reward modal for each reward with 3-second auto-dismiss and queue behavior

**Independent Test**: Trigger sequential rewards, verify FIFO modal order, 3-second timing, and persistence across navigation

### Tests for User Story 3

- [X] T021 [P] [US3] Add reward modal appears-on-reward test in `frontend/tests/reward-modal-trigger.spec.tsx`
- [X] T022 [P] [US3] Add modal queue FIFO behavior test in `frontend/tests/reward-modal-queue.spec.tsx`
- [X] T023 [P] [US3] Add modal 3-second auto-dismiss timing test in `frontend/tests/reward-modal-timer.spec.tsx`
- [X] T024 [P] [US3] Add modal persistence-across-navigation test in `frontend/tests/reward-modal-navigation.spec.tsx`

### Implementation for User Story 3

- [X] T025 [US3] Implement reward trigger hook in task completion flow in `frontend/src/services/reward-hierarchy.client.ts`
- [X] T026 [US3] Implement modal queue lifecycle controller and dequeue timing in `frontend/src/services/reward-modal-queue.service.ts`
- [X] T027 [US3] Implement global reward modal mount in app shell in `frontend/src/components/layout/app-shell.tsx`
- [X] T028 [US3] Implement spinning token animation behavior in modal UI in `frontend/src/components/rewards/reward-modal.tsx`
- [X] T029 [US3] Integrate modal queue dispatch from task completion actions in `frontend/src/pages/tasks-page.tsx`

**Checkpoint**: Reward modal feedback is deterministic, queued, and time-bound across page navigation

---

## Phase 5: User Story 2 - See Token Identity Clearly (Priority: P2)

**Goal**: Add consistent lego-style SVG token icon in reward-related UI contexts

**Independent Test**: Trigger reward and inspect reward contexts to verify consistent SVG token icon rendering

### Tests for User Story 2

- [X] T030 [P] [US2] Add token icon component rendering/accessibility test in `frontend/tests/token-icon.spec.tsx`
- [X] T031 [P] [US2] Add token icon presence in reward modal test in `frontend/tests/reward-modal-icon.spec.tsx`

### Implementation for User Story 2

- [X] T032 [US2] Implement lego-style SVG token component in `frontend/src/components/rewards/token-icon.tsx`
- [X] T033 [US2] Integrate token icon into reward modal body in `frontend/src/components/rewards/reward-modal.tsx`
- [X] T034 [US2] Integrate token icon into reward history list rows in `frontend/src/components/goals/reward-history.tsx`

**Checkpoint**: Token identity is visually consistent and reusable across reward surfaces

---

## Phase 6: User Story 4 - Review Reward History on Dedicated Page (Priority: P2)

**Goal**: Provide dedicated Reward History page with populated and empty states

**Independent Test**: Open Reward History page with/without events and verify both populated entries and empty-state behavior

### Tests for User Story 4

- [X] T035 [P] [US4] Add reward history page populated-state test in `frontend/tests/reward-history-page.spec.tsx`
- [X] T036 [P] [US4] Add reward history empty-state test in `frontend/tests/reward-history-empty.spec.tsx`

### Implementation for User Story 4

- [X] T037 [US4] Implement Reward History dedicated page layout in `frontend/src/pages/reward-history-page.tsx`
- [X] T038 [US4] Connect reward history data fetching to page lifecycle in `frontend/src/services/reward-history-page.service.ts`
- [X] T039 [US4] Render explicit empty state and list state in `frontend/src/components/goals/reward-history.tsx`

**Checkpoint**: Reward History page is independently usable and transparent for earned rewards

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, docs, and end-to-end verification

- [X] T040 [P] Update quickstart validation steps for dedicated pages and modal queue in `specs/003-separate-pages-token-modal/quickstart.md`
- [X] T041 [P] Update implementation notes and quality gates in `specs/003-separate-pages-token-modal/plan.md`
- [X] T042 [P] Add contract verification regression note for unchanged endpoints in `tests/contract/navigation-split-contract.md`
- [X] T043 Run frontend quality checks and capture outcomes in `specs/003-separate-pages-token-modal/quickstart.md`
- [X] T044 Run backend regression checks and capture outcomes in `specs/003-separate-pages-token-modal/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): starts immediately
- Phase 2 (Foundational): depends on Phase 1 completion and blocks all stories
- Phase 3-6 (User Stories): depend on Phase 2 completion
- Phase 7 (Polish): depends on selected story completion

### User Story Dependencies

- US1 (P1): starts after foundational phase and enables route/page split baseline
- US3 (P1): depends on US1 page split and foundational modal queue shell
- US2 (P2): depends on US3 modal UI so token icon integration can be validated in context
- US4 (P2): depends on US1 dedicated page layout and existing reward history data flow

### Dependency Graph

```text
US1 --> US3
US3 --> US2
US1 --> US4
```

---

## Parallel Execution Examples

### User Story 1

```bash
# Parallel test authoring for independent context-gating flows
Task: T014 frontend/tests/sub-goals-context.spec.tsx
Task: T015 frontend/tests/tasks-context.spec.tsx
```

### User Story 3

```bash
# Queue and timing tests can be prepared in parallel before implementation finalization
Task: T022 frontend/tests/reward-modal-queue.spec.tsx
Task: T023 frontend/tests/reward-modal-timer.spec.tsx
Task: T024 frontend/tests/reward-modal-navigation.spec.tsx
```

### User Story 2

```bash
# Icon component and icon-in-modal test can proceed in parallel
Task: T030 frontend/tests/token-icon.spec.tsx
Task: T032 frontend/src/components/rewards/token-icon.tsx
```

### User Story 4

```bash
# Reward history page test files can be prepared in parallel
Task: T035 frontend/tests/reward-history-page.spec.tsx
Task: T036 frontend/tests/reward-history-empty.spec.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational (Phase 1-2)
2. Deliver US1 dedicated pages + parent-context gating
3. Validate independent navigation behavior
4. Demo section separation MVP

### Incremental Delivery

1. Add US3 reward modal queue and timing behavior
2. Add US2 token icon visual identity consistency
3. Add US4 dedicated reward history page completion
4. Finish polish and validation notes

### Parallel Team Strategy

1. Developer A: routing, page composition, and parent-context gating
2. Developer B: reward modal queue service and animation behavior
3. Developer C: tests, contract verification docs, and quickstart updates

---

## Notes

- All tasks follow required checklist format with checkbox, task ID, optional `[P]`, required `[US#]` in story phases, and file paths.
- User stories remain independently testable increments.
- Tests are explicitly included because plan-level test strategy requires validation of page navigation, modal timing, and history states.
