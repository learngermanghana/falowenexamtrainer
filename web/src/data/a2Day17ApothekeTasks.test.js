import { getA2ReadingTask } from "./a2ReadingTasks";
import { getA2ListeningTask } from "./a2ListeningTasks";
import answerKeys from "../../../functions/data/answerKeyManifest.json";

test("A2-6.17 Lesen uses the new pharmacy notice and matching admin key", () => {
 const item = getA2ReadingTask(17);
 expect(item.text).toContain("Apotheke am Markt");
 expect(item.questions).toHaveLength(5);
 expect(item.questions[0].stem).toContain("Rabatt");
 const key=Object.values(answerKeys).find(entry => entry.assignment_id === "A2-6.17");
 expect(Object.values(key.answers.teil3).map(answer => answer[0])).toEqual(["B","B","B","A","A"]);
});
test("A2-6.17 Hören uses new questions, not the old recording", () => {
 const item=getA2ListeningTask(17);
 expect(item.questions).toHaveLength(5);
 expect(item.questions[0].stem).toContain("Probleme hat der Kunde");
 expect(item.audioUrl).toBe("");
 const key=Object.values(answerKeys).find(entry => entry.assignment_id === "A2-6.17");
 expect(Object.values(key.answers.teil4).map(answer => answer[0])).toEqual(["B","A","C","A","B"]);
});
