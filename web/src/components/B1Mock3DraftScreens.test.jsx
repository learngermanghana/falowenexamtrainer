import fs from "fs";
import path from "path";
import {getMockExam} from "../data/mockExamCatalog";

test("B1 Mock 3 keeps Hören as an unpublished practice, not a fake full mock",()=>{
 const item=getMockExam("b1-mock-03-hoeren");
 expect(item).toMatchObject({status:"preview",mode:"practice",showInMockLibrary:false});
});
test("B1 Mock 3 Lesen uses a protected 65-minute attempt and excludes private answers",()=>{
 const app=fs.readFileSync(path.resolve(__dirname,"../App.js"),"utf8");
 const ui=fs.readFileSync(path.resolve(__dirname,"./B1Mock3Lesen.jsx"),"utf8");
 const service=fs.readFileSync(path.resolve(__dirname,"../services/b1Mock3LesenService.js"),"utf8");
 expect(app).toContain('path="/campus/course/b1-mock-3-lesen" element={<B1Mock3Lesen />}');
 expect(ui).toContain("secondsLeft===0");
 expect(ui).toContain("submitB1Mock3Lesen");
 expect(ui).toContain("falowen:b1-mock-03:lesen:");
 expect(service).toContain("/b1-mock-03/lesen");
 expect(service).not.toMatch(/correctAnswers|ANSWER_KEY/);
});
test("B1 Mock 3 Sprechen connects B1 LiveSpeak and keeps examiner receipts in the backend",()=>{
 const app=fs.readFileSync(path.resolve(__dirname,"../App.js"),"utf8");
 const ui=fs.readFileSync(path.resolve(__dirname,"./B1Mock3Speaking.jsx"),"utf8");
 const service=fs.readFileSync(path.resolve(__dirname,"../services/b1Mock3SpeakingService.js"),"utf8");
 const coordinator=fs.readFileSync(path.resolve(__dirname,"./A2MockSpeakingExaminer.jsx"),"utf8");
 expect(app).toContain('path="/campus/course/b1-mock-3-sprechen" element={<B1Mock3Speaking />}');
 expect(ui).toContain('level="B1" mockId="b1-mock-03"');
 expect(ui).toContain("saveB1Mock3SpeakingPart");
 expect(ui).toContain("verifyB1Mock3Speaking");
 expect(coordinator).toContain("level = \"A2\"");
 expect(service).toContain("/b1-mock-03/sprechen");
});
