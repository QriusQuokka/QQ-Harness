#!/usr/bin/env node
// new-episode.mjs — bootstrap an episode package directory (trace/evidence discipline)
//
// Cross-platform (Node.js ESM) so it runs identically on Windows, macOS, and Linux.
// Creates harness/eval/episodes/<task-id>/ pre-seeded with empty JSONL trace files and a
// verification-report stub, so the agent records evidence as it works rather than after.
//
// Usage: node scripts/new-episode.mjs <task-id>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const taskId = process.argv[2];
if (!taskId) {
  console.error('Usage: node scripts/new-episode.mjs <task-id>');
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);
const dir = path.join(root, 'harness', 'eval', 'episodes', taskId);
const traces = path.join(dir, 'traces');
fs.mkdirSync(traces, { recursive: true });

// Eight trace files (JSONL) — see harness/eval/trace-schemas.md
const traceNames = ['action', 'tool', 'context', 'verification', 'attribution', 'intervention', 'entropy', 'outcome'];
for (const t of traceNames) {
  const p = path.join(traces, `${t}.jsonl`);
  if (!fs.existsSync(p)) fs.writeFileSync(p, '');
}

// Verification report stub (kept; not git-ignored)
const report = path.join(dir, 'verification-report.md');
if (!fs.existsSync(report)) {
  fs.writeFileSync(report, `# Verification Report — ${taskId}\n\n> Fill in per harness/34_verification-report-template.md\n`);
}

console.log(`Episode scaffolded: harness/eval/episodes/${taskId}/`);
console.log(`  traces/: ${traceNames.join('.jsonl, ')}.jsonl`);
console.log('  verification-report.md (stub)');
console.log('Note: traces/ is git-ignored runtime data; the report + outcome are kept.');
