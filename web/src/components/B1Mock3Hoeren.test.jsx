import fs from "fs";
import path from "path";
import {getMockExam} from "../data/mockExamCatalog";

test("B1 Mock 3 is a hidden Hören-only draft until teacher QA, audio upload and release",()=>{
  const exam=getMockExam("b1-mock-03-hoeren");
  expect(exam).toMatchObject({
    level:"B1",status:"preview",showInMockLibrary:false,mode:"practice",
    questionSetId:"b1-mock-03-hoeren",route:"/campus/course/b1-mock-3-hoeren",
    sections:["Hören · Teile 1 bis 4"]
  });
  const app=fs.readFileSync(path.resolve(__dirname,"../App.js"),"utf8");
  expect(app).toContain('path="/campus/course/b1-mock-3-hoeren" element={<B1Mock3Hoeren />}');
  const ui=fs.readFileSync(path.resolve(__dirname,"./B1Mock3Hoeren.jsx"),"utf8");
  expect(ui).toContain('mockId:"mock-03"');
  expect(ui).toContain("scoreB1Mock3Hoeren");
  expect(ui).toContain("getB1Mock3HoerenQuestions");
  expect(ui).toContain("falowen:b1-mock-03:hoeren:");
  expect(ui).toContain("answered!==30");
  expect(ui).toContain("scored.saved");
});
