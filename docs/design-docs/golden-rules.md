# Golden Rules — Taste Invariants

Validation status: **proposed** (enforce in lint/code as the codebase grows).

Rules designed to keep the codebase readable and consistent at execution time. They start
as documented norms and get **promoted into linters/structural tests** so they apply
everywhere at once. When a rule is enforced in code, link the enforcing artifact here.

## Current rules
1. **Prefer shared utility packages over bespoke helpers** for managing invariants centrally.
   Reimplement a small helper in-repo only when it is cheaper than tracking opaque upstream
   behavior — and then give it full test coverage + telemetry.
2. **No "YOLO-style" data exploration.** Validate at boundaries or rely on typed SDKs; never
   build on a guessed data shape. (See ARCHITECTURE.md "parse at the boundary".)
3. **Prefer boring, internalizable dependencies** — couplable, API-stable, well-represented
   in training data, modelable inside the repo.
4. **Structured logging only** in product layers; no ad hoc prints.
5. **Plans are first-class artifacts.** Non-trivial work gets an exec-plan with a decision log.
6. **Correctness over human stylistic preference.** If output is correct, maintainable, and
   readable for future agent runs, it meets the bar — even if it isn't how a human would write it.

## Promotion ledger (rule → enforcement)
| Rule | Status | Enforced by |
|------|--------|-------------|
| #2 boundary parsing | proposed | (future) architecture/structural test |
| #4 structured logging | proposed | (future) custom lint |

> Add rows as rules are promoted from doc → lint/code.
