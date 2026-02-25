# Data Model: Toggleable Navbar and Last Opened Tasks Landing

## Entity: NavigationSessionState

### Purpose
Represents current in-session visibility of the primary navigation menu.

### Fields
- `is_nav_visible` (boolean)
  - `true`: navigation is visible.
  - `false`: navigation is hidden.
  - Initial value on each app launch: `false`.

### Validation Rules
- Must always be a boolean.
- Must initialize to hidden on app startup regardless of previous session value.

### State Transitions
- `hidden` -> `visible` on header-left toggle activation.
- `visible` -> `hidden` on header-left toggle activation.

## Entity: LastOpenedTasksContext

### Purpose
Represents persisted context used to reopen the user’s most recently visited tasks page when app starts at root/home.

### Fields
- `route` (string)
  - Serialized tasks route path/hash.
  - Must match allowed tasks route patterns.
- `main_segment` (string | null)
  - Optional main-goal route segment used in tasks context.
- `sub_segment` (string | null)
  - Optional sub-goal route segment used in tasks context.
- `saved_at` (string)
  - Timestamp string indicating last update time.
- `schema_version` (integer)
  - Version number for future compatibility.

### Validation Rules
- `route` must be non-empty and correspond to tasks route namespace.
- `schema_version` must match supported version.
- Invalid or stale context must be ignored and replaced by default tasks page fallback.

### Lifecycle
1. Created or updated whenever user opens a tasks page context.
2. Read on app launch only when entry route is root/home.
3. Applied if valid; discarded if invalid.
4. Replaced when user opens a newer tasks context.

## Relationships

- `NavigationSessionState` is session-only and independent from persistence.
- `LastOpenedTasksContext` is persistent client state and informs initial route decision for root/home launches.
