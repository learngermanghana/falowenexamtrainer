# Falowen A2 PDF — production proof and retail release gates

Branch: fix/a2-pdf-retail-preflight-20261025. This changes the **A2 print/export only**, never the live student assignment UI.

## Confirmed source and scope

- Source of course progress: shared/curriculumCanonical.json
- A2 manifest: scripts/course-material-bundles/buildLevelManifest.mjs A2
- Shared renderer: scripts/course-material-bundles/renderLevelBundleV2.mjs A2
- A2-specific Playwright print hygiene: a2PdfPrint.mjs
- Retail cover: a2RetailCover.mjs
- PDF validator: validateGeneratedBundle.mjs A2
- Public sample generator: prepareA2Sample.mjs

A2 curriculum runs Day 0–28. Orientation Day 0 is explicitly excluded from the printable book. Day 1–28 still require end-to-end validation against actual deployed lesson pages. Some A2 workbooks legitimately do not offer Teil 2 or Teil 4, so validate what is present in the on-page tab navigation; do not invent content to satisfy a fixed four-tab assumption.

## What changed for print

- Preserves multiple-choice buttons and all check/radio markers (the old generic print CSS hid every button).
- Hides web navigation, videos, active timers and AI practice widgets.
- Removes Firestore class-sharing boxes and personal drafts from the Playwright print DOM; empties selected form answers and replaces writing inputs with ruled answer lines.
- Adds explicit paper writing space when A2 Schreiben uses only an AI online workspace.
- Waits for a real, hydrated A2 section; handles topic-specific grammar titles through data-a2-focused-grammar instead of requiring a literal "Grammar" heading.
- Errors if a visible lesson tab cannot be opened; optional tabs absent from the lesson remain optional.
- Page scan detects loading/empty/error sheets and known privacy/UI leak phrases.
- Dedicated retail cover, clickable PDF section navigation and existing page footers.

## Minimal testing

On the pull request, the course-material bundle validation matrix runs the A2 manifest and a2PdfPrint.test.mjs (plus other levels' smoke tests). For an authenticated complete render, dispatch the existing "Course material bundle" workflow from the A2 PR ref with inputs: level=A2, build_pdf=true, press_preview=false.

The workflow then generates and validates the complete PDF on the private Actions runner and publishes only Falowen-A2-Free-Day1-Sample.pdf (actual Day 1 Grammar+Workbook). It does **not** upload the full book or proof to public GitHub artifacts. Failed A2 jobs can upload only render-diagnostics.json.

To build locally in an authorized offline environment:

    node scripts/course-material-bundles/buildLevelManifest.mjs A2
    node scripts/course-material-bundles/renderLevelBundleV2.mjs A2
    node scripts/course-material-bundles/validateGeneratedBundle.mjs A2
    node scripts/course-material-bundles/prepareA2Sample.mjs

Install repo PDF dependencies (playwright, pdf-lib, chromium, poppler-utils) and provide existing PDF authentication through protected environment variables. Never commit credentials. Run the validated PDF through pdfinfo and pdftoppm for page-by-page visual proof checking. Explicitly inspect Day 1 and at least Day 14, Day 21 and Day 28 (grammar, writing, reading, listening options, tables, page breaks and QR functionality). Any failures must be fixed and the sample regenerated from the corrected manuscript.

## Sales still OFF

A2 is **not a live Falowen Books product** yet. The PDF and sample are editorial/review candidates, not confirmed licensable retail assets. Do not put the full file in web/public, Vercel storage or public GitHub artifacts. Before sale:
- Clear every third-party image, audio and teaching content right.
- Remove earlier publicly accessible complete A2 PDF artifacts.
- Provide private R2 books-bucket storage and book-scoped signed download credentials.
- Verify any protected audio QR instructions and what book-only customers can use.
- Test real Paystack signed-webhook purchase and re-download end to end.
- Decide final page count and pricing after visual review; never assume A2 must have A1's 250 pages.

A1 Books PR #3161 is open separately and touches the same course-material workflow. Merge carefully to preserve the sample-only privacy gates for both A1 and A2. The Vercel preview deployments for Falowen remain disabled. Do not merge this A2 change until all CI and a full content proof are reviewed.
