---
name: review
description: Loop stage 6 — run agent review (local + cloud) and iterate on feedback until reviewers are satisfied. Use after verification, before merge.
---

# review — Agent Review

Most review is agent-to-agent. Humans may review but it isn't required for every change.

## Steps
1. Self-review the diff locally (`inspect_diff`): scope, boundaries, no residue, no weakened
   tests.
2. Request agent review (`.claude/agents/reviewer.md`); for risk-sensitive changes also run
   `.claude/agents/security-auditor.md`.
3. Respond to every reviewer comment inline; push updates; iterate until all reviewers are
   satisfied.
4. Escalate to a human **only** when judgment is required — log it (`harness/42_*`).

## Done when
All agent reviewers are satisfied and feedback is resolved. Keep PRs short-lived.
