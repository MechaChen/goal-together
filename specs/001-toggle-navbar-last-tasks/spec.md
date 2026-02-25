# Feature Specification: Toggleable Navbar and Last Opened Tasks Landing

**Feature Branch**: `001-toggle-navbar-last-tasks`  
**Created**: 2026-02-21  
**Status**: Draft  
**Input**: User description: "I want navbar is toggleable, and hidden at first, there is a toggle button on header left, and the first page should be last opened tasks, help me adjust it"

## Clarifications

### Session 2026-02-21

- Q: Should launch always force the saved last-opened tasks page, or should explicit URLs be respected? → A: If URL is root/home, redirect to saved last-opened tasks; if URL explicitly targets a page, keep that page.
- Q: Should navbar visibility persist between launches? → A: Always start with navbar hidden on every app launch/reload.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Resume Where I Left Off (Priority: P1)

As a returning user, I want the app to open on the last task page I visited so I can continue work without manually navigating back.

**Why this priority**: Returning users spend most of their time continuing existing tasks, and restoring their last task context reduces friction on every session.

**Independent Test**: Open a specific tasks view, leave/reload the app, and verify the app opens to that same tasks view without using navigation controls.

**Acceptance Scenarios**:

1. **Given** a user has previously opened a tasks page, **When** they reopen the app, **Then** the first displayed page is that last opened tasks page.
2. **Given** a user has never opened a tasks page before, **When** they open the app, **Then** the first displayed page is the default tasks page.

---

### User Story 2 - Start with Navigation Hidden (Priority: P2)

As a user, I want the navigation menu hidden when the app first loads so the interface feels cleaner and I can focus on content.

**Why this priority**: This is a major requested UX behavior and directly changes first-impression layout for every visit.

**Independent Test**: Load the app and verify navigation options are not visible until the user explicitly toggles them.

**Acceptance Scenarios**:

1. **Given** the app is opened, **When** the header renders, **Then** the navigation menu is hidden by default.
2. **Given** the navigation menu is hidden, **When** the app is refreshed, **Then** the menu remains hidden on initial render.

---

### User Story 3 - Toggle Navigation from Header Left (Priority: P3)

As a user, I want a toggle button on the left side of the header so I can show or hide navigation whenever I need it.

**Why this priority**: This provides direct control of the hidden navigation behavior and is required for discoverability and usability.

**Independent Test**: Click the header-left toggle to open navigation, click again to hide it, and confirm page content remains unchanged.

**Acceptance Scenarios**:

1. **Given** navigation is hidden, **When** the user clicks the header-left toggle, **Then** navigation becomes visible.
2. **Given** navigation is visible, **When** the user clicks the same toggle again, **Then** navigation is hidden.
3. **Given** the user toggles navigation, **When** navigation visibility changes, **Then** the current page does not navigate away or lose unsaved view state.

### Edge Cases

- If the previously opened tasks context no longer exists, the app falls back to the default tasks page instead of showing an error screen.
- If there is no saved navigation or tasks preference available, the app uses default behavior (navigation hidden, default tasks page).
- If the toggle button is activated repeatedly, navigation state remains consistent and does not create duplicate UI elements.
- If the user is on a non-task page when leaving the app, the next app start still prioritizes opening the last opened tasks page.

## Constitution Alignment *(mandatory)*

- **CA-001 Toolchain Boundary**: Frontend scope uses TypeScript + Vite + `pnpm`; backend scope
  uses Python `asyncio`; no cross-runtime coupling is introduced.
- **CA-002 Contract Impact**: Define whether API/event contracts are created, changed, or
  unchanged, and list affected artifacts.
  - API/event contracts are unchanged.
  - No backend OpenAPI or contract artifacts are impacted.
- **CA-003 Testing Impact**: Define required frontend, backend, and contract validation coverage
  for this feature.
  - Frontend tests must cover default hidden navigation, header-left toggle behavior, and last-opened-tasks landing behavior.
  - Backend tests are not required because behavior is client-side navigation/state only.
  - Contract validation is unchanged because API surface is unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a navigation toggle control on the left side of the header on every primary app page.
- **FR-002**: System MUST keep navigation hidden by default when the app starts.
- **FR-003**: Users MUST be able to show navigation by activating the header-left toggle control.
- **FR-004**: Users MUST be able to hide navigation again by re-activating the same header-left toggle control.
- **FR-005**: System MUST remember the most recently opened tasks page context and use it as the first page on next app start.
- **FR-006**: If no previously opened tasks context exists, system MUST start on the default tasks page.
- **FR-007**: If saved tasks context is no longer valid, system MUST gracefully fall back to default tasks page without blocking access.
- **FR-008**: Toggling navigation visibility MUST NOT change the currently active page by itself.
- **FR-009**: The first page selection behavior MUST prioritize last opened tasks page over previously opened non-task pages.
- **FR-010**: Navigation and landing behavior changes MUST preserve existing user actions and labels on main goals, sub goals, tasks, and reward history pages.
- **FR-011**: System MUST apply last-opened-tasks landing only when app opens on root/home entry; explicit non-root routes provided at launch MUST be preserved.
- **FR-012**: System MUST NOT persist navbar open/closed visibility across launches; initial state on each launch MUST be hidden.

### Key Entities *(include if feature involves data)*

- **Navigation Visibility Preference**: Represents whether primary navigation is currently shown or hidden during an active session; includes current visibility state.
- **Last Opened Tasks Context**: Represents the most recently visited tasks page destination; includes enough route context to reopen the same tasks view.

## Assumptions

- The "first page" means the first page shown after app launch or reload.
- "Last opened tasks" means the most recently visited page within the tasks area, including selected context when available.
- Only client-side behavior changes are required; no backend data model or API changes are needed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In validation tests, 100% of app launches start with navigation hidden.
- **SC-002**: In validation tests, users can reveal or hide navigation with a single toggle action in under 1 second perceived response time.
- **SC-003**: In validation tests, 95% or more of relaunches return users to their last opened tasks page when that context is still valid.
- **SC-004**: In validation tests, 100% of invalid or missing saved task contexts recover to a usable default tasks page without dead-end screens.
