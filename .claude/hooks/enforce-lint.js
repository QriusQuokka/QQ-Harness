#!/usr/bin/env node
// enforce-lint.js — PostToolUse(Edit|Write|NotebookEdit) — loop stage 3: quality/architecture
//
// Cross-platform (Node.js) so it runs identically on Windows, macOS, and Linux.
//
// FRAME ONLY. There is no product code or linter yet. When a stack is chosen, wire the
// project's linters + structural/architecture tests here so taste invariants are enforced
// mechanically on every edit (see ARCHITECTURE.md). Custom lint messages should inject the
// fix instruction back into agent context.
//
// Contract: exit 0 = clean. exit 2 = lint failure (stderr fed back to the agent to fix).
// Until linters exist this is a no-op so it never blocks the loop.

'use strict';
const fs = require('fs');

// Read payload; scope enforcement to CODE files only. Docs/markdown are validated separately
// by scripts/doc-lint.mjs — running a code linter on every doc edit would be noisy.
let raw = '';
try { raw = fs.readFileSync(0, 'utf8'); } catch { process.exit(0); }
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);  // strip a UTF-8 BOM if present
if (raw && raw.trim()) {
  try {
    const fp = String(JSON.parse(raw).tool_input.file_path || '');
    if (/\.(md|markdown|txt)$/i.test(fp) || /[\\/]docs[\\/]/i.test(fp)) process.exit(0);
    // When linters exist, gate on code extensions, e.g.:
    //   if (!/\.(ts|tsx|js|jsx|py|go|rs)$/.test(fp)) process.exit(0);
  } catch { /* fall through */ }
}

// --- Wire real enforcement below when code exists, e.g.: ---
//   const { execSync } = require('child_process');
//   try { execSync('npm run lint', { stdio: 'pipe' }); }
//   catch (e) { process.stderr.write(`[enforce-lint] ${e.stdout}\n`); process.exit(2); }

process.exit(0);
