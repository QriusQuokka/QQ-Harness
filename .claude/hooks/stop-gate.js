#!/usr/bin/env node
// stop-gate.js — Stop hook — cross-cutting concerns B & C: trace/evidence + verification
//
// Cross-platform (Node.js) so it runs identically on Windows, macOS, and Linux.
//
// FRAME ONLY. Fires when the agent finishes responding. Its job is to nudge the agent toward
// requirement-level verification and trace/evidence discipline before considering work done.
//
// Contract: exit 0 = allow stop. Printing JSON { "decision": "block", "reason": "..." } on
// stdout forces the agent to continue with the given reason. Keep this advisory
// (non-blocking) for now so it never traps the loop; tighten once the verification protocol
// is in active use.

'use strict';
const fs = require('fs');

try { fs.readFileSync(0, 'utf8'); } catch { /* ignore */ }

// --- When ready to enforce, emit something like: ---
//   const fsx = require('fs');
//   if (!fsx.existsSync('harness/eval/episodes/<id>/verification-report.md')) {
//     process.stdout.write(JSON.stringify({
//       decision: 'block',
//       reason: 'No verification report found. Complete harness/33_verification-protocol.md ' +
//               '(reproduce->attribute->fix->verify->report) before stopping.',
//     }));
//   }

process.exit(0);
