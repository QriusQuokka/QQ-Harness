---
name: observe
description: Loop stage 4 — make the running app readable to the agent via per-worktree logs, metrics, traces, and UI inspection. Use to reproduce bugs and reason about runtime behavior.
---

# observe — Observability

What the agent can't see effectively doesn't exist. Expose runtime behavior so the agent can
reason about it directly. **Frame** — wire the real stack when an app exists.

## Capabilities to provide (per git worktree, ephemeral — torn down after the run)
- **Logs/metrics/traces**: isolated local observability stack; query logs (LogQL-style) and
  metrics (PromQL-style). Targets in `docs/RELIABILITY.md` become directly checkable.
- **UI inspection**: a Chrome DevTools-style driver for DOM snapshots, screenshots, and
  navigation — boot one app instance per worktree so the agent controls it.

## Steps
1. Boot the app for this worktree (see `harness/43_reproducibility-worktree.md` for the
   create→boot→observe→teardown lifecycle).
2. Capture the relevant signal (log query, metric query, snapshot/recording).
3. Feed observations into reproduction (`harness/31_*`) and the observation log.
4. On teardown, discard this worktree's ephemeral logs/metrics (no residue).

## Done when
The behavior in question is captured as concrete evidence (not inferred).
