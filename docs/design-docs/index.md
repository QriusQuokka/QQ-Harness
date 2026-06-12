# Design Docs

Indexed, categorized design knowledge. These define operating principles and validated
beliefs for the codebase. Keep entries short and cross-linked; link out to deeper docs
rather than inlining everything.

## Catalog
- [core-beliefs.md](core-beliefs.md) — the five harness design principles, expanded into an
  agent-first operating model. **Start here.**
- [golden-rules.md](golden-rules.md) — taste invariants that keep the codebase readable and
  consistent; promoted into linters/code over time.

## Adding a design doc
1. One belief/principle per file; give it a clear title and a "Why" section.
2. Mark its **validation status** (proposed / validated / enforced-in-code).
3. Cross-link related docs and the `harness/` artifact that enforces it, if any.
