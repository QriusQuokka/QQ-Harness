# docs/ — System of Record

This directory is the repo's durable knowledge base. It is a **system of record**, not a
scratchpad: anything an agent must rely on lives here as a version-controlled artifact.
`CLAUDE.md` is the map; this is the territory.

Mechanically enforced expectations (frame; wire into CI when a stack exists): docs stay
current, cross-linked, and owned. A recurring **doc-gardening** agent
(`.claude/agents/doc-gardener.md`) opens fix PRs for stale or contradicted docs.

## Layout
- **design-docs/** — how we think.
  - `core-beliefs.md` — the five design principles, expanded. Agent-first operating model.
  - `golden-rules.md` — taste invariants; promoted to lint/code over time.
  - `index.md` — design-doc catalog.
- **exec-plans/** — plans are first-class artifacts.
  - `active/` — plans in progress (with decision logs).
  - `completed/` — finished plans (kept for provenance).
  - `tech-debt-tracker.md` — known debt, paid down continuously.
- **product-specs/** — what we're building and the acceptance criteria.
- **references/** — external knowledge pulled in-repo (llms.txt-style), so it's reachable.
- **generated/** — machine-generated docs (e.g. schema dumps). Do not hand-edit.

## Top-level docs
- `SECURITY.md` — security golden rules. **Read before any external/destructive action.**
- `DESIGN.md` — product/system design notes.
- `PRODUCT_SENSE.md` — product principles and judgment calls.
- `TESTING.md` — testing conventions (how tests are written; H2 project memory).
- `FRONTEND.md` — frontend conventions (stub until a UI exists).
- `QUALITY_SCORE.md` — per-domain quality grades; tracks gaps over time.
- `RELIABILITY.md` — reliability/operability expectations.
- `PLANS.md` — planning conventions (how plans are written and tracked).
