import { B1_DAY26_REISEPROBLEME_LOESUNGEN_WORKBOOK_CONFIG } from "./B1Day26ReiseproblemeLoesungenWorkbookPage";
import { B1_DAY27_UMWELTFREUNDLICH_ALLTAG_WORKBOOK_CONFIG } from "./B1Day27UmweltfreundlichAlltagWorkbookPage";
import { B1_DAY28_KLIMAFREUNDLICH_LEBEN_WORKBOOK_CONFIG } from "./B1Day28KlimafreundlichLebenWorkbookPage";

describe("B1 Day 26 to 28 workbooks", () => {
  test("Day 26 keeps Reiseprobleme content and listening video", () => {
    const config = B1_DAY26_REISEPROBLEME_LOESUNGEN_WORKBOOK_CONFIG;

    expect(config.day).toBe(26);
    expect(config.chapter).toBe("9.26");
    expect(config.speaking.ideaGroups).toHaveLength(4);
    expect(config.speaking.ideaGroups[0].items).toContain(
      "Gepäck verloren: Der Koffer kommt nicht an",
    );
    expect(config.reading.text.questions).toHaveLength(7);
    expect(config.writing.title).toMatch(/Formelle E-Mail/);
    expect(config.reading.text.advertisements).toHaveLength(8);
    expect(config.submitReadingDescription).toMatch(/A–H or X/);
  });

  test("Day 27 uses the requested Goethe forum, reading and R2 Hören", () => {
    const config = B1_DAY27_UMWELTFREUNDLICH_ALLTAG_WORKBOOK_CONFIG;
    expect(config.day).toBe(27);
    expect(config.chapter).toBe("10.27");
    expect(config.speaking.ideaGroups).toHaveLength(5);
    expect(config.writing.sourceTitle).toMatch(/Felix \(26 Jahre\)/);
    expect(config.writing.taskPoints).toHaveLength(4);
    expect(config.reading.text.questions).toHaveLength(6);
    expect(config.reading.text.questions[0].options).toEqual(["A) Richtig", "B) Falsch"]);
    expect(config.listening.audioKey).toBe("b1/day-27/day-27.mp3");
    expect(config.listening.questions).toHaveLength(5);
    expect(config.listening.submitRequired).toBe(true);
  });

  test("Day 28 uses Laura, six Richtig/Falsch reading items and private R2 Hören", () => {
    const config = B1_DAY28_KLIMAFREUNDLICH_LEBEN_WORKBOOK_CONFIG;

    expect(config.day).toBe(28);
    expect(config.chapter).toBe("10.28");
    expect(config.speaking.ideaGroups).toHaveLength(6);
    expect(config.writing.sourceTitle).toContain("Laura (24 Jahre)");
    expect(config.writing.taskPoints).toHaveLength(4);
    expect(config.reading.text.title).toBe("Blogbeitrag: Mein Weg zu mehr Nachhaltigkeit im Alltag");
    expect(config.reading.text.paragraphs).toHaveLength(5);
    expect(config.reading.text.questions).toHaveLength(6);
    expect(config.reading.text.questions[0].options).toEqual(["A) Richtig", "B) Falsch"]);
    expect(config.listening.audioKey).toBe("b1/day-28/day-28.mp3");
    expect(config.listening.questions).toHaveLength(5);
    expect(config.listening.submitRequired).toBe(true);
    expect(config.listening.videoId).toBeUndefined();
  });
});
