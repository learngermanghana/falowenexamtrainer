import fs from "fs";
import path from "path";
import {A1_MOCK_4_LISTENING} from "../data/a1Mock4Listening";
import {getMockExam} from "../data/mockExamCatalog";
import {canReviewFullMock,getScoredMockSections} from "../utils/mockReviewAccess";
const page=fs.readFileSync(path.join(__dirname,"A1FinalMockExamPage.jsx"),"utf8");
const server=fs.readFileSync(path.join(__dirname,"../../functions/functionz/app.js"),"utf8");
test("Mock 4 has the exact three protected R2 part names and 15 interactive questions",()=>{
 const sections=["teil1","teil2","teil3"];
 expect(sections.map((k)=>A1_MOCK_4_LISTENING[k].questions.length)).toEqual([6,4,5]);
 for(const [i,key] of sections.entries()){
  const part=A1_MOCK_4_LISTENING[key];
  expect(part.audioObjectKey).toBe(`a1/mock-hoeren/mock-04/teil-${i+1}.mp3`);
  expect(part.questions.every((q,j)=>q.number===j+1)).toBe(true);
  expect(part.questions.every(q=>q.answer===undefined&&q.correctIndex===undefined)).toBe(true);
 }
 expect(A1_MOCK_4_LISTENING.teil2.questions.every(q=>typeof q.statement==="string"&&!q.options)).toBe(true);
 expect(Object.keys(A1_MOCK_4_LISTENING)).toEqual(sections);
});
test("library and UI include Hören for new Mock 4 but preserve historic three-module result",()=>{
 expect(getMockExam("a1-final-04").sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
 expect(getMockExam("a1-final-05").sections).toEqual(["Lesen","Schreiben","Sprechen"]);
 expect(page).toContain('mockAudioId={mockId==="a1-mock-04"?"mock-04":"mock-01"}');
 expect(page).toContain('assessmentVersion:response.assessmentVersion || "three-module-v1"');
 expect(page).toContain('moveToSection(hasHoren ? "hoeren" : "schreiben"');
 expect(page).toContain('isKombi ? exam.listeningAnswerKey?.[key] : question.answer');
 const previous={completed:true,assessmentVersion:"three-module-v1",overall:{maxPoints:75,assessmentVersion:"three-module-v1"},sectionScores:{lesen:25,schreiben:25,sprechen:25}};
 const current={completed:true,assessmentVersion:"four-module-v2",overall:{maxPoints:100,assessmentVersion:"four-module-v2"},sectionScores:{lesen:25,hoeren:25,schreiben:25,sprechen:25}};
 expect(getScoredMockSections(previous)).toEqual(["lesen","schreiben","sprechen"]);
 expect(getScoredMockSections(current)).toEqual(["lesen","hoeren","schreiben","sprechen"]);
 expect(canReviewFullMock(previous)).toBe(true);
 expect(canReviewFullMock(current)).toBe(true);
 expect(canReviewFullMock({...current,sectionScores:{lesen:25,schreiben:25,sprechen:25}})).toBe(false);
});
test("the backend returns listening keys only after verified Mock 4 completion",()=>{
 expect(server).toContain('verifiedAttempt.mockId==="a1-mock-04" && verifiedAttempt.assessmentVersion==="four-module-v2"');
 expect(server).toContain('listeningAnswerKey:getA1MockSet(verifiedAttempt.mockId)?.listeningAnswerKey');
});
