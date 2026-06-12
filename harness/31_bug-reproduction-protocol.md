# Bug-Reproduction Protocol — H3 (verification step 1)

**Reproduce the failure before editing.** Observe the actual vs. expected output so the fix
targets a confirmed cause, not a guess.

## Protocol
1. Identify the smallest command/probe that should exhibit the bug.
2. Run it; capture the **observed** output verbatim.
3. State the **expected** output (from the requirement / deterministic check).
4. Confirm they differ. Record both in the reproduction log.
5. (UI/behavioral) capture a before-snapshot/recording where applicable (see observe skill).

## Reproduction log template
```
Probe:     <command>
Observed:  <verbatim output>
Expected:  <expected output / substring>
Confirmed: yes/no
```

Output feeds directly into attribution (`32_*`). Do not edit until reproduction is confirmed.
