import { getB1ReadingTask } from "./b1ReadingTasks";
import { getB1WritingTask } from "./b1WritingTasks";
import { getB1ListeningTask } from "./b1ListeningTasks";
import { isB1WritingRequired } from "./b1WritingSchedule";
import { getB1Days23To28LessonMetadata } from "./b1Days23To28LessonMetadata";

describe("B1 Day 25 · original updated exam practice", () => {
  test("Lesen uses the user-supplied press article and exactly seven a–c questions", () => {
    const reading = getB1ReadingTask(25);
    expect(reading.text.title).toMatch(/Online-Shopping.*Rechte und Risiken/);
    expect(reading.text.paragraphs.join(" ")).toContain("Fake-Shops");
    expect(reading.text.paragraphs.join(" ")).toContain("14-tägige Widerrufsrecht");
    expect(reading.text.questions).toHaveLength(7);
    expect(reading.text.questions.every(q => q.options.length === 3)).toBe(true);
    const correct = ["b","b","b","a","a","a","c"];
    expect(reading.text.questions.map((q, i) => q.options["abc".indexOf(correct[i])][0].toLowerCase())).toEqual(correct);
    expect(reading.submissionNote).not.toContain("1B, 2B, 3B");
  });
  test("Schreiben is a scored 80-word guestbook opinion about Tim's view", () => {
    const writing = getB1WritingTask(25);
    expect(isB1WritingRequired(25)).toBe(true);
    expect(writing.sourceTitle).toContain("Tim");
    expect(writing.sourceText).toContain("14 Tagen");
    expect(writing.taskPoints).toHaveLength(3);
    expect(writing.title).toContain("80 Wörter");
    expect(writing.title).not.toContain("Beschwerdebrief");
  });
  test("Hören has seven questions from the sustainable-shopping dialogue without playing old mismatched media", () => {
    const listening = getB1ListeningTask(25);
    expect(listening.questions).toHaveLength(7);
    expect(listening.questions.every(q => q.options.length === 3)).toBe(true);
    expect(listening.transcript).toContain("Wochenmarkt");
    expect(listening.transcript).toContain("Rathaus");
    expect(listening.audioKey || listening.videoId || listening.embedUrl).toBeFalsy();
    expect(listening.status).toBe("audio-pending");
    expect(listening.submitRequired).toBe(false);
    expect(getB1Days23To28LessonMetadata(25).instruction).toContain("matching recording");
  });
});
