# Research: Toggleable Navbar and Last Opened Tasks Landing

## Decision 1: Restore last tasks page only on root/home launch

- **Decision**: Apply last-opened-tasks restoration only when app entry is root/home. Preserve explicitly provided non-root routes.
- **Rationale**: This keeps deep links reliable and avoids overriding intentional navigation targets.
- **Alternatives considered**:
  - Always redirect to saved tasks route on every launch.
  - Never restore and always use requested route.

## Decision 2: Keep navbar hidden by default on every launch without persistence

- **Decision**: Navbar launches hidden every time and can be toggled during the active session only.
- **Rationale**: Matches clarified product requirement exactly and provides deterministic startup behavior.
- **Alternatives considered**:
  - Persist open/closed preference across launches.
  - Hide only on first-ever visit.

## Decision 3: Persist last opened tasks context in browser local storage

- **Decision**: Store a compact serialized last-tasks route context in browser local storage.
- **Rationale**: Survives reload/browser restart and requires no backend changes.
- **Alternatives considered**:
  - Session-only memory (lost on reload).
  - Backend persistence per user (adds API and auth coupling).

## Decision 4: Validate saved context before navigation

- **Decision**: Validate saved tasks context against known route patterns and available in-memory hierarchy context; fallback to default tasks page if invalid.
- **Rationale**: Prevents dead-end launches and handles deleted/renamed contexts gracefully.
- **Alternatives considered**:
  - Blindly navigate to saved context and let route fail.
  - Ignore saved context entirely when any mismatch is found.

## Decision 5: Toggle control behavior and accessibility

- **Decision**: Header-left toggle must expose visible state and accessible label; toggling must not change current route.
- **Rationale**: Ensures discoverability, keyboard/screen-reader usability, and functional separation between navigation visibility and route state.
- **Alternatives considered**:
  - Icon-only unlabeled toggle.
  - Toggle that also navigates to a default page.
