import { getA2ReadingTask } from "./a2ReadingTasks";
import { getA2ListeningTask } from "./a2ListeningTasks";
test("Day 18 retains Lesen but replaces Hören and attaches Cloudflare audio",()=>{
 const reading=getA2ReadingTask(18);
 expect(reading.questions).toHaveLength(5);
 expect(reading.title).toBe("Ihr Termin zur Kontoeröffnung");
 const listening=getA2ListeningTask(18);
 expect(listening.questions).toHaveLength(5);
 expect(listening.questions[0].stem).toContain("Herr Keller");
 expect(listening.questions[4].stem).toContain("Entschuldigung");
 expect(listening.audioKey).toBe("a2/day-18/day-18.mp3");
 expect(listening.audioUrl || "").toBe("");
});
