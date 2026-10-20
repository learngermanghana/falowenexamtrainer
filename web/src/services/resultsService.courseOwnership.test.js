import { fetchResults } from "./resultsService";
import { buildProgressByAssignmentId } from "../hooks/useLessonProgress";

const mockScores = [
  { id: "foreign", uid: "somebody-else", studentId: "somebody-else", studentCode: "FAL-1234",
    studentEmail: "other@example.com", assignmentId: "A1-5.9", level: "A1", score: 99 },
  { id: "owned", uid: "student-uid", studentId: "student-uid", studentCode: "FAL-1234",
    studentEmail: "student@example.com", assignmentId: "A1-12.2", level: "A1", score: 76 },
];

jest.mock("../firebase", () => ({
  db: {},
  collection: (_db, name) => name,
  doc: (_db, coll, id) => ({ coll, id }),
  getDoc: async () => ({ exists: () => true, data: () => ({ studentCode: "FAL-1234" }) }),
  where: (field, op, value) => ({ field, op, value }),
  query: (name, ...constraints) => ({ name, constraints }),
  getDocs: async (ref) => {
    if (ref?.name !== "scores") return { docs: [], empty: true };
    // Simulate the student-code query returning an old record owned by
    // another UID alongside the current learner's real score.
    return {docs: mockScores.map(row => ({
      id: row.id,
      data: () => ({...row}),
    }))};
  },
  onSnapshot: () => () => {},
}));

test("fallback scores retain verified ownership fields after projection", async () => {
  const {results} = await fetchResults({level:"A1", studentCode:"FAL-1234", email:"student@example.com"});
  expect(results).toHaveLength(2);
  expect(results.find(item => item.assignmentId === "A1-5.9")).toEqual(expect.objectContaining({
    uid:"somebody-else", studentId:"somebody-else", studentEmail:"other@example.com",
  }));
  expect(results.find(item => item.assignmentId === "A1-12.2")).toEqual(expect.objectContaining({
    uid:"student-uid", studentId:"student-uid", studentEmail:"student@example.com",
  }));
});

test("a foreign-owned projected score never fabricates a course completion", async () => {
  const {results} = await fetchResults({level:"A1", studentCode:"FAL-1234", email:"student@example.com"});
  const progress = buildProgressByAssignmentId({
    level:"A1", userId:"student-uid", email:"student@example.com", studentCode:"FAL-1234", results,
  });
  expect(progress["A1-5.9"]).toBeUndefined();
  expect(progress["A1-12.2"]).toMatchObject({status:"passed", bestScore:76});
});
