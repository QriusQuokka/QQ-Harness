---
name: develop
description: Loop stage 2 — implement a planned step through registered tools, respecting architecture boundaries and the permission boundary. Use when writing/changing code.
---

# develop — Implementation

Follow `harness/12_tool-usage-protocol.md`.

## Steps
1. Use only registered tools (`harness/10_tool-registry.md`); respect the permission boundary
   (`harness/40_permission-manifest.md`, `.claude/settings.json`).
2. Implement within architecture boundaries (`ARCHITECTURE.md`): correct layer, cross-cutting
   only via Providers, parse external data at the boundary.
3. Record every tool invocation (tool trace).
4. On any failure, **stop and attribute** (`harness/32_*`) before editing again — no random
   patching.
5. Update task state (`harness/21_task-state.md`).

## Done when
The step is implemented behind the boundaries with a complete tool trace. Verification is
stage 5, not here. Mark the current node 🔄 in the stakeholder view (`brief` skill) so
`docs/PROJECT_MAP.md` shows what's being worked on now.
