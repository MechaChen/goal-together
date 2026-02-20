---

description: "Task list for token reward and three-layer goal hierarchy feature"
---

# Tasks: Token Reward and Goal-Task Hierarchy

**Input**: Design documents from `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-token-reward-and-goal-task-hierarchy/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are not explicitly included because TDD was not requested in the feature specification. Validation remains required during implementation and quality checks.

**Organization**: Tasks are grouped by user story to support independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Task can be executed in parallel (different files, no unfinished dependencies)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize base project structure and tool configuration

- [X] T001 Create backend hierarchy module layout in `backend/src/models/goal_hierarchy/` and `backend/src/services/rewards/`
- [X] T002 Create frontend hierarchy module layout in `frontend/src/components/goals/` and `frontend/src/services/rewards/`
- [X] T003 [P] Add backend env example variables for reward rules in `backend/.env.example`
- [X] T004 [P] Add frontend env example variables for reward display in `frontend/.env.example`
- [X] T005 [P] Add feature route shell page for hierarchy UI in `frontend/src/pages/token-hierarchy-page.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared data/contract foundations required by all stories

**⚠️ CRITICAL**: Complete before user story implementation

- [X] T006 Define main goal model in `backend/src/models/main_goal.py`
- [X] T007 Define sub goal model in `backend/src/models/sub_goal.py`
- [X] T008 Define task model with lifecycle state in `backend/src/models/task_item.py`
- [X] T009 Define token wallet model in `backend/src/models/token_wallet.py`
- [X] T010 Define reward event model with idempotency key in `backend/src/models/reward_event.py`
- [X] T011 Implement repository queries for hierarchy joins in `backend/src/services/hierarchy_repository.py`
- [X] T012 Implement shared reward ledger utilities in `backend/src/services/reward_ledger.py`
- [X] T013 Add API schema types for hierarchy and reward responses in `backend/src/api/reward_hierarchy_schema.py`
- [X] T014 Create frontend shared types for hierarchy/reward payloads in `frontend/src/services/reward-hierarchy.types.ts`
- [X] T015 Create frontend API client for hierarchy/reward endpoints in `frontend/src/services/reward-hierarchy.client.ts`
- [X] T016 Align contract definitions with clarified lifecycle/reward rules in `specs/001-token-reward-and-goal-task-hierarchy/contracts/openapi.yaml`

**Checkpoint**: Data model, schemas, and contract baseline are ready

---

## Phase 3: User Story 1 - Complete Tasks for Token Rewards (Priority: P1) 🎯 MVP

**Goal**: Completing a confirmed task grants +10 tokens exactly once

**Independent Test**: Complete a confirmed task once and verify +10; repeat completion and verify no extra reward plus hint

- [X] T017 [US1] Implement first-ever completion reward guard in `backend/src/services/reward_ledger.py`
- [X] T018 [US1] Implement complete-task command handler in `backend/src/services/complete_task_service.py`
- [X] T019 [US1] Implement `POST /tasks/{taskId}/complete` endpoint in `backend/src/api/tasks_complete.py`
- [X] T020 [P] [US1] Implement "already completed previously" hint mapping in `frontend/src/services/reward-hierarchy.client.ts`
- [X] T021 [US1] Implement task completion UI action handling in `frontend/src/components/goals/task-row.tsx`
- [X] T022 [US1] Wire completion action + hint rendering in `frontend/src/pages/token-hierarchy-page.tsx`

**Checkpoint**: Confirmed task completion gives one-time +10 reward and duplicate completion is blocked

---

## Phase 4: User Story 2 - Milestone Bonus at Every 5 Completions (Priority: P1)

**Goal**: Award +50 bonus at each multiple of 5 cumulative first-time confirmed completions

**Independent Test**: Reach 5 first-time confirmed completions and verify +50 bonus; verify same behavior at 10

- [X] T023 [US2] Implement rewarded completion counter tracking in `backend/src/services/reward_ledger.py`
- [X] T024 [US2] Implement milestone bonus grant logic in `backend/src/services/reward_milestone_service.py`
- [X] T025 [US2] Integrate milestone issuance into completion flow in `backend/src/services/complete_task_service.py`
- [X] T026 [US2] Extend completion endpoint response with bonus details in `backend/src/api/tasks_complete.py`
- [X] T027 [US2] Render milestone reward event visibility in `frontend/src/components/goals/reward-toast.tsx`

**Checkpoint**: Milestone bonus behavior is deterministic and based only on first-time confirmed completions

---

## Phase 5: User Story 3 - Manage Three-Layer Goal Hierarchy (Priority: P2)

**Goal**: Manage main goal -> sub goal -> task hierarchy with draft/confirmed task lifecycle rules

**Independent Test**: Create hierarchy, edit/delete draft tasks, confirm task, and verify confirmed delete is blocked

- [X] T028 [US3] Implement main goal CRUD endpoints in `backend/src/api/main_goals.py`
- [X] T029 [US3] Implement sub goal CRUD endpoints in `backend/src/api/sub_goals.py`
- [X] T030 [US3] Implement draft task create/edit/delete endpoints in `backend/src/api/tasks_draft.py`
- [X] T031 [US3] Implement task confirm endpoint in `backend/src/api/tasks_confirm.py`
- [X] T032 [US3] Enforce confirmed-task delete prohibition in `backend/src/services/hierarchy_repository.py`
- [X] T033 [P] [US3] Implement hierarchy tree UI component in `frontend/src/components/goals/goal-tree.tsx`
- [X] T034 [P] [US3] Implement draft task editor controls in `frontend/src/components/goals/task-editor.tsx`
- [X] T035 [US3] Implement confirm-task action and delete guard messaging in `frontend/src/components/goals/task-row.tsx`
- [X] T036 [US3] Compose hierarchy management flow in `frontend/src/pages/token-hierarchy-page.tsx`

**Checkpoint**: Lifecycle constraints are enforced and hierarchy operations are usable end-to-end

---

## Phase 6: User Story 4 - View Token Balance and Reward History (Priority: P2)

**Goal**: Expose transparent wallet balance and reward event history

**Independent Test**: Trigger task and milestone rewards and verify history entries reconcile to wallet balance

- [X] T037 [US4] Implement wallet summary endpoint in `backend/src/api/wallet_get.py`
- [X] T038 [US4] Implement reward history endpoint in `backend/src/api/rewards_history.py`
- [X] T039 [US4] Implement wallet summary UI card in `frontend/src/components/goals/wallet-summary.tsx`
- [X] T040 [P] [US4] Implement reward history list component in `frontend/src/components/goals/reward-history.tsx`
- [X] T041 [US4] Integrate wallet/history fetch flow in `frontend/src/pages/token-hierarchy-page.tsx`

**Checkpoint**: Users can verify why and when each reward was granted

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final alignment, docs, and implementation readiness

- [X] T042 [P] Update manual verification with draft/confirm and reward scenarios in `specs/001-token-reward-and-goal-task-hierarchy/quickstart.md`
- [X] T043 [P] Reconcile final endpoint details in `specs/001-token-reward-and-goal-task-hierarchy/contracts/openapi.yaml`
- [X] T044 Add backend quality check command notes in `specs/001-token-reward-and-goal-task-hierarchy/plan.md`
- [X] T045 Add frontend quality check command notes in `specs/001-token-reward-and-goal-task-hierarchy/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): starts immediately
- Phase 2 (Foundational): depends on Phase 1 completion and blocks stories
- Phase 3-6 (User Stories): depend on Phase 2 completion
- Phase 7 (Polish): depends on all desired stories being complete

### User Story Dependencies

- US1 (P1): starts after foundational phase
- US2 (P1): depends on US1 completion reward flow
- US3 (P2): can start after foundational phase but should complete before full US4 UX integration
- US4 (P2): depends on US1/US2 reward event generation and US3 hierarchy data availability

### Dependency Graph

```text
US1 --> US2
US3 --> US4
US1 --> US4
US2 --> US4
```

---

## Parallel Execution Examples

### User Story 1

```bash
# Parallelizable client-side handling while backend completion logic is implemented
Task: T020 frontend/src/services/reward-hierarchy.client.ts
Task: T021 frontend/src/components/goals/task-row.tsx
```

### User Story 2

```bash
# Milestone UI can be prepared while backend issuance logic is implemented
Task: T024 backend/src/services/reward_milestone_service.py
Task: T027 frontend/src/components/goals/reward-toast.tsx
```

### User Story 3

```bash
# UI components for hierarchy and editing can proceed in parallel
Task: T033 frontend/src/components/goals/goal-tree.tsx
Task: T034 frontend/src/components/goals/task-editor.tsx
```

### User Story 4

```bash
# Wallet and history components can be implemented in parallel
Task: T039 frontend/src/components/goals/wallet-summary.tsx
Task: T040 frontend/src/components/goals/reward-history.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational (Phase 1-2)
2. Deliver US1 (Phase 3)
3. Validate first-time completion reward behavior
4. Demo token reward MVP

### Incremental Delivery

1. Add US2 for milestone rewards
2. Add US3 for hierarchy lifecycle rules
3. Add US4 for wallet/history transparency
4. Finish polish/documentation updates

### Parallel Team Strategy

1. Developer A: backend domain and API tasks
2. Developer B: frontend hierarchy and reward UI tasks
3. Developer C: contract/docs alignment tasks

---

## Notes

- All tasks follow required checklist format with checkbox, task ID, optional `[P]`, required `[US#]` in story phases, and file paths.
- Story phases are independently testable increments.
- No explicit TDD-only test tasks were added because the spec did not require TDD.
