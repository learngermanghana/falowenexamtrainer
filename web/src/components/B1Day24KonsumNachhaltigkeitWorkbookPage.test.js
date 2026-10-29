import { B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG } from "./B1Day24KonsumNachhaltigkeitWorkbookPage";

describe("B1 Day 24 sustainability workbook", () => {
  test("keeps all seven speaking branches", () => {
    const { speaking } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG;

    expect(speaking.ideaGroups).toHaveLength(7);
    expect(speaking.ideaGroups[0].items).toContain(
      "Kulturelle Unterschiede im Konsum, zum Beispiel in Deutschland und Ghana",
    );
    expect(speaking.ideaGroups[1].items).toContain("Strom- und Wassersparen");
    expect(speaking.ideaGroups[5].title).toBe(
      "6. Redemittel für Diskussion oder Schreiben",
    );
    expect(speaking.ideaGroups[6].items).toContain(
      "Nachhaltigkeit und Wirtschaftswachstum: Konflikt oder Chance?",
    );
  });

  test("uses Paul's complete writing prompt", () => {
    const { writing } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG;

    expect(writing.title).toBe(
      "Ist es wichtig, beim Konsum auf Nachhaltigkeit zu achten? Schreiben Sie Ihre Meinung.",
    );
    expect(writing.sourceText).toContain(
      "weniger Plastik zu verwenden oder Secondhand zu kaufen",
    );
  });

  test("keeps Eleni's full reading and seven true-or-false statements", () => {
    const { text } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG.reading;

    expect(text.paragraphs.join(" ")).toContain("Wertstoffhof und ein Schadstoffmobil");
    expect(text.paragraphs.join(" ")).toContain("Man gibt Sachen eine zweite Chance!");
    expect(text.questions).toHaveLength(7);
    expect(text.questions.every((question) => question.options.length === 2)).toBe(true);
  });

  test("uses the new conversation 2 R2 recording and replaces all obsolete smartphone questions", () => {
    const { listening } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG;
    expect(listening.audioKey).toBe("b1/day-24/day-25.mp3");
    expect(listening.submitRequired).toBe(false);
    expect(listening.questions).toHaveLength(5);
    expect(listening.questions.every(item => item.options.length === 0)).toBe(true);
    expect(listening.questions[0].stem).toMatch(/Worum geht es in dem Gespräch/);
    expect(JSON.stringify(listening.questions)).not.toMatch(/Jonas|Lisa|Smartphone/);
  });
});
