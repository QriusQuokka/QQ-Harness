# Frontend

> **Stub.** No frontend exists yet. This placeholder reserves the agent-readable home for
> frontend conventions so they're reachable when a UI is built.

When a UI exists, document here (and enforce mechanically where possible):
- Component structure and the UI layer's place in the architecture (`ARCHITECTURE.md`:
  UI is a terminal layer; cross-cutting concerns enter via Providers only).
- Design-system references (vendor an `*-llms.txt` into `docs/references/`).
- Accessibility and interaction conventions.
- How the agent inspects UI behavior: per-worktree app boot + a Chrome DevTools-style driver
  for DOM snapshots/screenshots/navigation (see the `observe` skill).
