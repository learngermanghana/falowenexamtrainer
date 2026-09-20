import { courseSchedules } from "./courseSchedule";
import {
  C1_CANONICAL_TITLES,
  alignC1LessonContent,
  getC1CanonicalGrammarTitle,
  getC1ContentProfile,
} from "./c1ContentRefresh";

describe("C1 Course Book canonical alignment", () => {
  const c1Days = (courseSchedules.C1 || []).filter((entry) => {
    const day = Number(entry.day || 0);
    return day >= 1 && day <= 28;
  });

  test("exposes exactly the reconciled C1 Days 1-28", () => {
    expect(c1Days).toHaveLength(28);
    expect(c1Days.map((entry) => entry.topic)).toEqual(C1_CANONICAL_TITLES);
  });

  test.each(Array.from({ length: 28 }, (_, index) => index + 1))(
    "Day %i tile uses the canonical title, grammar label, goal and Leitfrage",
    (day) => {
      const entry = c1Days.find((item) => Number(item.day) === day);
      const profile = getC1ContentProfile(day);
      const title = C1_CANONICAL_TITLES[day - 1];

      expect(entry).toBeTruthy();
      expect(entry.topic).toBe(title);
      expect(entry.title).toBe(title);
      expect(entry.lessonTitle).toBe(title);
      expect(entry.grammar_topic).toBe(getC1CanonicalGrammarTitle(day));
      expect(entry.goal).toContain(profile.aim);
      expect(entry.instruction).toContain(profile.question);
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

  test("keeps the reconciled Day 17-28 identities instead of the retired Course Book titles", () => {
    const byDay = Object.fromEntries(c1Days.map((entry) => [Number(entry.day), entry.topic]));

    expect(byDay[17]).toBe("Umweltverantwortung");
    expect(byDay[18]).toBe("Gesellschaftlicher Zusammenhalt");
    expect(byDay[19]).toBe("Arbeitswelt und Automatisierung");
    expect(byDay[21]).toBe("Gesellschaftliche Teilhabe und Integration");
    expect(byDay[22]).toBe("Demokratie und Mitbestimmung");
    expect(byDay[23]).toBe("Work-Life-Balance");
    expect(byDay[24]).toBe("Verkehr und Infrastruktur");
    expect(byDay[25]).toBe("Wissenschaft und Forschungsethik");
    expect(byDay[27]).toBe("Digitale Verwaltung");
    expect(byDay[28]).toBe("Demografischer Wandel");

    expect(Object.values(byDay)).not.toContain("Umwelt und Verantwortung");
    expect(Object.values(byDay)).not.toContain("Arbeit der Zukunft");
    expect(Object.values(byDay)).not.toContain("Migration und Teilhabe");
    expect(Object.values(byDay)).not.toContain("Politik und Mitbestimmung");
    expect(Object.values(byDay)).not.toContain("Mobilität und Infrastruktur");
    expect(Object.values(byDay)).not.toContain("Wissenschaft und Forschung");
    expect(Object.values(byDay)).not.toContain("Digitalisierung und Verwaltung");
    expect(Object.values(byDay)).not.toContain("Demografischer Wandel und Generationengerechtigkeit");
  });
});
