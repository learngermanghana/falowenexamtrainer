import {
  uploadMockAnswerBackup, getMockAnswerBackup, restoreA2Mock2Backup,
  restoreB2Backup, submittedB2Sections,
} from "./a2Mock2Backup";
import {getA2Mock2StorageKeys} from "../utils/mockReviewAccess";

jest.mock("./backendUrl",()=>({getBackendUrl:()=>"/api"}));
const start = Date.now() - 50_000;
const submitted = Date.now() - 20_000;
const uid = "student-uid";
beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn().mockResolvedValue({
    ok:true,json:async()=>({ok:true,saved:true}),
  });
});
test("only submitted sections upload, repeated renders make no extra writes",async()=>{
  const writing={submittedAt:submitted,sms:"Hallo Julia",email:"Sehr geehrte Damen und Herren"};
  await expect(uploadMockAnswerBackup("a2-mock-02","schreiben",start,writing,"token",uid)).resolves.toBe(true);
  await expect(uploadMockAnswerBackup("a2-mock-02","schreiben",start,writing,"token",uid)).resolves.toBe(false);
  expect(fetch).toHaveBeenCalledTimes(1);
  const [url, options]=fetch.mock.calls[0];
  expect(url).toBe("/api/internal/mock-answer-backup");
  expect(options.method).toBe("POST");
  expect(options.body).not.toContain("audio");
  expect(options.body).not.toContain("transcript");
  await expect(uploadMockAnswerBackup("a2-mock-02","sprechen",start,
    {submittedAt:submitted, transcript:"private"},"token",uid)).resolves.toBe(false);
  expect(fetch).toHaveBeenCalledTimes(1);
});
test("restore submitted sections to their original student keys and advance to Sprechen",()=>{
  const keys=getA2Mock2StorageKeys(uid);
  const remote={backup:{attemptStartedAtMs:start,sections:{
    lesen:{submittedAt:submitted,answers:{"1":"a"}},
    hoeren:{submittedAt:submitted,answers:{"1":"ja"}},
    schreiben:{submittedAt:submitted,sms:"Hallo Julia",email:"Hallo Hotel"},
  }}};
  expect(restoreA2Mock2Backup(keys,remote)).toBe(true);
  expect(JSON.parse(localStorage.getItem(keys.schreiben)).startedAt).toBe(submitted);
  expect(JSON.parse(localStorage.getItem(keys.schreiben)).sms).toBe("Hallo Julia");
  expect(JSON.parse(localStorage.getItem(keys.flow)).stage).toBe("sprechen");
  expect(restoreA2Mock2Backup(keys,remote)).toBe(false);
});
test("B2 saved responses exclude speech and replay completed sections in order",()=>{
  const parts=submittedB2Sections({
    attemptStartedAtMs:start,
    teil4Completed:true,hoeren4Completed:true,schreibenCompleted:true,
    teil1Answers:{1:"a"},schreiben:{teil1:"Text",teil2:"E-Mail"},
    schreibenResult:{score:17}, speakingProgress:{recording:"DO NOT UPLOAD"},
  });
  expect(parts.map(([section])=>section)).toEqual(["lesen","hoeren","schreiben"]);
  expect(JSON.stringify(parts)).not.toContain("DO NOT UPLOAD");
  const cloud={backup:{attemptStartedAtMs:start,sections:{
    lesen:parts[0][1],hoeren:parts[1][1],schreiben:parts[2][1],
  }}};
  const restored=restoreB2Backup({stage:"teil1",started:false,teil1Answers:{}},cloud);
  expect(restored.stage).toBe("sprechen");
  expect(restored.schreibenResult.score).toBe(17);
});
test("reading backups is one on-demand authenticated request",async()=>{
  await getMockAnswerBackup("b2-final-mock","token");
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toContain("mockId=b2-final-mock");
});
