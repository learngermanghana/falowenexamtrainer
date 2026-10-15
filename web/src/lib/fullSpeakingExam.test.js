import {examPartCount,newFullSpeakingExam,finishFullSpeakingPart,fullExamSummary,validStoredFullExam} from "./fullSpeakingExam";

test.each(["A1","A2","B1","B2","C1","C2"])("%s full exam progresses through its real number of speaking parts",(level)=>{
  const started=newFullSpeakingExam(level);
  expect(started.currentTeil).toBe("1");
  const count=examPartCount(level);
  let state=started;
  for(let i=1;i<=count;i++){
    const result=finishFullSpeakingPart(state,{level,teil:"Teil "+i,
      taskId:"task-"+i,topic:"Topic "+i,feedback:"Completed.",
      assessment:{score:6,maxScore:8,percent:i===1?60:80}});
    expect(result.parts).toHaveLength(i);
    expect(result.status).toBe(i===count?"complete":"in_progress");
    if(i<count)expect(result.currentTeil).toBe(String(i+1));
    // Receiving the same section completion twice must not double-count it.
    const repeated=finishFullSpeakingPart(result,{level,teil:"Teil "+i,taskId:"task-"+i,feedback:"Completed."});
    expect(repeated).toEqual(result);
    state=result;
  }
  const summary=fullExamSummary(state);
  expect(summary.complete).toBe(true);
  expect(summary.parts).toHaveLength(count);
  expect(summary.percent).toBe(Math.round((60+80*(count-1))/count));
  expect(validStoredFullExam(JSON.parse(JSON.stringify(state)))).not.toBeNull();
});
test("full exam never invents a score when a section has feedback but no numeric result",()=>{
  const level="A1";
  let state=newFullSpeakingExam(level);
  for(let i=1;i<=3;i++)state=finishFullSpeakingPart(state,{level,teil:"Teil "+i,
    taskId:"task-"+i,feedback:"Saved feedback",assessment:i===2?null:{percent:80}});
  expect(fullExamSummary(state).percent).toBeNull();
});
test("full exam ignores mismatched levels, out-of-sequence and missing feedback",()=>{
  const state=newFullSpeakingExam("C2");
  expect(finishFullSpeakingPart(state,{level:"A1",teil:"Teil 1",taskId:"abc",feedback:"Hi"})).toBe(state);
  expect(finishFullSpeakingPart(state,{level:"C2",teil:"Teil 2",taskId:"abc",feedback:"Hi"})).toBe(state);
  expect(finishFullSpeakingPart(state,{level:"C2",teil:"Teil 1",taskId:"abc",feedback:""})).toBe(state);
  expect(validStoredFullExam({...state,currentTeil:"3"})).toBeNull();
});