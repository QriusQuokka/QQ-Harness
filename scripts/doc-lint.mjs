#!/usr/bin/env node
// doc-lint.mjs — deterministic documentation validator (cross-cutting concern: doc integrity)
//
// Cross-platform (Node.js ESM) so it runs identically on Windows, macOS, and Linux.
// Mechanically enforces what the doc-gardener agent does by judgment:
//   1. No broken local markdown links (every [text](path) target that is a local file exists).
//   2. Map discipline: CLAUDE.md stays a table of contents (~100 lines; hard cap 150).
//
// Contract: exit 0 = clean; exit 1 = violations found (suitable for CI). Reads no stdin.
// Usage: node scripts/doc-lint.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);            // repo root (scripts/ is one level down)
const problems = [];
const EXCLUDE = /[\\/](Reference|node_modules|\.git)[\\/]/;

// --- collect markdown files (excluding vendored/reference trees) ---
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (EXCLUDE.test(full + path.sep)) continue;
      walk(full, acc);
    } else if (e.isFile() && /\.md$/i.test(e.name) && !EXCLUDE.test(full)) {
      acc.push(full);
    }
  }
  return acc;
}

const mdFiles = walk(root);
const linkRx = /\[[^\]]*\]\(([^)]+)\)/g;

// --- 1) Broken local markdown links ---
for (const f of mdFiles) {
  const dir = path.dirname(f);
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    linkRx.lastIndex = 0;
    let m;
    while ((m = linkRx.exec(line)) !== null) {
      let target = m[1].trim().replace(/^</, '').replace(/>$/, '');
      if (/^(https?:|mailto:|#)/.test(target)) continue;   // external / anchor-only
      target = target.split('#')[0];                        // strip section anchor
      if (!target.trim()) continue;
      if (!fs.existsSync(path.join(dir, target))) {
        problems.push(`BROKEN LINK  ${path.relative(root, f)} : ${idx + 1}  ->  ${target}`);
      }
    }
  });
}

// --- 2) Map discipline: CLAUDE.md size ---
const claude = path.join(root, 'CLAUDE.md');
if (fs.existsSync(claude)) {
  const lines = fs.readFileSync(claude, 'utf8').split(/\r?\n/);
  if (lines.length && lines[lines.length - 1] === '') lines.pop();   // match line-count of a trailing newline
  const n = lines.length;
  if (n > 150) problems.push(`MAP TOO LARGE  CLAUDE.md has ${n} lines (hard cap 150; target ~100)`);
  else if (n > 100) console.log(`  warn: CLAUDE.md has ${n} lines (target ~100; keep it a table of contents)`);
}

// --- Report ---
if (problems.length === 0) {
  console.log(`doc-lint: OK (${mdFiles.length} markdown files checked, 0 problems)`);
  process.exit(0);
} else {
  console.log(`doc-lint: ${problems.length} problem(s) found:\n`);
  problems.forEach((p) => console.log(`  ${p}`));
  process.exit(1);
}
