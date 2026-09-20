# Reflection

**What was hardest, and why:** getting the AI's output to be trustworthy
enough to render directly as UI components, not just text in a chat
bubble. Asking a model for "JSON only" doesn't guarantee it — it can still
wrap the response in a code fence or drop a field. The real work wasn't
the prompt, it was `parseAndValidate`: deciding exactly what "malformed"
means for this data (empty arrays, missing keys, an out-of-range
`correctIndex`) and failing loudly and specifically instead of letting a
bad response crash the page with `undefined.map()`.

**What I'd do differently next time:** I'd write the validation function
and its tests *before* wiring up the real API call, not after. Building
the happy path first meant I only found the edge cases (fenced JSON,
missing fields) by thinking about them afterward instead of hitting them
naturally during development.

**One thing that surprised me:** how much of "AI integration" is actually
ordinary defensive programming once you accept the model's output can't
be trusted blindly. The Claude API call itself is a handful of lines;
almost all the code in `generate.ts` exists to check its answer, not to
produce one.
