import { fetchAssignmentSummary } from "./assignmentService";
import { doc, getDoc } from "../firebase";
import {
  buildAssignmentCatalogForLevel,
  resolveAssignmentCanonicalKey,
  resolveAssignmentMatchKey,
} from "../utils/assignmentIdentity";

jest.mock("../firebase", () => ({
  db: {},
  doc: jest.fn((...segments) => ({ segments })),
  getDoc: jest.fn(),
}));

jest.mock("../utils/assignmentIdentity", () => ({
  buildAssignmentCatalogForLevel: jest.fn(),
  resolveAssignmentCanonicalKey: jest.fn(),
  resolveAssignmentMatchKey: jest.fn(),
}));

describe("fetchAssignmentSummary recommendation flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ level: "A1" }),
    });

    buildAssignmentCatalogForLevel.mockReturnValue([
      {
        day: 1,
        label: "Day 1: 0.1",
        assignmentId: "0.1",
        canonicalAssignmentId: "A1-0.1",
        matchKey: "A1-0.1",
      },
      {
        day: 2,
        label: "Day 2: 0.2",
        assignmentId: "0.2",
        canonicalAssignmentId: "A1-0.2",
        matchKey: "A1-0.2",
      },
      {
        day: 2,
        label: "Day 2: 1.1",
        assignmentId: "1.1",
        canonicalAssignmentId: "A1-1.1",
        matchKey: "A1-1.1",
      },
      {
        day: 3,
        label: "Day 3: 1.2",
        assignmentId: "1.2",
        canonicalAssignmentId: "A1-1.2",
        matchKey: "A1-1.2",
      },
    ]);

    resolveAssignmentCanonicalKey.mockImplementation(({ assignmentId }) =>
      assignmentId ? `A1-${assignmentId}` : ""
    );
    resolveAssignmentMatchKey.mockImplementation(({ assignmentId }) =>
      assignmentId ? `A1-${assignmentId}` : ""
    );
  });

  it("recommends the first incomplete lesson in schedule order for partially completed shared days", async () => {
    const summary = await fetchAssignmentSummary({
      studentCode: "st-1",
      resultsRows: [
        {
          studentCode: "st-1",
          assignmentId: "0.1",
          assignment: "A1 0.1",
          score: 86,
          level: "A1",
        },
        {
          studentCode: "st-1",
          assignmentId: "1.1",
          assignment: "A1 1.1",
          score: 80,
          level: "A1",
        },
      ],
    });

    expect(doc).toHaveBeenCalledWith(expect.anything(), "students", "st-1");
    expect(summary.student.recommendationBlocked).toBe(false);
    expect(summary.student.nextRecommendedAssignment?.label).toBe("Day 2: 0.2");
    expect(summary.student.nextRecommendedAssignment?.day).toBe(2);
    expect(summary.student.jumpedAssignments).toEqual([]);
  });


  it("marks jumped assignments when a student completes a later day before finishing earlier items", async () => {
    const summary = await fetchAssignmentSummary({
      studentCode: "st-1",
      resultsRows: [
        {
          studentCode: "st-1",
          assignmentId: "0.1",
          assignment: "A1 0.1",
          score: 86,
          level: "A1",
        },
        {
          studentCode: "st-1",
          assignmentId: "1.2",
          assignment: "A1 1.2",
          score: 81,
          level: "A1",
        },
      ],
    });

    expect(summary.student.recommendationBlocked).toBe(false);
    expect(summary.student.jumpedAssignments.map((entry) => entry.label)).toEqual([
      "Day 2: 0.2",
      "Day 2: 1.1",
    ]);
  });


  it("does not create jumped assignments for calendar days that have no scheduled assignment", async () => {
    buildAssignmentCatalogForLevel.mockReturnValueOnce([
      {
        day: 1,
        label: "Day 1: 0.1",
        assignmentId: "0.1",
        canonicalAssignmentId: "A1-0.1",
        matchKey: "A1-0.1",
      },
      {
        day: 3,
        label: "Day 3: 1.2",
        assignmentId: "1.2",
        canonicalAssignmentId: "A1-1.2",
        matchKey: "A1-1.2",
      },
    ]);

    const summary = await fetchAssignmentSummary({
      studentCode: "st-1",
      resultsRows: [
        {
          studentCode: "st-1",
          assignmentId: "0.1",
          assignment: "A1 0.1",
          score: 88,
          level: "A1",
        },
        {
          studentCode: "st-1",
          assignmentId: "1.2",
          assignment: "A1 1.2",
          score: 82,
          level: "A1",
        },
      ],
    });

    expect(summary.student.jumpedAssignments).toEqual([]);
    expect(summary.student.nextRecommendedAssignment).toBeNull();
  });

  it("blocks recommendations when any assignment is failed", async () => {
    const summary = await fetchAssignmentSummary({
      studentCode: "st-1",
      resultsRows: [
        {
          studentCode: "st-1",
          assignmentId: "0.1",
          assignment: "A1 0.1",
          score: 86,
          level: "A1",
        },
        {
          studentCode: "st-1",
          assignmentId: "0.2",
          assignment: "A1 0.2",
          score: 55,
          level: "A1",
        },
      ],
    });

    expect(summary.student.recommendationBlocked).toBe(true);
    expect(summary.student.nextRecommendedAssignment).toBeNull();
  });
});
