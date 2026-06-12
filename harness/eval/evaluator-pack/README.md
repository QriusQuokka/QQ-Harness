# Evaluator Pack — KEEP HIDDEN FROM THE AGENT

This directory holds **evaluator-side ground truth** for a task: information the agent must
NOT see at any harness level (requirement **R4: no hidden evaluator leakage**). It exists so
adjudication is objective without leaking answers into the episode.

> Operational rule: when running an episode (any level H0–H3), this directory is **excluded
> from the agent's context**. It is read only by the evaluator (a human, or a separate
> evaluator agent that does not also solve the task).

## Contents (per task — see `template/`)
- `expected-attribution.md` — the correct failure type + layer the fix belongs in.
- `expected-fix.md` — the reference fix (what a correct change looks like).
- `deterministic-checks.eval.md` — the evaluator-side check registry. These run at **all**
  levels to classify the outcome; they are only *agent-visible* at H3 (via `harness/30_*`).
- `evaluator-notes.md` — any other adjudication notes.

## Why separate from `harness/30_deterministic-checks.md`
The H3 agent gets a deterministic check registry to support *its own* verification. The
evaluator also needs checks to adjudicate H0–H2 (where the agent never saw them). Keeping an
evaluator-side copy here preserves the ladder (controlled visibility) while still allowing
consistent adjudication across levels.
