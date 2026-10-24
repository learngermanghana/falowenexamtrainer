import fs from "fs";
import path from "path";
import {restoreFullMockReviewState} from "../utils/mockReviewAccess";

test.each(["A1","A2","B1"])("%s full mock keeps students progressing when writing AI fails",level => {
  const source=fs.readFileSync(path.join(__dirname,`${level}FinalMockExamPage.jsx`),"utf8");
  expect(source).toContain('moveToSection("sprechen", { writingPending: true })');
  expect(source).toContain('Retry Schreiben marking');
  expect(source).toContain('exam.completed && !exam.writingPending');
  expect(source).toContain('exam.writingPending || !attemptId');
  expect(source).toContain('writingPending:false');
});
test("a completed pending-writing attempt is not downgraded into a new Schreiben session",()=>{
  const pending={stage:"result", completed:true, writingPending:true,
    speakingResult:{score:16}, sectionScores:{lesen:20,hoeren:19,sprechen:16}};
  expect(restoreFullMockReviewState(pending)).toEqual(pending);
  const released=restoreFullMockReviewState({...pending,writingPending:false});
  expect(released.stage).toBe("schreiben");
  expect(released.completed).toBe(false);
});
test("B2 final score stays unpublished until Schreiben AI marking returns",()=>{
  const source=fs.readFileSync(path.join(__dirname,"B2FinalMockExamPage.jsx"),"utf8");
  expect(source).toContain('!state.schreibenResult || !idToken');
  expect(source).toContain('if (state.completed && !state.schreibenResult)');
  expect(source).toContain('retrySchreibenMarking');
  expect(source).toContain('schreibenCompleted:true, schreibenSubmittedAt:Date.now()');
});
