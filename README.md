# goal-together

Simple todo app with:
- Python FastAPI + SQLite backend
- React + Vite + Tailwind CSS 4 frontend
- 5-item todo limit and progress bar

## Prerequisites

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
