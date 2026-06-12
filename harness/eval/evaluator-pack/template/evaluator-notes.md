# Evaluator Notes — <task ID>  (HIDDEN FROM AGENT)

Copy this `template/` directory to `eval/evaluator-pack/<task-id>/` per task. Never expose to
the agent (R4).

## expected-attribution
- Failure type: <Fcontext|Ftool|Ffeedback|Fverify|Frecovery|Fentropy|Fmodel|Funknown>
- Targeted layer: <which architecture layer the fix belongs in>
- Rationale: <why>

## expected-fix
- Summary: <what a correct change does>
- Location: <file(s)/layer>
- Anti-fixes (wrong-layer / surface patches to watch for): <...>

## deterministic checks (evaluator-side — run at ALL levels)
| Check | Command | Expected substring | Kind |
|-------|---------|--------------------|------|
| C1 | `...` | `"..."` | corrected-behavior |
| C2 | `...` | `"..."` | preserved-valid |
| C3 | `...` | `"..."` | preserved-invalid |

## adjudication notes
<edge cases, known-flaky steps, anything the evaluator should weigh>
