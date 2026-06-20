import { getNextCourseBookEntry, isCourseBookEntryComplete } from "./courseBookProgression";

describe("course book next lesson progression", () => {
  const entries = [
    { assignmentKey: "A1-0.1", topic: "Greetings", isTutorMarked: true, status: "passed", isMilestone: false },
    { assignmentKey: "A1-DAY-3-PRACTICE-1.1", topic: "Pronouns self-study", isTutorMarked: false, status: "notStarted", isMilestone: false },
    { assignmentKey: "A1-1.2", topic: "Introducing Yourself", isTutorMarked: true, status: "notStarted", isMilestone: false },
  ];

  it("stops at an incomplete self-study lesson", () => {
    expect(getNextCourseBookEntry(entries, {})).toMatchObject({ assignmentKey: "A1-DAY-3-PRACTICE-1.1" });
    expect(isCourseBookEntryComplete(entries[1], {})).toBe(false);
  });

  it("unlocks the next assignment after self-study is marked complete", () => {
    const practiceProgress = { "A1-DAY-3-PRACTICE-1.1": { completed: true } };
    expect(isCourseBookEntryComplete(entries[1], practiceProgress)).toBe(true);
    expect(getNextCourseBookEntry(entries, practiceProgress)).toMatchObject({ assignmentKey: "A1-1.2" });
  });
});
