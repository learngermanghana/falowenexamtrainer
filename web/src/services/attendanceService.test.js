import {
  fetchAttendanceRecords,
  filterAttendanceRecordsForReporting,
  formatAttendanceRecord,
  reconcileAttendanceRecords,
} from "./attendanceService";
import { collection, doc, getDoc, getDocs } from "../firebase";

jest.mock("../firebase", () => ({
  db: {},
  isFirebaseConfigured: true,
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
}));

describe("formatAttendanceRecord", () => {
  it("prefers explicit present flag over conflicting status text", () => {
    const { record } = formatAttendanceRecord(
      "2026-03-25",
      {
        students: {
          DeborahERZUAH225: {
            present: true,
            status: "Absent",
          },
        },
      },
      "DeborahERZUAH225"
    );

    expect(record.present).toBe(true);
    expect(record.status).toBe("Present");
  });

  it("includes chapter and topic in the attendance title when available", () => {
    const { record } = formatAttendanceRecord(
      "2026-03-26",
      {
        chapter: "6",
        topic: "Objects and Colors",
        students: {
          DeborahERZUAH225: {
            present: true,
          },
        },
      },
      "DeborahERZUAH225"
    );

    expect(record.title).toBe("Chapter 6 · Objects and Colors");
    expect(record.chapter).toBe("Chapter 6");
    expect(record.topic).toBe("Objects and Colors");
  });

  it("keeps a preformatted chapter label without duplicating the prefix", () => {
    const { record } = formatAttendanceRecord(
      "2026-03-27",
      {
        chapter: "Chapter 7",
        students: {
          DeborahERZUAH225: {
            present: false,
          },
        },
      },
      "DeborahERZUAH225"
    );

    expect(record.title).toBe("Chapter 7");
    expect(record.chapter).toBe("Chapter 7");
  });
});

describe("filterAttendanceRecordsForReporting", () => {
  const pastPresent = {
    id: "2026-06-10",
    date: "2026-06-10",
    title: "Live class",
    marked: true,
    present: true,
  };
  const pastAbsent = {
    id: "2026-06-11",
    date: "2026-06-11",
    title: "Live class",
    marked: true,
    present: false,
  };
  const futureAbsent = {
    id: "2026-07-10",
    date: "2026-07-10",
    title: "Future live class",
    marked: true,
    present: false,
  };

  it("does not count a future session even when it was pre-marked absent", () => {
    const records = filterAttendanceRecordsForReporting(
      [pastPresent, pastAbsent, futureAbsent],
      { now: "2026-06-21T12:00:00Z" }
    );

    expect(records.map((record) => record.id)).toEqual(["2026-06-10", "2026-06-11"]);
  });

  it("uses the class start and end dates from the class catalogue", () => {
    const records = filterAttendanceRecordsForReporting(
      [
        { ...pastAbsent, id: "2026-06-01", date: "2026-06-01" },
        { ...pastPresent, id: "2026-06-12", date: "2026-06-12" },
        { ...pastAbsent, id: "2026-08-08", date: "2026-08-08" },
      ],
      {
        className: "A1 Munich Klasse",
        now: "2026-09-01T12:00:00Z",
      }
    );

    expect(records.map((record) => record.id)).toEqual(["2026-06-12"]);
  });

  it("removes self-practice lessons from live-class attendance", () => {
    const records = filterAttendanceRecordsForReporting(
      [
        pastPresent,
        {
          id: "practice",
          date: "2026-06-09",
          title: "Day 0 Tutorial - Self-practice only",
          marked: true,
          present: false,
        },
      ],
      { now: "2026-06-21T12:00:00Z" }
    );

    expect(records).toEqual([pastPresent]);
  });

  it("waits until the end of a date-only session before counting it", () => {
    const records = filterAttendanceRecordsForReporting(
      [
        {
          id: "today",
          date: "2026-06-21",
          title: "Today's class",
          marked: true,
          present: false,
        },
      ],
      { now: "2026-06-21T12:00:00Z" }
    );

    expect(records).toEqual([]);
  });
});

describe("reconcileAttendanceRecords", () => {
  it("keeps one present record when the same course day is also pending", () => {
    const records = reconcileAttendanceRecords([
      {
        id: "assignment-a1-3",
        title: "Day 3 - Pronouns",
        marked: false,
        present: null,
        status: "Pending",
      },
      {
        id: "2026-08-18",
        sessionLabel: "Day 3: Personal Information and Articles",
        date: "2026-08-18",
        marked: true,
        present: true,
        status: "Present",
      },
    ]);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      id: "2026-08-18",
      present: true,
      marked: true,
      status: "Present",
    });
  });

  it("lets a present mark override an absent mark for the same course day", () => {
    const records = reconcileAttendanceRecords([
      {
        id: "old-day-8",
        title: "Day 8 - Countries and Languages",
        marked: true,
        present: false,
        status: "Absent",
      },
      {
        id: "checkin-day-8",
        title: "Day 8: Countries and Languages",
        marked: true,
        present: true,
        status: "Present",
      },
    ]);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      id: "checkin-day-8",
      present: true,
      status: "Present",
    });
  });

  it("does not merge different course days held on the same calendar date", () => {
    const records = reconcileAttendanceRecords([
      {
        id: "day-3",
        title: "Day 3: Personal Information",
        date: "2026-08-18",
        marked: true,
        present: true,
      },
      {
        id: "day-4",
        title: "Day 4: Numbers and Addresses",
        date: "2026-08-18",
        marked: true,
        present: true,
      },
    ]);

    expect(records).toHaveLength(2);
  });
});

describe("fetchAttendanceRecords", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    collection.mockImplementation((...segments) => ({ type: "collection", segments }));
    doc.mockImplementation((...segments) => ({ type: "doc", segments }));
  });

  it("falls back to a normalized student-code checkin when the uid checkin is missing", async () => {
    getDocs.mockResolvedValue({
      docs: [
        {
          id: "2026-03-25",
          data: () => ({
            title: "Session 25",
            students: {
              DeborahERZUAH225: { present: false },
            },
          }),
        },
      ],
    });

    getDoc.mockImplementation(async (ref) => {
      const docId = ref?.segments?.[ref.segments.length - 1];
      if (docId === "uid-does-not-exist") return { exists: () => false };
      if (String(docId || "").toLowerCase() === "deboraherzuah225") {
        return {
          exists: () => true,
          data: () => ({
            attended: true,
            checkedInAt: "2026-03-25T13:35:50.000Z",
          }),
        };
      }
      return { exists: () => false };
    });

    const result = await fetchAttendanceRecords({
      className: "A1 Stuttgart Klasse",
      studentCode: "DeborahERZUAH225",
      studentUid: "uid-does-not-exist",
      now: "2026-03-26T23:59:59Z",
    });

    expect(collection).toHaveBeenCalled();
    expect(doc).toHaveBeenCalled();
    expect(result.records).toHaveLength(1);
    expect(result.records[0].present).toBe(true);
    expect(result.records[0].status).toBe("Present");
    expect(result.sessions).toBe(1);
  });

  it("excludes future Firestore sessions from the returned records and totals", async () => {
    getDocs.mockResolvedValue({
      docs: [
        {
          id: "2026-06-20",
          data: () => ({
            title: "Completed class",
            students: { Student001: { present: true } },
          }),
        },
        {
          id: "2026-07-20",
          data: () => ({
            title: "Future class",
            students: { Student001: { present: false } },
          }),
        },
      ],
    });
    getDoc.mockResolvedValue({ exists: () => false });

    const result = await fetchAttendanceRecords({
      className: "Unknown Test Class",
      studentCode: "Student001",
      now: "2026-06-21T12:00:00Z",
    });

    expect(result.records.map((record) => record.id)).toEqual(["2026-06-20"]);
    expect(result.sessions).toBe(1);
    expect(result.excludedSessions).toBe(1);
  });

  it("does not return the same course day as both present and pending", async () => {
    getDocs.mockImplementation(async (ref) => {
      if (ref?.segments?.[1] === "classes") return { docs: [] };
      return {
        docs: [
          {
            id: "assignment-a1-3",
            data: () => ({
              title: "Day 3 - Pronouns",
            }),
          },
          {
            id: "2026-08-18",
            data: () => ({
              date: "2026-08-18",
              sessionLabel: "Day 3: Personal Information and Articles",
              attendance: { Student001: true },
            }),
          },
        ],
      };
    });
    getDoc.mockResolvedValue({ exists: () => false });

    const result = await fetchAttendanceRecords({
      className: "Unknown Test Class",
      studentCode: "Student001",
      now: "2026-09-01T23:59:59Z",
    });

    expect(result.records).toHaveLength(1);
    expect(result.records[0]).toMatchObject({
      id: "2026-08-18",
      marked: true,
      present: true,
      status: "Present",
    });
    expect(result.sessions).toBe(1);
  });

  it("preserves Present by assignment and its evidence", () => {
    const { record } = formatAttendanceRecord(
      "session-day-4",
      {
        students: {
          Student001: {
            present: true,
            status: "present_by_assignment",
            source: "assignment_submission",
            method: "Assignment",
            assignmentId: "A1-day-4",
          },
        },
      },
      "Student001"
    );

    expect(record).toMatchObject({
      present: true,
      presentByAssignment: true,
      status: "Present by assignment",
      attendanceSource: "assignment_submission",
      attendanceMethod: "Assignment",
      assignmentId: "A1-day-4",
    });
  });

});
