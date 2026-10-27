import { getB1ReadingTask } from "./b1ReadingTasks";
import { getB1WritingTask } from "./b1WritingTasks";
import { getB1ListeningTask } from "./b1ListeningTasks";
import { getA2B1LessonProfile } from "./a2B1LessonProfile";
import { getTimedAssignmentConfig } from "./timedAssignmentConfig";

describe("B1 Day 26 · Reiseprobleme und Lösungen official workbook alignment", () => {
  test("Schreiben requests a 40–50-word formal Vienna tour email", () => {
    const writing=getB1WritingTask(26);
    expect(writing.title).toMatch(/Formelle E-Mail/);
    expect(writing.instructions).toContain("TraumReisen GmbH");
    expect(writing.instructions).toContain("40–50");
    expect(writing.taskPoints).toHaveLength(3);
    expect(writing.taskPoints[1]).toMatch(/Reisedaten.*Hotelkategorie.*Ausflügen/);
    expect(writing.taskPoints[2]).toMatch(/verbindlichen Angebots/);
    expect(JSON.stringify(writing)).not.toMatch(/Markus|Lieber Max|Liebe Lisa/i);
  });
  test("Lesen matches seven people and eight Anzeigen using A–H or X", () => {
    const reading=getB1ReadingTask(26);
    expect(reading.layout).toBe("matching-ads");
    expect(reading.text.situations).toHaveLength(7);
    expect(reading.text.advertisements).toHaveLength(8);
    expect(reading.text.questions).toHaveLength(7);
    expect(reading.text.questions.every(q=>q.options.length===9)).toBe(true);
    expect(reading.text.questions[0].options[8]).toMatch(/^X\)/);
    expect(reading.text.advertisements[2].description).toMatch(/Mindestmietdauer: 6 Monate/);
    expect(reading.text.situations[2].description).toMatch(/dreimonatigen/);
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
