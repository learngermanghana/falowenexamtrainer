import { finalizeA2Mock2, savedA2Mock2State } from "./a2Mock2Finalization";
import { saveA2MockAttempt, scoreA2MockWriting } from "./a2FinalMockService";
import { scoreA2MockSpeaking } from "./coachService";

jest.mock("./a2FinalMockService",()=>({
  saveA2MockAttempt:jest.fn(),
  scoreA2MockWriting:jest.fn(),
}));
jest.mock("./coachService",()=>({scoreA2MockSpeaking:jest.fn()}));

const keys={lesen:"l",hoeren:"h",schreiben:"w",sprechen:"s"};
const save=(key,value)=>localStorage.setItem(keys[key],JSON.stringify(value));
const verified={sectionScores:{lesen:25,hoeren:20,schreiben:15,sprechen:18},
  overall:{score:78,maxScore:100,passed:true}};
beforeEach(()=>{
  localStorage.clear();
  jest.resetAllMocks();
  save("lesen",{completedAt:1,answers:{"1":"b"}});
  save("hoeren",{completedAt:2,answers:{"1":"c"}});
  save("schreiben",{submittedAt:3,sms:"Liebe Julia",email:"Sehr geehrte Damen und Herren"});
  save("sprechen",{_examinerParts:{
    "1":{sessionId:"one"},"2":{sessionId:"two"},"3":{sessionId:"three"},
  }});
  saveA2MockAttempt.mockResolvedValue({completionSync:{ok:true},verifiedResult:verified});
  scoreA2MockWriting.mockResolvedValue({score:15,maxScore:25});
  scoreA2MockSpeaking.mockResolvedValue({score:18,maxScore:25});
});

test("a full mock uses one shared server attempt and returns only backend totals",async()=>{
  const state=savedA2Mock2State(keys);
  expect(state.lesenAnswers).toEqual({"1":"b"});
  expect(state.sprechenSessionIds).toEqual(["one","two","three"]);
  await expect(finalizeA2Mock2({keys,attemptId:"attempt",idToken:"token"})).resolves.toEqual(verified);
  expect(scoreA2MockWriting).toHaveBeenCalledTimes(1);
  expect(scoreA2MockWriting).toHaveBeenCalledWith(expect.objectContaining({
    attemptId:"attempt",mockId:"a2-mock-02",
  }));
  expect(scoreA2MockSpeaking).toHaveBeenCalledWith({
    attemptId:"attempt",idToken:"token",mockId:"a2-mock-02",
    examinerSessionIds:["one","two","three"],
  });
  expect(saveA2MockAttempt).toHaveBeenLastCalledWith(expect.objectContaining({
    attemptId:"attempt",section:"result",status:"completed",
  }));
});

test("an older five-answer submission reuses saved text without rerecording",async()=>{
  save("sprechen",Object.fromEntries(["t1_questions","t1_answers","t2_main","t2_followups","t3_plan"]
    .map(key=>[key,{transcript:"Meine Antwort"}])));
  await finalizeA2Mock2({keys,attemptId:"attempt",idToken:"token"});
  expect(scoreA2MockSpeaking).toHaveBeenCalledWith(expect.objectContaining({
    attempts:expect.arrayContaining([expect.objectContaining({id:"t3_plan",transcript:"Meine Antwort"})]),
  }));
});

test("cannot call an unconfirmed final synchronization a verified result",async()=>{
  saveA2MockAttempt.mockResolvedValue({completionSync:{ok:false,error:"storage unavailable"}});
  await expect(finalizeA2Mock2({keys,attemptId:"attempt",idToken:"token"}))
    .rejects.toThrow(/not confirmed/);
});

test("never fabricates a score without confirmed speaking evidence",async()=>{
  save("sprechen",{});
  await expect(finalizeA2Mock2({keys,attemptId:"attempt",idToken:"token"}))
    .rejects.toThrow(/incomplete or cannot be verified/);
  expect(saveA2MockAttempt).toHaveBeenCalledTimes(1);
});
