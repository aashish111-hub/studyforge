# StudyForge

Paste raw notes or lecture text, get structured flashcards and a quiz to
study from. Built for the Frontend AI Engineering capstone ("Ship It").

**Who it's for:** students who have messy notes and want them turned into
something testable, without manually writing flashcards by hand.

## Live app

_[add your Vercel/Netlify URL here after deploying]_

## Setup & run

```
npm install
cp .env.example .env.local   # add your GROQ_API_KEY
npm run dev
```

Open http://localhost:3000. Get a free API key (no credit card required)
at console.groq.com.

## Architecture

- **Next.js App Router**, Server Components by default, Client Components
  only where interactive: `NavBar` (active-route highlight), `NoteInputForm`
  (textarea + submit), `GenerateClient` (fetches + renders AI output).
- **`/api/generate`** (route handler) — receives raw notes, calls
  `generateStudyMaterial` (`src/lib/generate.ts`), returns a typed
  `{ ok: true, data } | { ok: false, error }` shape. The client never has
  to guess whether a response succeeded.
- **`/api/health`** — trivial JSON health check, rendered server-side on
  `/health` to prove server-to-server fetches work.
- **State handoff**: notes are passed from `/` to `/generate` via
  `sessionStorage` rather than a URL query param, keeping the URL clean
  and avoiding a length limit on pasted notes.

## AI integration

`src/lib/generate.ts` calls Groq's free API (`openai/gpt-oss-120b`,
OpenAI-compatible endpoint, no credit card required) with the user's notes
and asks for **strict JSON only** — 5–8 flashcards and 3–5 multiple-choice
quiz questions. This isn't a chatbot: the only output users see is the
structured study material itself.

**Why Groq instead of the Claude API:** same architecture works with
either — `generateStudyMaterial` is the only function that would need to
change providers. Groq was chosen here specifically for a free tier with
no billing setup required, so the app is runnable by anyone without cost.

**Why this prompt shape:** forcing JSON output (rather than freeform text)
means the UI can render real flashcard/quiz components instead of a wall
of markdown, and makes the response mechanically checkable before it's
trusted (see Resilience below).

## Resilience & error handling

`parseAndValidate` (in `generate.ts`, unit-tested in `generate.test.ts`)
checks the model's response before anything downstream touches it:
- Strips a markdown code fence if the model adds one anyway.
- Rejects invalid JSON, missing `flashcards`/`quiz` fields, malformed
  cards (missing question/answer), and quiz questions with an
  out-of-range `correctIndex`.
- Any failure throws with a specific message, which `/api/generate`
  catches and returns as `{ ok: false, error }` — never a raw stack trace
  or an unhandled promise rejection.
- The client (`GenerateClient`) shows a loading state, a clear error
  state with a **Try again** button, and a distinct "no notes found"
  state if `/generate` is reached directly without going through the form.
- `src/app/error.tsx` is a route-level error boundary for anything that
  still slips through.

## Testing

```
npm test           # vitest run
npm test -- --coverage
```

7 unit tests cover the validation logic in `generate.ts` (valid input,
fenced JSON, invalid JSON, missing fields, malformed flashcard, malformed
quiz question, empty array) — the actual resilience logic, not just a
smoke test. Coverage: ~55% statements on `generate.ts` (the untested
branch is the live Anthropic API call itself, which needs a real key to
exercise — see Known limitations).

## Accessibility

- All interactive elements are real `<button>`/`<input>`/`<textarea>`
  elements — no clickable `<div>`s.
- Form errors use `aria-invalid` + `aria-describedby` + `role="alert"`.
- Loading state uses `aria-live="polite"` so screen readers announce it.
- Visible focus rings on all buttons/inputs (`focus-visible` styles).
- Run your own Lighthouse/axe pass after deploying — see checklist below.

## Known limitations & future improvements

- No persistence — generated sets aren't saved (`/history` is still a
  placeholder). Would add a database or at least localStorage next.
- No rate limiting on `/api/generate` — a public deploy should add this
  before real traffic.
- Model can still occasionally produce a validation failure on unusual
  notes (e.g. very short input) — currently surfaced as a retryable error
  rather than auto-retried server-side.
- `/study` and `/quiz` don't yet consume real generated data — they're
  still FE-04 placeholders; wiring them to the same sessionStorage/API
  result is the next real step (see `Next_Case_Study_Process.md` in the
  portfolio repo for how that gets scheduled).
