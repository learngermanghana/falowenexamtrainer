import { getB1ReadingTask } from "./b1ReadingTasks";
import { getB1WritingTask } from "./b1WritingTasks";
import { getB1ListeningTask } from "./b1ListeningTasks";
import { getA2B1LessonProfile } from "./a2B1LessonProfile";
import { getTimedAssignmentConfig } from "./timedAssignmentConfig";

describe("B1 Day 26 · Reiseprobleme und Lösungen official workbook alignment", () => {
  test("Schreiben asks for 80-word Markus forum opinion, not a Max/Lisa letter", () => {
    const writing=getB1WritingTask(26);
    expect(writing.sourceTitle).toContain("Markus");
    expect(writing.sourceText).toContain("drei Stunden Verspätung");
    expect(writing.instructions).toContain("80");
    expect(writing.taskPoints).toHaveLength(3);
    expect(JSON.stringify(writing)).not.toMatch(/Lieber Max|Liebe Lisa/i);
  });
  test("Lesen presents all five ads and four matching scenarios with an unused 0 option", () => {
    const reading=getB1ReadingTask(26);
    expect(reading.text.paragraphs.filter(x=>x.startsWith("Situation "))).toHaveLength(4);
    expect(reading.text.paragraphs.filter(x=>x.startsWith("Anzeige "))).toHaveLength(5);
    expect(reading.text.questions).toHaveLength(4);
    expect(reading.text.questions.every(q=>q.options.length===6)).toBe(true);
    expect(reading.text.questions[0].options[5]).toMatch(/^0\)/);
    expect(reading.text.paragraphs.join(" ")).toContain("EuroPannenschutz");
  });
  test("Hören uses uploaded Day 26 R2 recording and five Richtig/Falsch statements", () => {
    const listening=getB1ListeningTask(26);
    expect(listening.audioKey).toBe("b1/day-26/day-26.mp3");
    expect(listening.submitRequired).toBe(true);
    expect(listening.videoId || listening.externalUrl).toBeFalsy();
    expect(listening.questions).toHaveLength(5);
    expect(listening.questions.every(q=>q.options.length===2)).toBe(true);
  });
  test("Both Day 25 and Day 26 require all three graded parts (30-minute timer)", () => {
    for(const day of [25,26]){
      const profile=getA2B1LessonProfile("B1",day);
      expect(profile.requiredSubmissionParts.map(part=>part.partId)).toEqual(["teil2","teil3","teil4"]);
      const config=getTimedAssignmentConfig(day===25?"B1-8.25":"B1-9.26");
      expect(config.timedTabs).toEqual(["schreiben","lesen","hoeren"]);
      expect(config.durationMinutes).toBe(30);
    }
  });
});
