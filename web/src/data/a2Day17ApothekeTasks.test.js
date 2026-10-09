import { getA2ReadingTask } from "./a2ReadingTasks";
import { getA2ListeningTask } from "./a2ListeningTasks";

test("A2 Day 17 reading uses the Apotheke am Markt notice", () => {
 const item = getA2ReadingTask(17);
 expect(item.text).toContain("Apotheke am Markt");
 expect(item.questions).toHaveLength(5);
 expect(item.questions[0].stem).toContain("Rabatt");
 expect(item.questions[4].stem).toContain("Notdienst");
});
test("A2 Day 17 listening uses the new customer questions and secured audio", () => {
 const item = getA2ListeningTask(17);
 expect(item.questions).toHaveLength(5);
 expect(item.questions[0].stem).toContain("Probleme hat der Kunde");
 expect(item.audioKey).toBe("a2/day-17/day-17.mp3");
 expect(item.audioUrl || "").toBe("");
});
