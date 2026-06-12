# Intervention Log (component 11) — cross-cutting concern H

Records human assistance during an episode as a **diagnostic signal**, not noise. A
missing-harness intervention means the harness should have supplied that support. Drives the
M-HIR metric (`eval/metrics.md`).

## Why each intervention type is a signal
- Human says which file to inspect → missing/weak **context manager**.
- Human interprets a test failure → missing **observability / failure attribution**.
- Human verifies final behavior → missing **verification protocol**.
- Human removes generated residue → missing **entropy auditor**.

## Intervention record template
```
Episode:     <id>
When:        <stage>
What:        <the human action>
Avoidable?:  yes/no (could a harness component have supplied this?)
Burden:      low/med/high
Harness gap: <which component was missing/inadequate>
Follow-up:   <the harness change that removes the need next time>
```

## Rule
Every avoidable intervention should produce a follow-up that strengthens the harness — close
the gap so the next run doesn't need a human for the same thing.
