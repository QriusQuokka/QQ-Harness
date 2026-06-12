# Known Failures (component 4: project memory) — H2

Agent-readable catalog of recurring failure modes, flaky areas, and their handling, so the
agent doesn't rediscover them every episode.

## Catalog (template)
| ID | Symptom | Cause | Handling | Status |
|----|---------|-------|----------|--------|
| _KF-001_ | _example: full regression times out_ | _heavy suite_ | _use targeted checks + record timeout_ | known |

## Rules
- When the agent hits a novel failure worth remembering, add it here (project memory), and if
  it's mechanical, promote the handling into tooling.
- Link entries to the relevant attribution-log episodes (`32_*`, `eval/`).
