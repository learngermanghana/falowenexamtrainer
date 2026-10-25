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


## Private localhost A2 editorial export (implemented October 25)

Use the branch-only manual GitHub workflow:
`.github/workflows/a2-editorial-readonly-proof.yml`

It starts the **current repository source** using a local Vite development server on `http://127.0.0.1:4173`. The PDF renderer activates `FALOWEN_A2_EDITORIAL_PRINT=true` only with that loopback URL and a private browser init-script flag. The A2 workbook accepts that flag only in Vite development mode on port 4173, so it cannot be activated by query strings, production builds, student accounts, public preview domains or normal browser navigation.

The workbook uses a presentational, read-only wrapper rather than `SharedTimedAssignment` in this isolated editor session. It preserves the original lesson's Grammar, Sprechen, Schreiben, Lesen and Hören sections, without starting a timer or unlocking a student's actual assignment. Submit/Ref navigation, live AI practice fields, and grading buttons cannot appear in the editorial view. The browser also blocks Firestore write/commit traffic while the PDF is produced. Normal Falowen pages still mount the original `SharedTimedAssignment`, use its locking rules, and maintain normal student status and scores.

**GitHub Actions prerequisites:** The PDF editorial test account already uses `FALOWEN_PDF_EMAIL` and `FALOWEN_PDF_PASSWORD` secrets. The local Vite app additionally requires these six **Firebase public client configuration values** to be saved under GitHub repository Settings → Secrets and variables → Actions, preferably in *Variables* (the workflow also accepts secrets with these names):

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

Copy the existing **client** settings from Falowen's approved Firebase/Vercel environment. **Never copy Firebase Admin service-account credentials, a Vercel API token, database admin keys, or Paystack secrets into the client variables.** The values above are client identifiers/configuration, not server secrets. When missing, the workflow fails before installing browser/runtime dependencies; see the initial preflight attempt: https://github.com/learngermanghana/falowenexamtrainer/actions/runs/40175342936.

After the six public client settings are available, rerun the private proof from the A2 branch (workflow can be retriggered by a change to its YAML file). Only the free Day 1 sample may be uploaded as an Actions artifact. No full book, personal saved work, Firestore data, authentication tokens, or private PDF must be published publicly. Review the complete page count, layout and navigation *within the trusted runner* before sale. The source content still needs a commercial rights review and book-only audio-access disclosure.

**No production merges/deployments were made as part of implementing this mode.**
