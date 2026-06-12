# Tool Registry (component 3) — H1

Declares the tools and commands available to the agent, so the action surface is explicit
and traceable rather than improvised. **Frame** — populate when a stack/toolchain exists.

## Registered tools (template)
| Tool | Purpose | Allowed? | Notes / gate |
|------|---------|----------|--------------|
| `git` | version control | yes | destructive subcommands blocked (see `40_*`) |
| package manager | deps | `ask` | additions gated (supply chain) |
| build | compile/bundle | yes | — |
| test runner | tests | yes | see `11_test-command-registry.md` |
| linter | quality/architecture | yes | wired in `enforce-lint.js` |
| browser driver | UI inspection | yes (future) | Chrome DevTools-style; see observe skill |

## Rules
- If a needed tool is missing, that's a harness gap — add it here and to settings, don't
  work around it.
- Every tool invocation is recorded in the tool trace (`eval/trace-schemas.md`).
