# Publishing lessons, tutor workbooks and exam tasks

Reviewed: 2026-11-01.

## Course editing
The canonical learner sources define the day/chapter and visible tasks. The generated A1–C2 course map is a build output from `scripts/generateFalowenCourseMap.mjs`; it should not become a manually edited second source.

A1 tutor workbooks use `web/src/components/A1TutorMarkedWorkbookShell.js` and level-specific assignment IDs. Optional Music does not belong to required sections or grading. A2/B1 have separate workbook contracts. Preserve existing saved answers, submission routing, gates and timers.

## Assessment changes
- Edit the learner-facing original task definition.
- Run `node scripts/generateAssessmentTaskRegistry.mjs` and `node scripts/generateAssessmentTaskRegistry.mjs --check`.
- Review answer keys, task IDs, writing/speaking rubric, payload version and required points.
- Use targeted workbook, navigation and marking tests for the affected level and lesson.
- New mock drafts stay private until the four exam modules, audio keys, server answers, scoring and results routes are verified.

See [question-aware marking](../assessment-task-sync.md) and [the mock factory](../mock-factory-a1-c2.md). If Admin marking is affected, coordinate an independent Admin PR for its contract.

## A1 Day 23 final mock (14 November 2026)

A1 Mock-01 (`a1-final-01` / `a1-mock-01`) is the graded Day 23 final readiness assessment. Keep its existing `/campus/course/a1-final-mock-exam` route available in the eCampus Course Book, but set `showInMockLibrary: false` in `web/src/data/mockExamCatalog.js` so it does **not** appear among independently repeatable Exams Room practice mocks. The filter applies even when `includeCourse: true`. Keep the catalog record and direct Campus route intact for existing completion/result links. Hiding the listing alone does not change grading, repeat-attempt backend rules, Score Sheet synchronization or certificate approval. The Score Sheet must count each canonical assignment only once for completion, irrespective of retry/repeat submissions; A1 certificate issuance remains Admin-verified.

## B1 Day 24 listening replacement (7 November 2026)

B1-8.24 (Konsum und Nachhaltigkeit) uses the owner-provided private R2 object `b1/day-24/day_24.mp3` as its single Hören player source. The previous five smartphone true/false statements were authored for a different recording and must not be displayed or marked against the new MP3. The Hören tab stays visible as audio-only self-check; the canonical submission profile requires only Teil 2 · Schreiben and Teil 3 · Lesen until five recording-matched, teacher-reviewed listening questions and a matching server-owned key have been published. The historical answer-key manifest is deliberately unchanged for previous learner attempts; do not reuse its Teil 4 answers for the replacement audio. The extra published-Studio Hören exercise is suppressed for this day to avoid showing another stale question set. R2 signing allowlists the exact new object key, rather than broadening folder access. Deployment requires both learner UI and Firebase audio-signer releases, plus a signed-in playback test; a Cloudflare dashboard object link alone does not verify successful playback.
