# Research: Token Reward and Goal-Task Hierarchy

## Decision 1: Task lifecycle with draft and confirmed states
- Decision: Tasks start as `draft`, support edit/delete, and become immutable when `confirmed`.
- Rationale: Directly reflects clarified behavior and separates planning from reward-eligible execution.
- Alternatives considered:
  - Single mutable task state: rejected because it cannot enforce immutable confirmed tasks.
  - Multi-stage approval workflow: rejected as unnecessary complexity for current scope.

## Decision 2: Reward eligibility tied to confirmed tasks only
- Decision: Rewards are computed only for completions of confirmed tasks.
- Rationale: Prevents gaming with disposable draft items and matches product intent.
- Alternatives considered:
  - Reward all task completions: rejected due to abuse risk.
  - Reward drafts at lower rate: rejected as scope expansion.

## Decision 3: First-ever completion reward idempotency
- Decision: Grant +10 token reward only on first-ever completion of each confirmed task.
- Rationale: Eliminates duplicate rewards from retries/toggle actions.
- Alternatives considered:
  - Reward every complete transition: rejected as inflationary and inconsistent.

## Decision 4: Milestone bonus on cumulative first-time rewarded completions
- Decision: Grant +50 tokens at every multiple of 5 in cumulative first-time rewarded completions of confirmed tasks.
- Rationale: Aligns with clarified counting basis and preserves predictable progression.
- Alternatives considered:
  - Count all completions including duplicates: rejected due to inconsistency.

## Decision 5: Reward ledger with immutable events
- Decision: Keep immutable reward events plus wallet aggregate for reconciliation.
- Rationale: Enables transparent history and deterministic balance auditing.
- Alternatives considered:
  - Balance-only storage: rejected due to weak explainability/debuggability.
