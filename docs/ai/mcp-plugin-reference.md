# Falowen Learning Companion — tool inventory

Reviewed: 2026-11-01. The backend and OpenAI Plugin Directory review are different release stages.

- MCP endpoint: `https://www.falowen.app/api/chatgpt/mcp`
- OAuth issuer: `https://www.falowen.app/api/chatgpt`
- Authorized student read scope: `falowen:read`

The current learner-scoped tools are documented in [the release guide](../chatgpt-falowen-companion.md).

| Tool | Expected information |
| --- | --- |
| `get_my_falowen_profile` | Own enrolled level and profile |
| `get_my_falowen_assignments` | Own assignment status and course links |
| `get_my_falowen_progress` | Own progress with missing-grade caveats |
| `get_my_falowen_feedback` | Own saved tutor feedback |
| `get_my_falowen_next_class` | Verified own class session |
| `get_my_falowen_class_preparation` | Lesson-grounded preparation |
| `get_my_falowen_lesson` | Canonical lesson metadata |
| `get_my_falowen_lesson_content` | Available learner-facing content |

The current connector does not submit assignments or mutate grades, payments or student records. Schema and permission changes require server tests and a new plugin review as applicable.

Use [the privacy guide](student-data-and-privacy.md) for student data boundaries. Never assert that a plugin is publicly installed solely because the MCP backend is deployed.
