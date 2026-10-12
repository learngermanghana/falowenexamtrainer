import { findOwnedSubmissionLock } from "./submissionLockService";
import { collection, getDocs, query, where } from "../firebase";
jest.mock("../firebase", () => ({ collection: jest.fn(() => "locks"), getDocs: jest.fn(), query: jest.fn(() => "owned-query"), where: jest.fn(() => "owner-filter") }));
beforeEach(() => jest.clearAllMocks());
test("a student's first submission checks only their own existing locks", async () => {
  getDocs.mockResolvedValue({ docs: [] });
  expect(await findOwnedSubmissionLock({ db: "db", studentId: "student", lockId: "task" })).toBeNull();
  expect(collection).toHaveBeenCalledWith("db", "submissionLocks");
  expect(where).toHaveBeenCalledWith("studentId", "==", "student");
  expect(query).toHaveBeenCalledWith("locks", "owner-filter");
});
test("an existing lock prevents duplicate submission without blocking other tasks", async () => {
  const lock = { id: "task" };
  getDocs.mockResolvedValue({ docs: [{ id: "another-task" }, lock] });
  expect(await findOwnedSubmissionLock({ db: "db", studentId: "student", lockId: "task" })).toBe(lock);
  expect(await findOwnedSubmissionLock({ db: "db", studentId: "student", lockId: "new-task" })).toBeNull();
});
