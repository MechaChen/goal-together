# Repository Guidelines

## Plan phase guide

### Explain Code

When when explaining how code works, teaching about a codebase, or when the user asks "how does this work?", always include:

1. **Start with an analogy**: Compare the code to something from everyday life
2. **Draw a diagram**: Use ASCII art to show the flow, structure, or relationships
3. **Walk through the code**: Explain step-by-step what happens
4. **Highlight a gotcha**: What's a common mistake or misconception?

Keep explanations conversational. For complex concepts, use multiple analogies.

## Implement phase guide

### Project Structure & Module Organization
The application uses a split architecture with `frontend/`, `backend/`, and `tests/`.
Frontend code is TypeScript-based and built with Vite, while backend services are Python
`asyncio` based. Keep cross-stack API/event contracts explicit and versioned in specs or
contract directories. Keep runtime and build files aligned with the component you touch.

### Build, Test, and Development Commands
Frontend: `pnpm install`, `pnpm dev`, `pnpm test`, `pnpm lint`.
Backend: create a virtual environment, install dependencies from requirements, and run tests
with `pytest` (including async tests). Use project-specific scripts in each subdirectory when
present and keep CI commands reproducible locally.

### Coding Style & Naming Conventions
Follow TypeScript strict-mode expectations from `tsconfig.json`: prefer explicit types at module boundaries and keep unused values out of commits. Stick to two-space indentation, semicolons, and double quotes to match existing files. File names should stay lowercase with hyphenated words (`goal-together`), and default exports belong in `index.ts` modules unless a feature grows large enough to warrant its own folder.

### Frontend part
1. Keep code clean and easy to scan. If a JSX block in a component or the logic inside a function exceeds roughly 10 lines, extract it into a semantic component or helper function with a name that clearly communicates its purpose.
2. Use `useEffect` sparingly. Prefer declarative patterns and direct data flow whenever possible, because overusing `useEffect` often introduces side effects and makes logic harder to understand.
3. `useEffect` semantics rule: For every `useEffect`, define one semantic function inside the callback and call it (avoid inline multi-step logic). If this still makes the effect hard to read, replace it with a custom hook that encapsulates the behavior. If the effect logic is substantial or reused, extract it into a custom hook instead of expanding the component-level `useEffect`.
4. Follow clean naming conventions: use nouns for value variables and verbs for function names, in line with Clean Code principles.
5. Avoid nested ternary operators. Use explicit conditionals or small helper functions for branching logic so the code remains readable.
6. Always extract repeated frontend values into `frontend/src/config/*`. If a suitable file does not exist, create a semantic config file with a clear, domain-specific name.
7. Prefer Tailwind CSS v4 theme tokens for styling. Avoid hardcoded hex colors and one-off CSS variable values in components; define semantic theme variables and consume them via Tailwind utilities for consistent, centralized styling.
8. Event handler naming rule: Use semantic, intent-revealing names for event handlers. Avoid generic patterns like `handleXXXOnXXX` when a clearer verb + domain/action name can be used (for example, prefer `openRenameEditor`, `submitSubGoalTitle`, `closeSidebarOnEscape`).

## Test phase guide

### Testing Guidelines
Frontend tests should live under `frontend/` and backend tests under `backend/tests/`.
Each feature should include contract validation when frontend-backend interactions change.
Aim to cover core user journeys, async backend behavior, and integration boundaries.

## Deploy phase guide

## Commit & Pull Request Guidelines
The repository currently ships without shared Git history, so default to Conventional Commits (`feat:`, `fix:`, `chore:`) to keep future changelog automation simple. Commit messages must always satisfy commit-lint compatible Conventional Commit format (for example: `feat(frontend): align header logo with figma`).
When the user requests a commit, first summarize the current unstaged changes and show the exact commit data you plan to use (files, commit message, and commit body). Wait for user review/approval before running `git commit`. After approval, create the commit using commitlint-compatible Conventional Commit format and include the user's previous requirement prompts in the commit description/body.
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
- TypeScript 5.x (frontend), Python 3.12+ (backend unchanged) + React 19, React Router, Vite, Tailwind CSS 4, Vites (001-toggle-navbar-last-tasks)
- Browser local storage for last opened tasks context; backend SQLite unchanged (001-toggle-navbar-last-tasks)

## Recent Changes
- 001-todo-with-target-and-limit: Added Python 3.12+ (backend), TypeScript 5.x (frontend) + FastAPI, Pydantic, SQLAlchemy + aiosqlite, React 19, Vite, pnpm
