# Quickstart: Toggleable Navbar and Last Opened Tasks Landing

## Prerequisites

- Node.js and `pnpm` installed
- Repository dependencies installed

## Run Locally

1. Start frontend:
   - `pnpm --dir frontend dev`
2. Open app in browser.

## Validate Core Behavior

1. **Navbar hidden on launch**
   - Reload app.
   - Verify navigation menu is hidden on initial render.
   - Verify header-left toggle button is visible.

2. **Header-left toggle controls navbar**
   - Click toggle button on header left.
   - Verify navigation appears.
   - Click again and verify navigation hides.
   - Verify current page does not change due to toggling.

3. **Last opened tasks restored from root/home**
   - Navigate to a specific tasks context.
   - Reload app at root/home entry (`#/`).
   - Verify app lands on previously opened tasks context.

4. **Explicit route precedence**
   - Open app directly on a non-root route (for example, reward history route).
   - Verify app stays on that explicit route and does not redirect.

5. **Invalid context fallback**
   - Simulate invalid saved tasks context.
   - Reload via root/home.
   - Verify fallback to default tasks page without dead-end state.

## Automated Verification

1. Run frontend test suite:
   - `pnpm --dir frontend test`
2. Run frontend lint/type-quality checks used by project:
   - `pnpm --dir frontend lint`
