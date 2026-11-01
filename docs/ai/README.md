# Falowen AI documentation hub

**Reviewed:** 2026-11-01. This is the entry point for developers, coding agents and documentation maintainers. It complements—not replaces—existing implementation docs.

| Area | Canonical reference |
| --- | --- |
| Agent rules | [AGENTS.md](../../AGENTS.md) |
| System layout / responsibilities | [Architecture](architecture.md) |
| Where to edit each feature | [Source-of-truth and documentation matrix](content-source-of-truth.md) |
| Tutor / AI marking policy | [Teaching and marking rules](teaching-and-marking-rules.md) |
| Learner information | [Student data and privacy](student-data-and-privacy.md) |
| Falowen Companion | [MCP reference](mcp-plugin-reference.md) and [release guide](../chatgpt-falowen-companion.md) |
| Music, lyrics, AI timing | [Music workflow](../workflows/music-and-lyrics.md) |
| Exams, workbooks, mock publishing | [Assessment workflow](../workflows/exam-and-assignment-publishing.md) |
| Release, verification and rollback | [Deployment runbook](../workflows/deployment-and-rollback.md) |
| Public AI knowledge | [llms.txt](../../web/public/llms.txt), [Help Markdown](../../web/public/falowen-help.md), [navigation JSON](../../web/public/falowen-navigation.json) |
| Admin platform | [falowenadmin](https://github.com/learngermanghana/falowenadmin) — its own `AGENTS.md` and `docs/ai/` |

## How to use
1. Determine whether the question is about **public documented behavior**, **source code**, or **one authenticated learner**. Only authenticated MCP tools may supply private student facts.
2. Inspect the listed canonical code and tests before changing contracts.
3. Make the smallest documented change, update public navigation content *only when learner behavior changed*, and run the documentation consistency check.
4. Keep historical notes dated; don't overwrite source-of-truth files with speculative or generated answers.

This documentation does **not** grant agents access to GitHub, Firestore, OAuth, secrets, payments, or student accounts. Runtime authorization always controls access.
