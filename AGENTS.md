# Repository Guidelines

## Project Structure & Module Organization
The application uses a split architecture with `frontend/`, `backend/`, and `tests/`.
Frontend code is TypeScript-based and built with Vite, while backend services are Python
`asyncio` based. Keep cross-stack API/event contracts explicit and versioned in specs or
contract directories. Keep runtime and build files aligned with the component you touch.

## Build, Test, and Development Commands
Frontend: `pnpm install`, `pnpm dev`, `pnpm test`, `pnpm lint`.
Backend: create a virtual environment, install dependencies from requirements, and run tests
with `pytest` (including async tests). Use project-specific scripts in each subdirectory when
present and keep CI commands reproducible locally.

## Coding Style & Naming Conventions
Follow TypeScript strict-mode expectations from `tsconfig.json`: prefer explicit types at module boundaries and keep unused values out of commits. Stick to two-space indentation, semicolons, and double quotes to match existing files. File names should stay lowercase with hyphenated words (`goal-together`), and default exports belong in `index.ts` modules unless a feature grows large enough to warrant its own folder.

## Testing Guidelines
Frontend tests should live under `frontend/` and backend tests under `backend/tests/`.
Each feature should include contract validation when frontend-backend interactions change.
Aim to cover core user journeys, async backend behavior, and integration boundaries.

## Commit & Pull Request Guidelines
The repository currently ships without shared Git history, so default to Conventional Commits (`feat:`, `fix:`, `chore:`) to keep future changelog automation simple. Commit messages must always satisfy commit-lint compatible Conventional Commit format (for example: `feat(frontend): align header logo with figma`).
Each pull request should describe the change, list manual verification steps (e.g., `pnpm dev` for frontend and backend service run/test commands), and link any tracking issue. Include screenshots or curl output for API changes and note follow-up tasks if you defer work.
For feature branches, prefer semantic clarity over extreme brevity. Descriptive names like
`todo-with-target-and-limit` are acceptable when they improve intent readability.

## Deployment & Configuration Tips
Keep service ports and environment variables configurable for local and deployed environments.
When updating frontend dependencies, commit `pnpm-lock.yaml`; when updating backend
dependencies, keep requirements/lock artifacts in sync. Confirm container/runtime images match
the frontend and backend toolchain versions used in development.

## Active Technologies
- Python 3.12+ (backend), TypeScript 5.x (frontend) + FastAPI, Pydantic, SQLAlchemy + aiosqlite, React 19, Vite, pnpm (001-todo-with-target-and-limit)
- SQLite (001-todo-with-target-and-limit)
- Python 3.12+ (backend), TypeScript 5.x (frontend) + FastAPI, Pydantic, SQLAlchemy + aiosqlite, React 19, Vite, Tailwind CSS 4, pnpm (001-todo-with-target-and-limit)
- TypeScript 5.x (frontend), Python 3.12+ (backend baseline unchanged) + React 19, Vite, Tailwind CSS 4, FastAPI existing API contracts (003-separate-pages-token-modal)
- SQLite (unchanged) (003-separate-pages-token-modal)

## Recent Changes
- 001-todo-with-target-and-limit: Added Python 3.12+ (backend), TypeScript 5.x (frontend) + FastAPI, Pydantic, SQLAlchemy + aiosqlite, React 19, Vite, pnpm
