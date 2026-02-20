# Quickstart: Todo With Target and Limit + Progress Bar

## Prerequisites

- Python 3.12+
- Node.js 20+
- pnpm 9+

Repository root:
- `/Users/tomobenson/Desktop/Benson/goal-together`

## 1) Backend setup and run

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/backend
uv sync --all-groups
uv run uvicorn src.main:app --reload --port 8000
```

## 2) Frontend setup and run

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/frontend
pnpm install
pnpm add -D tailwindcss@^4 @tailwindcss/vite
pnpm dev
```

## 3) Verify core behaviors

1. Create todos with valid `main target`.
2. Attempt a 6th todo and confirm rejection.
3. Toggle completion and confirm progress bar updates.
4. Delete one todo and confirm a new todo can be added.
5. Remove all todos and confirm progress shows `0%` and `0/0`.
6. Confirm UI styles render through Tailwind CSS 4 utilities.

## 4) Run tests

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/backend
uv run pytest

cd /Users/tomobenson/Desktop/Benson/goal-together/frontend
pnpm test
```

## 5) Contract review

- Contract file:
  `/Users/tomobenson/Desktop/Benson/goal-together/specs/001-todo-with-target-and-limit/contracts/openapi.yaml`
