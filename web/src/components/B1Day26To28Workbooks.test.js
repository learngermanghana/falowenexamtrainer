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
    expect(config.listening.videoId).toBe("0sZVT9XAEBc");
  });

  test("Day 27 keeps Umweltfreundlich im Alltag content and listening video", () => {
    const config = B1_DAY27_UMWELTFREUNDLICH_ALLTAG_WORKBOOK_CONFIG;

    expect(config.day).toBe(27);
    expect(config.chapter).toBe("10.27");
    expect(config.speaking.ideaGroups).toHaveLength(5);
    expect(config.writing.sourceTitle).toBe("Ahmed");
    expect(config.reading.text.questions).toHaveLength(7);
    expect(config.listening.videoId).toBe("jzm-MnWC7I0");
  });

  test("Day 28 keeps Klimafreundlich leben content and listening video", () => {
    const config = B1_DAY28_KLIMAFREUNDLICH_LEBEN_WORKBOOK_CONFIG;

    expect(config.day).toBe(28);
    expect(config.chapter).toBe("10.28");
    expect(config.speaking.ideaGroups).toHaveLength(6);
    expect(config.reading.text.title).toBe("Bewusst Leben: Wasser als kostbare Ressource");
    expect(config.reading.text.questions).toHaveLength(7);
    expect(config.listening.videoId).toBe("IGIxBJA222o");
  });
});
