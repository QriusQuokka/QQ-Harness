# Task State (component 5) — H2

A living record of the current task so work stays coherent across steps, episodes, and
context windows. Copy per task (e.g. into the active exec-plan) and keep it updated.

## Task-state template
```
Task ID:          <repo>-T<n>
Current step:     <n of m>
Hypothesis:       <current working theory>
Inspected files:  <paths consulted, with why>
Done so far:      <verified progress>
Open questions:   <unknowns blocking progress>
Next action:      <the single next concrete step>
Interventions:    <link to 42_intervention-log.md entries, if any>
```

## Rules
- Update **before** stopping and at each meaningful step — drift and repeated work come from
  stale task state.
- The "next action" field is always concrete enough to resume cold.
