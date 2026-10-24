import { B1_DAY23_ERSTES_DATE_WORKBOOK_CONFIG } from "./B1Day23ErstesDateWorkbookPage";

describe("B1 Day 23 first-date workbook", () => {
  test("keeps the complete speaking mind map", () => {
    const { speaking } = B1_DAY23_ERSTES_DATE_WORKBOOK_CONFIG;

    expect(speaking.question).toBe(
      "Was sind typische Situationen bei einem ersten Date, und wie verhält man sich am besten?",
    );
    expect(speaking.ideaGroups).toHaveLength(6);
    expect(speaking.ideaGroups[2].items).toContain("Was man mag oder nicht mag");
    expect(speaking.ideaGroups[3].items).toContain("Sympathie oder Desinteresse");
    expect(speaking.ideaGroups[4].items).toContain("Handy weglegen");
  });

  test("uses Sophie's complete opinion prompt", () => {
    const { writing } = B1_DAY23_ERSTES_DATE_WORKBOOK_CONFIG;

    expect(writing.title).toBe(
      "Ist das erste Date wirklich wichtig für eine Beziehung? Schreiben Sie Ihre Meinung.",
    );
    expect(writing.sourceText).toContain(
      "Manche Menschen sind beim ersten Treffen nervös und zeigen sich nicht so, wie sie wirklich sind.",
    );
  });

  test("keeps the complete Monopoly reading and seven questions", () => {
    const { text } = B1_DAY23_ERSTES_DATE_WORKBOOK_CONFIG.reading;

    expect(text.paragraphs).toHaveLength(5);
    expect(text.paragraphs.join(" ")).toContain("Über 275 Millionen Spiele");
    expect(text.paragraphs.join(" ")).toContain("nach ihrem Tod 1948 vergessen");
    expect(text.questions).toHaveLength(7);
    expect(text.questions[0].options).toContain("C) Elizabeth Magie Phillips");
    expect(text.questions[6].options).toContain("B) Mary Pilon");
  });
});
