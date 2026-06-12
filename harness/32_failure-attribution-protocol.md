# Failure-Attribution Protocol (component 7) — H3 (verification step 2)

**Attribution before recovery (P4).** Separate observation, expectation, and diagnosis so a
failed observation produces a *classified diagnosis* before any new edit. Prevents random
patching and wrong-layer fixes.

## Failure taxonomy
- `Fcontext` — agent lacks/misuses relevant context
- `Ftool` — tool missing, unstable, or misused
- `Ffeedback` — feedback unavailable or uninterpretable
- `Fverify` — agent cannot prove requirements are satisfied
- `Frecovery` — agent cannot recover from a failure
- `Fentropy` — agent introduces maintenance burden
- `Fmodel` — model reasoning/coding failure despite adequate harness+environment
- `Funknown` — cannot be confidently attributed

## Attribution log template
```
Observed:       <output>
Expected:       <output>
Failure type:   <one of taxonomy>
Evidence:       <why this attribution>
Alternatives:   <other plausible explanations considered>
Targeted layer: <which architecture layer the fix belongs in>
Next diagnostic: <action if attribution is uncertain>
```

## Rule
The fix in step 3 must target the **attributed layer**. If verification (step 4) later shows
the diagnosis was wrong, re-attribute (back-edge) rather than patching blindly.
