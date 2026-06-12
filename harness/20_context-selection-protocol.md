# Context-Selection Protocol (component 2) — H2

How the agent selects and records the project content it reasons over, so context use is
explicit and auditable (not an invisible prompt ingredient).

## Protocol
1. **Start from the map.** `CLAUDE.md` → relevant `docs/` index → specific artifact. Do not
   pattern-match locally without reading the governing doc first.
2. **Budget context.** Context is a scarce resource. Pull the *map*, not the encyclopedia;
   open deeper docs only as the task requires (progressive disclosure).
3. **Record what you consulted.** For each project-memory artifact used, log in the context
   trace: which artifact, what it contributed, whether it influenced a decision
   (`eval/trace-schemas.md`).
4. **Prefer in-repo, reachable knowledge.** If needed knowledge isn't in the repo, vendor it
   into `docs/references/` — out-of-repo knowledge effectively doesn't exist.

## Anti-patterns
- Loading everything "just in case" (drowns the real constraints).
- Treating one giant instructions file as truth (rots; becomes a graveyard of stale rules).
