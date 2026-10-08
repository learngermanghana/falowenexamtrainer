const {
  getStudentExamRoomHistory,
  normalizeExamRoomHistoryRow,
} = require("../examRoomHistory");

const fakeFirestore = (records = []) => {
  const observed = [];
  const db = {
    collection(name) {
      if (name !== "scores") throw new Error("wrong collection");
      return {
        where(field, operator, uid) {
          observed.push({ field, operator, uid });
          const permitted = records
            .filter((entry) => entry.value.uid === uid)
            .sort((a, b) => a.id.localeCompare(b.id));
          const query = (limit, after = "") => ({
            startAfter(doc) {
              return query(limit, doc.id);
            },
            async get() {
              const docs = permitted
                .filter((entry) => entry.id > after)
                .slice(0, limit)
                .map((entry) => ({
                  id: entry.id,
                  data: () => entry.value,
                }));
              return { size: docs.length, docs };
            },
          });
          return { limit: (size) => query(size) };
        },
      };
    },
  };
  return { db, observed };
};

const record = (id, value = {}) => ({ id, value: { uid: "student-1", ...value } });
const practice = (n, date) => record(String(n).padStart(4, "0"), {
  source: "exam_room_practice", examSection: "lesen", level: "A1",
  date, rawScore: 12, total: 15, percent: 80,
  examRoomAttemptId: `lesen-${n}`,
});

describe("authenticated Exam Room history", () => {
  test("does not cap unordered scores before filtering recent exam attempts", async () => {
    const mostlyAssignments = Array.from({ length: 245 }, (_, i) => record(
      String(i).padStart(4, "0"),
      { source: "course_assignment", level: "A1", date: "2026-10-08T12:00:00Z" },
    ));
    const old = practice(12, "2026-01-01T12:00:00Z");
    const newest = practice(250, "2026-10-08T12:00:00Z");
    const { db, observed } = fakeFirestore([...mostlyAssignments, old, newest,
      record("private", { uid: "another-student", source: "exam_room_practice",
        examSection: "lesen", level: "A1", date: "2026-12-01T12:00:00Z",
        rawScore: 15, total: 15, percent: 100 })]);
    const history = await getStudentExamRoomHistory({ db, uid: "student-1", level: "A1" });
    expect(history.results).toHaveLength(2);
    expect(history.results[0].attemptId).toBe("lesen-250");
    expect(history.results[1].attemptId).toBe("lesen-12");
    expect(history.limited).toBe(false);
    expect(history.fetched).toBeGreaterThan(200);
    expect(observed.every((call) =>
      call.field === "uid" && call.operator === "==" && call.uid === "student-1"
    )).toBe(true);
  });

  test("caps only after sorting relevant attempts, with accurate limited flag", async () => {
    const records = Array.from({ length: 125 }, (_, i) =>
      practice(i, new Date(Date.UTC(2026, 9, 8, 0, i)).toISOString()));
    const { db } = fakeFirestore(records);
    const history = await getStudentExamRoomHistory({ db, uid: "student-1", maxResults: 100 });
    expect(history.results).toHaveLength(100);
    expect(history.limited).toBe(true);
    expect(history.results[0].attemptId).toBe("lesen-124");
    expect(history.results.at(-1).attemptId).toBe("lesen-25");
  });

  test.each(["A1", "A2", "B1"])("normalizes %s dedicated final mock schema", (level) => {
    const row = normalizeExamRoomHistoryRow("mock-score-row", {
      source: `${level.toLowerCase()}_final_mock`,
      level,
      mockAttemptId: `${level}-attempt-3`,
      assignment: `${level} Final Mock Exam`,
      score: 65,
      date: "2026-10-07T18:00:00Z",
      link: `/campus/course/${level.toLowerCase()}-final-mock-exam`,
      sectionScores: { lesen: 20, hoeren: 10, schreiben: 15, sprechen: 20 },
      scoreBreakdown: [
        { key: "lesen", score: 20, maxScore: 25 },
        { key: "hoeren", score: 10, maxScore: 25 },
        { key: "schreiben", score: 15, maxScore: 25 },
        { key: "sprechen", score: 20, maxScore: 25 },
      ],
    });
    expect(row).toMatchObject({
      level, section: "mixed", resultType: "final_mock", score: 65,
      total: 100, percent: 65, attemptId: `${level}-attempt-3`,
    });
    expect(row.scoreBreakdown).toHaveLength(4);
    expect(row.route).toBe(`/campus/course/${level.toLowerCase()}-final-mock-exam`);
  });

  test("returns mixed final mocks next to practice scores without requiring examSection", async () => {
    const { db } = fakeFirestore([
      record("a", { source: "b1_final_mock", level: "B1",
        score: 72, mockAttemptId: "mock1", date: "2026-10-08T12:00:00Z",
        sectionScores: { lesen: 18, hoeren: 19, schreiben: 20, sprechen: 15 } }),
      record("b", { source: "exam_room_practice", level: "B1", examSection: "hoeren",
        rawScore: 4, total: 5, percent: 80, date: "2026-10-07T12:00:00Z" }),
      record("c", { source: "ordinary_assignment", level: "B1", score: 90 }),
    ]);
    const history = await getStudentExamRoomHistory({ db, uid: "student-1", level: "B1" });
    expect(history.results.map((entry) => entry.section)).toEqual(["mixed", "hoeren"]);
    expect(history.results[0].attemptId).toBe("mock1");
  });

  test("rejects unrelated or invalid results, and preserves a zero score", () => {
    expect(normalizeExamRoomHistoryRow("a", {
      source: "course_assignment", examSection: "lesen",
    })).toBeNull();
    expect(normalizeExamRoomHistoryRow("a", {
      source: "exam_room_practice", level: "A2", examSection: "lesen",
      rawScore: 5, total: 0,
    })).toBeNull();
    expect(normalizeExamRoomHistoryRow("a", {
      source: "exam_room_practice", level: "A2", examSection: "hoeren",
      rawScore: 0, total: 5,
    }).percent).toBe(0);
  });
});
