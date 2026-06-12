# Metrics

Process-level metrics computed from episode packages. They summarize harness contribution
across (model, harness level, task, repository) cells — not just pass/fail.

| Metric | Definition |
|--------|------------|
| **AVSR** (autonomous verified success rate) | share of episodes labeled `autonomous_verified_success` |
| **M-HIR** (missing-harness human intervention rate) | missing-harness interventions ÷ total episodes |
| **Verification autonomy** | share of completions backed by agent-produced requirement-level evidence |
| **Context-trace meaningfulness** | share of consulted memory artifacts that influenced a decision |
| **Tool recovery rate** | share of tool failures the agent recovered from |
| **Failure-attribution completeness** | share of failures with a complete attribution log before recovery |
| **Entropy delta** | net maintenance burden introduced per episode (from entropy audits) |

## Use
- A harness that **lowers M-HIR** is supplying support a human would otherwise provide.
- Run the same task across H0→H3 to attribute gains to specific runtime-support classes.
- With multi-task / multi-model designs these become estimable quantities with intervals.
