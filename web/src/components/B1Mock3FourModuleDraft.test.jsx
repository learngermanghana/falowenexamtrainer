import fs from "fs";
import path from "path";
import tasks from "../data/b1Mock3WritingTasks.json";
import {getMockExam} from "../data/mockExamCatalog";
test("B1 Mock 3 retains three teacher-provided Schreiben tasks, not Mock 2 prompts",()=>{
 expect(tasks).toHaveLength(3);
 expect(tasks[0].instruction).toMatch(/Geburtstag gefeiert/);
 expect(tasks[1].instruction).toMatch(/Persönliche Kontakte und Internet/);
 expect(tasks[2].instruction).toMatch(/Frau Müller/);
 expect(tasks.map(t=>t.points)).toEqual([9,10,6]);
});
test("B1 Mock 3 has four skills routed but is not misleadingly published as a full exam",()=>{
 const exam=getMockExam("b1-mock-03-draft");
 expect(exam.sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
 expect(exam).toMatchObject({status:"preview",showInMockLibrary:false,route:"/campus/course/b1-mock-3"});
 const app=fs.readFileSync(path.resolve(__dirname,"../App.js"),"utf8");
 for(const name of ["B1Mock3Lesen","B1Mock3Hoeren","B1Mock3Schreiben","B1Mock3Speaking","B1Mock3Hub"])expect(app).toContain(name);
 for(const suffix of ["lesen","hoeren","schreiben","sprechen"])expect(app).toContain('path="/campus/course/b1-mock-3-'+suffix+'"');
 const writer=fs.readFileSync(path.resolve(__dirname,"./B1Mock3Schreiben.jsx"),"utf8");
 expect(writer).toContain("falowen:b1-mock-03:schreiben:");
 expect(writer).toMatch(/Noch kein benotetes Prüfungsergebnis/);
});
