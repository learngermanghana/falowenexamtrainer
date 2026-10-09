import { getA2ReadingTask } from "./a2ReadingTasks";
import { getA2ListeningTask } from "./a2ListeningTasks";

test("Day 16 keeps the existing Lesen unchanged",()=>{
 const task=getA2ReadingTask(16);
 expect(task.title).toBe("Etwas für das Wohlbefinden");
 expect(task.questions).toHaveLength(5);
 expect(task.questions[0].stem).toContain("Marta");
});
test("Day 16 replaces only Hören with Lena and Max",()=>{
 const task=getA2ListeningTask(16);
 expect(task.questions).toHaveLength(5);
 expect(task.questions.map(q=>q.stem)).toEqual([
  "Was ist Lenas Problem?","Wann geht Max zum Yoga?",
  "Was kostet der Yogakurs?","Was macht Max abends, um besser zu schlafen?",
  "Was machen Lena und Max am Samstag?"
 ]);
 expect(task.audioUrl).toBe("");
});
