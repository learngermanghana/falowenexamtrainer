# Falowen Course Book PDFs and Falowen Press

## Source of truth and separation

The existing **Course material bundle** GitHub Actions workflow owns PDF rendering, not Falowen Admin or Vercel functions. It authenticates to https://www.falowen.app using existing GitHub Actions repository secrets and uses Playwright + pdf-lib to print the live lesson pages.

The printable lesson list is built from shared/curriculumCanonical.json by buildLevelManifest.mjs.

- **A1 Course Book:** Day 0 orientation and Day 23 final mock are excluded. A1 teaching Days 1–22 are selected by a1RenderPlan.json. validateA1RenderPlan.mjs refuses mismatches or non-course routes.
- **A2/B1:** Their existing grammar and workbook tabs are rendered together by renderLevelBundleV2.mjs.
- **B2/C1:** Continue using the existing guided lesson export path.
- **C2:** Not yet supported by the workflow; add it only after confirming a complete manifest and renderer.

The A1 final mock must be managed independently in Exams Room. Do **not** invent replacement Course Book routes, redirect the PDF renderer to /exams/writing, or silently add obsolete Day 24 pages.

## Build a Course Book PDF

1. Open the [Course material bundle workflow](https://github.com/learngermanghana/falowenexamtrainer/actions/workflows/course-material-bundle.yml).
2. Choose **Run workflow**, select the level, and leave **Render and merge the complete level PDF** checked.
3. Choose **Falowen Press editorial proof** only when reviewing a future publication layout.
4. Download the finished Falowen-LEVEL-course-materials-pdf artifact from the successful run.
5. A1–B1 PDFs are checked for table-of-contents links, bookmarks, section dividers and excluded web UI. Failures upload diagnostic artifacts.

### Canonical A1 course redirects

The A1 PDF renderer accepts only the exact requested lesson path on `www.falowen.app` or `falowen.app` over HTTPS, ignoring harmless trailing slashes. It still rejects login screens, off-domain redirects, unrelated course routes and app errors. The diagnostics on failure report both URL origins and paths without printing credentials or session tokens.

Day 18's outdated Chapter 12.2 and externally hosted PDFs were removed from the A1 render plan; the live merged Chapter 12.1 grammar and workbook are now printed from the canonical Course Book route.

### Authenticated lesson readiness and listening in print

Before printing each A1 target, the exporter now waits for visible lazy-loaded lesson panels to replace exact `Loading…` indicators, with up to three bounded page retries. If no lesson appears it **fails the job with the day and section**, rather than creating a misleading PDF. The completed PDF validator also rejects `Loading…` and `Audio wird geladen …` text.

Printed audio widgets are replaced by a **QR code to the authenticated Falowen course lesson** (a sign-in is required). The generated link strips the print-only `radio=done` query parameter and never exposes expiring Cloudflare R2 URLs. This is a **student workbook companion link**, not a public audio product for Amazon. The PDF rendering pass also suppresses web-only video panels and draft-save UI, while preserving actual answer options and writing inputs.

### A1 export preflight

The A1 renderer now prints each native workbook Teil panel instead of the default Overview. For other tutor or practice navigators, it visits each available Teil/Section tab and merges their printouts. Exercise option buttons remain visible; previous/next navigation, score/submission controls and video cards are suppressed. Rendering waits for real React lesson text; if a target is still loading, the build stops instead of producing an incomplete PDF.

The A1 printer inspects each just-rendered lesson section with `pdftotext` and low-resolution grayscale rasterization. Completely empty **trailing** print-overflow pages are removed before sections are merged, preserving bookmark and contents-page indices. Graphical pages and any interior blank pages are never deleted automatically. The web-only "Supporting materials", teacher-video actions and "Back to Course Book" navigation are hidden during PDF rendering, not removed from the student website.

The final A1 PDF validator also rejects any page containing a React loading screen, application error, or footer-only/blank page. Do not distribute a PDF that fails this check. The existing PDF uploaded before this change is not repaired in place; regenerate using the GitHub workflow to obtain a new build.


Credentials are read from FALOWEN_PDF_EMAIL, FALOWEN_PDF_PASSWORD, or the supported session secret, never committed to this repo.

## Falowen Press editorial proof

If press_preview is enabled, the workflow adds a branded editorial proof before the unchanged Course Book PDF, producing a separate Falowen-LEVEL-press-editorial-proof artifact. It is explicitly **NOT FOR SALE** and is not a Goethe model-exam workbook.

Before selling **any** converted book, the editorial team must:

1. Review questions, answers, example letters, diagrams and pagination.
2. Confirm ownership/licences for any existing external material. The A1 Day 18 exporter now uses the live Chapter 12.1 material instead of the outdated Google Drive PDF sources.
3. Replace app-specific UI and instructions with reader-appropriate book content.
4. Curate original exam-style practice with verified solutions and listening transcripts.
5. Link to properly licensed audio and validate every QR code.
6. Produce separate print-ready interior and cover files to the selected KDP trim and bleed specifications.
7. Ensure the title and cover clearly identify the book as *independent* preparation material, not an official Goethe publication.

The editor must expressly approve publication. The proof artifact must not be reused as a paid-download product automatically.

## Local validation

Run from the repository root:

    node scripts/course-material-bundles/buildLevelManifest.mjs A1
    node scripts/course-material-bundles/validateA1RenderPlan.mjs
    node --test scripts/course-material-bundles/validateA1RenderPlan.test.mjs

After installing the existing pdf-lib dependency:

    node --test scripts/course-material-bundles/buildPressProof.test.mjs

No additional Vercel or Cloud Run PDF-generation service is needed.
