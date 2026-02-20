<!--
Sync Impact Report
- Version change: N/A -> 1.0.0
- Modified principles:
  - N/A (initial adoption) -> I. Bounded Polyglot Architecture
  - N/A (initial adoption) -> II. Frontend Standard: TypeScript + pnpm + Vite
  - N/A (initial adoption) -> III. Backend Standard: Python + asyncio
  - N/A (initial adoption) -> IV. Contract-First Integration and Testing
  - N/A (initial adoption) -> V. Reproducible Developer Workflow
- Added sections:
  - Technology Standards
  - Delivery Workflow and Quality Gates
  - Governance
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
  - ⚠ pending: .specify/templates/commands/*.md (directory not present in scaffold)
- Runtime guidance updates:
  - ✅ updated: README.md
  - ✅ updated: AGENTS.md
- Follow-up TODOs:
  - None
-->
# Goal Together Constitution

## Core Principles

### I. Bounded Polyglot Architecture
All product features MUST be split into explicit `frontend/` and `backend/` boundaries.
Frontend code MUST NOT embed backend runtime concerns, and backend code MUST NOT depend
on frontend build tooling. Shared contracts MUST be language-neutral and versioned.
Rationale: strict boundaries reduce coupling and keep each runtime independently deployable.

### II. Frontend Standard: TypeScript + pnpm + Vite
Frontend implementation MUST use TypeScript and Vite; dependency and script execution MUST
use `pnpm`. New frontend work MUST live under `frontend/` and include linting, type checks,
and automated tests run in CI. `npm` and `bun` lockfiles/scripts MUST NOT be introduced for
frontend scope. Rationale: one toolchain prevents drift and inconsistent local/CI behavior.

### III. Backend Standard: Python + asyncio
Backend services and workers MUST be implemented in Python using `asyncio` for I/O-bound
concurrency. Blocking operations in request/event paths MUST be isolated through executors
or replaced with async equivalents. New backend work MUST live under `backend/` with explicit
dependency management and test coverage. Rationale: async-first backend design improves
throughput and preserves predictable latency under concurrent load.

### IV. Contract-First Integration and Testing
Any frontend-backend interaction MUST be defined through explicit API/event contracts before
implementation. Each feature MUST include:
- contract validation for request/response schema compatibility,
- backend unit/integration tests for core logic and async behavior,
- frontend component or flow tests for user-critical paths.
Changes that break existing contracts MUST trigger MAJOR version changes in affected contract
artifacts and migration notes. Rationale: contract-first delivery prevents cross-stack regressions.

### V. Reproducible Developer Workflow
Repository automation MUST provide deterministic local setup and CI parity. Every pull request
MUST pass the project quality gate commands, MUST document manual verification for changed
areas, and MUST describe contract or data-model impacts. Generated artifacts and lockfiles MUST
remain consistent with the selected package/dependency managers. Rationale: reproducibility
reduces release risk and shortens debugging cycles.

## Technology Standards

- Frontend baseline: TypeScript 5.x, React 19, Vite, `pnpm`.
- Backend baseline: Python 3.12+, `asyncio`, ASGI-compatible framework/runtime.
- Repository structure baseline:
  - `frontend/` for web client code and tests.
  - `backend/` for service code and tests.
  - `tests/` for cross-stack or end-to-end suites where needed.
- Contract artifacts MUST be stored in versioned, reviewable files under feature specs or
  dedicated contract directories.

## Delivery Workflow and Quality Gates

1. Specification phase MUST define user stories, acceptance criteria, and API/event contract
   impacts before implementation planning.
2. Plan phase MUST pass Constitution Check gates for architecture boundaries, toolchain
   compliance, contract definition, and test strategy.
3. Tasks phase MUST organize work by user story and include explicit frontend, backend, and
   contract/test tasks where applicable.
4. Implementation phase MUST keep frontend and backend changes independently runnable and
   validate contract compatibility before merge.
5. Merge phase MUST include evidence that required tests and quality checks passed.

## Governance

This constitution supersedes conflicting local conventions for architecture, tooling, and
delivery quality gates.

Amendment procedure:
1. Propose changes in a pull request that includes rationale, migration impact, and affected
   templates/docs.
2. Obtain approval from project maintainers responsible for both frontend and backend areas.
3. Update all impacted templates and runtime guidance in the same change.
4. Record version and amendment date updates in this document.

Versioning policy:
1. MAJOR: incompatible governance changes or principle removals/redefinitions.
2. MINOR: new principle/section or materially expanded mandatory guidance.
3. PATCH: clarifications, wording improvements, or non-semantic refinements.

Compliance review expectations:
1. Every implementation plan and task set MUST include a Constitution Check.
2. Every pull request review MUST verify principle compliance explicitly.
3. Non-compliant changes MUST include documented exceptions and an approved remediation plan.

**Version**: 1.0.0 | **Ratified**: 2026-02-20 | **Last Amended**: 2026-02-20
