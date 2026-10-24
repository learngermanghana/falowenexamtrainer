import { courseSchedules } from "./courseSchedule";

describe("A2 Day 4 Course Book grammar metadata", () => {
  test("matches the Wo/Wohin grammar taught in the workbook", () => {
    const day4 = courseSchedules.A2.find(
      (entry) => Number(entry.day) === 4 && String(entry.chapter) === "2.4"
    );

    expect(day4).toBeTruthy();
    expect(day4.grammar_topic).toBe(
      "Wo? oder Wohin? · Wechselpräpositionen (Dativ/Akkusativ)"
    );
    expect(day4.grammar_topic).not.toMatch(/nominali[sz]ation/i);
    expect(day4.grammarPage).toBe(
      "/campus/course/wo-moechten-wir-uns-treffen-2-4-grammar-notes"
    );
    expect(day4.lesen_hören?.grammarbook_link).toBe(
      "/campus/course/wo-moechten-wir-uns-treffen-2-4-grammar-notes"
    );
  });
});
