---
name: plan
description: Loop stage 1 — produce a first-class exec-plan with a decision log and task state. Use for multi-step changes after spec, before developing.
---

# plan — Planning

Plans are first-class artifacts (`docs/PLANS.md`). Trivial change → lightweight inline plan;
non-trivial → durable exec-plan in `docs/exec-plans/active/`.

## Steps
1. Select context via `harness/20_context-selection-protocol.md` (start from `CLAUDE.md` →
   `docs/`). Record what you consulted (context trace).
2. Write the exec-plan: objective & acceptance criteria, context links, ordered steps (each
   independently verifiable — depth-first decomposition), decision log, status.
3. Initialize task state (`harness/21_task-state.md`): current step, hypothesis, next action.
4. Check `harness/22_known-failures.md` for relevant pitfalls.

## Done when
There's a resumable plan whose steps map to the acceptance criteria, and task state has a
concrete next action. Then refresh the stakeholder view (`brief` skill) so
`docs/PROJECT_MAP.md` reflects the new/changed WBS tree.
