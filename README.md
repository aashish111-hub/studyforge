# StudyForge

Paste raw notes or lecture text and get structured flashcards and a quiz to study from. Built for the Frontend AI Engineering capstone, **"Ship It — Your First Production AI Product."**

**Who it's for:** Students who have messy notes and want them turned into something testable without manually writing flashcards by hand.

## Live app

**https://studyforge-5trd.vercel.app**

## Setup & run

```bash
npm install
npm run dev
```

Create a `.env.local` file and add:

```env
GROQ_API_KEY=your_groq_api_key
```

Then open:

```text
http://localhost:3000
```

The API key is used server-side and must not be committed to the repository.

## Architecture

* **Next.js App Router**, using Server Components by default and Client Components only where interaction is required.
* **`/api/generate`** — receives raw notes, calls `generateStudyMaterial` from `src/lib/generate.ts`, and returns a typed success/error response.
* **`/api/health`** — provides a simple JSON health check.
* **State handoff** — notes are passed from `/` to `/generate` through `sessionStorage` instead of a URL query parameter, keeping the URL clean and avoiding query-string length limits.

### Main client components

* `NavBar` — active-route highlighting.
* `NoteInputForm` — accepts notes and submits them for generation.
* `GenerateClient` — handles the generation request and renders the generated study material.

## AI integration

`src/lib/generate.ts` calls the **Groq API** using the `openai/gpt-oss-120b` model.

The application sends the user's notes and requests **strict JSON output** containing:

* 5–8 flashcards
* 3–5 multiple-choice quiz questions

This is not a general chatbot. The AI output is structured specifically for the study workflow.

### Why Groq?

Groq was chosen because the application can be run without setting up paid Anthropic API billing. The provider-specific logic is isolated in `generateStudyMaterial`, so the rest of the application does not depend directly on the AI provider.

### Why structured JSON?

Structured JSON allows the frontend to render real flashcard and quiz components instead of displaying unstructured model text. The response is validated before it is used by the application.

## Resilience & error handling

`parseAndValidate` in `src/lib/generate.ts` validates the AI response before it reaches the UI.

It:

* Strips a markdown code fence if the model adds one.
* Rejects invalid JSON.
* Rejects missing `flashcards` or `quiz` fields.
* Rejects malformed flashcards.
* Rejects quiz questions with an invalid `correctIndex`.
* Rejects empty flashcard arrays.

API failures are caught by `/api/generate` and returned as structured errors instead of exposing raw stack traces.

The client provides:

* A loading state.
* A clear error state.
* A **Try again** action.
* A "no notes found" state when `/generate` is accessed directly without submitted notes.

`src/app/error.tsx` provides a route-level error boundary for unexpected errors.

## Testing

Tests use **Vitest**.

Run:

```bash
npm test
```

Run with coverage:

```bash
npm test -- --coverage
```

### Final test result

* Test files: **1 passed**
* Tests: **7 passed / 7**
* Statement coverage: **51.21%**
* Branch coverage: **71.05%**
* Function coverage: **33.33%**
* Line coverage: **52.5%**

The tests focus on the validation and resilience logic in `generate.ts`, including valid JSON, fenced JSON, invalid JSON, missing fields, malformed flashcards, malformed quiz questions, and empty arrays.

## Accessibility

StudyForge uses semantic interactive elements and accessible feedback states.

* Interactive controls use real HTML buttons, inputs, and textareas.
* Form errors use `aria-invalid`, `aria-describedby`, and `role="alert"`.
* Loading feedback uses `aria-live="polite"`.
* Interactive controls have visible focus styles.

### Lighthouse

The production application was tested against the live deployment.

| Category       |   Score |
| -------------- | ------: |
| Performance    |  **98** |
| Accessibility  |  **92** |
| Best Practices | **100** |
| SEO            | **100** |

### WAVE

The live application was also checked with WAVE.

* Errors: **0**
* Contrast Errors: **0**
* ARIA Errors: **0**
* AIM Score: **10/10**
* Alerts: **1 — redundant link**

WAVE reported no errors or contrast errors. The redundant-link alert is documented as an alert rather than an accessibility error.

## Deployment

StudyForge is deployed on **Vercel**.

**Production URL:**

https://studyforge-5trd.vercel.app

The production environment contains `GROQ_API_KEY` as a Vercel environment variable. The secret is not committed to the repository.

Deployment and rollback procedures are documented in:

`DEPLOYMENT_CHECKLIST.md`

## Known limitations & future improvements

* No persistence — generated study sets are not currently saved.
* No rate limiting on `/api/generate` — a public application should add rate limiting before handling significant real-world traffic.
* The model can occasionally produce a validation failure for unusual or very short notes. This is currently surfaced as a retryable error.
* `/study` and `/quiz` remain limited compared with the main generation flow and could be connected to generated data in a future iteration.
* No dedicated uptime monitoring service is configured yet.

## Project status

StudyForge is a deployed, functional AI study application with:

* A production AI generation flow.
* Structured and validated AI output.
* Loading and error handling.
* Automated tests.
* Test coverage above the required 50% threshold.
* Accessibility testing.
* Lighthouse performance testing.
* A documented deployment and rollback process.
