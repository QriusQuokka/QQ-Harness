#!/usr/bin/env node
// block-secrets.js — PreToolUse guard (cross-cutting concern A: security & permissions)
//
// Cross-platform (Node.js) so the guard behaves identically on Windows, macOS, and Linux.
// Node is a hard prerequisite of Claude Code itself, so no extra install is required.
//
// Defense-in-depth alongside .claude/settings.json deny rules. Blocks:
//   1. Reading/editing/writing secret files (.env, keys, certs, secrets/ ...) via file tools
//   2. Grep over a secret path or glob (content leak)
//   3. Shell commands (Bash AND PowerShell) that read, copy, stage, or commit secrets
//   4. Destructive / irreversible shell commands (rm -rf, Remove-Item -Recurse -Force,
//      push --force, reset --hard, history rewrite, mkfs/dd/fork bomb)
//
// Contract: exit 0 = allow. exit 2 = BLOCK (stderr is shown to the agent as the reason).
// Input: PreToolUse JSON on stdin -> { tool_name, tool_input: { file_path | path | glob | command } }

'use strict';
const fs = require('fs');

function deny(reason) {
  process.stderr.write(`[block-secrets] BLOCKED: ${reason}\n`);
  process.exit(2);
}

// --- Read hook payload from stdin (fail open on empty/unparsable input) ---
let raw = '';
try { raw = fs.readFileSync(0, 'utf8'); } catch { process.exit(0); }
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);  // strip a UTF-8 BOM if present
if (!raw || !raw.trim()) process.exit(0);

let data;
try { data = JSON.parse(raw); } catch { process.exit(0); }

const tool = String(data.tool_name || '');
const input = data.tool_input || {};

// --- R4: evaluator-pack is hidden from the agent ONLY during a graded episode ---
// Primary enforcement is by separation (the pack is not copied into the episode worktree;
// see harness/43_reproducibility-worktree.md). This is a belt-and-suspenders backstop: the
// episode runner sets HARNESS_EPISODE=1, and only then does the guard block any access to
// eval/evaluator-pack/. With no flag set (normal maintenance), the maintainer reads it freely.
const episodeActive = (() => {
  const v = process.env.HARNESS_EPISODE;
  return !!v && v !== '0' && v.toLowerCase() !== 'false';
})();
const evaluatorPackRe = /(^|[\\/])evaluator-pack[\\/]/i;  // the distinctive dir name, any parent

// --- Secret file path patterns (allow .env.example explicitly) ---
const secretPatterns = [
  /(^|[\\/])\.env$/i,
  /(^|[\\/])\.env\.(?!example$)[^\\/]+$/i,            // .env.* but NOT .env.example
  /\.(pem|key|p12|pfx|keystore)$/i,                  // .crt/.cer are usually PUBLIC certs, not secrets
  /(^|[\\/])id_rsa/i,
  /(^|[\\/])id_ed25519/i,
  /(^|[\\/])secrets?[\\/]/i,                          // a secrets/ directory
  /(^|[\\/])secrets?\.(json|ya?ml|env|txt|ini|conf|cfg|toml)$/i,  // secrets.json etc. (NOT secrets.md)
  /service-account.*\.json$/i,
  /(^|[\\/])gcp-[^\\/]*\.json$/i,                     // common nickname for a GCP service-account key
  /(^|[\\/])\.ssh[\\/]/i,
  /(^|[\\/])\.aws[\\/]credentials/i,
  /credentials\.json$/i,
  /\.(credentials|keystore)$/i,
];

function isSecretPath(p) {
  if (!p || !String(p).trim()) return false;
  const norm = String(p).replace(/\\/g, '/');
  if (/(^|\/)\.env\.example$/i.test(norm)) return false;   // always allow the template
  return secretPatterns.some((re) => re.test(norm));
}

// Secret tokens that may appear inside a shell command string. Path-shaped only: a bare
// English word like "credentials" must NOT match (it appears in docs/commit messages).
const secretTokens = /(\.env(\.|\b)|\.(pem|key|p12|pfx|keystore)\b|id_rsa|id_ed25519|secrets?[\\/]|credentials\.json\b|service-account[^\\/ ]*\.json\b|gcp-[^\\/ ]*\.json\b|\.ssh[\\/]|\.aws[\\/]credentials)/i;

// Shared shell-command inspection for Bash and PowerShell.
function inspectShellCommand(cmd) {
  if (!cmd || !String(cmd).trim()) return;

  // R4 backstop: during a graded episode, no shell access to the evaluator-pack at all.
  if (episodeActive && evaluatorPackRe.test(cmd)) {
    deny('evaluator-pack is hidden from the agent during a graded episode (R4). See harness/eval/visibility-matrix.md.');
  }

  const touchesSecret = secretTokens.test(cmd) && !/\.env\.example\b/i.test(cmd);

  // 1) Reading/printing secret files (Bash + PowerShell readers/aliases + search tools)
  const readers = /\b(cat|type|less|more|head|tail|bat|nl|strings|xxd|od|grep|egrep|fgrep|rg|ag|findstr|awk|sed|jq|Get-Content|gc|Select-String|sls|Import-Csv|Format-Hex)\b/i;
  if (touchesSecret && readers.test(cmd)) {
    deny('command appears to read a secret file. See docs/SECURITY.md.');
  }

  // 1b) Copy/move that launders a secret into a non-secret path (defeats later reads).
  // Canonical file-copy commands only — generic English words are omitted to avoid FPs.
  const copiers = /\b(cp|mv|rsync|Copy-Item|Move-Item|cpi|mi)\b/i;
  if (touchesSecret && copiers.test(cmd)) {
    deny('command appears to copy/move a secret file, which could launder it past the guard. See docs/SECURITY.md.');
  }

  // 2) Staging / committing secrets
  if (touchesSecret && /\bgit\s+(add|commit)\b/i.test(cmd)) {
    deny('command appears to stage/commit a secret. Only .env.example may be committed. See docs/SECURITY.md.');
  }

  // 3a) Destructive — POSIX rm -rf
  if (/\brm\s+-[a-zA-Z]*r[a-zA-Z]*f|\brm\s+-[a-zA-Z]*f[a-zA-Z]*r|\brm\s+-rf\b|\brm\s+-fr\b/i.test(cmd)) {
    deny("destructive 'rm -rf' detected. Remove specific paths deliberately, or ask a human.");
  }
  // 3b) Destructive — PowerShell Remove-Item -Recurse -Force (and aliases ri/rmdir/rd; the
  //     legacy del/erase aliases are matched too, though they rarely take -Recurse/-Force)
  if (/\b(Remove-Item|ri|rmdir|rd|del|erase)\b/i.test(cmd) && /-Recurse\b|-r\b/i.test(cmd) && /-Force\b|-fo\b/i.test(cmd)) {
    deny("destructive 'Remove-Item -Recurse -Force' detected. Remove specific paths deliberately, or ask a human.");
  }
  // 3c) Destructive — overwrite/clear a secret
  if (touchesSecret && /\b(Clear-Content|clc|Set-Content|sc|Out-File)\b/i.test(cmd)) {
    deny('command appears to overwrite/clear a secret file. See docs/SECURITY.md.');
  }

  // 4) git destructive / irreversible (shell-agnostic)
  if (/\bgit\s+push\b/i.test(cmd) && /(--force\b|(^|\s)-f\b)/.test(cmd) && !/--force-with-lease/i.test(cmd)) {
    deny("'git push --force' detected. Use --force-with-lease or escalate to a human (history rewrite is irreversible).");
  }
  if (/\bgit\s+reset\s+--hard\b/i.test(cmd)) {
    deny("'git reset --hard' detected. This discards work irreversibly; confirm intent with a human or use a safer reset.");
  }
  if (/\bgit\s+(filter-branch|filter-repo)\b/i.test(cmd)) {
    deny('git history rewrite detected. This is irreversible and must be human-authorized.');
  }

  // 5) Dangerous system commands (Bash + PowerShell)
  if (/:\(\)\s*\{|\bmkfs\b|\bdd\s+if=|>\s*\/dev\/sd|\bFormat-Volume\b|\bClear-Disk\b/i.test(cmd)) {
    deny('dangerous system command detected.');
  }
}

// --- File tools: check the target path ---
if (['Read', 'Edit', 'Write', 'NotebookEdit'].includes(tool)) {
  if (episodeActive && evaluatorPackRe.test(String(input.file_path || ''))) {
    deny(`evaluator-pack is hidden from the agent during a graded episode (R4) -> '${input.file_path}'. See harness/eval/visibility-matrix.md.`);
  }
  if (isSecretPath(input.file_path)) {
    deny(`secret file access via ${tool} -> '${input.file_path}'. Secrets must never be read/edited/committed. Use .env.example for templates. See docs/SECURITY.md.`);
  }
  process.exit(0);
}

// --- Grep: block searching a secret path or glob (content leak) ---
if (tool === 'Grep') {
  if (episodeActive && (evaluatorPackRe.test(String(input.path || '')) || evaluatorPackRe.test(String(input.glob || '')))) {
    deny('Grep targets the evaluator-pack, hidden from the agent during a graded episode (R4). See harness/eval/visibility-matrix.md.');
  }
  if (isSecretPath(input.path)) {
    deny(`Grep targets a secret path -> '${input.path}'. This could leak secret contents. See docs/SECURITY.md.`);
  }
  if (isSecretPath(input.glob)) {
    deny(`Grep glob targets a secret path -> '${input.glob}'. This could leak secret contents. See docs/SECURITY.md.`);
  }
  process.exit(0);
}

// --- Shell tools: inspect the command string ---
if (['Bash', 'PowerShell'].includes(tool)) {
  inspectShellCommand(String(input.command || ''));
  process.exit(0);
}

process.exit(0);
