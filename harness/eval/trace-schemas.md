# Trace Schemas — Episode Package

Each agent run becomes an auditable **episode package**: eight trace types + a patch + a
verification report + an outcome record. Traces are line-structured JSON (JSONL).

## The eight trace types
| Trace | Captures | Failure type addressed |
|-------|----------|------------------------|
| action trace | sequence of meaningful operations | overall coherence |
| tool trace | command, exit code, duration, timeout, recovery | `Ftool` |
| context trace | which memory consulted, contribution, influence | `Fcontext` |
| verification trace | type/method/result/requirements/interpretation | `Fverify` |
| failure-attribution log | observed/expected/type/evidence/alternatives/next | `Fverify`, `Fmodel` |
| intervention log | human assistance, avoidability, burden, gap | all (diagnostic) |
| entropy audit | agent-introduced burden by category + severity | `Fentropy` |
| outcome record | final classification + summary metrics | adjudication |

## Compact schemas (JSONL — one object per line)
```
action:       {"op":"read_file|edit_file|run_tool|write_report|update_task_state|inspect_diff|declare_complete","target":"...","ts":"..."}
tool:         {"cmd":"...","exit":0,"ms":123,"timeout":false,"failure_type":null,"recovered":true}
context:      {"artifact":"docs/...","contribution":"...","influenced_decision":true}
verification: {"type":"deterministic|targeted|regression|lint|repro|patch_review","method":"...","result":"pass|fail|timeout","requirements":[1,2],"interpretation":"..."}
attribution:  {"observed":"...","expected":"...","failure_type":"Fverify","evidence":"...","alternatives":["..."],"next":"..."}
intervention: {"stage":"...","action":"...","avoidable":true,"burden":"low|med|high","harness_gap":"context_manager"}
entropy:      {"category":"code|documentation|dependency|test|file_residue|architecture|workflow","severity":0,"note":"..."}
outcome:      {"label":"autonomous_verified_success","metrics":{...}}
```

## Storage
`eval/episodes/<episode-id>/` holds the traces (`*.jsonl`), `patch.diff`,
`verification-report.md`, and `outcome.json`. Trace files are git-ignored runtime data;
the report and outcome are kept. Bootstrap a new one with
`node scripts/new-episode.mjs <task-id>`.

> Example: `eval/episodes/example-T1/` ships a filled, illustrative H3 episode package (reproduce→attribute→fix→verify→report, outcome `autonomous_verified_success`). `node scripts/init-template.mjs` removes it when you start a real project.
