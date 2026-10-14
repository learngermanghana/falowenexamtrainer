import fs from "fs";
import path from "path";

const read = filename => fs.readFileSync(path.join(__dirname,filename),"utf8");

test("A1 expired timer opens review and dispatches the final form even with short answers",()=>{
  const timer=read("A1TimedMockExam.jsx");
  const panel=read("A1CanonicalSubmissionPanel.jsx");
  const form=read("VerifiedCloudDraftSubmissionPage.js");
  expect(timer).toContain('search.set("workbookTab", "submit")');
  expect(timer).toContain('search.set("timedAutoSubmit", "1")');
  expect(timer).toContain('form.requestSubmit()');
  expect(timer).toContain('data-draft-submit-ready');
  expect(panel).toContain("allowIncompleteSubmission={timedMockExam.enabled}");
  expect(panel).toContain("allowUnconfirmedSubmission={timedMockExam.expired || timedMockExam.timedAutoSubmit}");
  expect(panel).toContain("!completeness.ok && !timedAutoSubmit && !timedMockExam.enabled");
  expect(form).toContain("if (!confirmed && !compact && !allowUnconfirmedSubmission)");
  expect(form).toContain("await finalBatch.commit()");
  expect(form).toContain("if (!allowIncompleteSubmission && submissionText.length < MIN_SUBMISSION_CHARACTERS)");
  expect(form).toContain("if (!allowIncompleteSubmission && submissionWordCount < MIN_SUBMISSION_WORDS)");
  expect(form).toContain("onSubmissionVerified?.()");
  expect(form).toContain("onSubmissionError?.(exactError)");
});

test("A2 and B1 timer expiry retains submission retry and only verifies a successful save",()=>{
  const shared=read("SharedTimedAssignment.jsx");
  const submission=read("AssignmentSubmissionPage.js");
  expect(shared).toContain("setAttemptState(\"expired\")");
  expect(shared).toContain("expiryCallbackRef.current?.(");
  expect(submission).toContain("timedAssignment?.timedAutoSubmit");
  expect(submission).toContain('persistSubmission({ statusLabel: "submitted" })');
  expect(submission).toContain("timedAssignment.onSubmissionVerified?.()");
  expect(submission).toContain("timedAssignment.onSubmissionError?.(message)");
  expect(submission).toMatch(/!timedWorkbookSubmission && (?:minimumSubmissionWords > 0 && )?submissionWordCount < minimumSubmissionWords/);
  expect(submission).toContain("if (!form.confirmed && !timedSubmitAfterExpiry)");
  expect(submission).toContain("await batch.commit()");
  expect(submission).toContain("timedAutoSubmitRetryCountRef.current += 1");
});
