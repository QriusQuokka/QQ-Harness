# Permission Manifest (component 9) — cross-cutting concern A

Human-readable companion to `.claude/settings.json` + `.claude/hooks/block-secrets.js`.
Restricts risky actions and exposes approval gates so episodes stay safe. The settings file
is the machine-enforced source of truth; this explains intent.

The guard covers **both shell tools** (`Bash` and `PowerShell`), the file tools
(`Read`/`Edit`/`Write`/`NotebookEdit`), and `Grep`. The PreToolUse matcher is
`Bash|PowerShell|Grep|Read|Edit|Write|NotebookEdit`. The hook is written in **Node.js**
(`block-secrets.js`), a hard Claude Code prerequisite, so it runs identically on Windows,
macOS, and Linux without any extra install.

## Blocked (hard deny — settings `deny` + hook)
- Read/edit/write/commit of secret files: `.env*` (except `.env.example`), `*.pem`, `*.key`,
  `*.p12`/`*.pfx`, `*.keystore`, `id_rsa*`, `id_ed25519*`, `secrets/**`,
  `service-account*.json`, `gcp-*.json` (GCP service-account key, common nickname),
  `credentials.json`, `.ssh/`, `.aws/credentials`. (`.crt`/`.cer` are **not** blocked — they
  are normally *public* certificates; the secret is the matching `.key`/`.pem`.)
- Reading/printing or staging/committing secrets via shell — covers Bash readers
  (`cat`/`type`/`head`/`tail`/`strings`/`xxd`/...), search tools
  (`grep`/`egrep`/`rg`/`ag`/`findstr`/`awk`/`sed`/`jq`), **and** PowerShell readers
  (`Get-Content`/`gc`/`Select-String`/`Import-Csv`/`Format-Hex`).
- Copy/move that would launder a secret into a non-secret path
  (`cp`/`mv`/`rsync`/`Copy-Item`/`Move-Item`) — defeats a later unguarded read.
- `Grep` targeting a secret **path or `glob`** (content leak).
- Destructive/irreversible commands across Bash and PowerShell: `rm -rf`,
  `Remove-Item -Recurse -Force` (and aliases `ri`/`rm`/`rmdir`/`del`), `git push --force`
  (use `--force-with-lease`), `git reset --hard`, `git filter-branch`/`filter-repo`,
  `Clear-Content`/`Set-Content`/`Out-File` over a secret, `mkfs`, `dd if=`,
  `Format-Volume`/`Clear-Disk`, fork bombs.

## Gated (`ask` — requires approval)
- Dependency changes: `npm/pnpm/yarn install|add`, `pip install`, `uv add`, `cargo add`,
  `go get`, `Install-Module`, `Install-Package` (supply-chain review).
- External transmission: `git push`, `WebFetch`, `WebSearch`, `curl`, `wget`, and PowerShell
  `Invoke-WebRequest`/`Invoke-RestMethod`/`iwr`. (`git push` is also defended at *setup* time:
  `scripts/init-template.mjs` removes the template's `origin` remote from a fresh clone, so an
  approved-but-misdirected push can't land back in the template repo — runtime gate + setup
  removal are complementary.)

## Two-layer division of labor (`.env*`)
`settings.json` `deny` enumerates the common secret-bearing variants recursively
(`**/.env`, `**/.env.local|development|production|test|staging|dev|prod`) so the template
`.env.example` stays readable/editable at the settings layer (deny takes precedence over
allow, so a broad `**/.env.*` would wrongly block the template). The hook covers the
**long tail** of arbitrary `.env.<name>` via a negative-lookahead regex (`.env.*` except
`.env.example`). settings = coarse machine-enforced floor (always on); hook = exhaustive
pattern guard (loads at session start, fails open on unparsable input). Neither alone is
sufficient; together they are defense-in-depth.

## Evaluator-pack (R4) — episode-scoped, not a global lock
`harness/eval/evaluator-pack/` is the hidden answer key. It is **not** in the settings `deny`
list, because that would also block harness maintainers from inspecting it. Instead R4 is
enforced primarily **by separation** (the pack is never copied into a graded episode's
worktree — see `43_reproducibility-worktree.md`), with a backstop in `block-secrets.js`: when
the episode runner sets `HARNESS_EPISODE=1`, any read/grep/shell access to an `evaluator-pack/`
path is denied. With the flag unset (canonical repo / maintenance), access is allowed.

## Residual / out of scope
- MCP remote-execution tools (e.g. `mcp__ssh-oracle__exec`/`sudo-exec`) run on remote hosts
  and are **not** covered by this local guard — govern them by separate policy/credentials.

## Allowed
- Everything else (read/edit non-secret files, run registered tools/tests, local git).

## Maintenance
When a new risky action class appears, add it to `settings.json` (and the hook if it needs
pattern matching), then document it here. Add a fixture and keep the suite green:
`node scripts/test-hooks.mjs` (asserts both that blocks block *and* that normal commands are
not over-blocked).
