# Reproducibility & Worktree Workflow — cross-cutting concern G

Each change runs in an **isolated, reproducible workspace** so episodes are comparable and
nothing leaks between them. This is also ladder requirement **R2** (same task, same repo,
same initial state) and the substrate for per-worktree observability (the `observe` skill).
**Frame** — wire the concrete boot/teardown commands when an app exists.

## Worktree lifecycle (per change)
```
1. Create     git worktree add ../wt-<task-id> <fixed-initial-commit>
2. Boot       start ONE app instance bound to this worktree (own port/data dir)
3. Observe    spin up an ephemeral local observability stack for this worktree
              (logs + metrics + traces), queryable by the agent (LogQL / PromQL)
4. Work       run the lifecycle loop (develop → lint → observe → verify) in isolation
5. Teardown   stop the app; DISCARD the worktree's logs/metrics; remove the worktree
              git worktree remove ../wt-<task-id>
```

## Rules
- **Fixed initial state (R2).** Always branch/worktree from a known initial commit so every
  episode (and every H0–H3 level on the same task) starts identically.
- **One instance per worktree.** The agent boots and controls its own app instance; no shared
  global state across concurrent changes.
- **Ephemeral observability.** Logs/metrics/traces live only for the worktree's lifetime and
  are torn down at teardown (they are git-ignored runtime data, not committed). This lets the
  agent reason over a fully isolated copy of the app's behavior.
- **No residue.** Teardown removes the worktree and its runtime data; leftover worktrees or
  data are an entropy finding (`41_entropy-audit-template.md`).
- **Evaluator-pack stays out of the episode worktree (R4).** When creating the worktree for a
  graded run, do **not** copy `harness/eval/evaluator-pack/` into it — the answer key must not
  be on the agent's disk (primary R4 enforcement, by separation). As a belt-and-suspenders
  backstop, the runner exports `HARNESS_EPISODE=1`, which makes `block-secrets.js` deny any
  access to an `evaluator-pack/` path. Outside a graded run (the canonical repo, maintenance),
  the flag is unset and a maintainer may read the pack normally.

## Ties into
- `observe` skill — what to capture inside the booted worktree.
- `31_bug-reproduction-protocol.md` — reproduce against the isolated instance.
- `eval/visibility-matrix.md` (R2) — identical initial state across ladder levels.
