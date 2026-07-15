import {
  getNextCourseBookEntry,
  isCourseBookEntryComplete,
  isPinnedCourseBookOrientationEntry,
} from "./courseBookProgression";

describe("course book next lesson progression", () => {
  const entries = [
    {
      day: 0,
      level: "A1",
      assignmentKey: "A1-DAY-0-PRACTICE-ORIENTATION",
      topic: "Orientation and Knowledge Test",
      isTutorMarked: false,
      status: "notStarted",
      isMilestone: false,
    },
    { day: 1, assignmentKey: "A1-0.1", topic: "Greetings", isTutorMarked: true, status: "passed", isMilestone: false },
    { day: 3, assignmentKey: "A1-DAY-3-PRACTICE-1.1", topic: "Pronouns self-study", isTutorMarked: false, status: "notStarted", isMilestone: false },
    { day: 3, assignmentKey: "A1-1.2", topic: "Introducing Yourself", isTutorMarked: true, status: "notStarted", isMilestone: false },
  ];

  it.each(["A1", "A2", "B1", "B2", "C1"])(
    "recognizes the pinned %s Day 0 orientation entry",
    (level) => {
      expect(
        isPinnedCourseBookOrientationEntry({
          day: 0,
          level,
          assignmentKey: `${level}-DAY-0-ORIENTATION`,
        })
      ).toBe(true);
    }
  );

  it("starts the learning journey with Day 1 instead of the pinned Day 0 tutorial", () => {
    const firstIncomplete = entries.map((entry) => ({ ...entry, status: "notStarted" }));
    expect(getNextCourseBookEntry(firstIncomplete, {})).toMatchObject({ day: 1, assignmentKey: "A1-0.1" });
  });

  it("stops at an incomplete self-study lesson", () => {
    expect(getNextCourseBookEntry(entries, {})).toMatchObject({ assignmentKey: "A1-DAY-3-PRACTICE-1.1" });
    expect(isCourseBookEntryComplete(entries[2], {})).toBe(false);
  });

  it("unlocks the next assignment after self-study is marked complete", () => {
    const practiceProgress = { "A1-DAY-3-PRACTICE-1.1": { completed: true } };
    expect(isCourseBookEntryComplete(entries[2], practiceProgress)).toBe(true);
    expect(getNextCourseBookEntry(entries, practiceProgress)).toMatchObject({ assignmentKey: "A1-1.2" });
  });
});
