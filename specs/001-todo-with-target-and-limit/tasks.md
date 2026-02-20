---

description: "Task list for implementing todo app with target, cap, and progress bar"
---

# Tasks: Todo With Target and Limit + Progress Bar

**Input**: Design documents from `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-todo-with-target-and-limit/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are not expanded as separate checklist items because TDD was not explicitly requested in the feature input. Validation is covered by implementation acceptance checks and quickstart verification.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable task (different files, no unfinished dependency)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project structure and baseline toolchains

- [X] T001 Create backend app structure in `backend/src/main.py`, `backend/src/api/`, `backend/src/models/`, and `backend/src/services/`
- [X] T002 Create frontend app structure in `frontend/src/pages/`, `frontend/src/components/`, and `frontend/src/services/`
- [X] T003 [P] Initialize backend dependencies in `backend/requirements.txt`
- [X] T004 [P] Initialize frontend dependencies and scripts in `frontend/package.json`
- [X] T005 [P] Add backend test configuration in `backend/pytest.ini`
- [X] T006 [P] Add frontend test configuration in `frontend/vitest.config.ts`
- [X] T007 Add environment template files in `backend/.env.example` and `frontend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared core required by all user stories

**⚠️ CRITICAL**: Complete this phase before any user story work

- [X] T008 Implement SQLite connection/session management in `backend/src/services/db.py`
- [X] T009 Define `TodoItem` persistence model in `backend/src/models/todo_item.py`
- [X] T010 Implement shared todo repository operations in `backend/src/services/todo_repository.py`
- [X] T011 Implement common error schema and handlers in `backend/src/api/errors.py`
- [X] T012 Implement API router bootstrap in `backend/src/api/router.py`
- [X] T013 Create shared Todo API types in `frontend/src/services/todo-api.types.ts`
- [X] T014 Create shared Todo API client in `frontend/src/services/todo-api.client.ts`
- [X] T015 Align contract source with feature API in `specs/001-todo-with-target-and-limit/contracts/openapi.yaml`

**Checkpoint**: Core data and API plumbing complete; story implementation can begin

---

## Phase 3: User Story 1 - Add Focused Todo (Priority: P1) 🎯 MVP

**Goal**: Users can create todos with a required main target and see them in the list

**Independent Test**: Create a todo with valid target and verify list render; submit blank target and verify rejection message

- [X] T016 [P] [US1] Implement create-todo request validation in `backend/src/api/todo_create_schema.py`
- [X] T017 [US1] Implement `POST /todos` endpoint in `backend/src/api/todos_create.py`
- [X] T018 [US1] Implement `GET /todos` endpoint in `backend/src/api/todos_list.py`
- [X] T019 [P] [US1] Implement create form UI in `frontend/src/components/todo-create-form.tsx`
- [X] T020 [P] [US1] Implement todo list UI in `frontend/src/components/todo-list.tsx`
- [X] T021 [US1] Implement create/list page orchestration in `frontend/src/pages/todos-page.tsx`
- [X] T022 [US1] Add blank-target validation message behavior in `frontend/src/components/todo-create-form.tsx`

**Checkpoint**: User can create valid todos and sees validation feedback for invalid target

---

## Phase 4: User Story 2 - Respect Todo Limit (Priority: P1)

**Goal**: System enforces hard limit of 5 total todos (completed + incomplete)

**Independent Test**: Reach 5 total todos, attempt 6th create, verify rejection; delete one and verify create succeeds

- [X] T023 [US2] Add total-count cap enforcement in create service in `backend/src/services/todo_repository.py`
- [X] T024 [US2] Return explicit capacity error from `POST /todos` in `backend/src/api/todos_create.py`
- [X] T025 [US2] Map capacity error response code/message in `backend/src/api/errors.py`
- [X] T026 [US2] Display max-cap message on create failure in `frontend/src/components/todo-create-form.tsx`
- [X] T027 [US2] Disable create action at cap in `frontend/src/components/todo-create-form.tsx`

**Checkpoint**: Hard cap behavior is enforced consistently in backend and frontend

---

## Phase 5: User Story 3 - Update Progress (Priority: P2)

**Goal**: Users can edit target text, toggle completion, and delete todos

**Independent Test**: Edit target, toggle status, and delete item; verify persisted changes in rendered list

- [X] T028 [US3] Implement `PATCH /todos/{todoId}` endpoint in `backend/src/api/todos_update.py`
- [X] T029 [US3] Implement `POST /todos/{todoId}/toggle` endpoint in `backend/src/api/todos_toggle.py`
- [X] T030 [US3] Implement `DELETE /todos/{todoId}` endpoint in `backend/src/api/todos_delete.py`
- [X] T031 [P] [US3] Implement inline edit UI for main target in `frontend/src/components/todo-list-item.tsx`
- [X] T032 [P] [US3] Implement completion toggle UI in `frontend/src/components/todo-list-item.tsx`
- [X] T033 [P] [US3] Implement delete action UI in `frontend/src/components/todo-list-item.tsx`
- [X] T034 [US3] Wire update/toggle/delete actions into page state in `frontend/src/pages/todos-page.tsx`

**Checkpoint**: Users can fully manage existing todos and see immediate updates

---

## Phase 6: User Story 4 - View Completion Progress Bar (Priority: P2)

**Goal**: Users see current-state completion bar including defined zero state (`0%`, `0/0`)

**Independent Test**: Verify progress equals completed/total, updates after every change, and shows `0%` + `0/0` with no todos

- [X] T035 [US4] Implement progress-summary calculation service in `backend/src/services/progress_service.py`
- [X] T036 [US4] Implement `GET /progress` endpoint in `backend/src/api/progress_get.py`
- [X] T037 [P] [US4] Implement progress bar component in `frontend/src/components/todo-progress-bar.tsx`
- [X] T038 [US4] Integrate progress polling/refetch with todo actions in `frontend/src/pages/todos-page.tsx`
- [X] T039 [US4] Implement zero-state rendering (`0%`, `0/0`) in `frontend/src/components/todo-progress-bar.tsx`

**Checkpoint**: Progress bar behavior matches all clarified requirements

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finalize docs, quality checks, and release readiness

- [X] T040 [P] Update feature quickstart verification notes in `specs/001-todo-with-target-and-limit/quickstart.md`
- [X] T041 [P] Reconcile final API behaviors in `specs/001-todo-with-target-and-limit/contracts/openapi.yaml`
- [X] T042 Run backend quality checks and fix findings in `backend/`
- [X] T043 Run frontend quality checks and fix findings in `frontend/`
- [X] T044 Document final manual verification evidence in `specs/001-todo-with-target-and-limit/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): starts immediately
- Foundational (Phase 2): depends on Setup completion; blocks all stories
- User Story phases (Phase 3-6): depend on Foundational completion
- Polish (Phase 7): depends on desired stories being complete

### User Story Dependencies

- US1 (P1): starts after Foundational; no dependency on other stories
- US2 (P1): depends on US1 create flow and shared repository logic
- US3 (P2): depends on US1 list/create baseline
- US4 (P2): depends on US3 status transitions to prove progress recalculation

### Dependency Graph

```text
US1 --> US2
US1 --> US3 --> US4
```

---

## Parallel Execution Examples

### User Story 1

```bash
# Parallel UI tasks
T019 frontend/src/components/todo-create-form.tsx
T020 frontend/src/components/todo-list.tsx

# Then integrate
T021 frontend/src/pages/todos-page.tsx
```

### User Story 2

```bash
# Backend and frontend can proceed in parallel once cap error contract is known
T023 backend/src/services/todo_repository.py
T026 frontend/src/components/todo-create-form.tsx
```

### User Story 3

```bash
# UI item interactions can be built in parallel
T031 frontend/src/components/todo-list-item.tsx
T032 frontend/src/components/todo-list-item.tsx
T033 frontend/src/components/todo-list-item.tsx
```

### User Story 4

```bash
# Progress compute and visual component can proceed in parallel
T035 backend/src/services/progress_service.py
T037 frontend/src/components/todo-progress-bar.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Finish Phase 1 and Phase 2
2. Deliver Phase 3 (US1)
3. Validate create/list and target validation behavior
4. Demo MVP

### Incremental Delivery

1. Ship US1 (core todo creation/list)
2. Ship US2 (hard cap)
3. Ship US3 (update/toggle/delete)
4. Ship US4 (progress bar)

### Team Parallelism

1. Engineer A: backend endpoint/service tasks
2. Engineer B: frontend component/page tasks
3. Engineer C: contracts/docs/polish tasks

---

## Notes

- All tasks follow required checklist format: `- [ ] T### [P?] [US?] Description with file path`
- Story labels are included only in user story phases
- [P] is applied only to tasks that can run independently
- Keep API contract and implementation aligned after each story phase
