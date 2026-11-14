# Falowen Learning Companion — student pilot and public plugin release

## Release status (3 November 2026)

**Production MCP backend: deployed and tested for A1–C2.** The nine-tool server includes a dedicated practice guide, exact learner-facing lesson sections, C1 Falowen-authored Lesen passages and C2 skill-day material. The older *installed* ChatGPT connection may expose only five previously reviewed tools. The existing `get_my_falowen_lesson` tool remains backward-compatible and can return a safe original exercise for A1–C2 where source material exists.

**Publisher action remains required.** For a published Falowen plugin, OpenAI keeps a reviewed tool snapshot: build a new version of the **existing** Falowen Learning Companion submission, rescan the unchanged MCP endpoint, submit for review and publish the approved version. Do not create a different plugin identity or say that nine tools are installed until the updated version is visible in a fresh ChatGPT conversation.

### Open the companion from Falowen

On the signed-in home page, select **Connect ChatGPT as a study partner** below Course Book and Exams Room. The link opens the Falowen Learning Companion listing in a new tab, where learners can connect it in ChatGPT.

### Production integration

- Endpoint: https://www.falowen.app/api/chatgpt/mcp
- OAuth issuer: https://www.falowen.app/api/chatgpt
- OAuth scope: `falowen:read`; public CIMD client ID `https://chatgpt.com/oauth/client.json`
- Authorization/consent: https://www.falowen.app/chatgpt/connect (via ChatGPT's authorization request)
- Privacy notice: https://www.falowen.app/chatgpt-privacy.html
- Terms: https://www.falowen.app/chatgpt-terms.html
- Support: https://www.falowen.app/help
- Falowen general legal information: https://register.falowen.app/

The API is read-only. Each request uses the authenticated learner's account and student level. Class-session lookup requires a verified assigned cohort, respects cancellations and reschedules, and does not reveal another cohort's Zoom details. Official work, payment, grades, student management and timed exam submissions remain in Campus.

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
