#!/usr/bin/env node
// init-template.mjs — turn a downloaded copy of this harness into a clean new project.
//
// Cross-platform (Node.js ESM). Run ONCE, right after you download/clone the harness into a
// new project folder:
//   node scripts/init-template.mjs
//
// It performs a clean-slate reset:
//   1. Removes the illustrative example episode (harness/eval/episodes/example-T1/).
//   2. Clears seeded demo state (the example row in the tech-debt tracker).
//   3. Trims the one doc line that pointed at the example.
//   4. Starts version control: git init + first commit (skipped if already a git repo).
// Identity placeholders you still fill in by hand are listed at the end.
//
// Safe to re-run: each step is guarded and becomes a no-op once already applied.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);            // repo root (scripts/ is one level down)
const done = [];
const todo = [];

// 1) Remove the illustrative example episode
const example = path.join(root, 'harness', 'eval', 'episodes', 'example-T1');
if (fs.existsSync(example)) {
  fs.rmSync(example, { recursive: true, force: true });
  done.push('Removed example episode: harness/eval/episodes/example-T1/');
}

// 2) Clear the demo row in the tech-debt tracker
const debt = path.join(root, 'docs', 'exec-plans', 'tech-debt-tracker.md');
if (fs.existsSync(debt)) {
  const lines = fs.readFileSync(debt, 'utf8').split(/\r?\n/);
  const kept = lines.filter((l) => !/^\|\s*_D-001_/.test(l));
  if (kept.length !== lines.length) {
    fs.writeFileSync(debt, kept.join('\n'));
    done.push('Cleared the example debt row in docs/exec-plans/tech-debt-tracker.md');
  }
}

// 3) Trim the single doc line that referenced the example
const ts = path.join(root, 'harness', 'eval', 'trace-schemas.md');
if (fs.existsSync(ts)) {
  const lines = fs.readFileSync(ts, 'utf8').split(/\r?\n/);
  const kept = lines.filter((l) => !l.includes('eval/episodes/example-T1/'));
  if (kept.length !== lines.length) {
    fs.writeFileSync(ts, kept.join('\n'));
    done.push('Removed the example reference in harness/eval/trace-schemas.md');
  }
}

// 4) Start version control
function run(args, opts = {}) {
  return execFileSync('git', args, { cwd: root, stdio: 'ignore', ...opts });
}
let gitAvailable = true;
try { execFileSync('git', ['--version'], { stdio: 'ignore' }); } catch { gitAvailable = false; }

if (!gitAvailable) {
  todo.push('Git not found. Install Git, then: git init && git add -A && git commit -m "Initial commit"');
} else {
  let alreadyRepo = false;
  try { run(['rev-parse', '--is-inside-work-tree']); alreadyRepo = true; } catch { alreadyRepo = false; }
  if (alreadyRepo) {
    done.push('Git repository already present — history left untouched');
    // A `git clone` of the template carries an origin remote pointing back at the template.
    let origin = '';
    try {
      origin = String(execFileSync('git', ['remote', 'get-url', 'origin'], { cwd: root })).trim();
    } catch { /* no origin configured */ }
    if (origin) {
      todo.push(
        `This repo's "origin" points at ${origin} (likely the template, not yours).\n` +
        '      To make it your own, remove or repoint it:\n' +
        '      git remote remove origin   # then: git remote add origin <your-repo-url>'
      );
    }
  } else {
    run(['init']);
    run(['add', '-A']);
    try {
      run(['commit', '-m', 'Initial commit from Claude Code Harness template']);
      done.push('Initialized git and created the first commit');
    } catch {
      todo.push('git commit failed (no identity configured). Set it, then commit:\n      git config user.email "you@example.com" && git config user.name "Your Name"\n      git add -A && git commit -m "Initial commit"');
    }
  }
}

// Identity placeholders that require a human
todo.push('Fill <COPYRIGHT HOLDER> in LICENSE with your name or organization');
todo.push('Replace <owner>/<repo> in README.md and README.en.md with your repository address (if you publish)');

// --- Report ---
console.log('init-template complete.\n');
if (done.length) {
  console.log('Done:');
  for (const d of done) console.log('  - ' + d);
}
if (todo.length) {
  console.log('\nStill to do (by hand):');
  for (const t of todo) console.log('  - ' + t);
}
console.log('\nNext: restart Claude Code so the guardrails load, then start with /spec or /plan.');
