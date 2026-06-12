# Harness — Agent Operating Map

> This file is a **table of contents, not an encyclopedia.** Keep it ~100 lines.
> Deep knowledge lives in `docs/` (the system of record) and `harness/` (runtime artifacts).
> Rule of thumb: *if it isn't reachable from the repo, it doesn't exist.* Put durable
> decisions in version-controlled files, not in chat or someone's head.

This is a **general-purpose Claude Code harness**: a runtime substrate that surrounds the
agent and manages context, tools, memory, verification, permissions, and maintenance so
that latent coding ability becomes *auditable, verifiable, maintainable* software work.
There is no product code yet — this repo is the **frame**. It is meant to be filled in and
hardened as real planning/development begins.

## Five design principles (apply to everything)
1. **Explicit runtime resources** — context, tools, memory, verification evidence, human
   attention, permission boundaries, maintenance state are *named*, not implicit.
2. **Traceable mediation** — record how context is selected, tools invoked, failures
   attributed, recovery attempted, and where humans had to intervene.
3. **Requirement-level verification** — "done" binds to deterministic evidence, never to a
   natural-language assertion.
4. **Attribution before recovery** — on failure, produce a *classified diagnosis* before
   editing again. No random patching.
5. **Maintenance & entropy awareness** — drift is caught and paid down continuously, not
   batched into a painful cleanup.

## The lifecycle loop (plan → ship)
Each stage has a skill in `.claude/skills/` and a runtime artifact in `harness/`.

| # | Stage | Skill | Primary artifact |
|---|-------|-------|------------------|
| 0 | Spec & acceptance criteria | `spec` | `docs/product-specs/`, `harness/01_task-interface.md` |
| 1 | Plan | `plan` | `docs/exec-plans/active/`, `harness/21_task-state.md` |
| 2 | Develop | `develop` | `harness/12_tool-usage-protocol.md` |
| 3 | Quality / architecture enforcement | `lint` | `ARCHITECTURE.md`, lint frame |
| 4 | Observe | `observe` | `harness/` observability (per-worktree, ephemeral) |
| 5 | Verify (reproduce→attribute→fix→verify→report) | `verify` | `harness/30-34_*` |
| 6 | Review | `review` | `.claude/agents/reviewer.md` |
| 7 | Merge / ship | `ship` | CI/release (minimal blocking gates) |
| 8 | Cleanup / maintain (GC) | `gc` | `harness/41_entropy-audit-template.md` |

## Cross-cutting concerns (every stage, always)
- **A. Security & permissions** → `docs/SECURITY.md`, `.claude/settings.json`,
  `.claude/hooks/block-secrets.js`, `harness/40_permission-manifest.md`.
  Secrets are never read/edited/committed (only `.env.example`). Destructive commands and
  dependency changes are gated.
- **B. Trace & evidence** → `harness/eval/` (8 trace types → episode package → outcome).
- **C. Requirement-level verification** → `harness/33_verification-protocol.md`.
- **D. Attribution before recovery** → `harness/32_failure-attribution-protocol.md`.
- **E. Entropy & GC** → `harness/41_entropy-audit-template.md`, `docs/exec-plans/tech-debt-tracker.md`.
- **F. Context management** → this map + `docs/` system of record.
- **G. Reproducibility** → fixed initial state, isolated workspace (git worktree per change).
  See `harness/43_reproducibility-worktree.md`.
- **H. Human escalation** → escalate only when judgment is needed; log it as a *signal*
  (missing-harness intervention) in `harness/42_intervention-log.md`.

## Map of the repository
- `docs/` — system of record. Start at `docs/index.md`.
  - `docs/design-docs/core-beliefs.md` — agent-first operating principles (the 5 above, expanded).
  - `docs/design-docs/golden-rules.md` — taste invariants enforced over time.
  - `docs/SECURITY.md` — security golden rules. **Read before any external/destructive action.**
  - `docs/exec-plans/` — plans are first-class artifacts (active / completed / tech-debt).
- `harness/` — runtime substrate artifacts. Start at `harness/README.md` (H0→H3 ladder).
- `.claude/` — Claude Code wiring: `settings.json` (permissions+hooks), `skills/`, `agents/`, `hooks/`.

## How to work here
1. Start from the relevant `docs/` map; do not pattern-match locally without reading it.
2. Follow the loop stage-by-stage; produce the stage's artifact as evidence.
3. Verify against deterministic checks, not assertions.
4. If you're missing a tool, doc, or guardrail: that's the signal — add it to the harness
   and write the fix back into the repo, rather than working around it.
