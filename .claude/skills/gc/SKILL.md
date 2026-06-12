---
name: gc
description: Loop stage 8 — entropy garbage collection. Audit agent-introduced maintenance burden and open small targeted cleanup PRs. Use at episode end and as a recurring background pass.
---

# gc — Entropy Garbage Collection

Agents replicate existing patterns, including bad ones; drift is inevitable. Pay it down
continuously (debt is a high-interest loan), not in a Friday batch.

## Steps
1. Run the entropy audit (`harness/41_entropy-audit-template.md`) over the episode's changes:
   code, docs, dependency, test, file-residue, architecture, workflow — each with severity 0–3.
2. Apply the **golden rules** (`docs/design-docs/golden-rules.md`): prefer shared utilities,
   no YOLO data exploration, boring/internalizable deps.
3. Severity ≥ 2 → entry in `docs/exec-plans/tech-debt-tracker.md` or an immediate small,
   auto-mergeable fix PR. Update `docs/QUALITY_SCORE.md` grades.
4. Run `doc-gardener` (`.claude/agents/doc-gardener.md`) for stale/contradicted docs.

## Done when
The entropy audit is recorded and severity≥2 findings are tracked or fixed. Most cleanup PRs
are reviewable in under a minute and auto-merge.
