# Authoritative source map and documentation update matrix

**Reviewed:** 2026-11-01. Prefer *source-owned* content rather than parallel hand-maintained snapshots.

| Change | Check or edit first | Related docs / validation |
| --- | --- | --- |
| Public routes, tabs, onboarding | `web/src/`, `web/public/falowen-help.md`, `web/public/falowen-navigation.json` | `web/public/llms.txt`, Help page, [Help contract](../FALOWEN_HELP_AND_NAVIGATION.md) |
| Public German / Kiswahili placement tests | `web/src/components/PlacementTestPage2026.jsx`, `placementTest2026Data.js`, `swahiliPlacementTestData.js`, `api/placement-attempts.js` | Teacher-provided Kiswahili A1–B2 diagnostic; private `SWAHILI_PLACEMENT_ANSWER_KEY_V2` Vercel secret; retain legacy key for older tickets; never commit answer keys; verify language-aware email/outbox tests |
| A1–C2 day, chapter, grammar, section | Canonical learner course content and `scripts/generateFalowenCourseMap.mjs` | Generated `falowen-course-map.json` in build output; public schedules; do not directly commit generated map |
| A1 tutor workbooks / optional music | `web/src/components/A1TutorMarkedWorkbookShell.js`, navigation and submission components | [A1 shared migration](../a1-shared-workbook-migration.md), `README.md`, targeted workbook tests |
| A2/B1 workbooks | Level-specific workbook sources | Canonical assignment keys and [assessment sync](../assessment-task-sync.md) |
| Kiswahili workbook (Day 1 and A1 Lesson 6) | `web/src/data/swahili/dayOne.js`, `web/src/data/swahili/daySix.js`, `web/src/components/SwahiliCourseBook.jsx`, `web/src/components/SwahiliDaySixWorkbook.jsx` | Public preview `/swahili`; learner campus shows the Kiswahili book only for `studentProfile.program === "swahili"`. Day 1 and restaurant Lesson 6 source-grounded Kiswahili–English vocabulary is searchable within Grammar; other topics remain pending. Day 1 and Day 6 writing/reading submissions and staff reviews are scoped to their respective lesson and user. Day 6 Music uses the separately published Swahili recording and optional listening questions. Workbook submission stays teacher-marked. |
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

Student signup stores Course type as `courseType` (`full_course` or `exam_preparation`). The Students Sheet exports it as `CourseType`. Legacy profiles infer a type from the existing exam-only account flag. Class delivery and schedule information stays with the class. Account settings use the authenticated course-type endpoint, and Firebase access changes follow the server-owned `courseAccountAccess/{uid}` policy. Existing course billing and paid exam subscriptions carry over. Exam-only registration may include the existing exam trial. A first full-course enrollment from an exam account requires a selected open German class and confirmed full tuition through the signed Paystack webhook. Regular full-course signup continues to offer its existing trial and payment options.

The Students Sheet also exports `AccountType` (`course` or `exam_only`). Automations use this value to determine whether course billing still applies when a learner selects Exam preparation. Existing `LearningMode` cells remain historical, and the sync appends missing headers. For the separately hosted Falowen Automations v5.11 Apps Script, use the [course-type patch](../../apps-script/student-course-type-v5.11.patch). Save the original script locally as `FalowenAutomations.gs`, apply the patch with `patch -p1 < /path/to/student-course-type-v5.11.patch`, and review the patched script before installing it. The patch preserves the existing automation settings, skips tuition mail for exam-only accounts, and keeps exam subscriptions out of tuition lead reconciliation.

## Public documentation precedence
1. **Authenticated account facts:** verified learner-scoped server/MCP responses.
2. **Published lesson behavior / page navigation:** current app routes plus official Help and generated course map.
3. **Technical implementation:** code, regression tests and the relevant technical doc.
4. **Historical design notes:** useful context, **not** current status or authority.

If contradictory, inspect source and release state; revise outdated docs in the same PR. Do not change a "last reviewed" date unless you actually checked the linked source.

## Documentation checks
Run `node scripts/checkAiDocumentation.mjs`. It validates required sources, internal links in the AI foundation, and agreement of the public AI navigation review stamp. It is not an E2E route/auth test and cannot replace release checks.

## Kiswahili Course Book layout

Published Kiswahili Radio episodes use the same Radio-first screen and Continue
button as German A2 Day 1. A1 Days 5, 6, 10, 11 and 12 and B1 Day 28 open Radio
before the workbook navigation. Continue preserves any requested workbook
section. AI lessons retain their workbook placement. Lessons without a
configured episode open directly to the workbook; Kiswahili A2 has no published
workbooks yet.

Kiswahili A1 Day 4 (**Nchi na Lugha**) replaces its old three-question short-answer Lesen with the instructor-supplied Amina–John countries/languages dialogue and five four-option multiple-choice questions. Hören now has five four-option questions based on the teacher-provided Kenya–Tanzania conversation and reads the private R2 key `swahili/A1/day-04/day-04.mp3` only through the existing Firebase-authenticated, fixed-key signed-audio endpoint `/api/course-media/swahili/a1/day-4/audio-url`. The learner workbook contains question prompts and options but no correct-answer key or public audio object URL. New Day 4 submissions use `readingVersion: 2`, so Admin applies the revised tutor key and includes listening; existing unversioned submissions retain the old three-question reading reference and no listening requirement. The learner review identifies older submissions rather than showing them under the new questions, and Day 4 revision drafts use a separate local key. The teacher-provided transcript is the basis for the five Hören questions; verify that the uploaded recording matches it before releasing to students. This does not change other lessons.



Kiswahili A1 Day 11 uses the signed recording `swahili/A1/day-11/day-11.mp3` in Teil 4. Day 11 sends the learner’s writing and five reading and five listening choices to the tutor through Review & Submit. Admin owns the reference answers.

Kiswahili A1 Day 7 uses the private R2 recording `swahili/A1/day-07/day-07.mp3` via the existing signed-audio flow. Its five listening questions are included in the tutor submission. The Grammar tab covers present-tense preferences, polite requests, hunger and thirst, and food and drink vocabulary.

Campus uses the shared German Course Book **Level** selector and the same enrolled-level ceiling for Kiswahili. A B1 learner can browse A1, A2 or B1, and an A2 learner can browse A1 or A2. A2 and B1 display titles from `a2B1TitleDictionary.json` in the existing lesson-card layout. Published workbooks and tutor progress are available across levels through the shared Kiswahili registry (`web/src/data/swahili/curriculumRegistry.js`). A2 currently has no published workbooks; B1 Days 26–28 are published. Switching the visible level does not update enrollment.

The Kiswahili A1 Course Book has 20 tutor-marked workbooks. Review & Submit shows the learner’s writing, reading and assigned listening responses. An explicit final submission sends the workbook to the Swahili marking queue. Grammar self-checks remain separate.

Falowen's existing learner shell is **programme-aware**: only the authenticated student profile's `program` determines whether Campus displays the German or Kiswahili learning experience. Kiswahili accounts reuse the same header, logout, shared Course Book styles, and Account Settings. Home uses the existing Falowen card components with Kiswahili-specific copy and level-specific published assignment progress and Continue Learning links; it does not show German mock exams, German ChatGPT Companion, German music/books, German vocabulary, German results, attendance, or German class-member views. The unavailable sections are filtered from navigation and forbidden by Campus section permissions; German account navigation is unchanged. Non-staff Kiswahili learners opening German Campus routes, attendance or Exams Room deep links return to their own course, including on the exams subdomain, while non-staff German learners cannot open Kiswahili Campus workbooks. Staff retain their existing review paths. This is a frontend programme boundary; Firestore security rules remain authoritative and unchanged.

The overview shows tutor feedback for the current submission and links to the lesson review. Public previews support local practice. A signed-in Kiswahili learner can submit through Campus.

Kiswahili students signed into a profile with `program: "swahili"` who open `/swahili`, `/swahili/day-1` or `/swahili/day-6` are redirected to their corresponding **Campus** Course Book route. This deliberately reuses the same Falowen learner header, Campus navigation, account controls and logout as the German course rather than maintaining a separate Kiswahili site chrome. Direct lesson URLs retain query parameters (including the selected Submit tab). Public Kiswahili previews remain available to signed-out visitors and authorized staff. Signed-in German learners opening those links return to their German Course Book. The redirect is performed only after the authentication session has resolved. No assignment IDs, submission records, lessons or German programme navigation are changed.

The public Kiswahili preview and Campus Course Book use the German Course Book's shared styles, lesson search and filters, and mobile Continue/Submit controls. The Campus overview calculates progress from the signed-in learner's published workbook submissions and displays tutor review status from the corresponding teacher review records. A submission contributes to progress when saved. Reviews are qualitative, so the mastery slot displays the number reviewed. The public preview shows the published assignment count, first lesson and learning mode. Submit opens the selected workbook section through `?view=submit` and preserves the lesson's Radio opening. Both workbooks provide previous and next section controls.

## Kiswahili A1 Lesson 6 interactive grammar study — 13 November 2026

The existing `MgahawaniGrammar.jsx` now adds brief English rules, original-example callouts, a color-coded affirmative/negative breakdown of `ninataka / sitaki`, and exactly one **ungraded**, browser-local multiple-choice self-check per teacher-authored grammar chapter. Topic navigation controls one expanded chapter at a time; the original seven chapter explanations, conjugation tables, numeral agreement tables, sample prices, and conversation are retained unchanged in `mgahawaniGrammarAndSong.js`. `mgahawaniGrammarPractice.js` owns the optional study checks and four-part restaurant scenario (polite order, rejecting meat, two cups of tea, total price); `MgahawaniGrammarPractice.jsx` renders answers and feedback locally without Firestore requests. Mobile styling is scoped to Mgahawani, with vertically stacked explanations, accessible touch-size controls and horizontally scrollable source tables. The new grammar checks do **not** affect reading/writing submissions, score reporting, staff marking, or lesson-completion requirements; do not add these practice answers to saved assignments.

## Kiswahili A1 Mgahawani grammar + song content — 13 November 2026

The teacher supplied `22MGAHAWANI GRAMMAR AND SONG LYRICS.docx` as the authoritative source for the existing A1 Lesson 6 Grammar and Music tabs. `web/src/data/swahili/mgahawaniGrammarAndSong.js` preserves all seven chapter topics and source examples: polite requests (Naomba/Ninaomba), the six grammatical persons, the affirmative/negative present of kutaka, availability and prices (Mna?/ngapi), counting through thousands and sample shilling prices, noun-class numeral agreement, and locative -ni. It includes the document's restaurant conversation. `MgahawaniGrammar.jsx` renders the source as one navigable set of expandable topic cards, table-based paradigms, a model dialogue, and collapsible existing vocabulary/dictionary. This adds no new course route or independent grammar system. `MgahawaniSong.jsx` shows the document's full MGAHAWANI lyrics within the existing Music tab, by named song section. **Lyrics are text only:** no song recording, player, or timing is asserted. The shilling amounts in Grammar are the document's *practice* prices and are not real menu prices. Existing submission prompts, saved data and teacher marking are unchanged. Styling is scoped to the Lesson 6 workbook to preserve other Swahili and German pages.

## Kiswahili A1 Lesson 6 — Mgahawani — 13 November 2026

Kiswahili workbooks use the shared Falowen Radio opening when the lesson data includes a radio resource. Day 6 opens with the Mgahawani episode on both the public and Campus links. Continue opens the workbook and preserves the handoff on refresh. The Day 6 AI lecture appears above the workbook activities. Its YouTube ID is stored in the same lesson record under `aiLecture.youtubeId`. To add another episode, follow the `radio` entry in `web/src/data/swahili/daySix.js`.

Ruth's supplied PDFs, `FOOD&DRINKS=LIKE&DISLIKES.pdf` (26 pages) and `Odering Food.pdf` (28 pages), are the content sources for the restaurant workbook. **Mgahawani is syllabus topic 4 but A1 course lesson 6**, as specified by the teacher; this does not imply that lessons 2–5 exist. Published routes: `/swahili/day-6` preview and `/campus/course/swahili/day-6` for the course. It uses the same `Music / Grammar / Teil 1 / Teil 2 / Teil 3 / Teil 4 / Submit` navigation as Day 1 and the standard A2/B1 workbook tabs. Grammar includes food and drink vocabulary and the original preference question/answer patterns, Teil 1 adapts the Amani–Furaha and Mhudumu–Mteja dialogues to partner practice, Teil 2 is guided writing, Teil 3 offers a practice menu assembled from source items and source-grounded dialogue reading, and Teil 4 is teacher-read optional listening. The source PDFs do not publish menu prices or audio: **none are fabricated or embedded**. The new vocabulary group is labeled `day-6` in the existing dictionary; remaining syllabus headings have no launched vocabulary. Day 6 submissions are separately stored under `users/{uid}/swahiliLessons/day-6`, saved only when the student chooses Submit; there is no automatic grading. Staff can open `/swahili/day-6?teacher=1` (or the corresponding Campus link) to use the existing on-demand Swahili review queue for submitted Day 6 writing/reading. That queue uses the same indexed, paginated collection-group lookup as Day 1, but filters to `swahili-day-6`, validates the canonical owner from the `users/{uid}/swahiliLessons/day-6` document path, and stores feedback separately under `swahiliTeacherReviews/{uid}_day-6`. Day 6 learners read their own feedback only on opening Submit. Day 1 review feedback remains at `swahiliTeacherReviews/{uid}`, so reviews do not overwrite one another. German routes and curricula are unchanged.

## French course archival and Kiswahili Day 1 — 12 November 2026

The unused French **course** schedule and class catalog are archived under `web/src/data/archive/french/`. The inactive historical French sign-up component and legacy `program: "french"` rendering remain available for reversibility, but there is no live French enrolment path to re-enable automatically. No existing student records, payments, course permissions, German levels, assignment keys or marking infrastructure were migrated or deleted. French **interface translations** remain available to users who choose that language; they are separate from the archived French course.

The first Kiswahili course-book pilot reuses Falowen's learning layout and A2/B1-inspired section pattern, but is intentionally independent of German answer keys and completion tracking. The public review route `/swahili` lists Day 1 and the separately authored Lesson 6, `/swahili/day-1` opens that lesson, and programme-scoped signed-in learners with `program: "swahili"` see it on Campus Course Book. Content is drawn from the supplied teacher lesson `Kiswahili Alfabeti, Sauti na Matamshi`: five vowels, sample consonants and combinations, syllables, stress and exercises. Music has **no published recording**; listening is teacher-read and its answer check is ungraded/browser-local. A **searchable Day 1 starter Kiswahili–English dictionary** is available within the Grammar tab, built only from the Day 1 vocabulary source. The 20-topic A1/A2 teaching syllabus supplies topic headings; beyond source-backed Day 1 and Lesson 6, vocabulary and lessons remain unpublished. Logged-in learners can submit Day 1 writing and reading to their own `users/{uid}/swahiliLessons/day-1` records; a staff-only review view can read those records and write feedback to `swahiliTeacherReviews/{uid}`, which students see on Submit. Staff review uses canonical owner UIDs from Firestore paths, filters submitted Day 1 records on the server, and loads them in ordered pages (with a collection-group index). The homepage Sign up button opens the shared signup form. Learners select German or Swahili (Kiswahili) in the Learning step. Swahili opens an online A1 workbook trial without a German class or checkout and offers a Start Day 1 button on the welcome screen that opens the first Campus workbook after saving onboarding. No recorded audio or automatic grading has been launched. The approved Day 1 teacher presentation is also available in the **separate Falowen Admin** teaching-slides language selector; it is not an extra learner workbook tab.

## Kiswahili trial entry

A signed-in learner with an active Kiswahili trial bypasses the first-login onboarding checkpoint. Entry from signup or the old onboarding URL goes to the Day 1 Campus workbook. Existing trial dates remain authoritative, and onboarding Paystack cannot initialize checkout for an active Kiswahili trial or fall back to German A1 tuition for an unpriced Kiswahili profile.

## Kiswahili feedback from Falowen Admin

Campus → Results shows only the signed-in Kiswahili learner’s Day 1 and Day 6 submissions, review status, tutor score and feedback from the current Firestore review. A revision link opens the workbook’s Submit tab. Admin publishes the manual score to the existing score Sheet queue and emails a link to Campus Results. The workbooks do not enter automated AI marking.

Falowen Admin Marking → Swahili reads the existing Day 1 and Day 6 submissions from `users/{uid}/swahiliLessons/day-{day}`. These records do not enter German assignment or score collections. The tutor's decision and feedback use the existing per-lesson review documents. Students see feedback in their workbook's Submit tab after the latest saved submission is reviewed. A new submission waits for a fresh review. The learner repository owns the production Firestore rules and composite index for this queue.

## Kiswahili A1 Day 5

Kiswahili A1 Day 5 is a tutor-marked workbook at `/swahili/day-5` and `/campus/course/swahili/day-5`. Its registered recording is `swahili/music/A1/day-05/Karibu Kufahamu Familia Yangu.mp3`. Published lyric timing comes from the matching R2 sidecar.

The separate `swahili/A1/day-05/` prefix is reserved for future Hören recordings.

Falowen Music uses the same player for its German and Swahili tabs. Swahili tracks are registered in `web/public/music/swahili-catalog.json` and the exact public R2 music allowlist. The lyrics API supplies the existing recording lyrics and any later published timings.

Swahili Day 5 uses the shared German-layout workbook music player and exact-key English translations. The bundled Swahili timing comes from recording-based word alignment and is labeled estimated until playback review. Campus Music opens the Swahili library for Swahili learners. Books, Vocabulary, Attendance, Class Members and Discussion use Swahili placeholders until their content is adapted.

A1 and the published B1 Day 28 workbook show learner responses and require explicit final confirmation. Title-only A2 and B1 entries have no assignment page.

## Kiswahili A1 Day 1 and Day 5 workbook practice

Day 1 and Day 5 reuse the Day 6 grammar self-check component for local practice. Day 1 keeps its writing fields and reading question IDs, with a new reading passage and aligned Day 1 tutor references in Admin. Day 5 collects the family writing, reading, radio and recorded listening responses.

## Published reference answers

German Campus Results loads the learner-owned reference snapshot when the learner opens result details. Legacy results continue to support their existing links.

Kiswahili Campus Results shows the reference snapshot attached by Admin to the current published tutor review. The result email links to the relevant Day 1 or Day 6 result.

### German and Swahili enrollment

The Admin Class tab labels each level by language. Campus opens the selected language at its assigned level. Swahili currently has published course books at A1 only.

Admin keeps the primary programme and placement in the existing student fields. An active second course is identified by `secondaryProgram` and uses its own level and class in `coursePlacements[secondaryProgram]`. Retained placements do not grant access. Campus selects an enrolled course for the current browser tab. German results and Swahili tutor reviews keep their existing identifiers, stores and publication workflows. Deploy the learner Firestore rules and Campus switch, then the Admin profile API, Swahili result worker and Admin editor before assigning dual enrollment.


## ChatGPT Exams Room content (15 November 2026)

The Sprechen prompt dictionary is `web/src/data/speakingDictionary.js`, the Schreiben practice source is `web/src/data/examWritingWorkspace.js`, the list of actually published mock routes is `web/src/data/mockExamCatalog.js`, and reviewed A1 Mock 02/03 Lesen/Hören come from `web/src/data/a1FinalMock2Data.js` and `web/src/data/a1FinalMock3Data.js`. `scripts/generateChatgptExamContent.mjs` selects only public learner-visible fields into the server's generated ChatGPT snapshot. Do not maintain a second manually copied mock bank or expose hidden answers/audio object keys.

## Public upcoming classes

Admin Live Classes owns the scheduled German and Swahili cohorts in Firestore. The public classes endpoint returns Swahili A1 listings in `swahiliClasses` and keeps the existing `classes` array for German brochure, registration, and placement consumers. [Upcoming Classes](https://www.falowen.app/classes/) shows published Swahili class dates, timetable and confirmed tuition when present, with a WhatsApp enquiry link. Swahili listing visibility requires an open, publicly visible class with successful session generation. Swahili listings use no German placement, course agreement, or Paystack flow.

## Kiswahili A2 and B1 course dictionary — 18 November 2026

Campus uses `web/src/data/swahili/a2B1TitleDictionary.json` for A2 and B1 lesson titles. Entries retain their Kiswahili IDs and the corresponding German chapter order and source IDs. Entries marked `titles-only` have no workbook. Speaking mock titles describe Kiswahili practice.

B1 Day 28 (chapter 10.28), *Kutunza Mazingira katika Maisha ya Kila Siku*, has status `workbook`. The B1 course card opens `/campus/course/swahili/b1/day-28`. The route supports signed-in Kiswahili learners enrolled at B1 or higher and staff. The radio transcript opens before the workbook. Continue opens the requested workbook section using the shared radio-first gate. The workbook includes bilingual lyrics, grammar, speaking, writing practice and self-review. Teil 3 contains the environmental-care reading, bilingual vocabulary support and five written comprehension questions. Teil 4 plays `swahili/B1/day-28/day-28.mp3` on request through the signed listening endpoint. Learners send their writing and all ten written comprehension responses to `users/{uid}/swahiliLessons/b1-day-28` for tutor marking. The answer key stays in Admin.

### Course discount links

Admin creates offers through the Campus `/api/course-discounts/admin` API. A share link opens signup or sign-in tied to the offer's program and level. A learner's first checkout can allocate one use and save server-calculated GHS tuition. Allocation is transactional and bound to the learner; expiry and revocation stop new allocations. Already allocated offers keep their price for retries. A signed Paystack payment marks the first redemption while normal tuition, balance and contract rules still apply.

Workbook submissions carry the course program (`german` or `swahili`). Admin uses the submitted course to label score rows and route tutor copies for dual-program students.


## Public German and Kiswahili A1–B1 placement assessment — 21 November 2026

The homepage now places a compact three-way visitor decision section between the carousel and the educator team. Its placement card can select **German** or **Kiswahili**; both use the existing `/placement-test` route, with `?language=swahili` for Kiswahili. The exam practice card remains German Goethe-style practice. The beginner card retains normal signup language selection.

Both placement experiences reuse the same public 30-question / 20-minute timer, resume-from-local-browser behavior, result email/outbox, existing private PlacementAttempts sheet, and Admin monitoring endpoint. A separate browser key and language marker on every start/complete/contact event prevents German and Kiswahili attempts or admissions messages from being interchanged. A signed start ticket is checked against the submitted language before accepting a Kiswahili completion. The result CTA passes `program=swahili` for Kiswahili, rather than sending learners to the German class list.

The question wording and four choices in `web/src/components/swahiliPlacementTestData.js` are transcribed from the teacher-supplied four-page PDF `SWAHILI CEFR PLACEMENT TEST (A1–B1)`; **the PDF and confidential answer key must never become downloadable public assets or be committed to this public Git repository**. The key is stored only as the encrypted `SWAHILI_PLACEMENT_ANSWER_KEY` Vercel environment variable (30 zero-based comma-separated option indices). Kiswahili answers are scored exclusively by the backend, and the frontend displays the score returned by the server. Kiswahili submissions do not display the teacher's correct-answer key in the browser. No new cron jobs, polling workers, or databases are added.

The teacher's thresholds are distinct from German's existing scoring: 8/10 for A1 mastery, 8/10 for A2 advancement, 7/10 for B1 mastery. This gives suggested A1 when A1 < 8, suggested A2 when A1 ≥ 8 but A2 < 8 or B1 < 7, and suggested B1 only when all three thresholds are passed. A suggestion is **not** an official CEFR certificate or a replacement for a speaking/writing interview.

Review before public release: the supplied source contains potentially awkward prompts in questions 24, 26 and 27. They are transcribed as provided, without silently editing the instructor's test. If the teacher revises those questions, keep the numbering, four choices, answer key and any saved attempt versions aligned. Validate with `web/src/components/swahiliPlacementTestData.test.js`, `web/src/components/HomepageStartPaths.test.jsx`, and the existing placement server/outbox/email tests. For docs updates, run `node scripts/checkAiDocumentation.mjs`; for published assessment changes, run `node scripts/generateAssessmentTaskRegistry.mjs --check`. Deploy only after appropriate build and pipeline checks, and verify actual production revision.

### Kiswahili shared learner progress

The Home dashboard, Course Book and Results consume `useSwahiliProgress` and the curriculum registry, which derives publication status from the existing A1 curriculum and A2/B1 title dictionary. Existing lesson document IDs, tutor review IDs and submission contracts are unchanged. On page mount the hook reads the learner's existing submissions once and fetches reviews only for submitted workbooks; no listener, polling or writes are added. Revisions take priority in Continue Learning. Progress measures submitted published required assignments, not completion of the full planned syllabus. Unknown data is not reported as zero. No new learner routes or permissions are introduced.

## Owner Course Book testing access

The verified owner can select Developer testing access in Campus → Course Book or Account, using the current enrolled language and a temporary testing level (German A1–C2; Kiswahili A1–B1, published lessons only). `web/src/utils/ownerCourseTesting.js` defines the identity, session and course-route checks; `web/src/App.js` holds the selection in memory, resetting on language change, logout or reload. The selector does not change `students`, `levelEnrollments`, payment grants, class assignment, or sheet synchronization. The Course Book suppresses its automatic completion snapshot while testing. The actual profile remains authoritative in Account, billing, and Exams Room. This is live course navigation, not an isolated data sandbox: explicitly submitting work or using ordinary progress controls may still save to the owner's real account. Server permissions, private audio access, assessment rules, and payment eligibility are not expanded. Use a dedicated test account for end-to-end submission and payment tests. No scheduled jobs or new data subscriptions are introduced.

### Kiswahili A1–B2 placement revision — 25 November 2026

The supplied four-level DOCX replaces the Kiswahili question bank with 40 multiple-choice items (10 per level). Keep the existing 20-minute timer and per-attempt shuffling; German remains 30 questions. Version `a1-b2-v2` is bound to the start ticket; the new browser storage key prevents mixing old and new answers. Older open clients retain the original server key. Scores remain preliminary: A1/A2 require 8/10 and B1/B2 require 7/10 to recommend the corresponding higher level, with the preceding thresholds satisfied. The B2 threshold is provisional pending teacher confirmation. The four supplied writing prompts are displayed after the scored portion for teacher-guided follow-up, not automatically graded or uploaded. B2 recommendations link to admissions rather than assuming B2 classes are open. Keep the 40-entry private answer key in `SWAHILI_PLACEMENT_ANSWER_KEY_V2`; the original answer key is unchanged. Verify the new key and marking criteria with the teacher before publishing.
