# Deployment Checklist

## Pre-deployment

* [x] `GROQ_API_KEY` set in Vercel project environment variables and not committed to the repository
* [x] `npm install` completes successfully
* [x] `npm test` passes locally: 7/7 tests passed
* [x] Test coverage recorded: 51.21% statements, 71.05% branches, 33.33% functions, 52.5% lines
* [x] Production build/deployment completed successfully on Vercel
* [x] Live home → generate flow tested with a real API key
* [x] Live AI generation tested successfully
* [x] Mobile-width layout checked
* [x] Lighthouse run against the live URL
* [x] WAVE accessibility audit run against the live URL

## Production evidence

**Live URL:** https://studyforge-5trd.vercel.app

### Lighthouse

* Performance: 98
* Accessibility: 92
* Best Practices: 100
* SEO: 100

### WAVE

* Errors: 0
* Contrast Errors: 0
* ARIA: 0
* AIM Score: 10/10
* Alerts: 1 — redundant link

The WAVE audit reported no errors or contrast errors. The single alert is documented rather than treated as an error.

## Error handling

* [x] API key is stored as a server-side environment variable
* [x] Invalid or malformed AI JSON is validated before use
* [x] API failures are returned as structured errors
* [x] Client displays a loading state
* [x] Client displays a retryable error state
* [x] Route-level error boundary is present

## Rollback plan

StudyForge uses Vercel with deployments connected to the `main` branch.

If a production deployment introduces a problem:

1. Identify the bad commit/deployment.
2. Revert the bad commit on `main` and push the revert.
3. Vercel automatically creates a new deployment from the updated `main` branch.

Alternatively, use the Vercel dashboard to promote the previous successful deployment back to production.

No custom infrastructure is required for rollback.

## Monitoring

No dedicated monitoring service is configured yet.

Server-side errors from `/api/generate` are logged with `console.error` and can be reviewed in Vercel function logs. Manual checks of the live application are currently used after deployments.

## Documentation check

* [x] README contains setup and run instructions
* [x] README documents the AI integration
* [x] README documents resilience and error handling
* [x] README documents testing
* [x] README documents accessibility
* [x] README documents known limitations
* [x] README includes the live deployment URL
* [x] README records final Lighthouse and WAVE evidence
