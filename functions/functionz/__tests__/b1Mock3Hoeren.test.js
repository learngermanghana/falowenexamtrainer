"use strict";
const fs=require("fs");
const path=require("path");
const {
  PARTS,QUESTIONS,ANSWER_KEY,QA_WARNINGS,
  publicB1Mock3Hoeren,markB1Mock3Hoeren
}=require("../b1Mock3Hoeren");

test("matches teacher's 30 supplied Hören items, section boundaries and R2 object keys",()=>{
  expect(PARTS.map(p=>p.count)).toEqual([10,5,7,8]);
  expect(PARTS.map(p=>p.repeats)).toEqual([2,1,1,2]);
  expect(QUESTIONS.map(q=>q.number)).toEqual(Array.from({length:30},(_,i)=>i+1));
  expect(QUESTIONS.filter(q=>q.part===1&&q.kind==="richtig-falsch")).toHaveLength(5);
  expect(QUESTIONS.filter(q=>q.part===3&&q.kind==="richtig-falsch")).toHaveLength(7);
  PARTS.forEach(p=>expect(p.key).toBe("b1/mock-hoeren/mock-03/teil-"+p.part+".mp3"));
  expect(QUESTIONS.every(q=>q.options.some(o=>o.id===q.answer))).toBe(true);
});

test("teacher's answer key covers all 30 and validates 100/100 and per-part scoring",()=>{
  expect(ANSWER_KEY).toHaveLength(30);
  expect(ANSWER_KEY.slice(0,10)).toEqual(["richtig","b","falsch","a","richtig","c","falsch","b","richtig","a"]);
  expect(ANSWER_KEY.slice(10,15)).toEqual(["b","c","a","b","c"]);
  expect(ANSWER_KEY.slice(15,22)).toEqual(["richtig","falsch","richtig","richtig","falsch","richtig","richtig"]);
  expect(ANSWER_KEY.slice(22)).toEqual(["b","c","a","c","b","a","b","c"]);
  const full=Object.fromEntries(QUESTIONS.map(q=>[q.number,q.answer]));
  expect(markB1Mock3Hoeren(full)).toMatchObject({
    correct:30,total:30,percentage:100,perPart:[
      {part:1,correct:10,total:10},{part:2,correct:5,total:5},
      {part:3,correct:7,total:7},{part:4,correct:8,total:8}
    ]
  });
  const flawed={...full,1:"falsch",2:"a",16:"falsch",30:"a"};
  expect(markB1Mock3Hoeren(flawed).correct).toBe(26);
});

test("Teil 3 questions follow audio Nummer 1–7 and exclude Beispiel 0",()=>{
  const part3=QUESTIONS.filter(q=>q.part===3);
  expect(part3.map(q=>q.number)).toEqual([16,17,18,19,20,21,22]);
  expect(part3.map(q=>q.answer)).toEqual(["richtig","falsch","richtig","richtig","falsch","richtig","richtig"]);
  expect(part3[0].question).toMatch(/Freitag.*Sonne/);
  expect(part3[4].question).toMatch(/Pizzeria/);
  expect(part3.every(q=>!q.question.includes("Donnerstag beginnen"))).toBe(true);
});

test("public exam payload never exposes private correct answers or transcript evidence",()=>{
  const published=publicB1Mock3Hoeren();
  expect(published.mockId).toBe("b1-mock-03");
  expect(published.practiceOnly).toBe(true);
  expect(published.parts.flatMap(p=>p.questions)).toHaveLength(30);
  for(const item of published.parts.flatMap(p=>p.questions)){
    expect(item).not.toHaveProperty("answer");
    expect(item).not.toHaveProperty("evidence");
  }
  expect(JSON.stringify(published)).not.toContain('"answer":');
});
test("rejects missing items, forged answer labels and extra item numbers",()=>{
  const good=Object.fromEntries(QUESTIONS.map(q=>[q.number,q.answer]));
  expect(()=>markB1Mock3Hoeren({})).toThrow(/30/);
  expect(()=>markB1Mock3Hoeren({...good,11:"d"})).toThrow(/Invalid answer/);
  expect(()=>markB1Mock3Hoeren({...good,31:"a"})).toThrow(/30/);
});
test("content QA and release flag are required before anyone can enter Mock 3",()=>{
  expect(QA_WARNINGS).toHaveLength(2);
  expect(QA_WARNINGS[0]).toMatch(/one statement per short text/);
  expect(QA_WARNINGS[1]).toMatch(/roles C and D/);
  const app=fs.readFileSync(path.resolve(__dirname,"../app.js"),"utf8");
  expect(app).toContain('process.env.B1_MOCK3_HOEREN_RELEASED==="true"');
  expect(app).toContain('app.get("/b1-mock-03/hoeren/questions"');
  expect(app).toContain('app.post("/b1-mock-03/hoeren/score"');
  expect(app).toContain('b1Mock3HoerenResults');
});
