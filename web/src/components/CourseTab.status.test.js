import { getStatusForEntry } from "./CourseTab";

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
});
