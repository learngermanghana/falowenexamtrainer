# Course speaking score synchronization

The learner API saves authoritative A2/B1 speaking scores, then queues an
`automaticScoreSync` document in Firebase project `falowen-examiner-trainer`.
The consumer belongs to the **falowenadmin** Firebase codebase in the same project.
Do not add a second consumer to the learner codebase: both would export the same job.

Tracked consumer:
- [Admin function export](https://github.com/learngermanghana/falowenadmin/blob/main/functions/index.js): `syncAutomaticCourseScore`, a create trigger on `automaticScoreSync/{syncId}` in `us-central1`.
- [Admin worker implementation](https://github.com/learngermanghana/falowenadmin/blob/main/functions/automaticCourseMarking.js): `createScoreSyncWorker`, bounded retries, latest saved score, stable upsert event ID.
- [Admin deployment workflow](https://github.com/learngermanghana/falowenadmin/blob/main/.github/workflows/deploy-firebase.yml): deploys `functions:falowenadmin:syncAutomaticCourseScore` before marking producers.
- [Speaking completion metadata](https://github.com/learngermanghana/falowenadmin/pull/1118).

Deploy the Admin consumer first, then this repository's API. The learner Firebase
workflow runs `scripts/checkSpeakingSyncConsumer.cjs` before deployment and fails
if the shared consumer is absent, inactive, has the wrong codebase or watches the
wrong collection. The authenticated deployment account needs permission to describe
Cloud Functions. No new webhook secrets are needed in the learner API.

Student success means the score is saved in Firestore. Export status remains on
the score and job documents for Admin diagnosis. A speaking-specific dedupe suffix
preserves historical workbook results sharing the lesson assignment ID.
