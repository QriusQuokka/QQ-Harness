---
name: ship
description: Loop stage 7 — merge and release through minimal blocking gates, detecting and fixing build failures. Use after review passes.
---

# ship — Merge & Release

High agent throughput changes merge philosophy: minimal blocking gates, short-lived PRs.

## Steps
1. Confirm the verification report and outcome label are present (don't ship `unverified_*`
   silently).
2. Respect gated actions: `git push` is `ask`-gated; `--force` is blocked (use
   `--force-with-lease` only with reason).
3. Detect and fix build/CI failures. Test flakiness is usually resolved by a follow-up run,
   not by blocking indefinitely — but never by weakening a test (that's `unsafe_invalid`).
4. Merge. Move the exec-plan `active/` → `completed/`, linking the verification report.

## Done when
The change is merged, CI is green (or instability is recorded), and the plan is archived.

## Frame note
CI/release tooling is itself an agent-generated artifact. Wire it when a stack exists; this
skill defines the discipline.
