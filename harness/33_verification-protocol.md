# Verification Protocol (component 8) — H3 (loop stage 5)

Binds task completion to evidence (P3). Verification is a **harness responsibility**, not
something delegated to a human reviewer. Completion is an evidentiary object, not an assertion.

## The five-step discipline
```
1. Reproduce   observe failure vs. expected            (31_bug-reproduction-protocol.md)
2. Attribute   classify failure type & evidence        (32_failure-attribution-protocol.md)
3. Fix         targeted edit to the attributed layer
4. Verify      deterministic checks + preserved behavior (30_deterministic-checks.md)
5. Report      verification report + limits             (34_verification-report-template.md)

   back-edge: if step 4 reveals the diagnosis was wrong → return to step 2 (re-attribute)
```

## Step 4 — what to run
- All deterministic checks for the requirements (corrected + preserved valid + preserved invalid).
- Targeted tests for the changed area.
- A bounded full-regression attempt (record timeouts/instability; never silently skip).
- Lint / structural (architecture) checks.
- Self-review of the diff (patch review).

## Completion rule
Map **every requirement** to its evidence. A requirement without passing evidence is not
done. Record any limitation (e.g. a full-regression timeout) explicitly in the report.
