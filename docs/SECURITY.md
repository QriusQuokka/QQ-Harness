# Security — Golden Rules

**Read this before any external-facing or destructive action.** Security is a cross-cutting
concern (A) that applies at every stage of the lifecycle loop, from spec to ship.

Enforcement is layered:
1. `.gitignore` — secrets never enter version control.
2. `.claude/settings.json` `deny`/`ask` — permission boundary on tools.
3. `.claude/hooks/block-secrets.js` — runtime guard (PreToolUse, cross-platform Node),
   verified by test cases.
4. These golden rules — judgment for cases tooling can't fully capture.

## Secrets
- **Never** read, edit, print, or commit secret files: `.env*` (except `.env.example`),
  `*.pem`, `*.key`, `*.p12`/`*.pfx`, `*.keystore`, `id_rsa*`, `id_ed25519*`, `secrets/**`,
  `service-account*.json`, `gcp-*.json`, `credentials.json`, `.ssh/`, `.aws/credentials`.
  (`.crt`/`.cer` are normally *public* certificates and are not blocked — protect the matching
  private `.key`/`.pem` instead.)
- Commit **only** `.env.example` with placeholder values and a comment per variable.
- If a secret is needed at runtime, read it from the environment — never inline it in code,
  logs, error messages, test fixtures, or docs.
- If you discover a committed secret: stop, flag it to a human, treat it as compromised
  (rotate). Do not attempt history rewrite yourself (it's an irreversible, human-authorized op).

## Destructive / irreversible actions (blocked or escalated)
- `rm -rf`, `git push --force` (use `--force-with-lease`), `git reset --hard`,
  `git filter-branch`/`filter-repo`, `mkfs`, `dd if=`, fork bombs → blocked by the hook.
- Prefer reversible alternatives. When a destructive action is genuinely required, escalate
  to a human with the reason — don't route around the guard.

## Supply chain
- Dependency installs/additions are behind an `ask` gate. Prefer **boring, internalizable**
  dependencies (see golden-rules #1, #3). Justify each new dependency: why it, why not
  in-repo, what its blast radius is.
- Never pull unvetted scripts piped to a shell (`curl … | sh`). `curl`/`wget` are gated.

## External transmission
- Sending content to an external service publishes it (may be cached/indexed even if later
  deleted). `WebFetch`, `WebSearch`, `git push`, `curl`, `wget` are `ask`-gated. Confirm
  intent first.

## Input handling (when code exists)
- Parse and validate untrusted input at the boundary into typed shapes. No "YOLO-style"
  exploration of unvalidated data. Errors must not leak secrets or internal detail.

## Escalation
When an action requires judgment beyond these rules, escalate to a human and **log it** in
`harness/42_intervention-log.md` as a missing-harness signal — then consider whether a new
guardrail should be added so the next run doesn't need a human.
