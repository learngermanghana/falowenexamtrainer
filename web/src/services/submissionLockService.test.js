import { findOwnedSubmissionDraft, findOwnedSubmissionLock } from "./submissionLockService";
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

test.each(["A1","A2","B1"])("%s first draft is searchable without reading an unowned missing document", async level => {
  getDocs.mockResolvedValue({docs:[]});
  const id = `student__${level.toLowerCase()}__chapter`;
  const snapshot=await findOwnedSubmissionDraft({db:"db",studentId:"student",draftId:id});
  expect(snapshot).toBeNull();
  expect(collection).toHaveBeenLastCalledWith("db","submissionDrafts");
  expect(where).toHaveBeenCalledWith("studentId","==","student");
});
test("draft query returns the student's existing draft by its exact ID", async()=>{
  const entry={id:"student__a1__chapter",data:()=>({studentId:"student",submissionText:"test"})};
  getDocs.mockResolvedValue({docs:[entry]});
  expect(await findOwnedSubmissionDraft({db:"db",studentId:"student",draftId:entry.id})).toBe(entry);
  expect(await findOwnedSubmissionDraft({db:"db",studentId:"student",draftId:"other"})).toBeNull();
});
