import { getB1ReadingTask } from "./b1ReadingTasks";
import { getB1WritingTask } from "./b1WritingTasks";
import { getB1ListeningTask } from "./b1ListeningTasks";
import { isB1WritingRequired } from "./b1WritingSchedule";
import { getB1Days23To28LessonMetadata } from "./b1Days23To28LessonMetadata";

describe("B1 Day 25 · ElectroWorld and consumer-rights exam practice", () => {
  test("Lesen uses the user-supplied press article and exactly seven a–c questions", () => {
    const reading = getB1ReadingTask(25);
    expect(reading.text.title).toContain("Verbraucherrechte im Internet");
    expect(reading.text.paragraphs.join(" ")).toContain("Gewährleistungsrecht");
    expect(reading.text.paragraphs.join(" ")).toContain("14-tägige Widerrufsrecht");
    expect(reading.text.questions).toHaveLength(7);
    expect(reading.text.questions.every(q => q.options.length === 3)).toBe(true);
    const correct = ["b","c","b","b","b","c","b"];
    expect(reading.text.questions.map((q, i) => q.options["abc".indexOf(correct[i])][0].toLowerCase())).toEqual(correct);
    expect(reading.submissionNote).not.toContain("1B, 2B, 3B");
  });
  test("Schreiben asks for a formal 40–50-word ElectroWorld complaint", () => {
    const writing = getB1WritingTask(25);
    expect(isB1WritingRequired(25)).toBe(true);
    expect(writing.instructions).toContain("ElectroWorld");
    expect(writing.instructions).toContain("beschädigt");
    expect(writing.taskPoints).toHaveLength(3);
    expect(writing.title).toContain("40–50 Wörter");
    expect(writing.taskPoints[0]).toContain("Bestellnummer");
  });
  test("Hören has five delivery-problem statements with the matching R2 recording", () => {
    const listening = getB1ListeningTask(25);
    expect(listening.questions).toHaveLength(5);
    expect(listening.questions.every(q => q.options.length === 2)).toBe(true);
    expect(listening.questions[0].stem).toContain("Smartphone");
    expect(listening.transcript).toBeUndefined();
    expect(listening.audioKey).toBe("b1/day-25/day-25.mp3");
    expect(listening.submitRequired).toBe(true);
    expect(getB1Days23To28LessonMetadata(25).instruction).toContain("five Richtig/Falsch Hören");
  });
});
