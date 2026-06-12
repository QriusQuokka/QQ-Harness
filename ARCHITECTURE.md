# Architecture

> Top-level map of domains and layering. **Frame only** — there is no product code yet.
> When real development begins, this becomes the authoritative, mechanically-enforced map.
> Agents work most effectively with strict boundaries and predictable structure.

## Why this exists
A fully agent-generated codebase drifts unless invariants are **mechanically enforced**
(custom linters + structural tests), not merely documented. Constraints are an *enabler*:
they let agents move fast without architectural decay. Set boundaries centrally; allow
local autonomy in how a solution is expressed inside those boundaries.

## Layered domain model (template)
Each business domain is split into a fixed set of layers. Code may only "flow" in one
direction through the layers. Cross-cutting concerns enter through a single explicit
interface (`Providers`). Everything else is disallowed and enforced mechanically.

```
                          Utils  (dependency-free helpers)
                            │
        ┌───────────────────┴───────────────────┐
        │            Business logic domain        │
        │                                         │
        │   Providers ──► App Wiring + UI          │   Providers = the ONLY entry
        │      │                                   │   for cross-cutting concerns:
        │      ▼                                   │   auth, connectors, telemetry,
        │   Service ──► Runtime ──► UI             │   feature flags.
        │      ▲                                   │
        │   Types ──► Config ──► Repo ─────────────┘
        └─────────────────────────────────────────┘

   Allowed flow within a domain:
   Types → Config → Repo → Service → Runtime → UI
```

## Invariants to enforce (when code exists)
These are placeholders for the lint/structural-test frame (`.claude/hooks/enforce-lint.js`):

- **Dependency direction** — a layer may only import from layers below it; no cycles.
- **Cross-cutting via Providers only** — auth/telemetry/flags/connectors never imported ad hoc.
- **Parse at the boundary** — external data is validated into typed shapes at the edge
  (e.g. a schema library); no "YOLO-style" untyped data exploration past the boundary.
- **Naming conventions** — schemas, types, files follow declared conventions.
- **File-size limits** — enforced statically.
- **Structured logging** — required; no ad hoc prints in product layers.
- **Prefer internalized, "boring" dependencies** — couplable, API-stable, well-represented
  in training data; reimplement small helpers (with full coverage + telemetry) when that is
  cheaper than tracking opaque upstream behavior.

> Custom lint error messages must **inject the fix instruction into agent context** — the
> message tells the agent exactly how to comply, not just that it failed.

## Status
- [ ] Domains defined
- [ ] Layer enforcement linter implemented
- [ ] Structural tests implemented
- [ ] Providers interface specified

Until checked, this document is the *intended* architecture, not the enforced one.
