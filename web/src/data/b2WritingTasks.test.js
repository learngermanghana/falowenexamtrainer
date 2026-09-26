import {
  B2_WRITE_DAYS,
  B2_WRITING_TASKS,
  getB2WritingTask,
} from "./b2WritingTasks";

describe("B2 Goethe-style writing tasks", () => {
  test("only the seven rotating Write days have B2 writing tasks", () => {
    expect(B2_WRITE_DAYS).toEqual([4, 8, 12, 16, 20, 24, 28]);
    expect(Object.keys(B2_WRITING_TASKS).map(Number)).toEqual(B2_WRITE_DAYS);
  });

  test("every B2 Write day has exactly four concise content points", () => {
    B2_WRITE_DAYS.forEach((day) => {
      const task = getB2WritingTask(day);
      expect(task.bullets).toHaveLength(4);
      task.bullets.forEach((bullet) => {
        expect(bullet.length).toBeGreaterThan(20);
        expect(bullet.length).toBeLessThan(120);
        expect(bullet).toMatch(/\.$/);
      });
    });
  });

  test("opinion and formal tasks use the correct minimum word counts", () => {
    [4, 8, 12, 20].forEach((day) => {
      const task = getB2WritingTask(day);
      expect(task.type).toBe("opinion");
      expect(task.minimumWords).toBe(150);
      expect(task.note).toContain("mindestens 150 Wörter");
    });

    [16, 24, 28].forEach((day) => {
      const task = getB2WritingTask(day);
      expect(task.type).toBe("formal");
      expect(task.minimumWords).toBe(100);
      expect(task.note).toContain("mindestens 100 Wörter");
    });
  });

  test("opinion template is only a short starter scaffold", () => {
    const template = getB2WritingTask(4).starterTemplate;
    expect(template.split(/\n\n/)).toHaveLength(4);
    expect(template).toContain("In der heutigen Zeit wird oft über ... diskutiert. Meiner Meinung nach ...");
    expect(template).toContain("Ein wichtiger Grund dafür ist, dass ...");
    expect(template).toContain("Eine andere Möglichkeit wäre, ... Ein Vorteil davon ist, dass ...");
    expect(template).toContain("Zusammenfassend lässt sich sagen, dass ...");
    expect(template).not.toContain("Ein weiterer Grund ist, dass ...");
    expect(template).not.toContain("Natürlich gibt es auch andere Meinungen");
    expect(template).not.toContain("Gegenargument");
    expect(template).not.toContain("eigene Position stärken");
  });

  test("formal template is only a short starter scaffold", () => {
    const template = getB2WritingTask(28).starterTemplate;
    expect(template).toContain("Sehr geehrte Frau ... / Sehr geehrter Herr ...");
    expect(template).toContain("ich bitte um Verständnis, weil ...");
    expect(template).toContain("Zurzeit ...");
    expect(template).toContain("Für die kommenden Tage schlage ich vor, dass ...");
    expect(template).toContain("Mir ist bewusst, dass ...");
    expect(template).toContain("Mit freundlichen Grüßen");
    expect(template).not.toContain("[Inhaltspunkt");
  });

  test("Day 4 and Day 28 keep the requested exam wording", () => {
    expect(getB2WritingTask(4).bullets).toEqual([
      "Äußern Sie Ihre Meinung zu Plastikverpackungen im Alltag.",
      "Nennen Sie Gründe, warum Plastikverpackungen so verbreitet sind.",
      "Nennen Sie andere Möglichkeiten, Dinge im Alltag zu verpacken.",
      "Nennen Sie Vorteile der anderen Verpackungen.",
    ]);

    expect(getB2WritingTask(28).bullets).toEqual([
      "Bitten Sie um Verständnis für Ihre Situation.",
      "Beschreiben Sie, womit Sie beschäftigt sind.",
      "Machen Sie einen Vorschlag für die kommenden Tage.",
      "Zeigen Sie Verständnis für die Arbeitssituation in der Firma.",
    ]);
  });
});
