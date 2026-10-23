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

### A1 export preflight

The A1 renderer now prints each native workbook Teil panel instead of the default Overview. For other tutor or practice navigators, it visits each available Teil/Section tab and merges their printouts. Exercise option buttons remain visible; previous/next navigation, score/submission controls and video cards are suppressed. Rendering waits for real React lesson text; if a target is still loading, the build stops instead of producing an incomplete PDF.

The final A1 PDF validator also rejects any page containing a React loading screen, application error, or footer-only/blank page. Do not distribute a PDF that fails this check. The existing PDF uploaded before this change is not repaired in place; regenerate using the GitHub workflow to obtain a new build.


Credentials are read from FALOWEN_PDF_EMAIL, FALOWEN_PDF_PASSWORD, or the supported session secret, never committed to this repo.

## Falowen Press editorial proof

If press_preview is enabled, the workflow adds a branded editorial proof before the unchanged Course Book PDF, producing a separate Falowen-LEVEL-press-editorial-proof artifact. It is explicitly **NOT FOR SALE** and is not a Goethe model-exam workbook.

Before selling **any** converted book, the editorial team must:

1. Review questions, answers, example letters, diagrams and pagination.
2. Confirm ownership/licences for any existing external material, including the two Google Drive PDF targets on A1 Day 18.
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
