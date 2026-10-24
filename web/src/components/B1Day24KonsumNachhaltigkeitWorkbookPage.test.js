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

  test("embeds the requested Goethe listening video as self-check practice", () => {
    const { listening } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG;

    expect(listening.videoId).toBe("zzPpGxzvJCY");
    expect(listening.externalUrl).toBe("https://youtu.be/zzPpGxzvJCY");
    expect(listening.selfCheckText).toContain(
      "The only parts that will be officially evaluated by the school are Lesen (reading) and Schreiben (writing).",
    );
  });
});
