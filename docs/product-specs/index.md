# Product Specs

What we're building, with **acceptance criteria** for each capability. Specs are the source
for the deterministic checks the verification stage binds to (loop stage 0 → stage 5).

## Catalog
- (none yet)

## Spec template
Copy into `product-specs/<feature>.md`:

```
# <Feature>

## Problem / user need

## Scope (and explicit non-goals)

## Requirements (numbered, testable)
1. <observable behavior, with expected output>
2. ...

## Acceptance criteria → deterministic checks
| Req | Check (command + expected substring) |
|-----|--------------------------------------|
| 1   | ...                                  |

## Open questions
```
