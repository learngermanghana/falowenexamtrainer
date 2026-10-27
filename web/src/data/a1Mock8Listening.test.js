import fs from "fs";
import path from "path";
import { A1_MOCK_8_LISTENING } from "./a1Mock8Listening";
import { getMockExam } from "./mockExamCatalog";
import { buildA1KombiAttemptContract } from "./a1KombiMocks04to08";

test("A1 Mock 08 Hören matches the 6/4/5 teacher ZIP question structure", () => {
  expect(Object.keys(A1_MOCK_8_LISTENING)).toEqual(["teil1", "teil2", "teil3"]);
  [1,2,3].forEach((partNumber,index)=>{
    const part=A1_MOCK_8_LISTENING[`teil${partNumber}`];
    expect(part.questions).toHaveLength([6,4,5][index]);
    expect(part.plays).toBe([2,1,2][index]);
    expect(part.audioObjectKey).toBe(`a1/mock-hoeren/mock-08/teil-${partNumber}.mp3`);
    part.questions.forEach((q,i)=>{
      expect(q.number).toBe(i+1);
      expect(q).not.toHaveProperty("answer");
      expect(q).not.toHaveProperty("correctIndex");
      expect(q).not.toHaveProperty("evidence");
      if (partNumber===2) expect(typeof q.statement).toBe("string");
      else expect(q.options.map(o=>o.id)).toEqual(["a","b","c"]);
    });
  });
  expect(A1_MOCK_8_LISTENING.teil1.questions[0].question).toBe("Was möchte der Mann im Café bestellen?");
  expect(A1_MOCK_8_LISTENING.teil3.questions[4].question).toBe("Wie informiert Stefan seinen Chef?");
  expect(A1_MOCK_8_LISTENING.teil2.questions[3].statement).toBe("Anna möchte, dass Jens Wasser und Milch kauft.");
});

test("Mock 08 joins four-module /100 exams without overwriting older /75 attempts",()=>{
  expect(getMockExam("a1-final-08")).toMatchObject({
    level:"A1",mode:"full",status:"preview",questionSetId:"a1-mock-08",
    sections:["Lesen","Hören","Schreiben","Sprechen"],
  });
  expect(buildA1KombiAttemptContract(8).maxScore).toBe(100);
  expect(buildA1KombiAttemptContract(8,{hoerenPublished:false}).maxScore).toBe(75);
  const page=fs.readFileSync(path.resolve(__dirname,"../components/A1FinalMockExamPage.jsx"),"utf8");
  expect(page).toContain("A1_MOCK_8_LISTENING");
  expect(page).toContain('"a1-mock-08"].includes(mockId)');
});
