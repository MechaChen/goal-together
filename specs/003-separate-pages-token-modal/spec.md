# Feature Specification: Navigation Split and Token Reward Modal

**Feature Branch**: `003-separate-pages-token-modal`  
**Created**: 2026-02-20  
**Status**: Draft  
**Input**: User description: "I want to separate main goals, sub goals, tasks, reward history in different page, and add a svg token icon (lego style), and when I get the token, it will popup a token spining animation in a modal, and disappear automatically in 3 seconds"

## Clarifications

### Session 2026-02-20

- Q: When multiple rewards are earned close together, how should the 3-second reward modal behave? → A: Queue reward modals and show each reward modal sequentially for 3 seconds.
- Q: For separated pages, should Sub Goals and Tasks be tied to selected parent context or shown globally? → A: Sub Goals require selected Main Goal; Tasks require selected Sub Goal.
- Q: If user navigates while reward modal is visible, what should happen? → A: Keep modal visible as a global overlay until the current 3-second timer ends.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate Work Sections by Page (Priority: P1)

As a user, I can open dedicated pages for main goals, sub goals, tasks, and reward history so each workflow is easier to focus on.

**Why this priority**: Clear navigation structure is foundational and enables all other feature behavior.

**Independent Test**: User can open each section page from navigation, complete one section-specific action, and return without losing context.

**Acceptance Scenarios**:

1. **Given** the user is on the app, **When** the user selects Main Goals, Sub Goals, Tasks, or Reward History, **Then** the app opens the corresponding dedicated page.
2. **Given** the user is on one section page, **When** the user switches to another section page, **Then** the new page shows only the relevant content for that section.
3. **Given** the user opens Sub Goals page without a selected Main Goal, **When** the page loads, **Then** the page requests Main Goal selection before showing Sub Goals.
4. **Given** the user opens Tasks page without a selected Sub Goal, **When** the page loads, **Then** the page requests Sub Goal selection before showing Tasks.

---

### User Story 2 - See Token Identity Clearly (Priority: P2)

As a user, I can recognize token rewards with a distinctive token icon so rewards feel visually meaningful.

**Why this priority**: Visual identity improves clarity and motivation when rewards are granted.

**Independent Test**: Trigger any reward and verify the token icon appears in reward-related UI locations.

**Acceptance Scenarios**:

1. **Given** reward-related content is displayed, **When** the page renders token values, **Then** a consistent token icon with a lego-style look is shown.

---

### User Story 3 - Receive Reward Celebration Modal (Priority: P1)

As a user, I see a spinning token celebration modal when tokens are earned so reward feedback feels immediate and satisfying.

**Why this priority**: Immediate reward confirmation is core to the engagement loop.

**Independent Test**: Complete a reward-eligible task and verify a reward modal appears, animates, and auto-dismisses after 3 seconds.

**Acceptance Scenarios**:

1. **Given** a token reward is granted, **When** the grant is confirmed, **Then** a modal appears with a spinning token animation and reward amount.
2. **Given** the reward modal is visible, **When** 3 seconds have elapsed, **Then** the modal closes automatically without user action.
3. **Given** no new reward is granted, **When** user actions complete, **Then** no reward modal is shown.
4. **Given** multiple rewards are granted in quick succession, **When** the first reward modal is already visible, **Then** additional reward modals are queued and shown sequentially for 3 seconds each.
5. **Given** reward modal is visible, **When** user navigates to another page, **Then** the same modal remains visible as a global overlay until its timer expires.

---

### User Story 4 - Review Reward History on Dedicated Page (Priority: P2)

As a user, I can review my reward events on a dedicated history page so I can verify how tokens were earned.

**Why this priority**: Reward transparency builds trust in the reward system.

**Independent Test**: After earning rewards, open Reward History page and verify entries match recent reward events.

**Acceptance Scenarios**:

1. **Given** reward events exist, **When** the user opens Reward History page, **Then** the page lists reward type, amount, and event time for each entry.
2. **Given** no reward events exist, **When** the user opens Reward History page, **Then** the page shows an explicit empty state.

### Edge Cases

- What happens when a second reward is triggered while a previous 3-second reward modal is still visible?
- What happens when users rapidly switch pages during an active reward modal animation?
- What happens when reward history is empty or temporarily unavailable?
- What happens when a reward event exists but icon assets fail to load?

## Constitution Alignment *(mandatory)*

- **CA-001 Toolchain Boundary**: Feature scope remains a frontend experience update with no cross-runtime coupling introduced.
- **CA-002 Contract Impact**: Existing reward and history contracts remain functionally unchanged; page separation and modal presentation are UI-level changes.
- **CA-003 Testing Impact**: Validation must cover page navigation behavior, reward modal timing behavior, and reward history page rendering states.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide separate pages for Main Goals, Sub Goals, Tasks, and Reward History.
- **FR-002**: System MUST provide clear navigation that allows moving between all four pages in one interaction.
- **FR-003**: System MUST preserve each page's functional context when the user navigates between pages.
- **FR-004**: System MUST display a consistent token icon in reward-related UI contexts.
- **FR-005**: Token icon visual style MUST match a lego-style token appearance.
- **FR-006**: System MUST display a reward modal immediately after a successful token grant.
- **FR-007**: Reward modal MUST include a visible spinning token animation.
- **FR-008**: Reward modal MUST close automatically 3 seconds after it appears.
- **FR-009**: System MUST avoid showing reward modal when no reward was granted.
- **FR-010**: System MUST allow reward history to be viewed on its dedicated page with event details.
- **FR-011**: Reward history page MUST provide an explicit empty state when no events are available.
- **FR-012**: System MUST keep reward feedback behavior consistent across all pages where reward-triggering actions can occur.
- **FR-013**: System MUST queue reward modals when multiple rewards are granted close together and display them sequentially.
- **FR-014**: Sub Goals page MUST require an active Main Goal context before listing Sub Goals.
- **FR-015**: Tasks page MUST require an active Sub Goal context before listing Tasks.
- **FR-016**: Reward modal MUST remain visible across page navigation until its active 3-second timer expires.

### Key Entities *(include if feature involves data)*

- **Section Page**: A dedicated navigable view for one domain area (Main Goals, Sub Goals, Tasks, Reward History).
- **Token Display Artifact**: A reusable visual element representing token identity in reward UI.
- **Reward Modal Event**: A transient UI event shown after reward grant with animation lifecycle and auto-dismiss timing.
- **Reward History Entry**: A historical record visible to the user that explains a reward grant.

### Assumptions

- Existing reward-grant logic remains authoritative and unchanged.
- The 3-second auto-dismiss timer starts when the modal first becomes visible.
- If multiple reward events occur quickly, the user still receives clear feedback for each event without data loss.
- Reward modal presentation is treated as a global overlay, not scoped to a single page view.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of users can navigate to each of the four dedicated pages in at most 2 interactions.
- **SC-002**: 100% of successful reward grants display a reward modal within 1 second of confirmation.
- **SC-003**: 100% of reward modals auto-dismiss in 3 seconds ±0.3 seconds.
- **SC-004**: 95% of users can identify their latest reward details on the Reward History page in under 10 seconds.
- **SC-005**: 95% of users report reward feedback is visually clear in usability checks.
