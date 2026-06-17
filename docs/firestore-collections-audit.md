# Firestore collections audit for PR 1829 correction

The repository was scanned with `rg`/scripted source inspection for Firestore `collection(...)`, `doc(..., "collection")`, and Admin SDK `.collection("...")` usages before updating `firestore.rules`. The corrective rule keeps the existing authenticated fallback so unlisted Falowen tutor/admin/application collections are not disabled while owner-controlled writing documents are tightened.

## Collections found

| Collection              | Observed access pattern                                  | Rule strategy in this PR                                                             |
| ----------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `aiAuditLogs`           | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `announcements`         | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `archived`              | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `assignmentProgress`    | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `attendance`            | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `class_board`           | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `class_lesson_notes`    | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `classes`               | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `grammarQuestions`      | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `group_discussion`      | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `language`              | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `leadCaptures`          | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `lessonProgress`        | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `loginSessions`         | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `notifications`         | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `paystackInitRequests`  | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `paystackWebhookEvents` | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `presentationSessions`  | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `qa_posts`              | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `scores`                | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `sessions`              | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `studentActivityEvents` | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `studentNotifications`  | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `students`              | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `studyBuddyUsage`       | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `usageQuotas`           | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `writingScoreStats`     | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |
| `writingSubmissions`    | Application/tutor/admin Firestore usage found in source. | Preserved by authenticated fallback unless a tighter writing-specific match applies. |

## Writing-specific collections

`writingProgress`, `writingProgress/{ownerId}/attempts`, `writingReferences`, `savedWriting`, and `writingFeedback` use owner-controlled rules: create validates incoming owner fields; read/delete validate existing resource owner fields; update validates both existing and incoming owner fields. Reads and deletes do not reference `request.resource`.

## Migration strategy

Existing `writingProgress` documents may still contain legacy `writingHistory` arrays. The UI reads them for backward compatibility, but new completed attempts are saved to `writingProgress/{ownerId}/attempts/{attemptId}` with a query limit of 25. A future data migration can copy each legacy array entry into the attempts subcollection, then remove the embedded arrays once production telemetry confirms reads are coming from attempts.
