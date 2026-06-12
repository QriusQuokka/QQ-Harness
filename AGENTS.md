# AGENTS.md

> Pointer for non-Claude agents. This harness targets **Claude Code**, whose operating map is
> `CLAUDE.md`. To keep one source of truth, the full agent guide lives there.

**Start at [`CLAUDE.md`](CLAUDE.md)** — it is the table of contents (the five design
principles, the plan→ship lifecycle loop, the cross-cutting concerns, and the map of `docs/`
and `harness/`).

If you are a different agent runtime, treat `CLAUDE.md` as your `AGENTS.md`: read it first,
then follow the loop and the harness artifacts under `harness/`. Tool wiring specific to
Claude Code (permissions, hooks, skills, subagents) lives under `.claude/`; port the
equivalents for your runtime as needed.
