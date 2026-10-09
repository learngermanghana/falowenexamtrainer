import { getA2ReadingTask } from "./a2ReadingTasks";
import { getA2ListeningTask } from "./a2ListeningTasks";
test("Day 19 shopping reading has seven questions",()=>{
 const reading=getA2ReadingTask(19);
 expect(reading.questions).toHaveLength(7);
 expect(reading.text).toContain("Der Wochenmarkt");
 expect(reading.text).toContain("Online-Shopping");
});
test("Day 19 Hören uses Paul shopping audio and five questions",()=>{
 const listening=getA2ListeningTask(19);
 expect(listening.questions).toHaveLength(5);
 expect(listening.questions[0].stem).toContain("Paul");
 expect(listening.audioKey).toBe("a2/day-19/day-19.mp3");
 expect(listening.audioUrl || "").toBe("");
});
