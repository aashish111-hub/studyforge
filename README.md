# StudyForge

Paste raw notes or lecture text, get structured flashcards and quiz
questions to study from. Built as a capstone project for the Frontend AI
Engineering track.

**Status:** FE-04 skeleton — routes and layout are scaffolded and deployed;
AI generation is not wired up yet (comes in a later assignment).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. Server Components by
default; Client Components only where interactivity is needed (`NavBar` for
active-route highlighting, `NoteInputForm` for the textarea + submit).

## Routes

| Route | Purpose | Status |
|---|---|---|
| `/` | Paste notes, kick off generation | Placeholder form (no backend yet) |
| `/generate` | Shows generated flashcards | Placeholder |
| `/study` | Flip-card review mode | Placeholder |
| `/quiz` | Multiple-choice quiz mode | Placeholder |
| `/history` | Past generated sets | Placeholder |
| `/health` | Health check — fetches `/api/health` and renders it | Live |

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000

## Environment variables

Copy `.env.example` to `.env.local`. `ANTHROPIC_API_KEY` is reserved for
the AI generation endpoint added in a later assignment — not used yet, so
the app runs with no env vars set.

## Deployment

Connected to Vercel via GitHub — every push to `main` gets a production
deploy, every PR/branch gets a preview URL.
