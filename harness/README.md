# harness/ — Runtime Substrate Artifacts

This directory is the **AI Development Harness**: the runtime substrate that mediates how the
agent observes the project, acts on it, receives feedback, and establishes that a change is
complete. It operationalizes the five design principles in
`docs/design-docs/core-beliefs.md`.

> Framework: arXiv 2605.13357 "AI Harness Engineering"; practices: OpenAI "Harness
> Engineering". This is the **frame** — artifacts are templates/protocols to fill in as real
> work begins.

## Eleven component responsibilities → artifacts
| # | Component | Contract | Failure when absent | Artifact |
|---|-----------|----------|---------------------|----------|
| 1 | Task interface | objective, requirements, success criteria | wrong-target work | `01_task-interface.md` |
| 2 | Context manager | select & expose task-relevant content | wrong-file inspection | `20_context-selection-protocol.md` |
| 3 | Tool registry | declare available tools/commands | failed/unsafe calls | `10_tool-registry.md` |
| 4 | Project memory | agent-readable architecture/testing/known-failure knowledge | repeated rediscovery; wrong-layer fix | `ARCHITECTURE.md`, `docs/TESTING.md`, `22_known-failures.md` |
| 5 | Task state | hypothesis, inspected files, next steps | drift; repeated work | `21_task-state.md` |
| 6 | Observability | expose logs, traces, outputs, errors | unverifiable success | observe skill + ephemeral stack |
| 7 | Failure attribution | separate observation/expectation/diagnosis | random patching | `32_failure-attribution-protocol.md` |
| 8 | Verification | map requirements to deterministic evidence | false confidence | `33_verification-protocol.md` |
| 9 | Permission boundary | restrict risky actions; approval gates | unsafe episodes | `40_permission-manifest.md` |
| 10 | Entropy auditor | detect agent-introduced maintenance burden | stale docs, residue | `41_entropy-audit-template.md` |
| 11 | Intervention logger | record human assistance & avoidability | invisible human scaffolding | `42_intervention-log.md` |

## The H0–H3 ladder (controlled, monotonic visibility)
Build and expose runtime support in layers so each layer's contribution is separable. Each
level inherits all artifacts of lower levels.

- **H0 — Minimal baseline.** Task description + repository files only.
- **H1 — Tool harness.** + `10_tool-registry.md`, `11_test-command-registry.md`,
  `12_tool-usage-protocol.md`. Makes the action surface explicit and traceable.
- **H2 — Context/memory harness.** + project memory (`docs/`, `22_known-failures.md`),
  `21_task-state.md`, `20_context-selection-protocol.md`. Makes context use explicit.
- **H3 — Observability/verification harness.** + `30_deterministic-checks.md`,
  `31_bug-reproduction-protocol.md`, `32_failure-attribution-protocol.md`,
  `33_verification-protocol.md`, `34_verification-report-template.md`. Makes completion an
  evidentiary object, not an assertion.

This harness targets **H3** as the operating level. Lower levels exist as a deliberate
ablation reference. The ladder is operationalized — not just described — by the **visibility
matrix** and the five ladder requirements (R1–R5) in `eval/visibility-matrix.md`, and by the
**evaluator pack** (`eval/evaluator-pack/`) that holds hidden ground truth so adjudication is
objective without leaking answers (R4). R4 is enforced **by separation** — the pack is not
copied into a graded episode's worktree — with an episode-scoped guard backstop
(`HARNESS_EPISODE=1` makes `block-secrets.js` deny `evaluator-pack/` access); see
`40_permission-manifest.md`. Adjudication runs out-of-band (a human or a separate evaluator
agent), and maintainers can read the pack in the canonical repo.

## Evaluation layer
`eval/` converts each agent run into an auditable **episode package** (8 trace types →
verification report → 5-label outcome). See:
- `eval/visibility-matrix.md` — H0–H3 visibility matrix + ladder requirements R1–R5.
- `eval/trace-schemas.md` — the 8 trace types and JSONL schemas.
- `eval/outcome-taxonomy.md` — the 5-label final-outcome taxonomy.
- `eval/metrics.md` — AVSR, M-HIR, and other process metrics.
- `eval/evaluator-pack/` — hidden evaluator ground truth (kept out of agent context).

## File index
- Cross-cutting: `40_permission-manifest.md`, `41_entropy-audit-template.md`,
  `42_intervention-log.md`, `43_reproducibility-worktree.md`
- Numbering: `0x` task interface · `1x` H1 · `2x` H2 · `3x` H3 · `4x` cross-cutting.
