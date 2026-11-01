# Falowen for ChatGPT — learning companion pilot

Status: implementation in source; **not public or live** until CI, OAuth connection testing and production deployment are verified.

## Scope

Students can connect their **own** active Falowen account in ChatGPT and ask for their course level, A1/A2/B1 tutor-assignment list, official Campus links, recorded course progress, tutor marks and feedback, and the topic/goal of a specific course day.

Five read-only tools: get_my_falowen_profile, get_my_falowen_assignments, get_my_falowen_progress, get_my_falowen_feedback, get_my_falowen_lesson.

The plugin is **read-only**. It does not submit work, change grades, process billing, call the Falowen AI marking API or run timed examinations. Use official submission links in Campus.

**Grade caveat:** no_grade_recorded does not prove that the learner has not submitted work, because tutor marking may be pending. Data comes from the same existing Google Sheets scores integration as Falowen. If the scores integration is unavailable, the MCP tool returns an error rather than inventing marks.

## Endpoints

- MCP URL: https://www.falowen.app/api/chatgpt/mcp
- Protected-resource metadata: https://www.falowen.app/api/chatgpt/.well-known/oauth-protected-resource
- Authorization-server metadata: https://www.falowen.app/.well-known/oauth-authorization-server/api/chatgpt
- Login/consent UI: /chatgpt/connect (shown after opening ChatGPT's authorization request)
- OAuth issuer: https://www.falowen.app/api/chatgpt
- Public ChatGPT CIMD client ID: https://chatgpt.com/oauth/client.json
- OAuth scope: falowen:read

Uses authorization-code + S256 PKCE with a fixed ChatGPT redirect URL and exact resource audience. Identity comes from verified Firebase Auth. Server-side Firestore tokens are random, stored by SHA-256 hash, short-lived and limited to the connected student's record; refresh tokens rotate on use. Token endpoint accepts public OAuth client with PKCE (none), not a secret in browser code.

Firestore collections: chatgptOauthCodes, chatgptOauthAccessTokens, chatgptOauthRefreshTokens. Each document has an expiresAt timestamp; configure Firestore TTL on these three collections in Firebase Console to avoid retaining expired records. No scheduled job or paid new service is required. Existing Firebase, Google Sheets and Vercel API infrastructure are reused.

## Verification checklist

1. Run npm ci and npm --prefix functions ci; run Jest on functions/functionz/__tests__/chatgptCompanion.test.js.
2. Build web app through existing CI and ensure /chatgpt/connect renders correctly.
3. Verify OAuth metadata on target domain and perform a full authorization-code + PKCE and refresh exchange using MCP Inspector.
4. Test accounts A and B: grades, feedback and assignment links must never cross accounts. Expired trial, staff account and deletion-request accounts must be refused.
5. Review response content for credentials, payment details, other students' data and untrusted links.
6. Connect privately as a custom MCP plugin in ChatGPT, then test profile, lesson and progress tools. Do not list publicly until security and privacy review.
7. Monitor Vercel invocations, Firebase reads/writes and Google Sheets requests before widening the pilot.

## Product policy

ChatGPT should explain, give hints and provide original practice questions instead of completing assessed answers. Send students to their official Campus lesson for graded submission.

Deployment and creation/publication of the plugin in the ChatGPT Plugin Directory are **separate steps**; committing this code does neither by itself.
