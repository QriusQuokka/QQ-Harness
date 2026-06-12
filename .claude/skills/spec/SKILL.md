---
name: spec
description: Loop stage 0 — turn a request or user feedback into a task interface with testable acceptance criteria. Use at the start of any non-trivial change before planning.
---

# spec — Specification & Acceptance Criteria

Produce the **task interface** (`harness/01_task-interface.md`) for the work.

## Steps
1. Read the relevant `docs/product-specs/` entry (or create one from the template).
2. Capture: objective, numbered **testable** requirements, constraints (what must be
   preserved), explicit non-goals, initial state.
3. Convert each requirement into an acceptance criterion → a deterministic check in
   `harness/30_deterministic-checks.md` (corrected behavior + preserved valid + preserved
   invalid).
4. Record the task interface (in the exec-plan or a task file).

## Done when
Every requirement has an expected observable output and a mapped check. This contract is what
the verification report (stage 5) will close against.
