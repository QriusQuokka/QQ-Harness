# Core Beliefs — Agent-First Operating Model

Validation status: **validated** (operating principles for this harness).

Software-engineering capability is an emergent property of a **model–harness–environment**
system, not of the model alone. The harness is the runtime substrate that decides whether
latent coding ability becomes *auditable, verifiable, maintainable* software work. These
five principles govern every stage of the lifecycle loop.

## P1 — Explicit runtime resources
Critical resources are named and exposed, never left implicit: context budget, tool
affordances, project memory, verification evidence, human attention, permission boundaries,
maintenance state. **Why:** what the agent cannot see in context effectively does not
exist. Knowledge in chat threads, external docs, or someone's head is unreachable.

## P2 — Traceable mediation
Record *how* the agent selects context, invokes tools, attempts verification, recovers from
failure, and where a human had to intervene. **Why:** providing a resource (e.g. memory) is
insufficient; its *use* must be inspectable to be auditable. See `harness/eval/`.

## P3 — Requirement-level verification
Task completion binds to evidence — deterministic checks, targeted tests, regression
attempts, lint, patch review — not to a natural-language assertion. **Why:** a patch that
"looks done" is not a verified change. This is the difference between a patch and a
verifiable change. See `harness/33_verification-protocol.md`.

## P4 — Attribution before recovery
A failed observation produces a *classified diagnosis* before the agent edits again.
**Why:** moving straight from failure to a new edit yields lucky fixes when the edit happens
to address the cause, and random patching when it does not. See
`harness/32_failure-attribution-protocol.md`.

## P5 — Maintenance & entropy awareness
The harness records whether the agent introduced maintenance burden — stale docs, dependency
churn, residue, weakened tests, boundary violations — rather than treating it as outside the
loop. **Why:** agents replicate existing patterns, including bad ones; drift is inevitable.
Technical debt is a high-interest loan — pay it down continuously, not in a painful batch.
See `harness/41_entropy-audit-template.md`.

## Consequences for how we work
- **Humans orchestrate; the agent executes.** People prioritize work, turn user feedback
  into acceptance criteria, and verify outcomes — operating at a higher abstraction layer.
- **When the agent struggles, that's a signal.** Identify the missing tool, guardrail, or
  doc, and write the fix back into the harness rather than working around it.
- **Optimize the repo for agent readability.** Improve navigability and explicit affordances
  the way you would onboard a new engineer — including conventions and team norms.
- **Promote rules to code.** Human taste captured in review comments and refactors gets
  encoded into docs, then into linters/tests, so it applies everywhere at once.
