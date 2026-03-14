import { getStatusForEntry, mergeCourseProgressStatuses } from "./CourseTab";

describe("getStatusForEntry", () => {
  it("reads canonical day aliases saved in profile progress", () => {
    const status = getStatusForEntry(
      {
        "A1-DAY-2": { assignmentKey: "A1-DAY-2", value: "submitted" },
      },
      {
        day: 2,
        topic: "Alphabets and Personal Pronouns",
        chapter: "0.2_1.1",
      },
      "A1",
      1
    );

    expect(status).toBe("submitted");
  });

  it("falls back to plain day index when present", () => {
    const status = getStatusForEntry(
      {
        "2": { value: "inProgress" },
      },
      { day: 2, topic: "Test" },
      "A1",
      1
    );

    expect(status).toBe("inProgress");
  });
  it("maps shared resolver status names", () => {
    const status = getStatusForEntry(
      {
        "A1-DAY-2": { assignmentKey: "A1-DAY-2", status: "in_progress" },
      },
      { day: 2, topic: "Test" },
      "A1",
      1
    );

    expect(status).toBe("inProgress");
  });

});


describe("mergeCourseProgressStatuses", () => {
  it("keeps the most recently updated local status over older profile data", () => {
    const merged = mergeCourseProgressStatuses(
      {
        "A1-DAY-2": { value: "submitted", updatedAt: 200, assignmentKey: "A1-DAY-2" },
      },
      {
        "A1-DAY-2": { value: "inProgress", updatedAt: 100, assignmentKey: "A1-DAY-2" },
      }
    );

    expect(merged["A1-DAY-2"].value).toBe("submitted");
  });

  it("keeps newer profile status when local value is stale", () => {
    const merged = mergeCourseProgressStatuses(
      {
        "A1-DAY-3": { value: "inProgress", updatedAt: 100, assignmentKey: "A1-DAY-3" },
      },
      {
        "A1-DAY-3": { value: "submitted", updatedAt: 200, assignmentKey: "A1-DAY-3" },
      }
    );

    expect(merged["A1-DAY-3"].value).toBe("submitted");
  });

  it("adds local status when profile has no matching entry", () => {
    const merged = mergeCourseProgressStatuses(
      {
        "A1-DAY-4": { value: "submitted", updatedAt: 150, assignmentKey: "A1-DAY-4" },
      },
      {}
    );

    expect(merged["A1-DAY-4"].value).toBe("submitted");
  });
});
