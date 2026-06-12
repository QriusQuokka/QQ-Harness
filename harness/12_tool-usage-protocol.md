# Tool-Usage Protocol — H1 (loop stage 2: develop)

How the agent acts through tools so behavior stays coherent, safe, and traceable.

## Protocol
1. **Check the registry** (`10_tool-registry.md`) before using a tool. Unregistered tool or
   unclear command → register it or escalate, don't improvise.
2. **Respect the permission boundary** (`40_permission-manifest.md`, `.claude/settings.json`).
   Gated actions (deps, push, external transmission, destructive) require their gate.
3. **Record every invocation** in the tool trace: command, exit code, duration, timeout
   status, failure type, recovery status.
4. **Recover deliberately.** On failure: prefer targeted checks, add timeouts, inspect logs,
   and run the failure-attribution protocol (`32_*`) before editing again — never jump
   straight from a failed observation to a new edit.
5. **Parse at the boundary.** Validate external/tool output into expected shapes before
   acting on it; don't build on a guessed shape.

## Develop-stage exit condition
A change is ready to leave `develop` only when it is implemented behind the architecture's
boundaries (ARCHITECTURE.md) and the tool trace is complete. Verification happens in stage 5.
