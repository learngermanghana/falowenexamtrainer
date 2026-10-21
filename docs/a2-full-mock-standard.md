# A2 full-mock standard (mandatory for every new mock)

A2 Mock 1 is the reference for the **verified scoring and persistence** workflow.
A2 Mock 2 and all future A2 full mocks must use the same backend contract.
Mock content differs; submission logic must not.

## Non-negotiable contract

1. Register a distinct `a2-mock-NN` identity in `functions/functionz/a2MockRegistry.js` with **server-held** keys for all Lesen and Hören items, title, results assignment ID, and route. Confirm those answer keys match the published questions.
2. Begin a real authenticated attempt using `startA2MockAttempt({idToken,mockId})`. Persist its exact server `attemptId` on the learner's device. Resume it instead of inventing a different attempt.
3. Save submitted reading/listening choices and writing text without relying on browser computed scores. Keep a safe backup so temporary OpenAI/Internet errors do not destroy the student's work.
4. After submission, use `scoreA2MockWriting({attemptId,mockId,...})`, then `scoreA2MockSpeaking({attemptId,mockId,examinerSessionIds,...})` for server-owned speaking receipts. The OpenAI fee may only be spent when a verified grade does not already exist.
5. Only call `saveA2MockAttempt({status:"completed"})` after the two verified subjective scores have been persisted. The backend checks the scores, recomputes the objective scores with registered keys and publishes to `scores` and `studentNotifications`. Display a score to students **only** from `verifiedResult` returned on successful publication, never from green section ticks.
6. When assessment or publication fails, preserve the submitted answers and examiner receipts, surface **Final result pending** and provide a retry. Never force repetition of a completed speaking recording just because result storage failed.
7. Do not allow a new mock to silently use Mock 1's answer key, writing prompt, task-version hash, receipt identity, score/notification ID, or title.

## Existing Mock 2 recovery

Submitted Lesen/Hören choices and Schreiben text are backed up. Previously saved
3-part AI examiner receipts may be securely claimed once against the authenticated
owner's real Mock 2 server attempt, without recording again. Old 5-part transcripts
can be graded after explicit recovery. If immutable speaking evidence is missing,
leave the mark pending rather than inventing one.

## Release gate

The full-mock release requires server contract tests in
`functions/functionz/tests/a2RegisteredMockContract.test.cjs`, examiner receipt
tests and a web build. **Before publishing any new A2 mock**, expand these tests
and the registry for the new identity. Test 4/4 completed, 4 verified /25 scores,
score publication /100, retry after OpenAI errors, return visit, and account
switching. Do not call a mock complete merely because all sections have checkmarks.
