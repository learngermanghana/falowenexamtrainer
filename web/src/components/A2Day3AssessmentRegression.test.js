import { getA2ReadingTask } from "../data/a2ReadingTasks";
import { getA2ListeningTask } from "../data/a2ListeningTasks";
import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";
import fs from "fs";
import path from "path";

const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../functions/data/answerKeyManifest.json"), "utf8"));

describe("A2 Day 3 canonical assessment regression", () => {
  test("uses the canonical five-question language-course comparison reading", () => {
    const reading = getA2ReadingTask(3);
    expect(reading.chapter).toBe("1.3");
    expect(reading.title).toBe("Zwei Sprachkurse");
    expect(reading.questions.map(({ stem }) => stem)).toEqual([
      "Welche Sprachschule ist billiger?",
      "Wo dauert eine Unterrichtsstunde länger?",
      "Welche Schule hat kleinere Gruppen?",
      "Welche Schule liegt näher an Ninas Wohnung?",
      "Wann hat Sprachschule A Unterricht?",
    ]);
    expect(reading.text).toContain("95 Euro");
    expect(reading.text).toContain("120 Euro");
  });

  test("keeps the canonical five Julia and Tobias listening questions and audio", () => {
    const listening = getA2ListeningTask(3);
    expect(listening.audioUrl).toBe("https://youtu.be/z0hve7zCDEo");
    expect(listening.questions).toHaveLength(5);
    expect(listening.questions[0].stem).toBe("Wie alt ist Julia?");
    expect(listening.questions[4].stem).toBe("Was machen Julia und Tobias oft am Wochenende?");
    expect(listening.questions[4].options).toContain("b) Gemeinsam kochen");
  });

  test("keeps the shared workbook profile and answer-key question counts aligned", () => {
    const profile = getA2B1LessonProfile("A2", 3);
    const answerKey = Object.values(manifest).find((entry) => entry.assignment_id === "A2-1.3");
    expect(profile.assignmentKey).toBe("A2-1.3");
    expect(answerKey).toBeDefined();
    expect(Object.keys(answerKey.answers.teil3)).toHaveLength(getA2ReadingTask(3).questions.length);
    expect(Object.keys(answerKey.answers.teil4)).toHaveLength(getA2ListeningTask(3).questions.length);
  });
});
