# A2 full mock standard

A2 Mock 1 (`a2-final-01`) is the reference implementation for every full A2 mock.

## Mandatory shared lifecycle

1. **Start:** call `/a2-mock/attempt/start` with the correct distinct mockId. Persist the returned attemptId; resume the same attempt after reload.
2. **Save:** call `/a2-mock/attempt/save` with the same attemptId as the learner progresses, retaining objective answers and the section stage.
3. **Objective marks:** server recomputes Lesen and Hören from **the correct mock-specific keys**, not from student-supplied scores.
4. **Writing:** evaluate with `/writing/a2-mock-score` using the server attemptId and the mock's task-specific rubric. Save `verifiedSections.schreiben` and reuse completed assessment results.
5. **Speaking:** verify examiner receipts against the authenticated learner, mockId, taskId and attemptId; save `verifiedSections.sprechen`. Do not treat client-stored feedback as a verified result.
6. **Finalize:** request `/a2-mock/attempt/save` with status `completed`. The server alone assembles four /25 marks, creates the /100 score, and synchronizes the Results and Admin records.
7. **Recover:** a retry must be idempotent and reuse existing submissions and verified assessments without automatically paying for another model call.
8. **Confirm:** show Completed only after the backend confirms result persistence. A local 4/4 tracker does not count.

## Publication rule

Every new A2 catalog entry starts as `preview` and `section-preview`.
It becomes `status: "ready", mode: "full"` only after all five capability flags in
`a2FullMockContract.js` are verified by the end-to-end suite and then explicitly enabled.

**A2 Mock 2 remains preview:** It currently has submitted-answer backups and browser progress only. It must receive the server attempt, mock-specific objective keys, verified writing and speaking pipelines, and final synchronization before it is called a full exam. The publication guard intentionally does not fabricate these features.

## Required tests before promotion

- New A2 mock creates and resumes its own server attempt without overlapping Mock 1.
- Lesen/Hören each score /25 against the selected mock's keys.
- Submitted writing is marked once and persisted as verified /25.
- Three examiner receipts verify the same student's mock-specific attempt and total /25.
- All four modules produce a verified /100 result in student Results, Admin, and score storage.
- Repeated finalization is idempotent; failed sync retries without discarding answers or recharging AI.
- Existing unfinished mocks recover safely, including older five-recording speaking answers.
