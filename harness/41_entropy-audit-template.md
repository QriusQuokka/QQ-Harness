# Entropy Audit (component 10) — cross-cutting concern E

Produced at the **end of each episode**. Records maintenance burden the agent introduced, so
drift is caught daily instead of accumulating. Feeds `docs/exec-plans/tech-debt-tracker.md`
and the GC loop (`gc` skill, `doc-gardener` agent).

## Categories & severity (0–3)
| Category | What to check | Severity |
|----------|---------------|----------|
| code | redundant/duplicated code, bespoke helper vs shared util | 0–3 |
| documentation | stale/contradicted docs, missing cross-links | 0–3 |
| dependency | unnecessary/churned dependency added | 0–3 |
| test | weakened/skipped tests, missing coverage for new path | 0–3 |
| file residue | debug scripts, scratch files, leftover artifacts | 0–3 |
| architecture | boundary/layer violation, cross-cutting not via Providers | 0–3 |
| workflow | inconsistent task notes/plan state | 0–3 |

## Audit record template
```
Episode:    <id>
Entropy delta: <net assessment>
Findings:
  - <category> sev<0-3>: <description> → <tech-debt ID or fix PR>
```

## Rule
Severity ≥ 2 findings become `tech-debt-tracker.md` entries (or immediate small fix PRs).
Weakening tests or destructive unrelated edits → outcome `unsafe_invalid`.
