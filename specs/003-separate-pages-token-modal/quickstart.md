# Quickstart: Navigation Split and Token Reward Modal

## Prerequisites

- Python 3.12+
- uv
- Node.js 20+
- pnpm

Repository root:
- `/Users/tomobenson/Desktop/Benson/goal-together`

## 1) Start backend

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/backend
uv sync --all-groups
uv run uvicorn src.main:app --reload --port 8000
```

## 2) Start frontend

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/frontend
pnpm install --ignore-workspace
pnpm dev
```

## 3) Manual verification scenarios

1. Open Main Goals page and verify it only shows main-goal-level controls.
2. Open Sub Goals page without selecting a Main Goal and verify selection prompt appears.
3. Select a Main Goal, then open Sub Goals page and verify scoped sub goals display.
4. Open Tasks page without selecting a Sub Goal and verify selection prompt appears.
5. Select a Sub Goal, open Tasks page, complete reward-eligible task, and verify reward modal appears.
6. Trigger multiple rewards quickly and verify reward modals queue in FIFO order.
7. Navigate between pages while modal is visible and verify modal persists until timer ends.
8. Verify each modal auto-dismisses after approximately 3 seconds.
9. Open Reward History page and verify list entries align with rewarded actions.
10. Verify lego-style SVG token icon appears in reward modal and reward-related contexts.

## 4) Quality checks

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/frontend
pnpm lint
pnpm test --run

cd /Users/tomobenson/Desktop/Benson/goal-together/backend
uv run pytest
```

## 5) Latest validation snapshot

- Frontend type/lint check: `pnpm lint` passes.
- Frontend tests: `pnpm test --run` passes.
- Backend regression command is expected to run even when no tests are collected yet.
