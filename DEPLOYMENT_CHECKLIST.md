# Deployment Checklist

- [ ] `ANTHROPIC_API_KEY` set in Vercel/Netlify project env vars (not committed to repo)
- [ ] `npm run build` passes locally with no errors before pushing
- [ ] `npm test` passes locally before pushing
- [ ] Preview deploy checked: home → generate flow works end to end with a real API key
- [ ] Error state checked manually: temporarily remove the API key locally, confirm `/generate` shows the error UI, not a crash
- [ ] Lighthouse run against the live URL (target ≥85, mobile included)
- [ ] axe/WAVE run against the live URL, no AA violations
- [ ] README reviewed by pretending to be a new dev: can you `npm install && npm run dev` from the README alone?

## Rollback plan

No custom infra — rollback is: revert the bad commit on `main` and push
(Vercel/Netlify auto-redeploys from `main`), or use the host's dashboard
to promote the previous successful deployment back to production.

## Monitoring

No dedicated monitoring service set up. Errors are logged server-side via
`console.error` in `/api/generate` (visible in Vercel/Netlify's function
logs). Manual spot-checks of the live URL after each deploy stand in for
automated uptime monitoring for now.
