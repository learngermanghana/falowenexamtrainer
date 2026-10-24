import { getAdvancedB2GrammarLesson } from "./B2Day10And12AdvancedGrammarNotes";

describe("advanced B2 Day 10 and Day 12 grammar notes", () => {
  test("expands Day 10 beyond a basic connector summary", () => {
    const lesson = getAdvancedB2GrammarLesson(10);

    expect(lesson).toEqual(expect.objectContaining({
      chapter: "2.5",
      title: expect.stringContaining("Zweiteilige Konnektoren"),
    }));
    expect(lesson.structures).toHaveLength(5);
    expect(lesson.rules.length).toBeGreaterThanOrEqual(3);
    expect(lesson.errors.length).toBeGreaterThanOrEqual(4);
    expect(lesson.checks.length).toBeGreaterThanOrEqual(5);
    expect(lesson.model).toContain("Einerseits");
    expect(lesson.model).toContain("nicht nur");
    expect(lesson.model).toContain("zwar");
  });

  test("teaches Day 12 time relationships and tense sequencing", () => {
    const lesson = getAdvancedB2GrammarLesson(12);

    expect(lesson).toEqual(expect.objectContaining({
      chapter: "3.2",
      title: expect.stringContaining("Temporale Nebensätze"),
    }));
    expect(lesson.structures.map(([connector]) => connector)).toEqual(
      expect.arrayContaining(["wenn", "als", "während", "bevor / ehe", "nachdem", "sobald", "seitdem", "bis"]),
    );
    expect(lesson.rules.some((rule) => rule.text.includes("Plusquamperfekt"))).toBe(true);
    expect(lesson.errors.length).toBeGreaterThanOrEqual(4);
    expect(lesson.model).toContain("Seitdem");
    expect(lesson.model).toContain("Sobald");
  });

  test("returns no advanced override for other B2 days", () => {
    expect(getAdvancedB2GrammarLesson(9)).toBeNull();
    expect(getAdvancedB2GrammarLesson(11)).toBeNull();
  });
});
