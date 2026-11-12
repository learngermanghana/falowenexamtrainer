# Authoritative source map and documentation update matrix

**Reviewed:** 2026-11-01. Prefer *source-owned* content rather than parallel hand-maintained snapshots.

| Change | Check or edit first | Related docs / validation |
| --- | --- | --- |
| Public routes, tabs, onboarding | `web/src/`, `web/public/falowen-help.md`, `web/public/falowen-navigation.json` | `web/public/llms.txt`, Help page, [Help contract](../FALOWEN_HELP_AND_NAVIGATION.md) |
| A1–C2 day, chapter, grammar, section | Canonical learner course content and `scripts/generateFalowenCourseMap.mjs` | Generated `falowen-course-map.json` in build output; public schedules; do not directly commit generated map |
| A1 tutor workbooks / optional music | `web/src/components/A1TutorMarkedWorkbookShell.js`, navigation and submission components | [A1 shared migration](../a1-shared-workbook-migration.md), `README.md`, targeted workbook tests |
| A2/B1 workbooks | Level-specific workbook sources | Canonical assignment keys and [assessment sync](../assessment-task-sync.md) |
| Kiswahili pilot (Day 1 only) | `web/src/data/swahili/dayOne.js`, `web/src/components/SwahiliCourseBook.jsx` | Public preview `/swahili`; learner campus shows the Kiswahili book only for `studentProfile.program === "swahili"`. No recorded audio, scored tests or teacher submissions yet. |
| Workbook reading vocabulary | `web/src/data/contextualReadingVocabulary.js`, level glossaries and `InlineReadingTranslations.jsx` | Three inline phrases per text block. More vocabulary expands additional exact matches locally. Advanced priority phrases include plain German. Save phrase stores the sentence and lesson locally under the signed-in student’s ID for Campus Vocab. |
| Assignment questions or answer keys | Student-facing task source, `scripts/generateAssessmentTaskRegistry.mjs` | Registry `--check`, rubric and marking tests |
| Full exams / mock publication | Server-owned answer keys and registered exam engines | [Mock factory](../mock-factory-a1-c2.md); review before labeling `ready` |
| Music MP3 additions | Approved `music/<level>/day-XX/` R2 folder and music discovery API | [Music publishing](../music-publishing.md), [music workflow](../workflows/music-and-lyrics.md) |
| German lyrics / cues / translation | `web/public/music/approved-recording-lyrics.json`, `timings.json`, `studio-drafts.json`, `english-translations.json` | Exact recording key, lyrics match, [timing guide](../music-recording-timings.md) |
| ChatGPT Companion tools / OAuth | `functions/functionz/` MCP handlers, scopes, demo tests | [MCP reference](mcp-plugin-reference.md), [plugin release](../chatgpt-falowen-companion.md) |
| Student identity, private data, payment | Server rules, consent and permissions | [Privacy](student-data-and-privacy.md); never make public documentation reveal private records |
| Admin marking, attendance, AI Music Studio | **falowenadmin** repo | Admin `AGENTS.md`, Admin `docs/ai/` and owner-scoped tests |

## Students sheet payment synchronization

The canonical learner Firebase `students/{documentId}` record is the source for the Students Google Sheet upsert. `functions/functionz/studentsSheet.js` must write confirmed `paid` tuition before considering legacy `paidAmount` fields or the Admin `initialPaymentAmount` intent. A previously approved organisation student's `studentCode` may differ from the stable Firestore document ID; the upsert matches an existing sheet row by student code, UID **or email** and must update the row rather than append a second one. Organisation payment credits and human-readable student-code repairs are made in the separate Admin repository; this learner repository owns sheet synchronization.

## Public documentation precedence
1. **Authenticated account facts:** verified learner-scoped server/MCP responses.
2. **Published lesson behavior / page navigation:** current app routes plus official Help and generated course map.
3. **Technical implementation:** code, regression tests and the relevant technical doc.
4. **Historical design notes:** useful context, **not** current status or authority.

If contradictory, inspect source and release state; revise outdated docs in the same PR. Do not change a "last reviewed" date unless you actually checked the linked source.

## Documentation checks
Run `node scripts/checkAiDocumentation.mjs`. It validates required sources, internal links in the AI foundation, and agreement of the public AI navigation review stamp. It is not an E2E route/auth test and cannot replace release checks.

## French course archival and Kiswahili Day 1 — 12 November 2026

The unused French **course** schedule and class catalog are archived under `web/src/data/archive/french/`. The inactive historical French sign-up component and legacy `program: "french"` rendering remain available for reversibility, but there is no live French enrolment path to re-enable automatically. No existing student records, payments, course permissions, German levels, assignment keys or marking infrastructure were migrated or deleted. French **interface translations** remain available to users who choose that language; they are separate from the archived French course.

The first Kiswahili course-book pilot reuses Falowen's learning layout and A2/B1-inspired section pattern, but is intentionally independent of German answer keys and completion tracking. The public review route `/swahili` lists only Day 1, `/swahili/day-1` opens that lesson, and programme-scoped signed-in learners with `program: "swahili"` see it on Campus Course Book. Content is drawn from the supplied teacher lesson `Kiswahili Alfabeti, Sauti na Matamshi`: five vowels, sample consonants and combinations, syllables, stress and exercises. Music has original practice lyrics but **no published recording**; listening is teacher-read and the answer check is ungraded/browser-local. Extra dictionary entries, future days, recorded audio, assessment submission and Swahili account enrolment/admin workflows have **not** been launched.
