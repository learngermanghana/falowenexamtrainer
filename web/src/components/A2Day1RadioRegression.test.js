import fs from "fs";
import path from "path";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Day 1 Small Talk Falowen Radio", () => {
  it("uses the approved Small Talk radio video", () => {
    expect(getLessonRadioResource("A2", 1)).toEqual(
      expect.objectContaining({
        key: "a2-day1-small-talk-falowen-radio",
        youtubeId: "76JUgui6CnY",
      }),
    );
  });

  it("keeps the existing Small Talk workbook route component behind the radio gate", () => {
    const source = read("A2Day2SmallTalkWorkbookEnhancedPage.js");
    expect(source).toContain('import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate"');
    expect(source).toContain('<RadioFirstWorkbookGate level="A2" day={1}>');
    expect(source).toContain("<SmallTalkWorkbook />");
    expect(source).toContain('chapter="1.1"');
    expect(source).toContain('workbookId="A2Day1SmallTalk"');
  });

  it("keeps Teil 4 as the original five-question listening task", () => {
    const source = read("A2Day2SmallTalkWorkbookEnhancedPage.js");
    const listeningBlock = source.match(/const listeningQuestions = \[([\s\S]*?)\n\];/);

    expect(listeningBlock).not.toBeNull();
    expect((listeningBlock?.[1].match(/stem:/g) || [])).toHaveLength(5);
    expect(source).toContain('hoerenQuestions={listeningQuestions}');
    expect(source).toContain("beantworte alle fünf Fragen");
    expect(source).not.toContain('hoerenQuestions={readingQuestions}');
    expect(source).toContain('stem: "Was hat Lena am Samstag vor?"');
    expect(source).toContain('stem: "Was schlägt Lena für das nächste Treffen vor?"');
  });
});
