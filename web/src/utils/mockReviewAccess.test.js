import { canReviewFullMock, restoreFullMockReviewState, getStudentMockStorageKey } from "./mockReviewAccess";

test("a full mock cannot be reviewed while any module is unfinished", () => {
  const exam = { stage: "result", completed: true, sectionScores: { lesen: 20, hoeren: 20 } };
  expect(canReviewFullMock(exam)).toBe(false);
  expect(restoreFullMockReviewState(exam)).toMatchObject({ stage: "schreiben", completed: false });
  const complete = { ...exam, sectionScores: { lesen: 0, hoeren: 0, schreiben: 0, sprechen: 0 } };
  expect(canReviewFullMock(complete)).toBe(true);
  expect(restoreFullMockReviewState(complete)).toBe(complete);
});
test("student mock storage separates accounts and guests", () => {
  expect(getStudentMockStorageKey("mock", "one")).not.toBe(getStudentMockStorageKey("mock", "two"));
  expect(getStudentMockStorageKey("mock", null)).toBe("mock:guest");
});
