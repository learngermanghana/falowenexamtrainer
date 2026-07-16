const mockGetDoc = jest.fn();
const mockDoc = jest.fn((...parts) => parts.join("/"));

jest.mock("../firebase", () => ({
  db: {},
  collection: jest.fn(),
  doc: mockDoc,
  getDoc: mockGetDoc,
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

import { __private__ } from "./canonicalLiveClassServiceV4";

describe("canonical live class V4 compatibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("converts Falowen Admin official curriculum indexes from one-based to zero-based", () => {
    const normalized = __private__.normalizeSession({
      id: "a1-bonn-day-3",
      data: () => ({
        classId: "a1-bonn",
        topic: "Day 3: Personal Information",
        assignmentIds: ["A1-1.1-PRACTICE", "A1-1.2"],
        curriculumIndex: 3,
        curriculumDay: 3,
        curriculumSource: "courseDictionary-day-groups",
        curriculumVersion: 2,
        startsAt: "2026-07-17T11:00:00.000Z",
        endsAt: "2026-07-17T12:00:00.000Z",
      }),
    });

    expect(normalized.curriculumIndex).toBe(2);
    expect(normalized.storedCurriculumIndex).toBe(3);
    expect(normalized.curriculumDay).toBe(3);
  });

  test("uses the student's exact class document before matching duplicate class names", async () => {
    mockGetDoc.mockResolvedValue({
      id: "a1-bonn-current",
      exists: () => true,
      data: () => ({
        name: "A1 Bonn Klasse",
        scheduleRules: [
          { day: "wed", startTime: "11:00" },
          { day: "thu", startTime: "11:00" },
          { day: "fri", startTime: "11:00" },
        ],
      }),
    });

    const klass = await __private__.findPreferredCanonicalClass({
      classId: "a1-bonn-current",
      className: "A1 Bonn Klasse",
    });

    expect(mockDoc).toHaveBeenCalledWith({}, "classes", "a1-bonn-current");
    expect(klass.id).toBe("a1-bonn-current");
    expect(klass.scheduleRules.map((rule) => rule.day)).toEqual(["wed", "thu", "fri"]);
  });
});
