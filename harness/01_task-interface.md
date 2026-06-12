# Task Interface (component 1)

Every episode begins by making the task explicit. Without this, the agent does wrong-target
work. Fill this in per task (or generate it from a `product-specs/` entry).

## Task record template
```
Task ID:            <repo>-T<n>
Objective:          <one sentence>
Requirements:       (numbered, testable, with expected observable output)
  1. ...
Constraints:        (what must be preserved / not changed)
Success criteria:   (the deterministic checks in 30_deterministic-checks.md this binds to)
Out of scope:       (explicit non-goals)
Initial state:      <commit / worktree>
Intervention policy: escalate to human only when judgment is required (log per 42_*)
```

## Rules
- Requirements must be **testable**, each tied to an expected output substring or check.
- "Preserve existing behavior X" is itself a requirement — list it, don't assume it.
- The task interface is the contract the verification report (`34_*`) will close against.
