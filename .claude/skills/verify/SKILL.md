---
name: verify
description: Loop stage 5 — bind completion to evidence via reproduce→attribute→fix→verify→report. Use before declaring any change done. This is the core H3 discipline.
---

# verify — Verification (H3)

Completion is an evidentiary object, not an assertion (`harness/33_verification-protocol.md`).

## Five-step discipline
1. **Reproduce** (`harness/31_*`) — observe failure vs. expected before editing.
2. **Attribute** (`harness/32_*`) — classify the failure type + targeted layer.
3. **Fix** — targeted edit to the attributed layer.
4. **Verify** (`harness/30_*`) — deterministic checks (corrected + preserved valid +
   preserved invalid), targeted tests, bounded full regression (record timeouts), lint,
   patch review. If this reveals the diagnosis was wrong → back to step 2.
5. **Report** (`harness/34_*`) — write the verification report mapping every requirement to
   its evidence, plus limitations.

## Done when
Every requirement maps to passing evidence and a verification report exists. Assign an
outcome label (`harness/eval/outcome-taxonomy.md`). Then move the node to ✅ in the
stakeholder view (`brief` skill) so `docs/PROJECT_MAP.md` stays current.
