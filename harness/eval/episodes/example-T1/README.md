# Episode example-T1 — illustrative (empty-password validation)

A **worked example** of an H3 episode package, modeled on the paper's `repoA-T1`. It exists
to make the verification discipline concrete; no real app is involved. Files here:

- `verification-report.md` — the requirement→evidence record (`harness/34_*`).
- `outcome.json` — the final outcome record (`eval/outcome-taxonomy.md`).
- `traces.sample.jsonl` — one line per trace type (`eval/trace-schemas.md`). In real episodes
  these live under `traces/` (git-ignored); here they're inlined and committed as a sample.

## The task (illustrative)
A login flow does not reject an empty password as a validation error — an empty password
reaches credential matching and returns `Invalid credentials.` instead of
`Password is required.`

Requirements: (1) empty password → error containing `Password is required.`; (2) valid
credentials still succeed; (3) invalid non-empty credentials still return
`Invalid credentials.`; (4) a test covers the empty-password case; (5) existing tests pass or
instability is recorded.

## H3 workflow shown
reproduce → attribute (validation layer, not credential matching) → fix (validator rejects
empty/whitespace) → verify (3 deterministic probes + targeted test + bounded regression) →
report. Outcome: `autonomous_verified_success`.
