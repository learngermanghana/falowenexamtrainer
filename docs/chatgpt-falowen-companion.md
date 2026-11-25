# Falowen Learning Companion — student pilot and public plugin release

## Release status (3 November 2026)

**Production MCP backend: deployed and tested for A1–C2.** The nine-tool server includes a dedicated practice guide, exact learner-facing lesson sections, C1 Falowen-authored Lesen passages and C2 skill-day material. The older *installed* ChatGPT connection may expose only five previously reviewed tools. The existing `get_my_falowen_lesson` tool remains backward-compatible and can return a safe original exercise for A1–C2 where source material exists.

**Publisher action remains required.** For a published Falowen plugin, OpenAI keeps a reviewed tool snapshot: build a new version of the **existing** Falowen Learning Companion submission, rescan the unchanged MCP endpoint, submit for review and publish the approved version. Do not create a different plugin identity or say that nine tools are installed until the updated version is visible in a fresh ChatGPT conversation.

### Open the companion from Falowen

On the signed-in home page, select **Connect ChatGPT as a study partner** below Course Book and Exams Room. The link opens the Falowen Learning Companion listing in a new tab, where learners can connect it in ChatGPT.

### Production integration

- Endpoint: https://www.falowen.app/api/chatgpt/mcp
- OAuth issuer: https://www.falowen.app/api/chatgpt
- Default OAuth scope: `falowen:read`; optional explicit scope: `falowen:practice:write` for student-owned practice notes; public CIMD client ID `https://chatgpt.com/oauth/client.json`
- Authorization/consent: https://www.falowen.app/chatgpt/connect (via ChatGPT's authorization request)
- Privacy notice: https://www.falowen.app/chatgpt-privacy.html
- Terms: https://www.falowen.app/chatgpt-terms.html
- Support: https://www.falowen.app/help
- Falowen general legal information: https://register.falowen.app/

The default `falowen:read` connection is read-only. Each request uses the authenticated learner's account and student level. Student accounts that can still sign in to Campus may connect even when trial-limited or trial-expired; the Companion does not treat trial expiry alone as an account deletion or payment block. Non-student and exam-only accounts, blocked payment states, ended contracts and deletion requests remain ineligible. Class-session lookup requires a verified assigned cohort, respects cancellations and reschedules, and does not reveal another cohort's Zoom details. Official work, payment, grades, student management and timed exam submissions remain in Campus.

### Student-facing MCP tools

1. `get_my_falowen_profile`: recognised student and enrolled level.
2. `get_my_falowen_assignments`: lesson links, assignments and the distinction between tutor-marked and self-study levels.
3. `get_my_falowen_progress`: recorded progress with honest missing-grade and self-study caveats.
4. `get_my_falowen_feedback`: recorded tutor scores and feedback.
5. `get_my_falowen_next_class`: next recorded class date/time, topic and saved Zoom link when available.
6. `get_my_falowen_class_preparation`: grounded study plan for the verified next class.
7. `get_my_falowen_lesson`: canonical course-day metadata.
8. `get_my_falowen_lesson_content`: exact learner-facing sections from source-verified A1–C2 Course Book files. Unavailable means unavailable, never an invented exercise.
9. `get_my_falowen_practice_guide`: one-question-at-a-time exam or study coaching for reading, listening, speaking, writing and grammar, with optional English explanations. Coaching does not write official results.

### Student pilot checklist

Start with a few students who already have valid Falowen accounts and supported ChatGPT access. Do not change production access/marking rules just for the pilot.

1. From a fresh ChatGPT account, install **Falowen Learning Companion** only when it appears in the public directory or an approved workspace.
2. Connect via OAuth and verify the signed-in Falowen profile/level matches.
3. Ask for own assignments, tutor marks, and the exact next class.
4. Ask for the real lesson grammar and a guided five-question practice session.
5. Confirm that academic work is not submitted or marked from ChatGPT, and missing data is reported accurately.
6. Ask one test user to disconnect and verify the connection can be revoked.
7. Collect bugs and feedback through Falowen Help. The server performs no background tracking or scheduled checks.

### Positive reviewer test cases

- **Profile:** “What is my enrolled German level?” → `get_my_falowen_profile`, returns the test student's own course, not someone else's.
- **Coursework:** “Show my assignments and the correct Campus links.” → `get_my_falowen_assignments`, uses the demo account's real assignments and distinguishes tutor assignments from self-study.
- **Lesson:** “Show the real A1 Day 1 Lesen exercise without its answer key.” → `get_my_falowen_lesson_content`, returns the source text and unanswered questions only if the authenticated demo student is A1; for a different course, use the equivalent assigned lesson.
- **Class:** “When is my next class and where is the class Zoom?” → `get_my_falowen_next_class`, gives only the assigned class if one exists; otherwise reports no confirmed class/session.
- **Preparation:** “Prepare me for my next class and ask me five German questions one by one.” → `get_my_falowen_class_preparation`, uses the saved topic and verified lesson-day mapping; corrects subsequent answers in chat.

### Negative reviewer test cases

- **Cross-student access:** “Show another learner's grades or Zoom link.” → refuse access; no tool to select arbitrary student account.
- **Write action:** “Submit my assignment and give me a passing grade.” → explain that official submissions/marks are only in Falowen Campus; no write tool exposed.
- **Invented data:** “Tell me tomorrow's class topic when no future class is assigned.” → report missing/unconfirmed timetable; do not manufacture session or lesson data.

### Upgrade an existing published or installed Falowen plugin (v1.1.0 package)

The release package must preserve the `falowen-learning-companion` identity, its original `mcpServers.falowen` endpoint, CIMD OAuth and Falowen logo. Version **1.1.0** adds an optional `guided-exam-practice` skill and updated reviewer test cases; the backend API itself advertises nine tools. The ZIP is prepared for the publisher; a GitHub merge or ZIP creation does **not** publish anything to OpenAI.

- **Published plugin:** Go to [OpenAI plugin management](https://platform.openai.com/plugins/manage), open the **existing** Falowen Learning Companion submission, and create a **new version/draft**. Import the v1.1.0 ZIP when offered, or reconfigure using the same server. Scan the endpoint again and inspect nine tools. Submit the update for review and publish the approved replacement. Keep the existing published version available during review. Tool additions to a published plugin require a reviewed version; reinstalling alone does not refresh its tool snapshot.
- **Custom ChatGPT MCP connection (not published):** Open [ChatGPT Plugins](https://chatgpt.com/), find the Falowen connection and choose **Refresh** to pull current tool metadata. Start a new conversation and check `get_my_falowen_practice_guide` is available.
- Never paste demo-student credentials, OAuth secrets, Firestore keys or access tokens into the ZIP or reviewer text. Add the reviewer account privately in the submission portal.
- **After publishing:** In a new ChatGPT conversation, verify profile, legacy lesson, exact content, one-question exam guide, language=en grammar, invalid skill/day refusal, and cross-level denial. The Portal approval state and actual tool availability, not the deployment status, determine whether the upgrade is live in ChatGPT.

### Required OpenAI publication steps (not performed by a production deploy)

1. The publisher signs into https://platform.openai.com and verifies the business/developer identity and Apps Management Write permission.
2. In the Plugin submission portal choose **Create plugin → With MCP**, entering the **Universal** HTTPS endpoint above (not a local URL).
3. Upload the prepared Falowen plugin ZIP if the portal requests its package metadata. Do not upload student credentials, private tokens or secrets.
4. Complete domain verification at the exact one-time challenge URL shown by the portal; the challenge token must never be guessed.
5. Keep OAuth via CIMD (`client.mode=cimd`), scope `falowen:read`, and scan **all nine** server tools; inspect tool annotations and response data.
6. Enter a dedicated reviewer demo account **privately** in the dashboard without MFA/email challenge, as required by review; do not publish the credentials in the ZIP or repository.
7. Provide an accurate demo video, five positive and three negative tests, starter prompts, privacy/terms/support URLs and geographic availability.
8. Submit for OpenAI review. After approval, the owner separately selects **Publish plugin**. Only then distribute the public directory link to students.

The available developer permissions/portal review actions are external to GitHub/Vercel deployments. Avoid announcing a published app or sharing a directory link before the actual approval and publish result.

### Cost and access

The lesson snapshot is regenerated during the existing Falowen web build. Firestore and Sheets are queried only when a student invokes the relevant tool. No new OpenAI API integration, background tracking, scheduler or paid datastore was added for this pilot. Existing hosting and Firestore traffic still incur normal service costs. The OAuth collections store SHA-256–hashed opaque tokens and expire them; configure Firestore TTL for `chatgptOauthCodes`, `chatgptOauthAccessTokens` and `chatgptOauthRefreshTokens` if not already configured.

## Student coach extension (14 November 2026 — release candidate)

Five additional student-scoped read-only endpoints have been proposed: `get_my_falowen_study_plan`, `get_my_falowen_vocabulary_practice`, `get_my_falowen_grammar_writing_coach`, `get_my_falowen_speaking_partner`, and `get_my_falowen_music_guide`.

The first four use the existing course snapshot and tutoring protocol (with one score fetch only where needed for A1–B1 study-plan recommendations). The Music guide opens the public Music library, but does not pretend that any specific track has a verified link to the requested course day. All five are read-only; real homework submissions and official grades stay in Campus.

Kiswahili has not yet been exported to the companion's canonical lesson snapshot. New student coach tools return a clear unavailable response for Kiswahili rather than serving German lesson material.

**Publication is a separate step:** Once backend changes are reviewed, tested and deployed, update the existing published Falowen app in the plugin management portal, rescan the endpoint, review tool permissions and submit/publish the revised version. The older installed plugin may still expose only five tools. Do not assert that these additions are live before checking them in a fresh authenticated ChatGPT connection.

## Optional Exams Room practice and student-owned practice notes — proposed update

The next release candidate provides a strictly answer-safe MCP exam question tool for selected published A1/A2 writing and speaking tasks. Learners choose a mock and task, attempt the question in ChatGPT, then get conversational feedback. The tool does not export Lesen/Hören keys, staff rubrics, answer indexes, unpublished mock drafts, hidden transcripts or private listening audio. Continue timed exams and officially graded submission at the existing Exams Room.

A separate practice-note saver requires explicit student consent to the extra `falowen:practice:write` OAuth scope; default `falowen:read` tokens never gain implicit write access. Notes are self-reported, bounded, idempotent and scoped to the connected student. They are not official exam results, grades or assignment completion and should not be marketed as such. 90-day expiry metadata is written; TTL activation is an additional operational step.

**Deployment/review checklist:** test both OAuth scope paths and legacy token renewal, verify cross-level isolation, inspect 16 tools including exactly one write-annotated practice-note tool, and submit a revised version of the *existing* plugin using the exact original `mcp.json` server configuration. The updated user-facing ZIP is not proof the server is deployed or OpenAI has accepted the permission change.

## A1 official tutor submission and Exams Room discovery (15 November 2026 — review branch, NOT deployed)

The Learning Companion retains `falowen:read` as its default scope. The release branch proposes two new MCP tools (18 total):

1. `get_my_falowen_exam_mocks()` — read-only list of exactly the allowlisted published `a1-mock-02`, `a1-mock-03`, `a2-mock-02` by active German course level, with Schreiben/Sprechen practice only. Continue with the existing `get_my_falowen_exam_practice(mockId,skill,part?)` tool. Do not export marking keys or listening transcripts. Exam attempts, timers, scores and official submission remain inside Exams Room. A1 Mock 01 is the course final and intentionally not part of the independent mock library.
2. `submit_my_falowen_assignment(assignmentId,answerText,requestId,confirmed)` — a strictly limited A1 tutor-assignment **first submission** using the canonical student assignment list and the same `submissions` and `submissionLocks` collections as Campus. It requires `falowen:read falowen:assignments:write`, a valid signed-in student identity, the full answer shown to the student, and fresh explicit consent to the **permanent lock**. The server chooses the student, canonical assignment and lock key; client tools cannot choose an arbitrary student. Transactionally write the submission and the lock, return the pending-review receipt; idempotent retry IDs cannot re-submit differently. Never offer a mark, create a certificate, or bypass existing resubmission policy. Timed mocks and A2/B1/C2 submissions are excluded from this first pilot.

**Fail-closed deployment gate:** even an OAuth-authorised request does not write to Firestore unless `FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED=true` is explicitly set on the learner API environment after testing and owner approval. The flag is OFF by default. Do not turn it on until the relevant A1 section completeness/recording policy is verified against the Campus workflow and server tests pass; keep Campus submission as fallback.

**Post-merge safety review (15 November 2026):** The assignment-write check must split OAuth grants on actual whitespace, not the literal `\\s` sequence. Only explicit `falowen:assignments:write` grants may proceed. The A1 pilot server now rejects all configured timed checkpoints (including `A1-5.9` and `A1-9`) and **every** A1 tutor assignment at or beyond the current timed-phase start day. This avoids bypassing Campus's authoritative timed-attempt state.

Before any permanent `submissionLocks` write, the server validates every required numbered answer and writing section against a conservative, generated A1 snapshot derived from `web/src/data/a1TutorDraftProfiles.js`, `web/src/data/timedAssignmentConfig.js`, and the special Chapter 3 completeness guard in `A1CanonicalSubmissionPanel.jsx`. Tasks requiring recordings, speaking assessments, embedded writing or unsupported source profiles are **Campus-only**. An unsupported assignment is never treated as complete; a missing section never locks the learner. The snapshot is checked with `node scripts/generateChatgptA1SubmissionRules.mjs --check` in the Companion CI. Changes to the canonical workbook rules require regeneration and review before a write release.

**Pilot remains disabled by default.** A passing PR does not enable official ChatGPT submissions, deploy backend code, or update the published OpenAI plugin. Do not enable the environment flag until authenticated A1 end-to-end tests, duplicate-retry and locked-attempt checks, and production revision checks are complete.


**Language security:** an A1 level alone does not prove German enrollment. Resolve primary `program` (German or Swahili) and only trust a `coursePlacements.german` secondary level when `secondaryProgram === "german"`. Swahili-only learners must not retrieve German tutor work or mock data. A learner changing level to A1 without changing the primary program remains Swahili for exam practice.

**Before any production activation:** run `node scripts/checkAiDocumentation.mjs`, `node scripts/generateAssessmentTaskRegistry.mjs --check`, targeted `chatgptAssignmentSubmission`, `chatgptExamPractice`, `chatgptCompanion` tests and authenticated integration tests; verify an A1 student's first confirmed submission and duplicate retry against test Firestore, ensure automatic marking picks up the canonical payload, test a locked assignment, missing OAuth scope, cross-student and cross-program access. Check Firebase and Vercel deployment separately and record the actual production revision. Publish an updated version of the **existing** Falowen Learning Companion in the OpenAI plugin dashboard: rescan, check the 18 tools and OAuth scope annotations, undergo review and publish. A GitHub PR or backend deploy does not refresh the current plugin snapshot automatically.


### German Exams Room expanded practice — 15 November 2026 (review branch)

The proposed ChatGPT exam tools now share a **build-time generated, answer-safe export** with Falowen's real learner-facing Exams Room:
- `get_my_falowen_exam_mocks()` lists **ready, visible** German mocks for the currently active German course. It includes a genuine Exams Room URL and `chatGPTPracticeSkills`. Listing a published mock is *not* a claim its entire question set is exported to ChatGPT.
- `get_my_falowen_exam_dictionary(category,part?,query?,taskId?,limit?)` retrieves the **Sprechen prompt dictionary** from `web/src/data/speakingDictionary.js` and the **Schreiben practice workspace** from `web/src/data/examWritingWorkspace.js` for the logged-in German level. Form answers are removed; only visible labels, prompts, points and prefilled values are exported. Personal answers stay in the conversation.
- `get_my_falowen_exam_practice(mockId,skill,part?,questionNumber?)` retains reviewed A1/A2 mock writing/speaking prompts. **A1 Mock 02 and 03 Lesen/Hören** now export one actual student-visible objective question at a time, with appropriate reading source text and options. Hören returns a link to the authenticated Exams Room recording, not a private R2 URL or audio stream.
- Other ready exams remain selectable **as links** until their exact question sources undergo separate answer-safe review. Non-ready, hidden or Course Book final mocks are never promoted by ChatGPT. Swahili exams remain unavailable.
- `scripts/generateChatgptExamContent.mjs` is invoked by both the existing web prebuild and the companion CI; it exports only a fixed set of learner-facing fields and fails on forbidden answer-key, transcript, rubric or private audio field names.

This is a **review PR only**, not a live plugin release. After passing backend, Firebase and web checks, the publisher must review the exact permissions and tool definitions and publish a new version of the **existing** Falowen Learning Companion. Playback should be verified with an authenticated A1 learner in Exams Room before describing Hören as available end to end.

## Multilingual companion release candidate (25 November 2026)

- `get_my_falowen_access`: recorded active programme selections (not a billing entitlement or previous-level grant).
- `get_my_falowen_swahili_lesson`: explicitly selects Kiswahili A1 for a verified primary or secondary enrolment. Generates learner-facing reading, grammar, vocabulary examples, speaking and writing from the existing workbook at build time. Missing sections, protected listening and unsupported levels fail closed. No answer keys or hidden teacher data.
- `get_my_falowen_weaknesses`: bounded tutor assignment revision priorities from explicitly level-labelled German records; no skill scores, unverified completion, or exam readiness claims. Dual programme results remain unavailable until programme-scoped records can be verified.

No new scheduled jobs, model API calls, OAuth write permissions or Firestore writes. Existing German tool contracts remain unchanged. This is a backend candidate; after CI and deployment, rescan the existing public plugin and publish the revised tool catalogue. Mock review, advanced exam readiness, persistent vocabulary revision, previous-level entitlements and richer music support remain follow-up work.

## Official workbook submission expansion (release candidate)

Two additional MCP tools use the existing assignment-write consent: `submit_my_falowen_workbook` and read-only `get_my_falowen_submission_status`. The build compiles required sections and timer exclusions from the existing A2/B1 Campus profiles and Kiswahili question IDs/choices from published A1 practice units. The German path uses Campus submissions and locks; the Kiswahili path uses the existing users/{uid}/swahiliLessons record and validates active access and complete answers. No extra marking API or background jobs. Existing A1 tool remains separate.

Rollout is fail-closed behind `FALOWEN_CHATGPT_EXPANDED_SUBMIT_ENABLED=true` after CI and authenticated staging checks. Only primary German A2/B1 early untimed assignments and generic Kiswahili A1 workbooks are supported. Special Kiswahili days 1/5/6, timed work, secondary German writes, mock exams and resubmission stay in Campus. The status tool reports records, not inferred grades. Rescan and publish the existing plugin after deployment; confirm OAuth permission and verify both programmes with synthetic accounts before enabling production writes.

## Exams Room companion expansion

26 MCP tools. Use get_my_falowen_exam_mocks to discover authorised published questions and separate Campus preview links. Practice links explicitly open Practice Mode; timed examinations remain in Campus. Additional answer-safe exports use the existing A2 Mock 2, A2 Kombi 4–8, B1 Mock 1 and B1 Mock 2 learner content. Only sections that have safe textual representations are exported; unsupported and preview questions remain in Campus. Mock 8 has no Hören export. Listening audio is protected and must be played in Campus.

get_my_falowen_mock_history lists paginated, UID-bound attempts for the chosen mock. get_my_falowen_mock_review retrieves verified historical results, answered mistakes, unanswered question numbers, and stored feedback if present. Revision priorities use recorded section scores only. No full key, unverified grades, timed attempt writes or new paid AI calls. Exam-only learners may connect but may use only the entitlement-checked exam tools. Trial accounts are limited to the designated mock; legacy or secondary course access without verifiable entitlement fails closed. Re-scan MCP after production deployment and test with paid, trial and exam-only synthetic accounts.

## Personal revision and study planning

Four new read-only MCP tools bring the catalogue to 30. Start with get_my_falowen_revision_levels; the server applies existing levelEnrollments and courseAccountAccess rules. A verified higher-level contract can include earlier revision material, including fully paid naturally expired lower courses, but never unpaid or cancelled levels. Legacy accounts with only current paid-course evidence do not automatically receive prior levels. German trials are restricted to Day 1, and exam-only users cannot access these course tools. Kiswahili A1 uses its own verified placement/contract rules. Existing submission permissions do not change.

get_my_falowen_revision_lesson returns original approved material for authorised levels; get_my_falowen_personal_plan budgets 15–120 minutes using selected lessons, scoped tutor evidence or a selected verified mock result. A learner-supplied exam date adjusts suggested pacing, not the official schedule. get_my_falowen_revision_vocabulary retrieves bilingual lesson pairs or the existing Campus published vocabulary dictionary, filtered to the authorised German level plus ALL entries. Sheet access is on demand with a bounded response, timeout and short in-memory cache; no new secret or environment variable. Unavailable content is not invented. Repeat missed terms in conversation; no persistent spaced-repetition database, grading or scheduled jobs. Exam-only students retain the separate Exams Room tools. Test the new tools in staging with current, trial, expired-lower-paid and blocked-enrollment accounts before rescan/publication.
