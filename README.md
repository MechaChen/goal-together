# goal-together

## Todos

### Unexpected to fix

- [x] coin style is not good looking, modify it
- [x] sidebar should be togglable
- [x] main page should be the last ongoing tasks list
- [x] all draft tasks should be confirm all tasks at once
- [x] when all tasks of any sub goal are completed, the subgoal should be checked
- [x] subtask completion won't give new reward, since tasks cannot be changed, but main goal completion still does
- [x] when tasks are confirmed, the +Add task button should be disabled
- [ ] redesign reward mechanism
- [ ] when main goal is completed, cannot add new sub goal in it.

### New ideas

- [x] add voice effect when getting token
- [x] Update sub goal / main goal name
- [ ] Login system before released & reward
- [ ] Passkey (WebAuth)
- [ ] Adding level system, level up to unlock the features (e.g. custom rewarding sound)
- [ ] Add Today's mission
- [ ] Limit number of subtask to prevent user from burning out
- [ ] Adding tasks estimation time, and add all up to subgoal, then can adding more reward based on time consuming as well
- [ ] A task should be finsihed within XXX minute?
- [ ] Depolyment plan - Supabase DB ready
- [ ] Deployment plan - AWS Server ready
- [ ] Deployment plan - Frontend ready
- [ ] Deployment plan - DNS ready
- [ ] progress bar show which point can get bonus, like bar in 60%
- [ ] if the subgoal is done, switch to next subgoal
- [ ] AI feature - suggest a strong sense of achievement with little effort
- [ ] AI feature - Retro system
- [ ] Encourage "Confirming tasks" and give token award as well?
- [ ] Archive main goal / sub goal features, some features I don't want to see anymore

### Development Enhancement

- [ ] Try to figure out the way to add LSP server
- [ ] Try to add guide for unit testing
- [ ] Prevent `handleXXXOnXXX` such no meaning function name

## Prerequisites

tech stack:
- Python FastAPI + SQLite backend
- React + Vite + Tailwind CSS 4 frontend
- 5-item todo limit and progress bar

- Python 3.12+
- `uv`
- Node.js 20+
- `pnpm`

## Backend

```bash
cd backend
uv sync --all-groups
uv run uvicorn src.main:app --reload --port 8000
```

## Frontend

```bash
cd frontend
pnpm install --ignore-workspace
pnpm dev
```

## Testing

```bash
cd backend
uv run pytest

cd ../frontend
pnpm lint
pnpm test --run --passWithNoTests
```

## Manual verification

1. Open `http://localhost:5173`
2. Create todo with valid target
3. Validate blank target is rejected
4. Verify 6th todo is blocked
5. Toggle/delete todos and verify progress bar updates
6. Verify zero state shows `0%` and `0/0`

