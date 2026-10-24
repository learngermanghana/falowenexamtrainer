# Structured submission contract

Falowen keeps one textarea for students but derives its headings from the canonical assignment.

- A1 uses `a1AssignmentRegistry` section ownership and ignores non-submission reminders.
- A2/B1 use the shared workbook section profile. Teil 4 is included only when it is actually submitted.
- The textarea stores ordinary backward-compatible text with `TEIL N` headings.
- The Firestore payload also stores `structuredSections`, `submissionSectionOrder`, `requiredSubmissionParts`, and `submissionStructureVersion`.
- Submission is blocked when a required heading is removed or a required section has no answer.
- Admin clients should prefer `structuredSections` and fall back to legacy text parsing for historical submissions.
