#!/usr/bin/env node
// test-hooks.mjs — deterministic fixtures for the security guard .claude/hooks/block-secrets.js
//
// Cross-platform (Node.js ESM). Makes the "verified against fixtures" claim in
// docs/SECURITY.md and harness/40_permission-manifest.md reproducible by anyone.
//
// Each fixture pipes a PreToolUse payload to the hook and asserts the exit code:
//   exit 2 = BLOCKED, exit 0 = ALLOWED.
// Both directions matter: blocks must block, and normal commands must NOT be over-blocked.
//
// Contract: exit 0 = all fixtures pass; exit 1 = at least one failed (suitable for CI).
// Usage: node scripts/test-hooks.mjs

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const hook = path.join(here, '..', '.claude', 'hooks', 'block-secrets.js');

const BLOCK = 2;
const ALLOW = 0;

// [name, toolPayload, expectedExitCode, opts?]
// opts.episode === true sets HARNESS_EPISODE=1 for that fixture (simulates a graded run).
const cases = [
  // --- must BLOCK ---
  ['read .env (cat)',        { tool_name: 'Bash', tool_input: { command: 'cat .env' } }, BLOCK],
  ['read .env (grep)',       { tool_name: 'Bash', tool_input: { command: 'grep KEY .env' } }, BLOCK],
  ['read .env (findstr)',    { tool_name: 'PowerShell', tool_input: { command: 'findstr KEY .env' } }, BLOCK],
  ['read .env (awk)',        { tool_name: 'Bash', tool_input: { command: 'awk 1 .env' } }, BLOCK],
  ['read .env (Get-Content)',{ tool_name: 'PowerShell', tool_input: { command: 'Get-Content .env' } }, BLOCK],
  ['copy .env (cp)',         { tool_name: 'Bash', tool_input: { command: 'cp .env leak.txt' } }, BLOCK],
  ['copy .env (Copy-Item)',  { tool_name: 'PowerShell', tool_input: { command: 'Copy-Item .env x' } }, BLOCK],
  ['read credentials.json',  { tool_name: 'Bash', tool_input: { command: 'cat credentials.json' } }, BLOCK],
  ['read .aws/credentials',  { tool_name: 'PowerShell', tool_input: { command: 'gc .aws/credentials' } }, BLOCK],
  ['commit a key',           { tool_name: 'Bash', tool_input: { command: 'git add server.key && git commit -m x' } }, BLOCK],
  ['Read .env (file tool)',  { tool_name: 'Read', tool_input: { file_path: '.env' } }, BLOCK],
  ['Read secrets.json',      { tool_name: 'Read', tool_input: { file_path: 'config/secrets.json' } }, BLOCK],
  ['Read under secrets/',    { tool_name: 'Read', tool_input: { file_path: 'app/secrets/db.txt' } }, BLOCK],
  ['Read .keystore',         { tool_name: 'Read', tool_input: { file_path: 'a/release.keystore' } }, BLOCK],
  ['Grep glob over .env',    { tool_name: 'Grep', tool_input: { pattern: '.', glob: '**/.env' } }, BLOCK],
  ['rm -rf',                 { tool_name: 'Bash', tool_input: { command: 'rm -rf build/' } }, BLOCK],
  ['Remove-Item -R -Force',  { tool_name: 'PowerShell', tool_input: { command: 'Remove-Item -Recurse -Force C:\\tmp' } }, BLOCK],
  ['git push --force',       { tool_name: 'Bash', tool_input: { command: 'git push --force origin main' } }, BLOCK],
  ['git reset --hard',       { tool_name: 'Bash', tool_input: { command: 'git reset --hard HEAD~3' } }, BLOCK],
  ['read gcp key (cat)',     { tool_name: 'Bash', tool_input: { command: 'cat gcp-prod.json' } }, BLOCK],
  ['Read gcp key (file)',    { tool_name: 'Read', tool_input: { file_path: 'config/gcp-prod.json' } }, BLOCK],

  // --- R4: evaluator-pack blocked ONLY during a graded episode (HARNESS_EPISODE=1) ---
  ['episode: Read evaluator-pack', { tool_name: 'Read', tool_input: { file_path: 'harness/eval/evaluator-pack/template/expected-fix.md' } }, BLOCK, { episode: true }],
  ['episode: cat evaluator-pack',  { tool_name: 'Bash', tool_input: { command: 'cat harness/eval/evaluator-pack/template/expected-fix.md' } }, BLOCK, { episode: true }],
  ['episode: Grep evaluator-pack', { tool_name: 'Grep', tool_input: { pattern: '.', glob: '**/evaluator-pack/**' } }, BLOCK, { episode: true }],

  // --- must ALLOW (false-positive regression) ---
  ['maintainer: Read evaluator-pack', { tool_name: 'Read', tool_input: { file_path: 'harness/eval/evaluator-pack/template/expected-fix.md' } }, ALLOW],
  ['maintainer: cat evaluator-pack',  { tool_name: 'Bash', tool_input: { command: 'cat harness/eval/evaluator-pack/README.md' } }, ALLOW],
  ['npm run eval (word "eval")',      { tool_name: 'Bash', tool_input: { command: 'npm run eval' } }, ALLOW],
  ['read a public cert (.crt)',       { tool_name: 'Read', tool_input: { file_path: 'certs/server.crt' } }, ALLOW],
  ['search docs for word "credentials"', { tool_name: 'PowerShell', tool_input: { command: 'Select-String -Pattern credentials docs/SECURITY.md' } }, ALLOW],
  ['commit message mentions credentials', { tool_name: 'Bash', tool_input: { command: 'git commit -m rotate-credentials' } }, ALLOW],
  ['read a docs file named secrets.md',   { tool_name: 'Read', tool_input: { file_path: 'docs/secrets.md' } }, ALLOW],
  ['npm install',            { tool_name: 'Bash', tool_input: { command: 'npm install express' } }, ALLOW],
  ['copy a normal file',     { tool_name: 'PowerShell', tool_input: { command: 'Copy-Item report.md out/' } }, ALLOW],
  ['move a normal file',     { tool_name: 'Bash', tool_input: { command: 'mv a.txt b.txt' } }, ALLOW],
  ['read .env.example',      { tool_name: 'Read', tool_input: { file_path: '.env.example' } }, ALLOW],
  ['git push --force-with-lease', { tool_name: 'Bash', tool_input: { command: 'git push --force-with-lease' } }, ALLOW],
  ['Grep over source glob',  { tool_name: 'Grep', tool_input: { pattern: 'x', glob: '**/*.js' } }, ALLOW],
];

let pass = 0;
let fail = 0;
for (const [name, payload, expect, opts = {}] of cases) {
  let code = 0;
  const env = opts.episode ? { ...process.env, HARNESS_EPISODE: '1' } : process.env;
  try {
    execFileSync('node', [hook], { input: JSON.stringify(payload), stdio: ['pipe', 'ignore', 'ignore'], env });
  } catch (e) {
    code = typeof e.status === 'number' ? e.status : 1;
  }
  const ok = code === expect;
  ok ? pass++ : fail++;
  console.log(`${ok ? 'OK  ' : 'FAIL'}  ${name.padEnd(38)} exit=${code} expect=${expect}`);
}

console.log(`\nRESULT: pass=${pass} fail=${fail}`);
process.exit(fail ? 1 : 0);
