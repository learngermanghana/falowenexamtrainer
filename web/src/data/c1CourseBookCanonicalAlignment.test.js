import { courseSchedules, C1_COURSE_DICTIONARY_BY_LEVEL } from "./courseSchedule";
import { C1_ACADEMIC_DAYS } from "./c1AcademicCurriculum";
import { getC1Phase2Lesson } from "./c1Phase2Lessons";
import {
  C1_CANONICAL_TITLES,
  alignC1LessonContent,
} from "./c1ContentRefresh";

describe("C1 Course Book canonical alignment", () => {
  const c1Days = (courseSchedules.C1 || []).filter((entry) => {
    const day = Number(entry.day || 0);
    return day >= 1 && day <= 28;
  });

  test("exposes exactly the reconciled C1 Days 1-28", () => {
    expect(c1Days).toHaveLength(28);
    expect(c1Days.map((entry) => entry.topic)).toEqual(C1_ACADEMIC_DAYS.map(item => item.topic));
    expect(C1_COURSE_DICTIONARY_BY_LEVEL.filter(x=>x.day>=1&&x.day<=28).map(x=>x.topic)).toEqual(C1_ACADEMIC_DAYS.map(item=>item.topic));
  });

  test.each(Array.from({ length: 28 }, (_, index) => index + 1))(
    "Day %i tile uses the upgraded topic, grammar and exam focus",
    (day) => {
      const entry = c1Days.find((item) => Number(item.day) === day);
      const academic = C1_ACADEMIC_DAYS[day - 1];
      const title = academic.topic;

      expect(entry).toBeTruthy();
      expect(entry.topic).toBe(title);
      expect(entry.title).toBe(title);
      expect(entry.lessonTitle).toBe(title);
      expect(entry.grammar_topic).toBe(getC1Phase2Lesson(day).grammar);
      expect(entry.foundationTitle).toBe(C1_CANONICAL_TITLES[day-1]);
      expect(entry.goal).toContain(academic.task);
      expect(entry.instruction).toContain(academic.skill + " · Teil " + academic.part);
      expect(entry.instruction).not.toContain("no video or grammar book");
      expect(entry.instruction).toContain("Learn → Speak → Write → Finish → Ref");
    },
  );

  test("builds formal C1 writing prompts from the canonical lesson title without a runtime reference error", () => {
    const aligned = alignC1LessonContent({
      level: "C1",
      day: 27,
      title: "Legacy title",
      writingTaskType: "Formal letter / E-Mail",
    });

    expect(aligned.title).toBe("Digitale Verwaltung");
    expect(aligned.writingTopic).toContain("Schreiben: Digitale Verwaltung");
    expect(aligned.writingTopic).toContain("zum Thema „Digitale Verwaltung“");
  });

  test("preserves existing chapter IDs while replacing old public titles", () => {
    for (const entry of c1Days) {
      const day = Number(entry.day);
      expect(entry.chapter).toBe(`${Math.ceil(day/5)}.${((day-1)%5)+1}`);
      expect(entry.topic).toBe(C1_ACADEMIC_DAYS[day-1].topic);
      expect(entry.assignmentId).toBeTruthy();
      expect(entry.workbookRoute).toBeTruthy();
    }
  });
});
