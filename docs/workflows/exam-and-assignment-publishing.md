# Publishing lessons, tutor workbooks and exam tasks

Reviewed: 2026-11-01.

## Course editing
The canonical learner sources define the day/chapter and visible tasks. The generated A1–C2 course map is a build output from `scripts/generateFalowenCourseMap.mjs`; it should not become a manually edited second source.

A1 tutor workbooks use `web/src/components/A1TutorMarkedWorkbookShell.js` and level-specific assignment IDs. Optional Music does not belong to required sections or grading. A2/B1 have separate workbook contracts. Preserve existing saved answers, submission routing, gates and timers.

## Assessment changes
- Edit the learner-facing original task definition.
- Run `node scripts/generateAssessmentTaskRegistry.mjs` and `node scripts/generateAssessmentTaskRegistry.mjs --check`.
- Review answer keys, task IDs, writing/speaking rubric, payload version and required points.
- Use targeted workbook, navigation and marking tests for the affected level and lesson.
- New mock drafts stay private until the four exam modules, audio keys, server answers, scoring and results routes are verified.

See [question-aware marking](../assessment-task-sync.md) and [the mock factory](../mock-factory-a1-c2.md). If Admin marking is affected, coordinate an independent Admin PR for its contract.
