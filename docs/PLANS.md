# Planning Conventions

Plans are **first-class, version-controlled artifacts**. This doc defines how they're written
and tracked; the plans themselves live in `exec-plans/`.

## When to write a plan
- **Trivial change** → a lightweight, ephemeral plan inline in the task is fine.
- **Non-trivial / multi-step change** → a durable exec-plan in `exec-plans/active/` with a
  decision log, so progress survives across episodes and context windows.

## Exec-plan structure
Each plan file should contain:
1. **Objective & acceptance criteria** — what done means, in testable terms.
2. **Context links** — the specs, docs, and code the plan depends on.
3. **Steps** — ordered, each small enough to verify independently (depth-first decomposition).
4. **Decision log** — choices made and why, appended as work proceeds.
5. **Status** — current step, open questions, next action.

## Lifecycle
`active/` → (on completion, with verification report linked) → `completed/`.
Known debt discovered along the way goes to `tech-debt-tracker.md`.

## Why
Progressive disclosure: the agent starts from a small, stable entry point and advances step
by step without being overwhelmed, and never depends on out-of-repo context.
