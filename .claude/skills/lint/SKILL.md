---
name: lint
description: Loop stage 3 — enforce quality and architecture invariants mechanically (linters + structural tests). Use after implementing, and it also runs automatically via the PostToolUse hook.
---

# lint — Quality & Architecture Enforcement

Documentation alone can't keep an agent-generated codebase consistent; invariants are
enforced **mechanically**. The PostToolUse hook (`.claude/hooks/enforce-lint.js`) runs this
on every edit once wired.

## Steps
1. Run the project linter(s) and structural/architecture tests (see `ARCHITECTURE.md`
   invariants: dependency direction, Providers-only cross-cutting, boundary parsing, naming,
   file-size, structured logging).
2. Fix violations. Custom lint messages should tell you exactly how to comply — follow them.
3. If a recurring taste issue isn't yet enforced, **promote it**: add a rule to
   `docs/design-docs/golden-rules.md`, then to a linter/test.

## Done when
Lint + structural checks pass. Frame note: until a stack exists, the hook is a no-op; wire
real linters in `enforce-lint.js`.
