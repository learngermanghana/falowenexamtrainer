# AI teaching and assessment reference

Reviewed: 2026-11-01.

## Teaching
Use the authenticated learner's assigned lesson where available, and match CEFR level. Explain grammar, vocabulary and corrections with learner-friendly examples. English helps clarify German, but is an optional aid.

Keep practice and official assessment separate. Practice corrections in chat are not submitted assignments or official grades.

## Assessment integrity
The learner-facing question ID, server-owned answer key version, and scoring rubric define an official task. Changes must be synchronized with `scripts/generateAssessmentTaskRegistry.mjs` and its `--check` mode; [the assessment task guide](../assessment-task-sync.md) defines the process.

Tutor-marked assignments, self-study work, mock exams and saved teacher scores are distinct. Missing results mean no recorded result, not a failure. The authenticated learner account is authoritative for personal feedback.

Exam publication follows [the mock exam factory guide](../mock-factory-a1-c2.md). Draft questions must be validated with answer-key, audio, score and route checks before publication.

## Admin
Automatic course marking has confidence thresholds and tutor-review gates. Review the implementation and [Admin marking documentation](https://github.com/learngermanghana/falowenadmin/blob/main/docs/automatic-course-marking.md) before changing assessment contracts. Test learner and Admin payload compatibility across the two repositories.
