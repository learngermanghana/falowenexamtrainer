import { B1_MOCK4_WRITING_TASKS, B1_MOCK4_SCHREIBEN_MINUTES, B1_MOCK4_SCHREIBEN_RUBRIC } from "./b1Mock4WritingTasks";

describe("B1 Mock 04 Schreiben teacher task contract",()=>{
  test("three source tasks have 20/25/15 minutes and the 40/40/20 rubric",()=>{
    expect(B1_MOCK4_WRITING_TASKS.map(x=>x.id)).toEqual(["teil1","teil2","teil3"]);
    expect(B1_MOCK4_WRITING_TASKS.map(x=>x.minutes)).toEqual([20,25,15]);
    expect(B1_MOCK4_WRITING_TASKS.map(x=>x.target)).toEqual([80,80,40]);
    expect(B1_MOCK4_WRITING_TASKS.map(x=>x.maxPoints)).toEqual([40,40,20]);
    expect(B1_MOCK4_SCHREIBEN_MINUTES).toBe(60);
    expect(B1_MOCK4_SCHREIBEN_RUBRIC.totalPoints).toBe(100);
  });
  test("birthday email requires description, favorite present reason and a meeting proposal",()=>{
    const task=B1_MOCK4_WRITING_TASKS[0];
    expect(task.prompt).toContain("Geburtstag");
    expect(task.prompt).toContain("krank");
    expect(task.points.join(" ")).toMatch(/Feier/);
    expect(task.points.join(" ")).toMatch(/Geschenk/);
    expect(task.points.join(" ")).toMatch(/Treffen/);
    expect(task.instruction).toContain("Anrede");
  });
  test("guestbook cites Tanja exactly and formal email names Frau Müller",()=>{
    const guestbook=B1_MOCK4_WRITING_TASKS[1],email=B1_MOCK4_WRITING_TASKS[2];
    expect(guestbook.quoteBy).toContain("Tanja");
    expect(guestbook.quote).toContain("Kontakte im Internet");
    expect(email.prompt).toContain("Frau Müller");
    expect(email.points.join(" ")).toContain("Entschuldigen");
    expect(email.instruction).toContain("Sie-Form");
  });
});
