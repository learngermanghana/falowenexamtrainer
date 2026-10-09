# Question-aware marking

The Writing and Speaking pages send the selected task ID. The API resolves that ID against the packaged learner-facing task catalog and grades every required point. Writing includes the displayed situation and points; speaking includes the displayed question, so an outdated tab is rejected instead of marked against a changed task. Free practice without a catalog ID must not receive invented task-completion requirements.

A1–B2 mock markers receive the actual task definitions, with B2 presentation marking restricted to the selected topic. They grade transcripts directly rather than reusing earlier analysis scores or trusting browser-provided mock task descriptions. Mock requests include a hash of their bundled question data; mismatches return `409 ASSESSMENT_TASK_CHANGED` before AI calls or quota charges. Answers remain in the browser and the message asks learners to copy them before reloading.

Edit questions in their existing learner-facing data files/components. Run:

```
node scripts/generateAssessmentTaskRegistry.mjs
node scripts/generateAssessmentTaskRegistry.mjs --check
```

Commit `functions/data/assessmentTasks.json` and `web/src/data/assessmentTaskVersions.json` alongside question changes. The generator runs before the web build, in the Firebase deployment workflow and in Firebase predeploy. CI checks committed snapshots for drift. Exam point counts remain part of their approved rubric: changing the number of points requires updating the scoring contract too; generation refuses incompatible counts.

The registry must stay under `functions/` because Firebase uploads only that directory. Generation reads the named data initializers in JSX files without executing React modules. Keep those task constants self-contained; extraction errors stop deployment rather than retain stale task data.
