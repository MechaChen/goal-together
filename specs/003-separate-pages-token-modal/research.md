# Research: Navigation Split and Token Reward Modal

## Decision 1: Use route-based page separation for Main Goals, Sub Goals, Tasks, Reward History

- Decision: Implement dedicated route-level pages with shared top navigation and section-scoped content.
- Rationale: Route-based separation makes each workflow independently testable, linkable, and easier to reason about than conditional rendering in one page.
- Alternatives considered:
  - Single-page tab switching: rejected due to weaker deep-linking and test isolation.
  - Nested route-within-route by hierarchy only: rejected because Reward History is orthogonal and should remain independently discoverable.

## Decision 2: Parent-context gating for Sub Goals and Tasks pages

- Decision: Require selected Main Goal for Sub Goals page and selected Sub Goal for Tasks page.
- Rationale: Matches clarified requirement and prevents ambiguous or orphaned lists.
- Alternatives considered:
  - Global default listing: rejected because it conflicts with strict hierarchy navigation intent.
  - Hybrid default+focus mode: rejected because it adds UX branching without requirement value.

## Decision 3: Global reward modal queue with 3-second timed dismissal

- Decision: Use a global modal queue (FIFO); each reward modal stays visible for 3 seconds and persists across navigation.
- Rationale: Ensures no reward feedback loss during bursts and honors clarified behavior.
- Alternatives considered:
  - Replace current modal with latest reward: rejected because earlier rewards can be missed.
  - Aggregate rewards into one modal: rejected because it hides discrete reward events.

## Decision 4: Lego-style token SVG as reusable UI primitive

- Decision: Build a reusable inline SVG token icon component used in reward modal and reward-related UI.
- Rationale: Inline SVG supports consistent styling, performance, and deterministic rendering in tests.
- Alternatives considered:
  - PNG asset icon: rejected due to scaling/fidelity constraints.
  - Icon font glyph: rejected due to reduced design specificity for lego-style requirement.

## Decision 5: API contract remains unchanged for this feature

- Decision: Keep existing hierarchy/reward endpoints and return structures; no new backend endpoints required.
- Rationale: Feature scope is presentation, navigation, and modal orchestration; data semantics are unchanged.
- Alternatives considered:
  - Introduce UI-specific backend endpoints: rejected as unnecessary coupling and maintenance overhead.
