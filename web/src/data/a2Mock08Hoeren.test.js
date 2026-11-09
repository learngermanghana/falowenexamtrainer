import { A2_MOCK_08_HOEREN } from "./a2Mock08Hoeren";
import { getMockExam, getMockExamsForLevel } from "./mockExamCatalog";
import { a2KombiKeys } from "../services/a2KombiMockFinalization";

const answers = require("../../../functions/functionz/a2Mock08HoerenKeys");
const { buildVerifiedA2MockScore } = require("../../../functions/functionz/a2MockCompletionSync");
const { APPROVED_A2_MOCK_08_AUDIO, verifyA2Mock08Audio } =
  require("../../../functions/functionz/a2Mock08PublishedAudio");

test("Mock 08 Hören has exactly 20 separate learner questions with private answer keys", () => {
  expect(A2_MOCK_08_HOEREN).toHaveLength(4);
  expect(A2_MOCK_08_HOEREN.map(part => part.embeddedRepetitions)).toEqual([2,1,1,2]);
  expect(A2_MOCK_08_HOEREN.map(part => part.questions.length)).toEqual([5,5,5,5]);
  const qs=A2_MOCK_08_HOEREN.flatMap(part => part.questions);
  expect(qs.map(q=>q.number)).toEqual(Array.from({length:20},(_,i)=>i+1));
  expect(Object.keys(answers)).toHaveLength(20);
  A2_MOCK_08_HOEREN.forEach((part,i) => {
    expect(part.audioObjectKey).toBe(`a2/mock-hoeren/mock-08/teil-${i+1}.mp3`);
    part.questions.forEach(q => {
      expect(q.options).toHaveLength(i===3?2:3);
      expect(q).not.toHaveProperty("answer");
      expect(q).not.toHaveProperty("evidence");
      expect(q.options.map(o=>o.id)).toContain(answers[q.number]);
    });
    expect(APPROVED_A2_MOCK_08_AUDIO[part.id].key).toBe(part.audioObjectKey);
    expect(APPROVED_A2_MOCK_08_AUDIO[part.id].sha256).toMatch(/^[a-f0-9]{64}$/);
  });
  expect(getMockExam("a2-mock-08")).toMatchObject({
    mode:"kombi",sections:["Lesen","Hören","Schreiben","Sprechen"],
    route:"/campus/course/a2-kombi-mock-8",
  });
  expect(a2KombiKeys("a2-mock-08","student-1").hoeren).toContain(":hoeren");
  expect(getMockExamsForLevel("A2",{includeCourse:true}).some(x=>x.id==="a2-mock-03-hoeren")).toBe(false);
});

test("Mock 08 new /100 scoring uses private Hören key while old /75 results remain unchanged", () => {
  const reading=require("../../../functions/functionz/a2KombiMarkingSets")["a2-mock-08"].reading;
  const verifiedSections={schreiben:{verified:true,score:25},sprechen:{verified:true,score:25}};
  const legacy=buildVerifiedA2MockScore({mockId:"a2-mock-08",
    state:{assessmentVersion:"three-module-v1",lesenAnswers:reading},verifiedSections});
  expect(legacy.overall.maxPoints).toBe(75);
  expect(legacy.overall.assessmentVersion).toBe("three-module-v1");
  expect(legacy.sectionScores).not.toHaveProperty("hoeren");
  const upgraded=buildVerifiedA2MockScore({mockId:"a2-mock-08",
    state:{assessmentVersion:"four-module-v2",lesenAnswers:reading,hoerenAnswers:answers},verifiedSections});
  expect(upgraded.overall.maxPoints).toBe(100);
  expect(upgraded.overall.points).toBe(100);
  expect(upgraded.sectionScores.hoeren).toBe(25);
  expect(upgraded.overall.sections).toEqual(["lesen","hoeren","schreiben","sprechen"]);
});

test("Mock 08 R2 playback fails closed if audio is not verified", async () => {
  expect(await verifyA2Mock08Audio({level:"A2",mockId:"mock-08",part:"teil-1",
    key:"a2/mock-hoeren/mock-08/teil-1.mp3",
    signedUrl:"https://bucket.r2.cloudflarestorage.com/teil-1.mp3",
    fetchImpl:async()=>({ok:false})})).toBe(false);
  expect(await verifyA2Mock08Audio({level:"A2",mockId:"mock-08",part:"teil-1",
    key:"a2/mock-hoeren/mock-08/teil-1.mp3",
    signedUrl:"https://example.com/untrusted.mp3"})).toBe(false);
});
