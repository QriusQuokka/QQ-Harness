# H0–H3 Visibility Matrix & Ladder Requirements

The operational definition of the ladder. The H0–H3 levels are not just "more docs" — they
are a **controlled-visibility ablation** that makes each runtime-support class's contribution
separable from the model's. This file specifies exactly what is visible at each level and the
five requirements an ablation run must satisfy.

## Visibility matrix
Each artifact is visible (✅) or hidden (—) at a given level. Visibility is **monotonic**:
each level inherits everything visible at lower levels.

| Artifact (this repo's file) | H0 | H1 | H2 | H3 |
|-----------------------------|----|----|----|----|
| Task description (`harness/01_task-interface.md`) | ✅ | ✅ | ✅ | ✅ |
| Repository files | ✅ | ✅ | ✅ | ✅ |
| Tool registry (`harness/10_*`) | — | ✅ | ✅ | ✅ |
| Test-command registry (`harness/11_*`) | — | ✅ | ✅ | ✅ |
| Tool-usage protocol (`harness/12_*`) | — | ✅ | ✅ | ✅ |
| Agent guide (`CLAUDE.md`) | — | — | ✅ | ✅ |
| Architecture (`ARCHITECTURE.md`) | — | — | ✅ | ✅ |
| Testing guide (`docs/TESTING.md`) | — | — | ✅ | ✅ |
| Task state (`harness/21_*`) | — | — | ✅ | ✅ |
| Known failures (`harness/22_*`) | — | — | ✅ | ✅ |
| Context-selection protocol (`harness/20_*`) | — | — | ✅ | ✅ |
| Deterministic check registry (`harness/30_*`) | — | — | — | ✅ |
| Bug-reproduction protocol (`harness/31_*`) | — | — | — | ✅ |
| Failure-attribution protocol (`harness/32_*`) | — | — | — | ✅ |
| Verification protocol (`harness/33_*`) | — | — | — | ✅ |
| Verification report template (`harness/34_*`) | — | — | — | ✅ |
| **Hidden evaluator notes** (`eval/evaluator-pack/`) | — | — | — | — |

> Note: deterministic checks have a **dual role** — agent-visible only at H3, but used
> evaluator-side at *all* levels for adjudication (see `evaluator-pack/README.md`).

## Ladder design requirements (R1–R5)
An ablation run is valid only if it satisfies all five:

- **R1 — Controlled visibility.** Each level exposes only the artifacts marked ✅ for it;
  lower levels must not see higher-level artifacts. (When running a level, withhold the
  hidden artifacts from the agent's context.)
- **R2 — Same task, same repository, same initial state.** All levels run from an identical
  task spec and an identical repo state (a fixed initial commit / fresh worktree).
- **R3 — Traceable runtime support.** When a level provides a capability, its use is recorded
  in the episode package (`trace-schemas.md`). Unused support is visible as such.
- **R4 — No hidden evaluator leakage.** Expected files, expected fix, expected attribution,
  and evaluator notes are never visible to the agent at any level (`eval/evaluator-pack/`).
  Enforced primarily **by separation**: the pack is not copied into the episode worktree, so
  it is not on the agent's disk (`43_reproducibility-worktree.md`). As a backstop, the episode
  runner sets `HARNESS_EPISODE=1` and `block-secrets.js` then denies any read/grep/shell access
  to an `evaluator-pack/` path. The lock is *episode-scoped*, not global: in the canonical repo
  (no flag) a maintainer reads the pack freely, so this guard never blocks harness upkeep.
- **R5 — Outcome comparability.** Every level is adjudicated under the same five-label
  outcome taxonomy (`outcome-taxonomy.md`), so results are comparable.

## What the ladder measures
Not just task success: whether the agent inspected relevant context, used tools, ran tests,
reproduced the failure, attributed it, verified each requirement, preserved prior behavior,
avoided unrelated changes, introduced entropy, and required human intervention. The result
is an episode package per level whose **evidence structure** differs systematically — the
empirical signal of each harness layer's contribution.
