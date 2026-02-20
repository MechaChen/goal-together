# Feature Specification: Todo With Target and Limit

**Feature Branch**: `001-todo-with-target-and-limit`  
**Created**: 2026-02-20  
**Status**: Draft  
**Input**: User description: "I want to build a simple todo app with python fastapi & SQLite, which specify main target, and only limit to 5 todos; add a progress bar feature"

## Clarifications

### Session 2026-02-20

- Q: Does the 5-item cap apply to all todos or only incomplete todos? → A: The cap applies to all todos in the list (completed and incomplete).
- Q: What should the progress display show when there are zero todos? → A: Show an empty progress bar at 0% with label 0/0.
- Q: Should the progress bar include historical trends or only current list state? → A: Show only current completion progress for the active list.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Focused Todo (Priority: P1)

As a user, I can add a todo item by entering a clear main target so I can track what outcome I
am trying to achieve.

**Why this priority**: Without adding focused todos, the app has no core value.

**Independent Test**: Create a new todo with a valid main target and confirm it appears in the
list with the entered content.

**Acceptance Scenarios**:

1. **Given** the todo list has fewer than 5 items, **When** I submit a valid main target,
   **Then** a new todo is created and shown in the list.
2. **Given** I submit an empty or whitespace-only main target, **When** I attempt to add it,
   **Then** the system rejects the submission and shows a clear validation message.

---

### User Story 2 - Respect Todo Limit (Priority: P1)

As a user, I can only maintain up to 5 active todo items so the app stays intentionally simple
and focused.

**Why this priority**: The 5-item cap is an explicit business constraint and key behavior.

**Independent Test**: Add any combination of completed and incomplete todos until total items reach
5, then attempt to add one more and verify creation is blocked.

**Acceptance Scenarios**:

1. **Given** the list already contains 5 todos (completed and/or incomplete), **When** I try to
   add another todo,
   **Then** the system does not create it and explains that the maximum has been reached.
2. **Given** the list contains fewer than 5 todos after deleting one, **When** I add a new todo,
   **Then** the new todo is accepted.

---

### User Story 3 - Update Progress (Priority: P2)

As a user, I can mark todos as complete and edit existing todo targets so the list reflects my
current progress and priorities.

**Why this priority**: Progress tracking is important, but secondary to creation and limit rules.

**Independent Test**: Mark a todo complete and edit a todo target; verify the updated state is
visible immediately and retained.

**Acceptance Scenarios**:

1. **Given** an existing incomplete todo, **When** I mark it as completed,
   **Then** its status changes to completed.
2. **Given** an existing todo, **When** I update its main target to a valid value,
   **Then** the updated target is saved and shown.

---

### User Story 4 - View Completion Progress Bar (Priority: P2)

As a user, I can see a progress bar that summarizes how many todos are completed so I can quickly
understand my current progress toward finishing the list.

**Why this priority**: A visual progress indicator improves clarity and motivation without changing
core todo management behavior.

**Independent Test**: With multiple todos in mixed completion states, verify the progress bar value
matches completed versus total todos for the current list state only and updates immediately after
status changes.

**Acceptance Scenarios**:

1. **Given** a list with completed and incomplete todos, **When** I view the todo screen,
   **Then** I see a progress bar reflecting completion percentage.
2. **Given** I mark a todo complete or incomplete, **When** the action succeeds,
   **Then** the progress bar updates to the new percentage without a manual refresh.

---

### Edge Cases

- What happens when a user tries to create a 6th todo item?
- How does the system handle a main target containing only spaces?
- What happens when a user edits a todo target to become empty?
- How does the system behave if a user tries to update or delete a todo that no longer exists?
- What happens to the progress bar when there are zero todos? It must display 0% and 0/0.
- How does the progress bar handle rapid status toggles across multiple todos?

## Constitution Alignment *(mandatory)*

- **CA-001 Toolchain Boundary**: Feature scope stays within existing frontend/backend boundaries
  and introduces no additional runtime/toolchain categories.
- **CA-002 Contract Impact**: Data exchange patterns for create/list/update/delete todo behavior
  are explicitly reflected in scenarios and requirements.
- **CA-003 Testing Impact**: Validation covers user flows, list-cap behavior, and failure paths.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a user to create a todo item with a required main target.
- **FR-002**: The system MUST reject creation requests when the main target is empty or
  whitespace-only.
- **FR-003**: The system MUST prevent creation of a new todo when 5 total todos already exist,
  regardless of completion status.
- **FR-004**: The system MUST provide a clear user-facing reason when a creation request is
  rejected due to validation failure or list-cap limit.
- **FR-005**: The system MUST allow a user to view all current todo items and their completion
  status.
- **FR-006**: The system MUST allow a user to update an existing todo main target.
- **FR-007**: The system MUST reject updates that set a todo main target to empty or
  whitespace-only.
- **FR-008**: The system MUST allow a user to mark a todo as completed or not completed.
- **FR-009**: The system MUST allow a user to delete a todo item.
- **FR-010**: The system MUST preserve todo data so items remain available after the app restarts.
- **FR-011**: The system MUST display a progress bar showing completion progress based on completed
  todos versus total todos.
- **FR-012**: The system MUST update the progress bar immediately after create, delete, or completion
  status changes.
- **FR-013**: The system MUST show a zero-progress state when no todos exist: an empty progress
  bar at 0% with a `0/0` label.
- **FR-014**: The system MUST represent current completion state only and MUST NOT include historical
  trend or forecast information in the progress indicator.

### Key Entities *(include if feature involves data)*

- **Todo Item**: A single tracked task with attributes including identifier, main target text,
  completion status, and timestamps.
- **Todo List**: The bounded collection of todo items with a hard maximum size of 5.
- **Progress Summary**: A derived view state representing completed count, total count, and
  completion percentage for rendering the progress bar.

### Assumptions

- This feature targets a single-user experience (no multi-user sharing or permissions in scope).
- The 5-item maximum applies to all todos in the list at any given time, including completed
  and incomplete items.
- A deleted todo frees one slot for creating a new todo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of attempts to add a 6th todo are blocked with a clear explanatory message.
- **SC-002**: 95% of users can add a valid todo with a main target in under 30 seconds.
- **SC-003**: 100% of saved valid updates to a todo target and completion state are visible
  immediately after the action.
- **SC-004**: 100% of todo lists retain their saved state after an application restart.
- **SC-005**: For 100% of tested list states, the progress bar percentage equals
  `completed todos / total todos`.
- **SC-006**: 95% of users can correctly identify their completion progress from the progress bar
  in under 5 seconds.
