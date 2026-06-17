---
name: brief
description: Cross-cutting — translate spec/plan/task-state into a non-developer WBS dashboard (docs/PROJECT_MAP.md). Use to create or refresh the stakeholder view, and at the end of plan/develop/verify to keep status current.
---

# brief — Stakeholder Translation (non-developer WBS view)

Produce / refresh `docs/PROJECT_MAP.md`: a plain-language **work-breakdown dashboard** so a
planner or PM can see, at a glance, what the whole project does, how it's split, and what's
happening right now — without reading developer artifacts.

This is a **derived view, never a source of truth.** It is translated *out of* the spec,
exec-plans, and task state. If it ever disagrees with those, the source documents win and
this gets re-derived.

## Steps
1. Read the sources, in this order:
   - `docs/product-specs/` → the objective and what's being built (the "why").
   - `docs/exec-plans/active/` (and `completed/`) → how the work is decomposed into steps
     (the WBS skeleton).
   - `harness/21_task-state.md` → the current step and next action (the "you are here").
2. Build the WBS tree in `docs/PROJECT_MAP.md`: one node per phase → feature → task. Each node
   gets a one-line plain-language "what this does / why it matters" and a status icon.
3. Fill the **지금 하는 일 / Now** section from task state — current node + next action, in
   non-developer language.
4. For each node, link to its source spec/plan so a reader can drill into the original if they
   want. Move any unavoidable technical term into the **용어 사전 / Glossary**.
5. Stamp "마지막 갱신 / Last synced" with the date and the source commit/plan it was derived from.

## Language rules
- Write for someone who does not code. No jargon in the tree itself — explain *outcomes*, not
  implementation ("로그인 기능", not "JWT 미들웨어").
- Don't invent status or scope. Only state what the source documents support; if a node's
  status is unknown, mark it ⏳ and say so.
- Keep it skimmable: a tree + status icons + one Now section. Detail lives in the linked originals.

## Done when
`docs/PROJECT_MAP.md` reflects the current spec/plans/task-state, every node maps back to a
source document, and the Now section matches `harness/21_task-state.md`.
