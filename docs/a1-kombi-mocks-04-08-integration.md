# Falowen A1 Kombiprüfung Mocks 4–8 — QA and release

## Source mapping (verified)
- Mock 4 ← uploaded PDF Test 1; Mock 5 ← Test 2; Mock 6 ← Test 3;
  Mock 7 ← Test 4; Mock 8 ← Test 5.
- Fifteen reading tasks per mock, five writing-form fields, one email task,
  and three A1 speaking parts. Hören is absent from every PDF.
- PDFs themselves are not hosted by the PR. Student-facing reading text excludes
  the answer-key pages; confidential keys are in `functions/functionz` only.

## Implemented in this PR
- Five A1 Kombiprüfung catalog entries, dedicated learner routes and timed
  Lesen (25 min) → Schreiben (15 min) → Sprechen (15 min) flow.
- Reuses A1 AI writing and speaking endpoints with canonical per-mock tasks and
  server-only form/reading answer keys.
- Persisted version `three-module-v1`; backend pins scored sections to
  Lesen, Schreiben and Sprechen, excluding Hören.
- Server computes /75 raw points plus percent /100, without trusting
  browser-supplied scores; writing/speaking must have verified receipts.
- Results and student notification use three-element breakdown, labels,
  original attempt identity and correct Mock 4–8 routes.
- A completed /75 result remains an independent historical attempt when a
  future Hören-enabled version is introduced.
- Reading answer keys are returned only after server-confirmed completion.
- Resume and review gating handle three-module attempts and pending AI marking.
- Unit/regression tests cover each answer key, form, /75 score, review and
  source/public answer-key separation.

## Remaining release checks
- [ ] The latest PR commit passes **all** required GitHub Actions, including Web checks.
- [ ] Run authenticated end-to-end student flow for each of Mocks 4–8:
  start → Lesen → Schreiben → Sprechen → verified save → Results → Admin Timed Attempts.
- [ ] Test timeout auto-submit, reload/resume, quota/AI failure/retry and completed retake.
- [ ] Confirm the PDFs' rights and avoid suggesting Falowen is an official Goethe-Institut exam.
- [ ] Once these pass, mark the currently preview-status Kombiprüfung cards
  production-ready, merge the PR, and verify frontend/backend deployments.

**Do not merge this draft PR as a production release until the remaining checks pass.**
