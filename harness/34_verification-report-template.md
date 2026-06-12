# Verification Report Template — H3 (verification step 5)

The transferable record of *why the change is believed correct*. Produced at the end of every
episode; lives in `eval/episodes/<id>/verification-report.md`.

```
# Verification Report — <task ID>

## Summary
<one-line outcome>

## Requirement coverage
| Req | Evidence (check/test) | Result | Notes |
|-----|-----------------------|--------|-------|
| 1   | C1 / targeted test    | pass   |       |
| 2   | C2 (preserved valid)  | pass   |       |
| 3   | C3 (preserved invalid)| pass   |       |

## Reproduction
<observed vs expected before the fix> (link reproduction log)

## Attribution
<failure type + targeted layer> (link attribution log)

## Fix
<what changed, in which layer>

## Checks run
- deterministic checks: <pass/fail per check>
- targeted tests: <result>
- full regression: <pass / timeout(bounded) / instability — recorded, not hidden>
- lint / architecture: <result>

## Limitations
<e.g. full-regression timed out; deterministic coverage complete>

## Outcome
<one of: autonomous_verified_success | assisted_verified_success | unverified_success |
 failed | unsafe_invalid>   (see eval/outcome-taxonomy.md)
```
