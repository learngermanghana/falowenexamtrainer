"use strict";
const fs = require("fs");
const path = require("path");
const { getMyExamDictionary, getMyMockObjectivePractice, listMyExamMocks } = require("../chatgptExamLibrary");

describe("German Exams Room source-authoritative practice export", () => {
  test("matches the original Sprechen dictionary and filters only the connected level", () => {
    const res = getMyExamDictionary("A1","speaking",{part:"teil-1",limit:4});
    expect(res.available).toBe(true);
    expect(res.items[0]).toMatchObject({
      id:"a1-teil-1-introduction", level:"A1",
      topicPrompt:"Stellen Sie sich kurz vor",
    });
    expect(res.items.every(x => x.level === "A1")).toBe(true);
    expect(getMyExamDictionary("C2","speaking",{taskId:"a1-teil-1-introduction"}).available).toBe(false);
    expect(getMyExamDictionary("A1","speaking",{part:"teil-0"}).available).toBe(false);
  });
  test("provides authentic Schreiben dictionary tasks but never form answers", () => {
    const res = getMyExamDictionary("A1","writing",{part:"teil1",taskId:"a1-course-registration"});
    expect(res.available).toBe(true);
    expect(res.items[0].situation).toMatch(/Maria Garcia/);
    expect(res.items[0].formFields.length).toBeGreaterThan(2);
    expect(res.items[0].formFields.some(x=>Object.hasOwn(x,"answer"))).toBe(false);
    expect(getMyExamDictionary("A2","writing",{taskId:"a1-course-registration"}).available).toBe(false);
    expect(getMyExamDictionary("A1","writing",{query:"Einladung",limit:2}).items.length).toBeLessThanOrEqual(2);
  });
  test("exports published mocks and A1 Lesen/Hören without private fields", () => {
    const mock = listMyExamMocks("A1").mocks.find(x=>x.mockId==="a1-mock-02");
    expect(mock.chatGPTPracticeSkills).toContain("listening");
    const lesen = getMyMockObjectivePractice("A1","a1-mock-03","reading","teil2",6);
    expect(lesen.available).toBe(true);
    expect(lesen.question.options[0].title).toMatch(/Pizza/);
    const hoeren = getMyMockObjectivePractice("A1","a1-mock-02","listening","teil2",6);
    expect(hoeren.available).toBe(true);
    expect(hoeren.question.statement).toMatch(/Bibliothek/);
    expect(JSON.stringify(hoeren)).not.toContain("audioObjectKey");
    expect(getMyMockObjectivePractice("A2","a1-mock-02","listening","teil1",1).available).toBe(false);
  });
  test("generated snapshot rejects any answer keys, solutions and private R2 links", () => {
    const file = path.resolve(__dirname,"../../data/chatgptExamContent.generated.json");
    const data = JSON.parse(fs.readFileSync(file,"utf8"));
    const fieldNames = new Set();
    const walk = x => {
      if (Array.isArray(x)) return x.forEach(walk);
      if(x && typeof x==="object") Object.entries(x).forEach(([k,v])=>{fieldNames.add(k);walk(v);});
    };
    walk(data);
    for (const key of ["answer","answers","answerKey","correctOption","explanation","rubric","modelAnswer","audioObjectKey","transcript","audioUrl","signedUrl"]) {
      expect(fieldNames.has(key)).toBe(false);
    }
    expect(data.mocks.some(x=>x.level==="A1"&&x.mockId==="a1-mock-02")).toBe(true);
    expect(data.speaking.length).toBeGreaterThan(30);
    expect(data.writing.A1.length).toBeGreaterThan(0);
  });
});
