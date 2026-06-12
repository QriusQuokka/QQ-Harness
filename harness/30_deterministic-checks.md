# Deterministic Check Registry (component 8) — H3

Maps task requirements to **directly observable outputs**: short commands that exercise the
behavior, each with an expected output substring. This is what "done" binds to.

Dual role:
- **Agent-visible at H3** — supports the agent's own verification.
- **Evaluator-side at all levels** — adjudicates the final outcome.

## Check template
```
Check ID:   C<n>
Requirement: <req it covers>
Command:    <short command that exercises the behavior>
Expected:   <substring that must appear in output>
Kind:       corrected-behavior | preserved-valid | preserved-invalid
```

## Rules
- Each requirement has at least one check covering the corrected behavior **and** checks
  covering preserved valid/invalid behavior (don't only test the new path).
- Checks are deterministic and fast; no reliance on flaky full runs.
- Below H3 the agent does not see this registry; it's still used evaluator-side.

## Registry (template)
| Check ID | Requirement | Command | Expected | Kind |
|----------|-------------|---------|----------|------|
| _C1_ | _req 1_ | `...` | `"..."` | corrected-behavior |
