import { act, renderHook, waitFor } from "@testing-library/react";
import { buildProgressByAssignmentId, mergeLessonProgress, useLessonProgress } from "./useLessonProgress";
import { isTimedAssignmentReviewUnlocked } from "../utils/timedAssignmentAccess";

const mockSubscriptions = [];
jest.mock("../firebase", () => ({
  db: {},
  collection: (_db, name) => name,
  query: (name, ...constraints) => ({ name, constraints }),
  where: (field, operator, value) => ({ field, operator, value }),
  getDocs: async () => ({ docs: [] }),
  onSnapshot: (query, next) => {
    const stop = jest.fn();
    mockSubscriptions.push({ query, next, stop });
    return stop;
  },
}));
jest.mock("../services/resultsService", () => ({
  fetchResults: async () => ({ results: [] }),
}));

beforeEach(() => { mockSubscriptions.length = 0; });

test.each(["A1-14.1", "A2-3.6", "B1-5.17"])(
  "%s saved passing score overrides a pending projection and unlocks review",
  (assignmentId) => {
    const scored = buildProgressByAssignmentId({ results: [{ assignmentId, score: 95 }] });
    const pending = { [assignmentId]: { status: "submitted", passed: false, hasResult: true, markedAt: "2026-10-06" } };
    const progress = mergeLessonProgress(scored, pending)[assignmentId];
    expect(progress.status).toBe("passed");
    expect(progress.bestScore).toBe(95);
    expect(isTimedAssignmentReviewUnlocked({ attemptState: "submitted", progress })).toBe(true);
  }
);

test("failed scores stay locked and newer marked corrections take precedence", () => {
  const older = buildProgressByAssignmentId({ results: [{ assignmentId: "A1-14.1", score: 95, date: "2026-10-01" }] });
  const newer = buildProgressByAssignmentId({ results: [{ assignmentId: "A1-14.1", score: 40, date: "2026-10-02" }] });
  const progress = mergeLessonProgress(older, newer)["A1-14.1"];
  expect(progress.status).toBe("failed");
  expect(isTimedAssignmentReviewUnlocked({ attemptState: "submitted", progress })).toBe(false);
});

test.each(["A1", "A2", "B1"])("%s mirror scores arriving after submission update live progress", async (level) => {
  const assignmentId = `${level}-14.1`;
  const profile = { studentCode: "student-1", email: "student@example.com" };
  const user = { uid: "uid-1" };
  const { result, unmount } = renderHook(() => useLessonProgress({ studentProfile: profile, user, level }));
  await waitFor(() => expect(result.current.loading).toBe(false));
  const projection = mockSubscriptions.find((entry) => entry.query.name === "lessonProgress");
  const scores = mockSubscriptions.find((entry) => entry.query.name === "scores" && entry.query.constraints[0].field === "studentCode");
  act(() => projection.next({ docs: [{ id: "progress-1", data: () => ({ assignmentId, level, status: "submitted" }) }] }));
  expect(result.current.progressByAssignmentId[assignmentId].status).toBe("submitted");
  act(() => scores.next({ docs: [{ id: "score-1", data: () => ({ assignmentId, level, studentCode: "student-1", score: 95 }) }] }));
  expect(result.current.progressByAssignmentId[assignmentId].status).toBe("passed");
  expect(result.current.progressByAssignmentId[assignmentId].bestScore).toBe(95);
  // A delayed pending projection cannot relock an already marked assignment.
  act(() => projection.next({ docs: [{ id: "progress-1", data: () => ({ assignmentId, level, status: "submitted" }) }] }));
  expect(result.current.progressByAssignmentId[assignmentId].passed).toBe(true);
  unmount();
  mockSubscriptions.forEach(({ stop }) => expect(stop).toHaveBeenCalledTimes(1));
});
