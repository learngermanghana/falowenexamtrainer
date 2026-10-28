# A2 PDF correction review — 28 October 2026

This branch is an **unapproved PDF correction draft**. Do not merge, deploy,
publish or replace a distributed book until the complete authenticated A2
build and editorial comparison below pass.

## Edition and source pipeline

The reported edition is `Falowen-A2-course-materials-pdf(1).zip`, containing
`Falowen-A2-Course-Materials.pdf` (356 pages, approximately 37.2 MB).
The public Actions page identifies a successful A2 dispatch on 28 October:
https://github.com/learngermanghana/falowenexamtrainer/actions/runs/40704827225
Its PDF artifact is named `Falowen-A2-course-materials-pdf` (17.5 MB compressed).
The original PDF bytes and page count have **not** been independently inspected:
the artifact requires authenticated access unavailable in this environment.

The full generator is `scripts/course-material-bundles/renderLevelBundleV2.mjs`.
Its manifest is built from `shared/curriculumCanonical.json`. A2 printable
companions use the canonical A2 writing, reading, listening and speaking data.

## Corrections

- Fix the missing JSX space producing Day 13's “wanted todo”, and clarify its
  explanation of past ability, obligation and intention. Apply the same exact
  text corrections in the export DOM so a proof can be built without first
  deploying the website.
- Print graded Schreiben, Lesen and Hören from public source fields only,
  even for unlocked tabs. Do not click or export account-specific graded tabs.
  Preserve grammar examples; exclude explicit answer-key disclosures.
- Remove whole private writing/speaking/class-sharing and teacher-only widgets;
  neutralize saved form values; restore the original print DOM afterwards.
  Fail the per-section and final-PDF privacy checks on known leak indicators.
  Keep A2 authentication state in memory and omit account-page text from errors.
- Restrict audio companion links to same-origin HTTPS A2 course routes for
  Days 1–28, without credentials, nonstandard ports or query tokens. Validate
  the corresponding link for every expected listening lesson in the final PDF.
- Reject incomplete question/option data and compare source companion text
  with actual extracted PDF text to catch clipped/truncated output. Fail if
  the actual speaking material is unavailable instead of substituting filler.
- Keep the blue Falowen headings and boxes; compact companion typography,
  keep question/option groups together, expand clipped print containers, open
  educational disclosures, and reject empty or unresolved-loading pages.

No A1/B1 content, A1 generator/helper, Paystack code, Firestore rules, payment
functionality, dependency manifest or lockfile is changed. Nothing is deployed.

## Validation and remaining release gates

Local checks passed:

- All 114 PDF-pipeline tests, including existing A1 regression tests.
- Nine A2 Day 13/content tests.
- Frontend Vite compilation passed (local output only; no deployment).
- A2 manifest: 28 printable days, no missing days or unresolved routes.
- Chromium rendered 80 source-based sections across all 28 days; source text
  was verified against extracted PDF text. All 24 printed listening QR codes
  were rasterized and decoded back to their expected lesson links.
- Offline companion proof: 115 pages (not the complete authenticated book).
  This proof omits the authenticated grammar and live speaking/mind-map pages
  except the separate source-only Day 22 companion.

The complete render command was attempted with system Chromium and failed at
Day 1 with `net::ERR_TUNNEL_CONNECTION_FAILED`. `www.falowen.app` and the
GitHub API are blocked by the environment's egress policy. No PDF login/session
variables are injected locally. Existing repository secrets should be reused by
the Actions workflow; do not copy credentials into files or the pull request.

Outstanding, required before merging:

1. Obtain the reported ZIP and inspect its 356 pages against the current A2
   course, particularly the exact exercise answers and remaining language errors.
2. Run **Course material bundle** on this branch with `level=A2`,
   `build_pdf=true`, `press_preview=false`, using its existing secure credentials.
   The job reads authenticated lessons but must not submit graded work.
3. Check all 28 grammar and workbook bundles, private-data redaction, worked
   examples versus graded keys, no clipped content and final pagination visually.
4. Open each authenticated listening lesson and verify the actual audio matches
   its questions. QR decoding verifies the destination, not audio availability,
   sound quality, licensing, or semantic correctness.
5. Confirm the full validator passes and the `Falowen-A2-course-materials-pdf`
   artifact uploads. Record its final page count, build result and artifact URL
   in the pull request. No complete replacement-book page count is available yet.

The new A2-only CI job uploads an explicitly named **offline companion proof**
for review; it must never be presented as the complete book or a paid product.
