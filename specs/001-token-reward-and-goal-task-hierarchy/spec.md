# Feature Specification: Token Reward Hierarchy

**Feature Branch**: `001-token-reward-and-goal-task-hierarchy`  
**Created**: 2026-02-20  
**Status**: Draft  
**Input**: User description: "I want to add a token aware system, when user finish a task, it should be awared with 10 token, and when user finish 5 tasks, should be awared another 50 token and there should be 3 layers of task, main goal -> sub goals -> tasks"

## Clarifications

### Session 2026-02-20

- Q: Should a task grant rewards only on first completion or also on re-completion? → A: Rewards are granted only on the first-ever completion of each task; if it was already completed previously, no new reward is granted.
- Q: What is the deletion and reward policy for tasks after drafting? → A: Draft sub-goal tasks are editable/deletable; confirmed tasks are immutable (no delete), and only confirmed tasks can earn token rewards.
- Q: What should milestone counting be based on? → A: Milestone counting is based only on cumulative first-time rewarded completions of confirmed tasks.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Tasks for Token Rewards (Priority: P1)

As a user, I can complete tasks and immediately receive token rewards so I feel progress and stay motivated.

**Why this priority**: Direct reward feedback is the core value of the feature.

**Independent Test**: Complete one task and verify token balance increases by 10 with a visible reward event.

**Acceptance Scenarios**:

1. **Given** a user has an existing task marked incomplete, **When** the user marks the task complete,
   **Then** the system adds 10 tokens to the user balance.
2. **Given** a task was already completed previously, **When** the user attempts to complete it again,
   **Then** no additional completion reward is granted and the user sees an \"already completed previously\" hint.

---

### User Story 2 - Milestone Bonus at Every 5 Completions (Priority: P1)

As a user, I receive an additional bonus when I complete 5 tasks so milestone achievement feels meaningful.

**Why this priority**: The 5-task bonus is an explicit business rule and reward mechanic.

**Independent Test**: Complete five distinct confirmed tasks for the first time and verify total added reward includes 50 bonus tokens in addition to per-task rewards.

**Acceptance Scenarios**:

1. **Given** the user has completed 4 tasks toward the current milestone, **When** the user completes the 5th task,
   **Then** the system grants 10 tokens for the task and an additional 50-token milestone bonus.
2. **Given** the user completes tasks beyond the first milestone, **When** total first-time rewarded completion count of confirmed tasks reaches each next multiple of 5,
   **Then** the same 50-token milestone bonus is granted at each multiple.

---

### User Story 3 - Manage Three-Layer Goal Hierarchy (Priority: P2)

As a user, I can organize work into main goals, sub goals, and tasks so progress reflects meaningful structure.

**Why this priority**: Structured planning improves clarity and supports long-term usage.

**Independent Test**: Create draft tasks under a sub goal, edit/delete drafts, confirm selected tasks, then verify confirmed tasks cannot be deleted and are reward-eligible.

**Acceptance Scenarios**:

1. **Given** a user creates a main goal, **When** the user adds sub goals and tasks beneath it,
   **Then** each item is stored in the correct parent-child hierarchy.
2. **Given** a task belongs to a sub goal under a main goal, **When** the task is completed,
   **Then** completion status is reflected in the hierarchy views without breaking parent-child relationships.
3. **Given** a task is in draft state, **When** the user edits or deletes it,
   **Then** the system allows the action.
4. **Given** a task is confirmed, **When** the user attempts to delete it,
   **Then** the system rejects deletion and keeps the task immutable.

---

### User Story 4 - View Token Balance and Reward History (Priority: P2)

As a user, I can see current token balance and recent reward events so I can trust how rewards are calculated.

**Why this priority**: Transparency is needed for confidence in the reward system.

**Independent Test**: Complete tasks to trigger standard and milestone rewards, then verify balance and history entries match expected totals.

**Acceptance Scenarios**:

1. **Given** a user receives task and milestone rewards, **When** the user opens token summary,
   **Then** current balance equals cumulative granted rewards.
2. **Given** reward events occur, **When** the user views history,
   **Then** each event shows reward type, amount, and related task completion context.

---

### Edge Cases

- What happens if a task completion update is retried due to a transient failure?
- How does the system prevent duplicate token grants for the same task completion event?
- What happens when a user attempts to delete a confirmed task?
- How does milestone bonus logic behave when multiple completion actions occur in quick succession?
- What happens if a sub goal or main goal is archived while child tasks remain incomplete?
- What happens when a task is completed while still in draft state?

## Constitution Alignment *(mandatory)*

- **CA-001 Toolchain Boundary**: Feature scope keeps frontend and backend responsibilities separated,
  with no runtime coupling violations.
- **CA-002 Contract Impact**: Reward events, hierarchy CRUD, and completion actions require clear
  contract updates for deterministic token behavior.
- **CA-003 Testing Impact**: Validation covers hierarchy integrity, idempotent rewarding, milestone
  bonuses, and user-visible balance/history consistency.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support a three-layer work hierarchy: main goals, sub goals, and tasks.
- **FR-002**: The system MUST enforce parent-child relationships where each sub goal belongs to one
  main goal and each task belongs to one sub goal.
- **FR-003**: The system MUST allow users to mark tasks as complete and incomplete.
- **FR-004**: The system MUST support task lifecycle states including `draft` and `confirmed`.
- **FR-005**: The system MUST allow editing and deleting tasks while they are in `draft` state.
- **FR-006**: The system MUST prevent deletion of tasks once they are `confirmed`.
- **FR-007**: The system MUST grant 10 tokens only on the first-ever completion of a `confirmed` task.
- **FR-008**: The system MUST prevent duplicate 10-token rewards for repeated completion actions on
  tasks that were already completed previously.
- **FR-009**: The system MUST prevent token rewards for task completions while task state is `draft`.
- **FR-010**: The system MUST grant an additional 50-token bonus whenever the user reaches each
  cumulative first-time rewarded completion count of confirmed tasks that is a multiple of 5.
- **FR-011**: The system MUST maintain a running token balance per user that reflects all granted
  rewards.
- **FR-012**: The system MUST show token balance and reward history to the user.
- **FR-013**: Reward history MUST record reward type (task reward or milestone bonus), token amount,
  and the related completion context.
- **FR-014**: The system MUST ensure reward grants are resilient to retries so duplicated completion
  requests do not create duplicated rewards.
- **FR-015**: The system MUST preserve hierarchy and reward data after application restart.

### Key Entities *(include if feature involves data)*

- **Main Goal**: Top-level objective containing one or more sub goals.
- **Sub Goal**: Child objective linked to one main goal and containing one or more tasks.
- **Task**: Atomic actionable item linked to one sub goal with lifecycle state (`draft`, `confirmed`),
  completion state, and timestamps.
- **Token Wallet**: User reward balance aggregate tracking total earned tokens.
- **Reward Event**: Immutable record of each token grant, including type, amount, source action,
  and event timestamp.

### Assumptions

- The app remains single-user for this feature iteration.
- Milestone bonus applies at every multiple of 5 first-time rewarded completions of confirmed
  tasks (5, 10, 15, ...).
- Uncompleting a task does not retroactively revoke already-awarded historical rewards unless a
  future policy explicitly introduces clawback behavior.
- Confirmed tasks are immutable with respect to deletion.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid task completion actions increase user balance by exactly 10 tokens once.
- **SC-002**: 100% of cumulative first-time rewarded completion counts of confirmed tasks reaching
  multiples of 5 trigger one additional 50-token bonus event.
- **SC-003**: 100% of sampled reward histories reconcile exactly with displayed token balances.
- **SC-004**: 95% of users can create a main goal, sub goal, and task hierarchy in under 2 minutes.
- **SC-005**: 95% of users can identify why their latest reward was granted within 10 seconds using
  the balance/history views.
