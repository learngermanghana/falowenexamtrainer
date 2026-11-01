# Falowen Learning Companion — student pilot and public plugin release

## Release status (1 November 2026)

**Production MCP backend: deployed and tested.** Original A1, A2, B1 and B2 learning content is served from canonical Falowen course sources. The authenticated connection has been tested with an A1 account. **Public Plugin Directory publication is a separate, external OpenAI review and publish step.** Do not tell students the app is publicly installable before OpenAI approves and the publisher completes the publication action.

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
8. `get_my_falowen_lesson_content`: actual learner-facing sections from the canonical course files. Some A1 and B1 exercises have not yet been exported; unavailable means unavailable, never a guessed workbook passage.

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

### Required OpenAI publication steps (not performed by a production deploy)

1. The publisher signs into https://platform.openai.com and verifies the business/developer identity and Apps Management Write permission.
2. In the Plugin submission portal choose **Create plugin → With MCP**, entering the **Universal** HTTPS endpoint above (not a local URL).
3. Upload the prepared Falowen plugin ZIP if the portal requests its package metadata. Do not upload student credentials, private tokens or secrets.
4. Complete domain verification at the exact one-time challenge URL shown by the portal; the challenge token must never be guessed.
5. Set OAuth via CIMD (`client.mode=cimd`), grant `falowen:read`, and scan all eight tools; inspect tool annotations and response data.
6. Enter a dedicated reviewer demo account **privately** in the dashboard without MFA/email challenge, as required by review; do not publish the credentials in the ZIP or repository.
7. Provide an accurate demo video, five positive and three negative tests, starter prompts, privacy/terms/support URLs and geographic availability.
8. Submit for OpenAI review. After approval, the owner separately selects **Publish plugin**. Only then distribute the public directory link to students.

The available developer permissions/portal review actions are external to GitHub/Vercel deployments. Avoid announcing a published app or sharing a directory link before the actual approval and publish result.

### Cost and access

The lesson snapshot is regenerated during the existing Falowen web build. Firestore and Sheets are queried only when a student invokes the relevant tool. No new OpenAI API integration, background tracking, scheduler or paid datastore was added for this pilot. Existing hosting and Firestore traffic still incur normal service costs. The OAuth collections store SHA-256–hashed opaque tokens and expire them; configure Firestore TTL for `chatgptOauthCodes`, `chatgptOauthAccessTokens` and `chatgptOauthRefreshTokens` if not already configured.
