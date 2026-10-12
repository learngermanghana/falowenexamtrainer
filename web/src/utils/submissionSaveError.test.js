import { getSubmissionSaveError } from "./submissionSaveError";
test("permission and expired-session errors tell the student how to recover without losing answers", () => {
  expect(getSubmissionSaveError({ code: "permission-denied" })).toMatch(/answers are still in the editor.*teacher/);
  expect(getSubmissionSaveError({ code: "unauthenticated" })).toMatch(/Copy your answers.*sign out and sign in/);
});
test("connection errors offer a retry, while draft failures identify the action", () => {
  expect(getSubmissionSaveError({ code: "unavailable" }, "draft")).toMatch(/draft.*internet connection.*answers are still/);
  expect(getSubmissionSaveError({ code: "deadline-exceeded" })).toMatch(/internet connection/);
});
