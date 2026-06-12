# Tech Debt Tracker

Known debt, tracked and paid down **continuously** (entropy GC, cross-cutting concern E).
Debt is a high-interest loan: small steady repayment beats a painful batch.

## Open debt
| ID | Description | Source | Severity (0–3) | Status |
|----|-------------|--------|----------------|--------|
| _D-001_ | _example: missing boundary parsing in X_ | quality-score | 2 | open |

## How items get here
- Entropy audits (`harness/41_entropy-audit-template.md`) at episode end.
- Quality-score downgrades (`docs/QUALITY_SCORE.md`).
- Review findings and user-reported bugs.

## How items leave
Small, targeted, auto-mergeable refactor PRs from the GC loop (`gc` skill /
`doc-gardener` agent). Link the closing PR/plan when resolved.
