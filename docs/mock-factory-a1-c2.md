# Mock Exam Factory — A1, A2, B1, B2, C1, C2

## Two distinct stages

1. **Private content authoring:** In Admin → Mock Builder, create `a1-mock-04`, `a2-mock-03`, `b1-mock-02`, etc. Drafts are stored in the staff-only Firestore `mockFactoryDrafts` collection. Teacher JSON export is deliberately NOT executable exam code. Include original questions, stable IDs, separate protected audio object keys, teacher-approved answer keys and rubrics.
2. **Verified production publication:** Convert reviewed content into the level-specific examination engine only after registering exact answers server-side, assigning attempt IDs, validating AI marking receipts, and passing end-to-end student + Admin result tests. Every new `ready` full mock must be explicitly registered in `web/src/data/mockFactoryContract.js` *and* have tests demonstrating those claims. It must have a real student route. Never promote a draft simply by checking boxes in Admin.

The generator's default is always `preview`. Existing published A1, A2, B1 and B2 routes are left untouched. A draft for a new level/number does not magically create a real four-module exam or score.

### QA for every level

- **Lesen:** verify that each learner-visible question ID maps to the same server-owned key. Check duplicate IDs, ambiguous answers, and the appropriate level scoring scale.
- **Hören:** same answer-key validation, protected R2 MP3 object keys, manifest publication, valid permissions, audio playback, question evidence, and no unannounced change after release.
- **Schreiben:** exact task-specific rubric, authoritative exam identity, reuse of already verified OpenAI marks, model failures and quota recovery.
- **Sprechen:** secure attempt binding, matching examiner task IDs and immutable receipts. Do not publish browser practice feedback as a verified result.
- **Result:** complete all four skills with a dedicated test learner, confirm authenticated Firestore attempt completed, student sees final grade, Admin has the same grade, and resubmission after a simulated save failure is idempotent.
- **Release:** verify BOTH the website (Vercel) and backend (Firebase/Cloud Run) run compatible commits, including the required Firestore rules. GitHub merge or UI preview alone is not sufficient.

Level-specific marking scales and Goethe part counts must be configured in each level's tested grader, **not copied from A2's four × /25 scheme**. A Goethe exam simulation is practice marking, not an official Goethe certificate.

### A2 Mock 3 status

Mock 3 is a **draft**. Do not publish while Hören is unfinished. Existing teacher-only `Ein neuer Job` Teil 4 draft is PR [#3080](https://github.com/learngermanghana/falowenexamtrainer/pull/3080). Its first Richtig/Falsch answer requires audio review: `Gastronomie` doesn't conclusively rule out employment in a hotel. R2 audio must be actually verified before claiming it is ready.

### C1 and C2 status

Draft authoring is available, but a complete verified four-module engine and result publisher must be implemented and tested before any C1/C2 mock is `ready`. Do not present reading-only exercises as a completed full exam.

### Security

- Students have no read/write access to `mockFactoryDrafts`.
- Staff can create/edit `draft` or `review` records only. No browser API grants `published` status.
- Published correct answers and score calculations are server-owned.
- Admin's local rules file is not the complete production Firestore ruleset; the exam trainer's `firestore.rules` is the canonical source. Do not deploy Admin's reduced rules file over it.
