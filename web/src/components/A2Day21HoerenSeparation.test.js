import { getA2ListeningTask, A2_LISTENING_MODES } from "../data/a2ListeningTasks";
import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";
import { getTimedAssignmentConfig } from "../data/timedAssignmentConfig";
import { isTimedAssignmentTabLocked } from "../utils/timedAssignmentAccess";

describe("A2 Day 21 protected graded Hören replaces the older self-check exercise", () => {
  const key = "a2/day-21/day-21.mp3";

  test("uses only the private Day 21 audio and five supplied questions", () => {
    const listening = getA2ListeningTask(21);
    expect(listening).toMatchObject({
      chapter: "8.21",
      mode: A2_LISTENING_MODES.GRADED,
      audioKey: key,
      audioUrl: "",
    });
    expect(listening.questions).toHaveLength(5);
    expect(listening.task).toMatch(/Claudia und Thomas/);
    expect(JSON.stringify(listening)).not.toContain("Qg0tQFveI0M");
  });

  test("Hören must be submitted and locked before the three-part timer starts", () => {
    const profile = getA2B1LessonProfile("A2", 21);
    expect(profile.sections.part4).toMatchObject({ mode: "graded", submitRequired: true });
    expect(profile.requiredSubmissionParts.map((item) => item.partId)).toEqual(["teil2", "teil3", "teil4"]);
    const timer = getTimedAssignmentConfig("A2-8.21");
    expect(timer.timedTabs).toEqual(["schreiben", "lesen", "hoeren"]);
    expect(timer.durationMinutes).toBe(30);
    expect(isTimedAssignmentTabLocked({ enabled: true, timedTabs: timer.timedTabs, attemptState: "none", tabKey: "hoeren" })).toBe(true);
    expect(isTimedAssignmentTabLocked({ enabled: true, timedTabs: timer.timedTabs, attemptState: "active", secondsLeft: 1200, tabKey: "hoeren" })).toBe(false);
    expect(isTimedAssignmentTabLocked({ enabled: true, timedTabs: timer.timedTabs, attemptState: "expired", tabKey: "hoeren" })).toBe(true);
    expect(isTimedAssignmentTabLocked({ enabled: true, timedTabs: timer.timedTabs, attemptState: "submitted", tabKey: "hoeren", reviewUnlocked: true })).toBe(false);
  });
});
