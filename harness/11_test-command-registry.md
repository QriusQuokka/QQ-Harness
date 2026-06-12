# Test-Command Registry (component 3) — H1

The canonical commands for exercising the system, each with scope and stability notes. Lets
the agent choose **targeted** checks over expensive/flaky full runs, and recover from
instability deliberately. **Frame** — fill in with the real toolchain.

## Commands (template)
| Name | Command | Scope | Timeout | Stability |
|------|---------|-------|---------|-----------|
| deterministic checks | (see `30_deterministic-checks.md`) | requirement probes | short | high |
| targeted test | `<runner> <path>` | one area | short | high |
| lint | `<linter>` | static | short | high |
| full regression | `<runner>` | whole suite | bounded | may be flaky |

## Rules
- A missing full-regression result is **never** silently treated as success.
- Full regression runs under a strict timeout; on timeout, record it — do not silently retry.
- At H3, a full-regression timeout does not block `autonomous_verified_success` if
  deterministic requirement coverage is complete and the limit is reported (`34_*`).
