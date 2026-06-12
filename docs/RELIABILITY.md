# Reliability

> Reliability and operability expectations. **Frame only** — make these concrete (with
> numbers) once a service exists, so they become verifiable prompts the agent can check
> against observability data.

## Targets (template — replace with real SLOs)
- Service startup completes within _N_ ms.
- No span in the core user journeys exceeds _N_ s.
- Error rate for critical endpoints stays below _N_%.

## Why concrete numbers matter
With a per-worktree observability stack (logs via LogQL, metrics via PromQL — see the
`observe` skill), targets like "startup under 800ms" or "no core-journey span over 2s"
become **directly checkable** by the agent during verification, not aspirational prose.

## Operability
- Structured logging everywhere; every critical path emits metrics/traces.
- Failures are diagnosable from traces alone (see failure-attribution protocol).
