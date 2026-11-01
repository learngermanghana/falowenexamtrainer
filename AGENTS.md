# Falowen learner platform — AI agent instructions

Read this file before editing this repository. This is a **public** repository: never put passwords, OAuth tokens, student records, private R2 URLs, service-account JSON, environment values, or reviewer credentials in docs, logs or commits.

## First, find the right source
- Start with [AI documentation index](docs/ai/README.md), [platform architecture](docs/ai/architecture.md), and [source-of-truth map](docs/ai/content-source-of-truth.md).
- **Learner UI and courses:** `web/src/`; **public assets:** `web/public/`; **backend:** `functions/functionz/`; **hosting:** `api/`, `vercel.json`. Admin is a **different** repository: [learngermanghana/falowenadmin](https://github.com/learngermanghana/falowenadmin).
- The [ChatGPT Learning Companion](docs/chatgpt-falowen-companion.md) currently exposes **read-only**, student-scoped tools. A repository deploy is *not* OpenAI Plugin Directory approval.
- Use the generated course map and official public help for navigation; do not invent grades, timetables, payment states, assessment rules or enabled features.

## Non-negotiable editing constraints
1. **A1 tutor workbooks:** use `web/src/components/A1TutorMarkedWorkbookShell.js` and existing canonical assignment IDs. Music is optional/ungraded; preserve Review & Submit, saved drafts, timers, and grading. A2/B1 have separate workbook navigation.
2. **Assessment:** question IDs, answer keys, scoring rubrics and published mock status are server-owned. Run the [assessment registry process](docs/assessment-task-sync.md); never publish unreviewed drafts as real exams.
3. **Music:** public `music/<level>/day-XX/*.mp3` is not private Hören audio. Playback does not imply that a lyric or timestamp is verified. Follow [music and lyrics rules](docs/workflows/music-and-lyrics.md). Treat Whisper-generated cues as **estimated** until reviewed. English translations require exact recording key **and** German lines.
4. **Student data / AI:** require authenticated learner identity for personal information. Do not claim a tool can write grades, submit assignments, or access another student's cohort. Follow [AI privacy rules](docs/ai/student-data-and-privacy.md).
5. **Deployments:** use pull requests, scoped tests, and check the *actual production revision*. Do not merge on failing checks or silently change Firestore rules, billing, subscriptions, R2 policy or cloud costs.
6. **Docs:** update the existing canonical document with behavior changes; do not create a second contradictory source. Follow [documentation update matrix](docs/ai/content-source-of-truth.md).

## Before considering work complete
- Explain exactly what changed, what was tested, and what remains **unverified**.
- Run `node scripts/checkAiDocumentation.mjs` for documentation changes. For questions/tasks, also run `node scripts/generateAssessmentTaskRegistry.mjs --check`; use relevant suite tests and build checks for code changes.
- Generated course map `falowen-course-map.json` is a **build artifact**, not a committed source file.
- Never describe estimated lyrics as "auto-synced and verified" or a PR as deployed before confirming the production state.
