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
