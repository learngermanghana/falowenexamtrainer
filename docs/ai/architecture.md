# Falowen architecture and ownership

**Reviewed:** 2026-11-01.

## Two repositories, several experiences

| Surface | Source / deployment responsibility |
| --- | --- |
| Learner campus `www.falowen.app` | This repo: React in `web/src/`, Vercel routing in `vercel.json` and `api/`, Express/Firebase integrations in `functions/functionz/` |
| Public Music `music.falowen.app` | The learner repo's `web/public/music/` static player and existing music library / signed R2 audio APIs; **not** a standalone public R2 bucket |
| AI-facing public help | `web/public/llms.txt`, `falowen-help.md`, `falowen-navigation.json` and the generated course map |
| Learning Companion MCP | Student-scoped read-only endpoint; [plugin reference](mcp-plugin-reference.md) |
| Tutor/Admin `admin.falowen.app` | Separate **falowenadmin** React/Vite + Firebase Functions repo; do not edit it by changing learner docs alone |
| Media and classes | Signed R2 object access, Firestore, Firebase Auth, class/cohort data with server-side identity checks |

## Boundaries

- Public songs and published course media have distinct paths and approval rules. Never list or expose private Hören MP3s as public music.
- Student progress, assignment submissions, billing and teacher marks are not derivable from public lesson documents. Read them only through authenticated server/API or properly scoped MCP.
- Admin's marking worker may produce scores but is subject to server-owned answer-key versions, confidence and manual-review gates. Read [teaching and marking policy](teaching-and-marking-rules.md).
- Deployment is multi-surface: merging to learner `main` is not a Firebase Functions deployment, an Admin deployment, or public plugin publication.
- No per-listen AI transcription/translation, live background sync or unrestricted Firestore listener should be introduced just for display. Prefer static approved packs and on-demand bounded requests.

## Changes across repos

A contract change involving both learner assignment submission and Admin marking needs separate PRs plus shared payload/version tests. The two repos deploy independently; confirm each side's release status. See [source-of-truth map](content-source-of-truth.md).
