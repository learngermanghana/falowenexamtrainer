# Firestore collections referenced in Falowen Exam Coach

This project reads from or writes to a handful of Firestore collections carried over from the prior app. Use the paths below to avoid creating duplicate collections when wiring the React frontend. React code now centralizes these routes in `web/src/lib/firestorePaths.js` so all features reuse the same collection names.【F:web/src/lib/firestorePaths.js†L1-L7】

## Class board / discussions
- `class_board/{level}/classes/{className}/posts` holds the class discussion threads the React UI lists and creates via Firestore.【F:web/src/components/ClassDiscussionPage.js†L20-L99】
- `qa_posts` stores migrated Q&A replies that the discussion view subscribes to for inline answers.【F:web/src/components/ClassDiscussionPage.js†L100-L158】

## Assignments and submissions
- `drafts_v2/{student}/lessons/{lesson}` keeps per-student draft text while learners type; legacy `draft_answers` keys are still read for older saves.【F:web/src/services/submissionService.js†L1-L120】
- `submissions/{level}/posts` is the per-level submission feed tracked in local storage alongside `submission_locks/{level__student__lesson}` to prevent duplicate sends.【F:web/src/services/submissionService.js†L120-L215】
- `scores` holds graded assignment rows pulled into the leaderboard and results screens.【F:web/src/services/assignmentService.js†L14-L25】【F:web/src/services/resultsService.js†L19-L40】

## Student profiles and auth
- `students` stores student records used for legacy login lookups on the backend and profile enrichment on the frontend.【F:functions/functionz/app.js†L349-L378】【F:web/src/services/studentDirectory.js†L22-L44】

## Attendance
- `attendance/{className}/sessions` contains per-class attendance sessions that the attendance helper aggregates for each student.【F:web/src/services/attendanceService.js†L48-L88】

## Falowen chat/coaching
- `falowenChats/{userId}/messages` persists chat history for the coaching assistant shown in the course tab.【F:web/src/services/chatService.js†L12-L45】
