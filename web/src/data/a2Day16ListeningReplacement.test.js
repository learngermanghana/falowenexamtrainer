import { getA2ReadingTask } from "./a2ReadingTasks";
import { getA2ListeningTask, A2_LISTENING_MODES } from "./a2ListeningTasks";
import { getA2B1LessonProfile } from "./a2B1LessonProfile";

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
 expect(task.audioKey || "").toBe("");
 expect(task.mode).toBe(A2_LISTENING_MODES.NONE);
 expect(getA2B1LessonProfile("A2",16).sections.part4).toMatchObject({visible:false,submitRequired:false,mode:"none"});
 expect(getA2B1LessonProfile("A2",16).requiredSubmissionParts.map(p=>p.partId)).not.toContain("teil4");
});
