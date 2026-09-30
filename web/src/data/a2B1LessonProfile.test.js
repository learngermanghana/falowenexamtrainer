import {
  getA2B1LessonProfile,
  getA2B1LessonProfiles,
} from "./a2B1LessonProfile";
import { isA2WritingRequired } from "./a2WritingSchedule";
import { isB1WritingRequired } from "./b1WritingSchedule";
import {
  A2_LISTENING_MODES,
  getA2ListeningTask,
} from "./a2ListeningTasks";
import { getB1ListeningTask } from "./b1ListeningTasks";

describe("canonical A2/B1 lesson profiles", () => {
  test.each(["A2", "B1"])("%s has one profile for every course day", (level) => {
    const profiles = getA2B1LessonProfiles(level);
    expect(profiles).toHaveLength(28);
    profiles.forEach((profile, index) => {
      expect(profile.day).toBe(index + 1);
      expect(profile.level).toBe(level);
      expect(profile.sections.reading.visible).toBe(true);
      expect(profile.sections.reading.submitRequired).toBe(true);
      expect(profile.sections.speaking.mode).toBe("practice");
    });
  });

  test("writing visibility and grading come from the canonical writing schedules", () => {
    for (let day = 1; day <= 28; day += 1) {
      const a2 = getA2B1LessonProfile("A2", day);
      const b1 = getA2B1LessonProfile("B1", day);
      expect(a2.sections.writing.visible).toBe(isA2WritingRequired(day));
      expect(a2.sections.writing.submitRequired).toBe(isA2WritingRequired(day));
      expect(b1.sections.writing.visible).toBe(isB1WritingRequired(day));
      expect(b1.sections.writing.submitRequired).toBe(isB1WritingRequired(day));
    }
  });

  test("A2 Teil 4 follows the canonical listening registry", () => {
    for (let day = 1; day <= 28; day += 1) {
      const task = getA2ListeningTask(day);
      const part4 = getA2B1LessonProfile("A2", day).sections.part4;

      if (!task || task.mode === A2_LISTENING_MODES.NONE) {
        expect(part4).toMatchObject({ visible: false, mode: "none", submitRequired: false, contentType: null });
      } else if (task.mode === A2_LISTENING_MODES.SELF_CHECK) {
        expect(part4).toMatchObject({ visible: true, mode: "self-check", submitRequired: false, contentType: "listening" });
      } else {
        expect(part4).toMatchObject({ visible: true, mode: "graded", submitRequired: true, contentType: "listening" });
      }
    }
  });

  test("B1 Teil 4 follows availability, reading fallback and submit semantics", () => {
    for (let day = 1; day <= 28; day += 1) {
      const task = getB1ListeningTask(day);
      const part4 = getA2B1LessonProfile("B1", day).sections.part4;

      if (!task || task.status === "unavailable") {
        expect(part4.visible).toBe(false);
        expect(part4.submitRequired).toBe(false);
      } else if (task.mode === "reading-fallback") {
        expect(part4).toMatchObject({ visible: true, contentType: "reading", sourceMode: "reading-fallback" });
        expect(part4.submitRequired).toBe(Boolean(task.submitRequired));
      } else {
        expect(part4.visible).toBe(true);
        expect(part4.contentType).toBe("listening");
        expect(part4.submitRequired).toBe(Boolean(task.submitRequired));
      }
    }
  });

  test("required submission parts are generated from the same section states", () => {
    for (const level of ["A2", "B1"]) {
      for (let day = 1; day <= 28; day += 1) {
        const profile = getA2B1LessonProfile(level, day);
        const expected = [
          profile.sections.writing,
          profile.sections.reading,
          profile.sections.part4,
        ]
          .filter((section) => section.visible && section.submitRequired)
          .map((section) => `teil${section.partNumber}`);

        expect(profile.requiredSubmissionParts.map((part) => part.partId)).toEqual(expected);
        expect(profile.grading.tutorMarkedParts).toEqual(expected);
      }
    }
  });

  test("assignment identity is resolved from the canonical lesson registries", () => {
    expect(getA2B1LessonProfile("A2", 21).assignmentKey).toBe("A2-8.21");
    expect(getA2B1LessonProfile("A2", 25).assignmentKey).toBe("A2-9.25");
    expect(getA2B1LessonProfile("B1", 22).assignmentKey).toBe("B1-7.22");
    expect(getA2B1LessonProfile("B1", 28).assignmentKey).toBe("B1-10.28");
    expect(getA2B1LessonProfile("A2", 15)).not.toHaveProperty("timer");
  });

  test("critical late-course profiles no longer drift from lesson data", () => {
    expect(getA2B1LessonProfile("A2", 21).sections.part4.mode).toBe("self-check");
    expect(getA2B1LessonProfile("A2", 24).sections.part4.mode).toBe("graded");
    expect(getA2B1LessonProfile("A2", 25).sections.part4.visible).toBe(false);
    expect(getA2B1LessonProfile("A2", 26).sections.part4.mode).toBe("graded");
    expect(getA2B1LessonProfile("A2", 28).sections.part4.submitRequired).toBe(true);

    expect(getA2B1LessonProfile("B1", 21).sections.part4.visible).toBe(false);
    expect(getA2B1LessonProfile("B1", 22).sections.part4).toMatchObject({
      visible: true,
      contentType: "reading",
      submitRequired: true,
    });
    expect(getA2B1LessonProfile("B1", 23).sections.part4.visible).toBe(false);
  });
});
