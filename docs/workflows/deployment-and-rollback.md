# Falowen release verification and rollback guide

Reviewed: 2026-11-01.

## Release boundaries
- Learner UI and public Music: this repository, Vercel project for `www.falowen.app` and the `music.falowen.app` host routing.
- Learner backend: `functions/functionz/`, with its separate Firebase functions deployment paths.
- Admin: `learngermanghana/falowenadmin`, independent UI and Firebase service workflows.
- ChatGPT Learning Companion: a deployed backend does **not** imply OpenAI plugin approval or publication.

## Safe sequence
1. Inspect the current main branch and verify that the relevant feature tests exist.
2. Make a small PR. For documentation: `node scripts/checkAiDocumentation.mjs`. For task changes: `node scripts/generateAssessmentTaskRegistry.mjs --check`.
3. Read CI results for the **latest PR head commit**. Address failures rather than bypassing required checks.
4. Merge only when intended. Check the deployment SHA, status and actual live endpoint response before claiming success.
5. For affected cross-repo payloads (Admin marking, course records), validate learner and Admin deployments independently.

## Recovery
- A reverted UI commit does not necessarily revert Firestore data, MP3 uploads or published lyrics sidecars.
- For website failures, revert the offending PR through GitHub, run tests and verify the newly deployed revision. For Firebase migrations or security rules, use their dedicated deployment/rollback procedures with explicit authorization.
- Record the changed commit/PR and the observed user-facing impact in the changelog.
- Never store deploy tokens, private R2 credentials, OAuth secrets or demo-user credentials in these documents.

This guide is a **release checklist**, not a mechanism that automatically deploys or rolls back services.
