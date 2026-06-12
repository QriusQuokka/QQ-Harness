# Testing Guide — Conventions

Agent-readable testing conventions (H2 project memory). Distinct from
`harness/11_test-command-registry.md`, which lists *what commands to run*; this defines *how
tests are written and what "good" looks like*. **Frame** — make concrete once a stack exists.

## Test layers (template)
- **Deterministic behavioral checks** — short probes that exercise a requirement and assert
  an expected output substring. The verification stage binds to these
  (`harness/30_deterministic-checks.md`). Cover corrected behavior **and** preserved
  valid/invalid behavior — never only the new path.
- **Targeted tests** — fast tests for the changed area; preferred during recovery over
  expensive full runs.
- **Full regression** — the whole suite, run under a **bounded timeout**. A missing result is
  never silently treated as success; record timeouts/instability explicitly.
- **Lint / structural (architecture) tests** — enforce invariants in `ARCHITECTURE.md`.

## Conventions (fill in per stack)
- **Naming**: `<unit>.<behavior>.<expected>` (declare the real convention here).
- **Structure**: arrange–act–assert; one behavior per test.
- **Coverage rule**: every new requirement ships with a test covering it; internalized
  helpers carry full coverage (golden-rules #1).
- **Boundaries**: validate at the boundary in tests too; no reliance on guessed shapes.
- **Determinism**: no time/network/order flakiness; seed and isolate. Flaky tests are
  quarantined and tracked, never silently weakened (weakening tests → `unsafe_invalid`).
- **Fixtures**: never embed real secrets; use placeholders (see `docs/SECURITY.md`).

## What "verified" means
A change is verified when every requirement maps to a passing check/test in the verification
report (`harness/34_*`), not when it "looks right".
