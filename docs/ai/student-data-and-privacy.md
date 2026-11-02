# Student data, privacy and AI access

Reviewed: 2026-11-01.

Public course information and general music can be answered using the published Help, course-map and music content. Individual level, progress, grades, tutor feedback and class participation require the student's own authenticated server or MCP response.

- For private account questions, first verify identity and scope. If no record is returned, explain that it is unavailable instead of inferring a value.
- A class session or Zoom link is limited to the verified assigned cohort.
- Official submission, grades, receipts and payment status remain authoritative in the authenticated Campus and its server contracts.
- OAuth scope `falowen:read` provides read-only Learning Companion access. Any future write action requires new authorization and review.
- Private exam keys, tutor audits, credentials and student submissions are not appropriate for public documentation, chat examples, GitHub issues or CI output.
- Public music analytics is opt-in; include consent and privacy checks before new student-level analytics. Prefer bounded requests and static reviewed content to limit costs.
- Treat music studio drafts, approximate cues and unreviewed translations differently from approved recordings.

Review [the companion contract](mcp-plugin-reference.md) and the [Admin analytics guide](https://github.com/learngermanghana/falowenadmin/blob/main/docs/music-analytics.md) before updating access or tracking.


## Authenticated Campus music practice

The \`/campus/music\` embedded player (not the public \`music.falowen.app\` listener) sends coarse song events to its same-origin React parent. The parent verifies the iframe source/origin, validates the track and duration, and posts the data with the signed-in student's Firebase ID token to the owner-owned Admin Firebase API (\`/music-practice/record\`). Students are shown an explanation above the player.

Events are limited to song start, pause/switch progress and audio completion. There is no constant timer, speech capture, answer tracking, personal-data transmission to GA4, or recording when signed out. The receiving API uses token-derived student identity, writes one summary document per student/song/UTC day, and has a per-account rate limit. Student-level reporting is owner-only and reads Firestore only when the Admin Student Practice tab is opened. Public listening and the GA4 consent model remain separate.

Records may help tutors support learners, but playback events are not assignment marks or proof of attention. The server stores an \`expireAt\` field for a 90-day TTL policy; this requires Firestore TTL to be enabled on the Admin project separately. Details and rollout checks are in the Admin repository's \`docs/music-analytics.md\`.
