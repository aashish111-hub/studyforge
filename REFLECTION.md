# Reflection

**What was hardest, and why:**
Getting the AI's output to be trustworthy enough to render directly as UI components, rather than just displaying it as text in a chat bubble. Asking a model for "JSON only" does not guarantee valid JSON — it can still wrap the response in a code fence or omit a field. The real work was not the prompt itself; it was `parseAndValidate`: deciding exactly what "malformed" means for this data, including empty arrays, missing keys, and an out-of-range `correctIndex`. The goal was to fail clearly and specifically instead of allowing a bad response to crash the page with something like `undefined.map()`.

**What I'd do differently next time:**
I'd write the validation function and its tests *before* wiring up the real API call, rather than doing it afterward. Building the happy path first meant I only identified edge cases such as fenced JSON and missing fields by thinking about them afterward instead of designing for them from the beginning.

**One thing that surprised me:**
How much of "AI integration" is actually ordinary defensive programming once you accept that model output cannot be trusted blindly. The Groq API call itself is only a handful of lines; much of the code in `generate.ts` exists to check and validate the model's answer rather than simply produce one.

**What I learned from shipping it:**
Getting an AI feature to work locally is only part of building a product. I also had to handle errors, validate AI output, write tests, check accessibility, measure performance, configure the production API key securely, deploy the application, and document a rollback process. The final product is more reliable because the AI is treated as an external system whose output needs to be checked before the UI depends on it.
