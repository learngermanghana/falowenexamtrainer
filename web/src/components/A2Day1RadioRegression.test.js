import fs from "fs";
import path from "path";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";
import { A2_LISTENING_MODES, A2_LISTENING_TASKS } from "../data/a2ListeningTasks";

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

  it("keeps Teil 4 as the canonical five-question listening task", () => {
    const answerManifest = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../../../functions/data/answerKeyManifest.json"), "utf8"),
    );
    const smallTalkKey = answerManifest["A2 1.1 Small Talk"];
    const listening = A2_LISTENING_TASKS[1];

    expect(listening.mode).toBe(A2_LISTENING_MODES.GRADED);
    expect(listening.audioUrl).toBe("https://youtu.be/z5yj1HQZbQo");
    expect(listening.questions).toHaveLength(5);
    expect(Object.keys(smallTalkKey.answers.teil3)).toHaveLength(5);
    expect(Object.keys(smallTalkKey.answers.teil4)).toHaveLength(5);
    expect(listening.task).toContain("beantworte alle fünf Fragen");
    expect(listening.questions[0].stem).toBe("Was hat Lena am Samstag vor?");
    expect(listening.questions[4].stem).toBe("Was schlägt Lena für das nächste Treffen vor?");
  });
});
