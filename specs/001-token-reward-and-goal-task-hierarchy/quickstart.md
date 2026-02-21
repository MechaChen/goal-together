# Quickstart: Token Reward and Goal-Task Hierarchy

## Prerequisites

- Python 3.12+
- uv
- Node.js 20+
- pnpm

Repository root:
- `/Users/tomobenson/Desktop/Benson/goal-together`

## 1) Backend

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/backend
uv sync --all-groups
uv run uvicorn src.main:app --reload --port 8000
```

## 2) Frontend

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/frontend
pnpm install --ignore-workspace
pnpm dev
```

## 3) Manual verification scenarios

1. Create a main goal, create a sub goal, and add a draft task.
2. Edit and delete draft tasks successfully.
3. Confirm a task and verify delete is blocked afterward.
4. Complete a confirmed task for first time and verify +10 tokens.
5. Re-complete same task and verify no new reward plus "already completed previously" hint.
6. Reach 5 first-time confirmed completions and verify +50 milestone bonus.
7. Verify wallet balance reconciles with reward history.

## 4) Quality checks

```bash
cd /Users/tomobenson/Desktop/Benson/goal-together/backend
uv run pytest

cd /Users/tomobenson/Desktop/Benson/goal-together/frontend
pnpm lint
pnpm test --run --passWithNoTests
```
