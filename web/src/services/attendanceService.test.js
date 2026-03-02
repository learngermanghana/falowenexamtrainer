import { fetchAttendanceRecords, formatAttendanceRecord } from "./attendanceService";
import { collection, doc, getDoc, getDocs } from "../firebase";

jest.mock("../firebase", () => ({
  db: {},
  isFirebaseConfigured: true,
  collection: jest.fn((...segments) => ({ type: "collection", segments })),
  doc: jest.fn((...segments) => ({ type: "doc", segments })),
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

describe("fetchAttendanceRecords", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("falls back to student-code checkin document ids when uid checkin is missing", async () => {
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
      if (docId === "uid-does-not-exist") {
        return { exists: () => false };
      }
      if (docId === "DeborahERZUAH225") {
        return {
          exists: () => true,
          data: () => ({
            attended: true,
            checkedInAt: "2026-02-25T13:35:50.000Z",
          }),
        };
      }
      return { exists: () => false };
    });

    const result = await fetchAttendanceRecords({
      className: "A1 Stuttgart Klasse",
      studentCode: "DeborahERZUAH225",
      studentUid: "uid-does-not-exist",
    });

    expect(collection).toHaveBeenCalled();
    expect(doc).toHaveBeenCalled();
    expect(result.records).toHaveLength(1);
    expect(result.records[0].present).toBe(true);
    expect(result.records[0].status).toBe("Present");
    expect(result.sessions).toBe(1);
  });
});
