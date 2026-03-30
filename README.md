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
- [ ] history record & custom reward sound should be on the header's menu's setting icon
- [ ] redesign reward mechanism
- [ ] when main goal is completed, cannot add new sub goal in it.

### New ideas

- [x] add voice effect when getting token
- [x] Update sub goal / main goal name
- [ ] see tasks completed time
- [ ] Login system before released & reward
- [ ] Passkey (WebAuth)
- [ ] Adding level system, level up to unlock the features (e.g. custom rewarding sound)
- [ ] Add Today's mission
- [ ] Add Brag/Achievement document
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
pnpm i
pnpm dev:goals
pnpm dev:retro
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

---

Phase 1: Monorepo Foundation
10-minute tasks:

1. Create root package.json with workspace scripts.
2. Update pnpm-workspace.yaml to include apps/_ and packages/_.
3. Create apps/ directory.
4. Move current frontend/ into apps/web/.
5. Rename apps/web/package.json package name to web.
6. Verify apps/web still starts with Vite.
7. Create apps/retro-web/.
8. Scaffold apps/retro-web/package.json.
9. Scaffold apps/retro-web/vite.config.ts.
10. Scaffold apps/retro-web/src/main.tsx.
11. Scaffold apps/retro-web/src/app.tsx.
12. Add root scripts for dev:web, dev:retro, build:web, build:retro.
13. Install dependencies for the new workspace layout.
14. Fix path issues after moving frontend to apps/web.
15. Update README to reflect new app paths.

Phase 2: Shared Packages Setup
10-minute tasks:

1. Create packages/contracts/.
2. Add packages/contracts/package.json.
3. Add packages/contracts/src/index.ts.
4. Create initial shared retro types in packages/contracts/src/retro.ts.
5. Create initial shared reward types in packages/contracts/src/reward.ts.
6. Add @goal-together/contracts dependency to apps/web.
7. Add @goal-together/contracts dependency to apps/retro-web.
8. Create packages/goal-core/.
9. Add packages/goal-core/package.json.
10. Add one small pure helper in goal-core, such as reward eligibility logic.
11. Create packages/retrospection/.
12. Add packages/retrospection/package.json.
13. Add placeholder retro prompt/helper exports.
14. Verify both apps can import from shared packages.
15. Run typecheck for both apps.

Phase 3: Web App Stabilization After Move
10-minute tasks:

1. Check router still works in apps/web.
2. Fix broken imports caused by directory move.
3. Check tests in apps/web/tests.
4. Check global styles and assets still resolve.
5. Check API base URL logic still works.
6. Confirm reward flow still works in existing app.
7. Confirm tasks/goals pages still render.
8. Clean app naming and scripts in apps/web/package.json.
9. Move any app-only shared helpers into apps/web/src/shared/.
10. Leave domain-shared logic out of apps/web if it belongs in packages/\*.

Phase 4: Retro App Shell
10-minute tasks:

1. Create apps/retro-web/src/app/.
2. Create apps/retro-web/src/features/retrospection/.
3. Create route setup for retro app.
4. Add landing page for retro app.
5. Add daily retro page shell.
6. Add life playbook page shell.
7. Add retro history page shell.
8. Add app navigation between those three pages.
9. Add shared layout for retro app.
10. Add basic Tailwind/global styling for retro app.
11. Verify retro-web runs independently.
12. Decide whether retro app has its own visual identity or inherits the main brand.

Phase 5: Backend High-Level Retro Support
10-minute tasks:

1. Define retro entry payload shape.
2. Define life playbook payload shape.
3. Add retro API module folder in backend.
4. Add create daily retro endpoint.
5. Add fetch retro history endpoint.
6. Add fetch playbook endpoint.
7. Add save playbook endpoint.
8. Add retro service layer placeholders.
9. Add retro repository layer placeholders.
10. Add retro models/table definitions.
11. Wire retro routes into backend router.
12. Verify backend starts with new route registration.

Phase 6: Daily Retro MVP
10-minute tasks:

1. Add retro API client in apps/retro-web.
2. Add daily retro form state.
3. Add editor placeholder component.
4. Integrate Lexical base editor.
5. Add plain text persistence.
6. Add code block support.
7. Add save button.
8. Submit daily retro to backend.
9. Show success state after save.
10. Prevent duplicate submit glitches.
11. Load today’s existing retro if present.
12. Add validation for empty retro submission.

Phase 7: Reward Integration
10-minute tasks:

1. Define “first retro of the day earns reward” rule.
2. Implement reward eligibility check in backend.
3. Reuse existing reward event recording flow where possible.
4. Return reward result from retro submit API.
5. Update retro app client types for reward response.
6. Show reward feedback in retro app UI.
7. Verify reward is only granted once per day.
8. Add a backend test for duplicate same-day submissions.
9. Add a frontend state for reward success banner/modal.
10. Confirm reward history remains consistent with main app expectations.

Phase 8: Life Playbook MVP
10-minute tasks:

1. Add life playbook API client.
2. Add life playbook page layout.
3. Add editor area for playbook content.
4. Load existing playbook content.
5. Save edited playbook content.
6. Add explicit save state.
7. Add loading state.
8. Add error state.
9. Add updated timestamp display.
10. Verify persistence works end to end.

Phase 9: Retro History MVP
10-minute tasks:

1. Add retro history API client.
2. Fetch retro history list.
3. Render entries by date.
4. Add click-to-open detail view.
5. Render read-only retro content.
6. Show whether reward was earned that day.
7. Add empty state.
8. Add loading state.
9. Add error state.
10. Verify history ordering is correct.

Phase 10: Hardening
10-minute tasks:

1. Add contract types for all retro endpoints.
2. Add one backend test for create retro flow.
3. Add one backend test for life playbook save/load.
4. Add one frontend test for daily retro submission.
5. Add one frontend test for playbook save.
6. Run lint in apps/web.
7. Run lint in apps/retro-web.
8. Run frontend tests for both apps.
9. Run backend tests.
10. Update README with dev commands for both apps.
11. Add manual verification checklist.
12. Clean naming and remove temporary placeholders.

Recommended Build Order

1. Monorepo foundation
2. Shared packages
3. Stabilize apps/web
4. Create apps/retro-web
5. Add backend retro APIs
6. Implement daily retro flow
7. Add reward integration
8. Add life playbook
9. Add retro history
10. Test and clean up
