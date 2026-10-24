"use strict";
const fs=require("fs"),path=require("path");
const {PARTS,QUESTIONS,QA_NOTES,publicB1Mock3Lesen,markB1Mock3Lesen}=require("../b1Mock3Lesen");
test("five reading parts contain exactly 30 consecutively numbered B1 questions",()=>{
 expect(PARTS.map(p=>p.questions.length)).toEqual([6,6,7,7,4]);
 expect(PARTS.map(p=>p.timeMinutes)).toEqual([10,20,10,15,10]);
 expect(PARTS.reduce((n,p)=>n+p.timeMinutes,0)).toBe(65);
 expect(QUESTIONS.map(q=>q.number)).toEqual(Array.from({length:30},(_,i)=>i+1));
});
test("Lesen Teil 2 Menden Carsharing is filled and teacher-authorized",()=>{
 const p=PARTS[1].passages[0];
 const full=p.paragraphs.join(" ");
 expect(p.title).toMatch(/Carsharing/);
 expect(p.reconstructionApprovedByTeacher).toBe(true);
 expect(full).toMatch(/Menden/);
 expect(full).toMatch(/Smartphone-App/);
 expect(full).toMatch(/stundenweise/);
 expect(full).toMatch(/fünf weitere Fahrzeuge/);
 expect(PARTS[1].questions.slice(0,3).map(q=>q.answer)).toEqual(["b","b","c"]);
});
test("Original supplied reading answers match each section",()=>{
 expect(PARTS[0].questions.map(q=>q.answer)).toEqual(["richtig","falsch","richtig","falsch","richtig","falsch"]);
 expect(PARTS[1].questions.map(q=>q.answer)).toEqual(["b","b","c","b","a","b"]);
 expect(PARTS[2].questions.map(q=>q.answer)).toEqual(["G","B","A","E","C","D","X"]);
 expect(PARTS[3].questions.map(q=>q.answer)).toEqual(["ja","nein","ja","nein","ja","nein","ja"]);
 expect(PARTS[4].questions.map(q=>q.answer)).toEqual(["a","b","c","b"]);
});
test("Six teacher numbered reader comments plus Niko supply exactly seven scored statements",()=>{
 const section=PARTS[3];
 expect(section.comments.map(c=>c.name)).toEqual(["Niko","Dagmar","Kathleen","Marius","Jonny","Robert","Marinette"]);
 expect(section.questions.map(q=>q.number)).toEqual([20,21,22,23,24,25,26]);
 expect(QA_NOTES.some(x=>x.includes("Niko example"))).toBe(true);
});
test("Public question payload never gives away answer keys",()=>{
 const pub=publicB1Mock3Lesen();
 expect(pub.questionCount).toBe(30);
 expect(pub.durationSeconds).toBe(3900);
 expect(pub.parts.flatMap(p=>p.questions).every(q=>!Object.hasOwn(q,"answer"))).toBe(true);
});
test("Private server grading accepts exact answers and rejected forged labels",()=>{
 const perfect=Object.fromEntries(QUESTIONS.map(q=>[q.number,q.answer]));
 expect(markB1Mock3Lesen(perfect)).toMatchObject({correct:30,total:30,percentage:100});
 const missing={...perfect};delete missing["7"];
 expect(()=>markB1Mock3Lesen(missing)).toThrow(/Answer all 30/);
 expect(markB1Mock3Lesen(missing,{allowPartial:true})).toMatchObject({correct:29,total:30});
 expect(()=>markB1Mock3Lesen({...perfect,15:"invalid"})).toThrow(/Invalid answer/);
 expect(()=>markB1Mock3Lesen({...perfect,31:"x"})).toThrow(/Unexpected/);
});
test("Release gate, protected attempt and deadline are server-owned",()=>{
 const app=fs.readFileSync(path.resolve(__dirname,"../app.js"),"utf8");
 const routes=fs.readFileSync(path.resolve(__dirname,"../b1Mock3LesenRoutes.js"),"utf8");
 expect(app).toContain('require("./b1Mock3LesenRoutes")');
 expect(routes).toContain('B1_MOCK3_LESEN_RELEASED==="true"');
 expect(routes).toContain("Date.now()+65*60*1000");
 expect(routes).toContain("b1Mock3LesenUsers");
 expect(routes).toContain("verifiedBy:\"server-answer-key\"");
});
