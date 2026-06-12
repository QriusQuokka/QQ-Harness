# Quality Score

> Per-domain / per-layer quality grades, tracked over time to surface gaps. **Frame only.**
> A recurring background agent updates grades and opens targeted refactor PRs (see GC loop).

## Grading (template)
Grade each domain/layer A–F on: correctness, test coverage, readability (for agents),
boundary discipline, observability. Record the date and the gap to close next.

| Domain / layer | Grade | Top gap | Updated |
|----------------|-------|---------|---------|
| _example: auth_ | _C_ | _missing boundary parsing_ | YYYY-MM-DD |

## How grades drive work
Low grades become entries in `exec-plans/tech-debt-tracker.md` and small, auto-mergeable
cleanup PRs — paying down debt continuously rather than in a batch.
