import fs from "fs";
import path from "path";
import vm from "vm";

const source = fs.readFileSync(path.resolve(__dirname, "../../../functions/functionz/liveSpeak.js"), "utf8");

function setup(overrides = {}, authOverride = {}) {
  const docs = new Map();
  const routes = new Map();
  const snapshot = key => ({ exists:docs.has(key), data:()=>docs.get(key) });
  const mutate = (key, value, merge) => {
    const old = merge ? {...(docs.get(key)||{})} : {};
    for (const [field, delta] of Object.entries(value)) {
      old[field] = delta && typeof delta==="object" && "incrementBy" in delta ?
        (Number(old[field])||0)+delta.incrementBy : delta;
    }
    docs.set(key, old);
  };
  const doc = key => ({
    key,
    get:async()=>snapshot(key),
    update:async(value)=>mutate(key,value,true),
  });
  const db = {
    collection:name=>({doc:id=>doc(name+"/"+id)}),
    runTransaction:async action=>action({
      get:async ref=>snapshot(ref.key),
      update:(ref,value)=>mutate(ref.key,value,true),
      set:(ref,value,options)=>mutate(ref.key,value,Boolean(options?.merge)),
    }),
  };
  const admin = {firestore:Object.assign(()=>db,{
    FieldValue:{ serverTimestamp:()=> "server",increment:n=>({incrementBy:n}) },
  })};
  const fakeClient = {
    audio:{
      transcriptions:{create:jest.fn(async()=>({text:"Ich gehen heute zum Markt."}))},
      speech:{create:jest.fn(async()=>({arrayBuffer:async()=>Uint8Array.from([1,2,3]).buffer}))},
    },
    chat:{completions:{create:jest.fn(async()=>({choices:[{message:{content:"Fast richtig: Ich gehe heute zum Markt. Und was kaufst du dort?"}}]}))}},
  };
  const moduleObj={exports:{}};
  const env={LIVE_SPEAK_ENABLED:"true",
    LIVE_SPEAK_MONTHLY_TURN_CAP:"40",OPENAI_API_KEY:"sk_test_fake",...overrides};
  vm.runInNewContext(source,{
    module:moduleObj,exports:moduleObj.exports, Buffer, Date, console,
    process:{env},
    require:name=>{
      if(name==="crypto")return {randomUUID:()=>"unique-session-id"};
      if(name==="openai")return {toFile:async(_data,name)=>({name})};
      if(name==="./goetheExaminerFlow")return require("../../../functions/functionz/goetheExaminerFlow");
      if(name==="./openaiClient")return {getOpenAIClient:()=>fakeClient};
      throw new Error("Unexpected require "+name);
    },
  },{filename:"liveSpeak.js"});
  const app={
    post:(route,handler)=>routes.set("POST "+route,handler),
    get:(route,handler)=>routes.set("GET "+route,handler),
  };
  const student={auth:{uid:"u123",email:"student@example.com"},profile:{uid:"u123",email:"student@example.com"}};
  const auth = {...student.auth,...authOverride};
  moduleObj.exports.registerLiveSpeakRoutes(app,{
    admin,getAuthedUser:async()=>auth,
    findStudentByCodeOrEmail:async()=>({snap:{data:()=>student.profile}}),
  });
  const call=async(method,route,body={})=>{
    const fn=routes.get(method+" "+route);
    if(!fn)throw new Error("Missing route "+route);
    const res={code:200,payload:null,status(n){this.code=n;return this},json(p){this.payload=p;return this}};
    await fn({body,headers:{authorization:"Bearer test"}},res);
    return res;
  };
  return {call,db,docs,routes,fakeClient};
}

test("no payment or checkout routes are registered anywhere in the voice pilot",()=>{
  const api=setup();
  const routes=Array.from(api.routes.keys());
  expect(routes).toContain("POST /live-speak/pilot/claim");
  expect(routes).toContain("POST /live-speak/session/turn");
  expect(routes.some(x=>/paystack|checkout|billing|payment|verify/i.test(x))).toBe(false);
});

test("the pilot is disabled by default without explicit server activation",async()=>{
  const api=setup({LIVE_SPEAK_ENABLED:"false"});
  const grant=await api.call("POST","/live-speak/pilot/claim");
  expect(grant.code).toBe(503);
  expect(grant.payload.code).toBe("pilot_disabled");
  expect(api.docs.size).toBe(0);
});

test("signed-in student can claim free pilot sessions without allowlisting",async()=>{
  const api=setup({LIVE_SPEAK_ENABLED:"true"});
  const status=await api.call("GET","/live-speak/status");
  expect(status.code).toBe(200);
  expect(status.payload.pilotAvailable).toBe(true);
  const claim=await api.call("POST","/live-speak/pilot/claim");
  expect(claim.code).toBe(200);
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(2);
});

test("mismatched student identity cannot access the speaking pilot",async()=>{
  const api=setup({}, {uid:"other-user",email:"outsider@example.com"});
  const claim=await api.call("POST","/live-speak/pilot/claim");
  expect(claim.code).toBe(403);
  const start=await api.call("POST","/live-speak/session/start",{level:"A1"});
  expect(start.code).toBe(403);
  expect(api.fakeClient.audio.speech.create).not.toHaveBeenCalled();
});

test("student can claim two sessions only once, even when repeatedly requested",async()=>{
  const api=setup();
  const first=await api.call("POST","/live-speak/pilot/claim",{sessions:999});
  expect(first.code).toBe(200);
  expect(first.payload.sessions).toBe(2);
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(2);
  const again=await api.call("POST","/live-speak/pilot/claim");
  expect(again.code).toBe(409);
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(2);
});

test("starting a session deducts one credit and the greeting uses natural AI TTS",async()=>{
  const api=setup();
  await api.call("POST","/live-speak/pilot/claim");
  const first=await api.call("POST","/live-speak/session/start",{level:"A2"});
  expect(first.payload.sessionId).toBe("unique-session-id");
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(1);
  const resumed=await api.call("POST","/live-speak/session/start",{level:"B2"});
  expect(resumed.payload.resumed).toBe(true);
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(1);
  const voice=await api.call("POST","/live-speak/session/turn",{sessionId:first.payload.sessionId,intro:true});
  expect(voice.payload.reply).toMatch(/Hallo/);
  expect(voice.payload.audioBase64).toBeTruthy();
  expect(api.fakeClient.audio.speech.create).toHaveBeenCalledTimes(1);
  expect(api.docs.get("liveSpeakSessions/u123").turnsUsed).toBe(1);
  expect(api.docs.get("liveSpeakUsage/"+new Date().toISOString().slice(0,7)).turns).toBe(1);
});

test("the pilot cap prevents voice usage and a session expires on the server",async()=>{
  const api=setup({LIVE_SPEAK_MONTHLY_TURN_CAP:"1"});
  // First use a pre-approved test session to verify the cap on a real turn.
  api.docs.set("liveSpeakSessions/u123",{
    uid:"u123",sessionId:"session",level:"A1",expiresAt:new Date(Date.now()+90_000).toISOString(),
    turnsUsed:0,inFlight:false,endedAt:null,
  });
  const first=await api.call("POST","/live-speak/session/turn",{sessionId:"session",intro:true});
  expect(first.code).toBe(200);
  const blocked=await api.call("POST","/live-speak/session/turn",{sessionId:"session",intro:true});
  expect(blocked.code).toBe(429);
  expect(api.fakeClient.audio.speech.create).toHaveBeenCalledTimes(1);
  api.docs.set("liveSpeakUsage/"+new Date().toISOString().slice(0,7),{turns:0});
  api.docs.set("liveSpeakSessions/u123",{...api.docs.get("liveSpeakSessions/u123"),expiresAt:"2001-01-01T00:00:00Z"});
  const expired=await api.call("POST","/live-speak/session/turn",{sessionId:"session",intro:true});
  expect(expired.code).toBe(409);
  expect(api.fakeClient.audio.speech.create).toHaveBeenCalledTimes(1);
});

// Transcription must remain ungraded until student reviews the transcript.
test("German speech is transcribed without inventing tutor corrections before confirmation",async()=>{
  const api=setup();
  await api.call("POST","/live-speak/pilot/claim");
  const started=await api.call("POST","/live-speak/session/start",{level:"C2"});
  const audioBase64=Buffer.from("a".repeat(1600)).toString("base64");
  const speech=await api.call("POST","/live-speak/session/turn",{
    sessionId:started.payload.sessionId,mimeType:"audio/webm",audioBase64,
  });
  expect(speech.code).toBe(200);
  expect(speech.payload.needsConfirmation).toBe(true);
  expect(speech.payload.transcript).toBe("Ich gehen heute zum Markt.");
  expect(speech.payload.reply).toBeUndefined();
  expect(api.fakeClient.chat.completions.create).not.toHaveBeenCalled();
  expect(api.fakeClient.audio.speech.create).not.toHaveBeenCalled();
  expect(api.fakeClient.audio.transcriptions.create).toHaveBeenCalledWith(expect.objectContaining({
    model:"gpt-4o-transcribe",language:"de",response_format:"json",include:["logprobs"],
  }), expect.objectContaining({maxRetries:0,timeout:45000}));
  expect(api.docs.get("liveSpeakSessions/u123").pendingId).toBe(speech.payload.pendingId);
  expect(api.docs.get("liveSpeakUsage/"+new Date().toISOString().slice(0,7)).turns).toBe(2);
  const confirmed=await api.call("POST","/live-speak/session/confirm",{
    sessionId:started.payload.sessionId,pendingId:speech.payload.pendingId,
    transcript:"Ich gehe heute zum Markt.",history:[],
  });
  expect(confirmed.code).toBe(200);
  expect(confirmed.payload.transcript).toBe("Ich gehe heute zum Markt.");
  expect(confirmed.payload.reply).toMatch(/Fast richtig/);
  expect(confirmed.payload.audioBase64).toBeTruthy();
  expect(api.fakeClient.chat.completions.create).toHaveBeenCalledTimes(1);
  expect(api.fakeClient.audio.speech.create).toHaveBeenCalledTimes(1);
  const again=await api.call("POST","/live-speak/session/confirm",{
    sessionId:started.payload.sessionId,pendingId:speech.payload.pendingId,
    transcript:"Ich gehe heute zum Markt.",
  });
  expect(again.code).toBe(409);
  expect(api.fakeClient.chat.completions.create).toHaveBeenCalledTimes(1);
});

test("AI refuses transcript confirmation without a preceding metered recording",async()=>{
  const api=setup();
  await api.call("POST","/live-speak/pilot/claim");
  const started=await api.call("POST","/live-speak/session/start",{level:"A2"});
  const response=await api.call("POST","/live-speak/session/confirm",{
    sessionId:started.payload.sessionId,pendingId:"forged",transcript:"Ich spreche Deutsch.",
  });
  expect(response.code).toBe(409);
  expect(api.fakeClient.chat.completions.create).not.toHaveBeenCalled();
});

test("workbook topic starts a real scoped voice session; Exam Room cannot silently replace it", async () => {
  const api=setup();
  const claim=await api.call("POST","/live-speak/pilot/claim");
  expect(claim.code).toBe(200);
  const started=await api.call("POST","/live-speak/session/start",{
    level:"B2",topic:"Nachhaltige Mobilität",source:"b2-workbook",
  });
  expect(started.code).toBe(200);
  expect(started.payload.topic).toBe("Nachhaltige Mobilität");
  expect(started.payload.source).toBe("b2-workbook");
  const status = await api.call("GET","/live-speak/status");
  expect(status.payload.activeSession).toEqual(expect.objectContaining({
    level:"B2",topic:"Nachhaltige Mobilität",source:"b2-workbook",
    sessionId:started.payload.sessionId,
  }));
  const record=api.docs.get("liveSpeakSessions/u123");
  expect(record.level).toBe("B2");
  expect(record.topic).toBe("Nachhaltige Mobilität");
  const spoken=await api.call("POST","/live-speak/session/turn",{
    sessionId:started.payload.sessionId,intro:true,
  });
  expect(spoken.code).toBe(200);
  expect(spoken.payload.reply).toContain("Nachhaltige Mobilität");
  expect(api.fakeClient.audio.speech.create).toHaveBeenCalledTimes(1);
  const resumed=await api.call("POST","/live-speak/session/start",{
    level:"A2",topic:"Im Restaurant",source:"exam-speaking-practice",
    examTask:{id:"a2-example",teil:"Teil 2",prompt:"Im Restaurant"},
  });
  expect(resumed.code).toBe(200);
  expect(resumed.payload.resumed).toBe(true);
  expect(resumed.payload.level).toBe("B2");
  expect(resumed.payload.topic).toBe("Nachhaltige Mobilität");
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(1);
});

test("Goethe AI Examiner uses the selected A1 exam task and does not correct during the dialogue",async()=>{
  const api=setup();
  await api.call("POST","/live-speak/pilot/claim");
  const task={id:"a1-teil-1-introduction",teil:"Teil 1",prompt:"Stellen Sie sich kurz vor",
    keywords:"Name, Alter, Wohnort, Beruf, Hobby",hint:"Sprechen Sie kurz über alle Punkte."};
  const start=await api.call("POST","/live-speak/session/start",{
    level:"A1",source:"exam-speaking-practice",topic:task.prompt,examTask:task,
  });
  expect(start.code).toBe(200);
  expect(start.payload.examTask).toEqual(expect.objectContaining(task));
  expect(api.docs.get("liveSpeakSessions/u123").source).toBe("exam-speaking-practice");
  const intro=await api.call("POST","/live-speak/session/turn",{sessionId:start.payload.sessionId,intro:true});
  expect(intro.payload.reply).toContain("Stellen Sie sich kurz vor");
  const speech=await api.call("POST","/live-speak/session/turn",{
    sessionId:start.payload.sessionId,mimeType:"audio/webm",
    audioBase64:Buffer.from("hello".repeat(340)).toString("base64"),
  });
  expect(speech.payload.needsConfirmation).toBe(true);
  const confirmed=await api.call("POST","/live-speak/session/confirm",{
    sessionId:start.payload.sessionId,pendingId:speech.payload.pendingId,
    transcript:"Ich heiße Mia und komme aus Ghana.",
  });
  expect(confirmed.code).toBe(200);
  const request=api.fakeClient.chat.completions.create.mock.calls[0][0];
  expect(request.messages[0].content).toMatch(/Do NOT correct grammar/);
  expect(request.messages[0].content).toMatch(/ONE concise next question/);
  expect(request.messages[0].content).toContain("Stellen Sie sich kurz vor");
  expect(api.docs.get("liveSpeakSessions/u123").answeredTurns).toBe(1);
});

test("examiner feedback is metered, provided only after a confirmed answer, and reuses saved feedback on retry",async()=>{
  const api=setup();
  await api.call("POST","/live-speak/pilot/claim");
  const task={id:"b1-teil-2",teil:"Teil 2",prompt:"Gesund und fit bleiben"};
  const start=await api.call("POST","/live-speak/session/start",{
    level:"B1",source:"exam-speaking-practice",topic:task.prompt,examTask:task,
  });
  const premature=await api.call("POST","/live-speak/session/exam-feedback",{
    sessionId:start.payload.sessionId,answers:["Ich denke, dass Sport wichtig ist."],
  });
  expect(premature.code).toBe(400);
  const audio=await api.call("POST","/live-speak/session/turn",{
    sessionId:start.payload.sessionId,mimeType:"audio/webm",
    audioBase64:Buffer.from("hallo".repeat(360)).toString("base64"),
  });
  const confirm=await api.call("POST","/live-speak/session/confirm",{
    sessionId:start.payload.sessionId,pendingId:audio.payload.pendingId,
    transcript:"Ich treibe Sport, weil ich gesund bleiben möchte.",
  });
  expect(confirm.code).toBe(200);
  const feedback=await api.call("POST","/live-speak/session/exam-feedback",{
    sessionId:start.payload.sessionId,answers:["Ich treibe Sport, weil ich gesund bleiben möchte."],
  });
  expect(feedback.code).toBe(200);
  expect(feedback.payload.practiceOnly).toBe(true);
  const feedbackInput=api.fakeClient.chat.completions.create.mock.calls.at(-1)[0];
  expect(feedbackInput.messages[0].content).toContain("not an official Goethe result");
  expect(feedbackInput.messages[0].content).toContain("Do NOT assert a pronunciation score");
  expect(api.docs.get("liveSpeakSessions/u123").feedbackRequested).toBe(true);
  const retry=await api.call("POST","/live-speak/session/exam-feedback",{
    sessionId:start.payload.sessionId,answers:["Ich treibe Sport."],
  });
  expect(retry.code).toBe(200);
  expect(retry.payload.cached).toBe(true);
  expect(api.fakeClient.chat.completions.create).toHaveBeenCalledTimes(2);
});

test("general conversation cannot call examiner feedback",async()=>{
  const api=setup();
  await api.call("POST","/live-speak/pilot/claim");
  const start=await api.call("POST","/live-speak/session/start",{level:"A2",topic:"Familie",source:"course-workbook"});
  const reply=await api.call("POST","/live-speak/session/exam-feedback",{
    sessionId:start.payload.sessionId,answers:["Ich komme aus Ghana."],
  });
  expect(reply.code).toBe(409);
  expect(api.fakeClient.chat.completions.create).not.toHaveBeenCalled();
});

const sessionKey = "liveSpeakSessions/u123";
const usageKey = () => "liveSpeakUsage/"+new Date().toISOString().slice(0,7);
const task = {id:"b1-teil-2",teil:"Teil 2",prompt:"Gesund bleiben",keywords:"Sport, Essen"};
const audioPayload = {mimeType:"audio/webm",audioBase64:Buffer.from("a".repeat(1600)).toString("base64")};
async function startExam(api) {
  await api.call("POST","/live-speak/pilot/claim");
  return (await api.call("POST","/live-speak/session/start",{
    level:"B1",source:"exam-speaking-practice",examTask:task,
  })).payload;
}
async function answerExam(api, session, text="Ich mache Sport, weil ich gesund bleiben möchte.") {
  const audio = await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...audioPayload});
  expect(audio.code).toBe(200);
  return api.call("POST","/live-speak/session/confirm",{sessionId:session.sessionId,pendingId:audio.payload.pendingId,transcript:text});
}

test("reload restores recognition and confirmed answers; feedback ignores client answers",async()=>{
  const api=setup(); const session=await startExam(api);
  const audio=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...audioPayload});
  const status=await api.call("GET","/live-speak/status");
  expect(status.payload.activeSession.pending).toEqual(expect.objectContaining({pendingId:audio.payload.pendingId,transcript:"Ich gehen heute zum Markt."}));
  await api.call("POST","/live-speak/session/confirm",{sessionId:session.sessionId,pendingId:audio.payload.pendingId,transcript:"Ich gehe heute zum Markt."});
  const resumed=await api.call("POST","/live-speak/session/start",{source:"exam-speaking-practice",examTask:task});
  expect(resumed.payload.confirmedAnswers).toEqual(["Ich gehe heute zum Markt."]);
  expect(resumed.payload.messages).toEqual(expect.arrayContaining([expect.objectContaining({role:"user",text:"Ich gehe heute zum Markt."})]));
  await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId,answers:["FORGED ANSWER"]});
  const input=api.fakeClient.chat.completions.create.mock.calls.at(-1)[0];
  expect(input.messages.at(-1).content).toContain("Ich gehe heute zum Markt.");
  expect(input.messages.at(-1).content).not.toContain("FORGED ANSWER");
});

test("two answers finish without buying another generated reply",async()=>{
  const api=setup(); const session=await startExam(api);
  expect(session.maxRecordingSeconds).toBe(90);
  expect((await answerExam(api,session)).payload.maxRecordingSeconds).toBe(20);
  expect((await answerExam(api,session,"Ich esse Gemüse.")).payload.taskReady).toBe(true);
  expect(api.fakeClient.chat.completions.create).toHaveBeenCalledTimes(1);
  expect(api.fakeClient.audio.speech.create).toHaveBeenCalledTimes(1);
  const blocked=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...audioPayload});
  expect(blocked.payload.code).toBe("task_ready");
  expect(api.fakeClient.audio.transcriptions.create).toHaveBeenCalledTimes(2);
  expect((await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId})).code).toBe(200);
  expect(JSON.parse(api.fakeClient.chat.completions.create.mock.calls.at(-1)[0].messages.at(-1).content).studentTranscripts).toHaveLength(2);
});

test("failed feedback preserves answers; one metered retry is cached and restored by status",async()=>{
  const api=setup(); const session=await startExam(api); await answerExam(api,session);
  const before=api.docs.get(usageKey()).turns;
  api.fakeClient.chat.completions.create.mockRejectedValueOnce(new Error("provider unavailable"));
  expect((await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId})).code).toBe(503);
  expect(api.docs.get(sessionKey)).toEqual(expect.objectContaining({feedbackStatus:"failed",endedAt:null,feedbackAttempts:1}));
  expect((await api.call("GET","/live-speak/status")).payload.activeSession.confirmedAnswers).toHaveLength(1);
  const retried=await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId});
  expect(retried.code).toBe(200);
  const cached=await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId});
  expect(cached.payload.feedback).toBe(retried.payload.feedback);
  expect(api.docs.get(usageKey()).turns).toBe(before+2);
  expect((await api.call("GET","/live-speak/status")).payload.lastExamResult.feedback).toBe(retried.payload.feedback);
});

test("concurrent feedback retrieval does not launch another provider call",async()=>{
  const api=setup(); const session=await startExam(api); await answerExam(api,session);
  let release;
  api.fakeClient.chat.completions.create.mockImplementationOnce(()=>new Promise(resolve=>{release=resolve}));
  const first=api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId});
  while(!release) await Promise.resolve();
  const duplicate=await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId});
  expect(duplicate.payload.code).toBe("feedback_processing");
  release({choices:[{message:{content:"Saved feedback"}}]});
  expect((await first).code).toBe(200);
  expect(api.fakeClient.chat.completions.create).toHaveBeenCalledTimes(2);
});

test("repeated failure exhausts retry allowance without deleting answers",async()=>{
  const api=setup(); const session=await startExam(api); await answerExam(api,session);
  api.fakeClient.chat.completions.create.mockRejectedValue(new Error("provider failed"));
  for(let i=0;i<2;i++) expect((await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId})).code).toBe(503);
  expect((await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId})).payload.code).toBe("feedback_retry_limit");
  expect(api.docs.get(sessionKey).confirmedAnswers).toHaveLength(1);
  expect(api.fakeClient.chat.completions.create).toHaveBeenCalledTimes(3);
});

test("lost reply speech keeps the answer and allows feedback without re-recording",async()=>{
  const api=setup(); const session=await startExam(api);
  api.fakeClient.audio.speech.create.mockRejectedValueOnce(new Error("TTS unavailable"));
  const confirmed=await answerExam(api,session);
  expect(confirmed.code).toBe(200);
  expect(confirmed.payload.taskReady).toBe(true);
  expect(api.docs.get(sessionKey).confirmedAnswers).toHaveLength(1);
  expect((await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId})).code).toBe(200);
});

test("openings reuse audio; expired tasks can finish in the bounded grace period",async()=>{
  const api=setup(); const session=await startExam(api);
  await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,intro:true});
  await answerExam(api,session);
  api.docs.set(sessionKey,{...api.docs.get(sessionKey),expiresAt:new Date(Date.now()-1000).toISOString()});
  expect((await api.call("GET","/live-speak/status")).payload.activeSession.sessionId).toBe(session.sessionId);
  expect((await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId})).code).toBe(200);
  const next=(await api.call("POST","/live-speak/session/start",{level:"B1",source:"exam-speaking-practice",examTask:task})).payload;
  await api.call("POST","/live-speak/session/turn",{sessionId:next.sessionId,intro:true});
  expect(api.fakeClient.audio.speech.create).toHaveBeenCalledTimes(2);
});

test("feedback retry cannot bypass the global cap",async()=>{
  const api=setup(); const session=await startExam(api); await answerExam(api,session);
  api.docs.set(usageKey(),{turns:40});
  expect((await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId})).payload.code).toBe("budget_reached");
  expect(api.docs.get(sessionKey).feedbackAttempts).toBe(0);
  expect(api.fakeClient.chat.completions.create).toHaveBeenCalledTimes(1);
});

test("saved answers can be resumed and reviewed after the spending cap is reached",async()=>{
  const api=setup(); const session=await startExam(api); await answerExam(api,session);
  api.docs.set(usageKey(),{turns:40});
  const resumed=await api.call("POST","/live-speak/session/start",{source:"exam-speaking-practice",examTask:task});
  expect(resumed.code).toBe(200);
  expect(resumed.payload.confirmedAnswers).toHaveLength(1);
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(1);
  api.docs.set(sessionKey,{...api.docs.get(sessionKey),expiresAt:new Date(Date.now()-11*60000).toISOString()});
  const expired=await api.call("GET","/live-speak/status");
  expect(expired.payload.activeSession).toBe(null);
  expect(expired.payload.lastExamResult.confirmedAnswers).toHaveLength(1);
});

test("unconfirmed re-recordings have a server-enforced total byte allowance",async()=>{
  const api=setup(); const session=await startExam(api);
  const large={...audioPayload,audioBase64:Buffer.alloc(350000,65).toString("base64")};
  for(let i=0;i<2;i++) expect((await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...large})).code).toBe(200);
  const blocked=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...audioPayload});
  expect(blocked.payload.code).toBe("audio_limit");
  expect(api.fakeClient.audio.transcriptions.create).toHaveBeenCalledTimes(2);
});

test("feedback from an older session cannot overwrite a replacement session",async()=>{
  const api=setup(); const session=await startExam(api); await answerExam(api,session);
  let release;
  api.fakeClient.chat.completions.create.mockImplementationOnce(()=>new Promise(resolve=>{release=resolve}));
  const request=api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId});
  while(!release) await Promise.resolve();
  api.docs.set(sessionKey,{sessionId:"new-session",level:"A1",confirmedAnswers:["New answer"]});
  release({choices:[{message:{content:"Old feedback"}}]});
  expect((await request).payload.code).toBe("task_changed");
  expect(api.docs.get(sessionKey)).toEqual({sessionId:"new-session",level:"A1",confirmedAnswers:["New answer"]});
});

test("a recording finishing at time-up can upload and confirm during a short grace period",async()=>{
  const api=setup(); const session=await startExam(api);
  api.docs.set(sessionKey,{...api.docs.get(sessionKey),expiresAt:new Date(Date.now()-1000).toISOString()});
  expect((await answerExam(api,session)).code).toBe(200);
  api.docs.set(sessionKey,{...api.docs.get(sessionKey),expiresAt:new Date(Date.now()-20000).toISOString()});
  const late=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...audioPayload});
  expect(late.payload.code).toBe("session_ended");
});

test("last answer reserves only transcription when one budget unit remains",async()=>{
  const api=setup(); const session=await startExam(api); await answerExam(api,session);
  api.docs.set(usageKey(),{turns:39});
  const last=await answerExam(api,session,"Ich esse gern Gemüse.");
  expect(last.code).toBe(200);
  expect(last.payload.taskReady).toBe(true);
  expect(api.docs.get(usageKey()).turns).toBe(40);
  expect(api.fakeClient.chat.completions.create).toHaveBeenCalledTimes(1);
});

async function startTaskFlow(api,level,part,mode="guided",topic="Freizeit") {
  await api.call("POST","/live-speak/pilot/claim");
  api.fakeClient.chat.completions.create.mockImplementation(async request=>({choices:[{message:{content:request.response_format
    ? JSON.stringify({reply:"Ja, gern. Was meinst du dazu?",decisions:[]}) : "Task completion: review the specific points."}}]}));
  const started=await api.call("POST","/live-speak/session/start",{level,source:"exam-speaking-practice",examinerFlowVersion:1,examMode:mode,
    examTask:{id:`${level}-${part}`,teil:`Teil ${part}`,prompt:topic}});
  expect(started.code).toBe(200);
  return started.payload;
}

test.each(["A1","A2","B1"].flatMap(level=>[1,2,3].map(part=>[level,part])))("%s Teil %s runs the complete server-owned flow and assesses saved evidence",async(level,part)=>{
  const api=setup(); const session=await startTaskFlow(api,level,part);
  await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,intro:true});
  expect(session.examFlow.key).toBe(`${level}-${part}`);
  for(let index=0;index<session.answerLimit;index++){
    const answer=await answerExam(api,session,`Das ist meine Antwort Nummer ${index+1}.`);
    expect(answer.code).toBe(200);
    expect(Boolean(answer.payload.taskReady)).toBe(index===session.answerLimit-1);
  }
  const status=await api.call("GET","/live-speak/status");
  expect(status.payload.activeSession.confirmedAnswers).toHaveLength(session.answerLimit);
  const feedback=await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId,answers:["FORGED"]});
  expect(feedback.code).toBe(200);
  const input=JSON.parse(api.fakeClient.chat.completions.create.mock.calls.at(-1)[0].messages.at(-1).content);
  expect(input.studentTranscripts).toHaveLength(session.answerLimit);
  expect(input.examContext.requiredCriteria.length).toBeGreaterThan(1);
  expect(input.examContext.reachedTurnLimit).toBe(true);
  expect(input.examContext.taskComplete).toBe(!(level === "A2" && part === 3) && !(level === "B1" && part === 1));
  expect(JSON.stringify(input)).not.toContain("FORGED");
});

test("B1 presentation accepts its larger recording but remains inside the original total audio allowance",async()=>{
  const api=setup(); const session=await startTaskFlow(api,"B1",2);
  expect(session.maxRecordingSeconds).toBe(180);
  expect(session.maxAudioBytes).toBe(700000);
  const recorded=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,mimeType:"audio/webm",audioBase64:Buffer.alloc(550000,65).toString("base64")});
  expect(recorded.code).toBe(200);
  expect(api.docs.get(usageKey()).turns).toBe(2);
  const done=await api.call("POST","/live-speak/session/confirm",{sessionId:session.sessionId,pendingId:recorded.payload.pendingId,transcript:"Ich möchte über meine Ausbildung sprechen. ".repeat(55)});
  expect(done.payload.taskReady).toBe(true);
  expect(api.fakeClient.chat.completions.create).not.toHaveBeenCalled();
  expect(api.fakeClient.audio.speech.create).not.toHaveBeenCalled();
});

test("simulation binds unedited answers to ASR; explicitly flagged recognition corrections are saved",async()=>{
  const api=setup(); const session=await startTaskFlow(api,"A1",1,"simulation");
  const recording=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...audioPayload});
  await api.call("POST","/live-speak/session/confirm",{sessionId:session.sessionId,pendingId:recording.payload.pendingId,transcript:"Unflagged rewritten answer"});
  expect(api.docs.get(sessionKey).confirmedAnswers[0]).toBe("Ich gehen heute zum Markt.");
  const next=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...audioPayload});
  await api.call("POST","/live-speak/session/confirm",{sessionId:session.sessionId,pendingId:next.payload.pendingId,transcript:"B A I D O O",recognitionCorrection:true});
  expect(api.docs.get(sessionKey).confirmedAnswers[1]).toBe("B A I D O O");
  expect(api.docs.get(sessionKey).recognitionReviews[1].corrected).toBe(true);
});

test("B2 retains the existing voice flow even if the client requests a new profile",async()=>{
  const api=setup(); const session=await startTaskFlow(api,"B2",1);
  expect(session.examFlow).toBe(null);
  expect(session.answerLimit).toBe(2);
});

test("calendar negotiation can finish on a supported agreement before its turn ceiling",async()=>{
  const api=setup(); const session=await startTaskFlow(api,"A2",3);
  await answerExam(api,session,"Hast du am Montag um 17 Uhr Zeit?");
  const text="Ja, Mittwoch um 18 Uhr passt.";
  api.fakeClient.chat.completions.create.mockResolvedValueOnce({choices:[{message:{content:JSON.stringify({reply:"Gut, dann Mittwoch um 18 Uhr.",decisions:[{point:"appointment",value:"Mittwoch 18:00",quote:text}]})}}]});
  const agreed=await answerExam(api,session,text);
  expect(agreed.payload.taskReady).toBe(true);
  expect(api.docs.get(sessionKey).answeredTurns).toBe(2);
  expect(api.fakeClient.chat.completions.create).not.toHaveBeenCalled();
  expect(agreed.payload.examFlow.step).toBe(null);
  expect(agreed.payload.examFlow.decisions).toEqual([{point:"appointment",value:"Mittwoch 18:00"}]);
});

test("B1 presentation discussion resumes the learner's preceding presentation topic",async()=>{
  const api=setup(); const presentation=await startTaskFlow(api,"B1",2,"guided","Ausbildung");
  await answerExam(api,presentation,"Heute spreche ich über meine Ausbildung.");
  await api.call("POST","/live-speak/session/exam-feedback",{sessionId:presentation.sessionId});
  const discussion=await startTaskFlow(api,"B1",3,"simulation","Fragen stellen zu einer Präsentation");
  expect(discussion.examFlow.topic).toBe("Ausbildung");
  expect(discussion.examFlow.step.instruction).toContain("Ausbildung");
  expect(api.docs.get(sessionKey).examFlow.ownPresentation).toBe("Heute spreche ich über meine Ausbildung.");
  expect(discussion.examFlow.partnerPresentation).toBe("");
  const first=await answerExam(api,discussion,"Ich habe viel im Betrieb gelernt.");
  expect(first.payload.speaker).toBe("partner");
  expect(first.payload.examFlow.partnerPresentation).toContain("Online Deutsch lernen");
});

test("simulation and task limits cannot be replaced by client profile fields",async()=>{
  const api=setup();await api.call("POST","/live-speak/pilot/claim");
  const response=await api.call("POST","/live-speak/session/start",{level:"A1",source:"exam-speaking-practice",examinerFlowVersion:1,
    examMode:"simulation",answerLimit:999,examFlow:{key:"B1-2",maxAnswers:999},examTask:{id:"x",teil:"Teil 1",prompt:"Name"}});
  expect(response.payload.answerLimit).toBe(4);
  expect(response.payload.maxRecordingSeconds).toBe(60);
  expect(response.payload.examFlow.hints).toEqual([]);
});

test("A2 eight-answer flow allows two failed recordings after the introduction",async()=>{
 const api=setup();const session=await startTaskFlow(api,"A2",1);
 expect(session.maxTurns).toBe(14);
 await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,intro:true});
 api.fakeClient.audio.transcriptions.create.mockResolvedValueOnce({text:""}).mockResolvedValueOnce({text:""});
 for(let i=0;i<2;i++)await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...audioPayload});
 for(let i=0;i<8;i++)expect((await answerExam(api,session)).code).toBe(200);
 expect(api.docs.get(sessionKey).answeredTurns).toBe(8);
});
test("successful early appointment is complete for assessment",async()=>{
 const api=setup();const session=await startTaskFlow(api,"A2",3);
 await answerExam(api,session,"Wann hast du Zeit?");
 await answerExam(api,session,"Ja, Mittwoch um 18 Uhr passt.");
 await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId});
 const input=JSON.parse(api.fakeClient.chat.completions.create.mock.calls.at(-1)[0].messages.at(-1).content);
 expect(input.examContext).toEqual(expect.objectContaining({taskComplete:true,completedAllTurns:true,reachedTurnLimit:false}));
});

test("A2 retry allowance remains bounded",async()=>{
 const api=setup();const session=await startTaskFlow(api,"A2",1);
 api.docs.set(sessionKey,{...api.docs.get(sessionKey),turnsUsed:14});
 const blocked=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...audioPayload});
 expect(blocked.payload.code).toBe("turn_limit");
 expect(api.fakeClient.audio.transcriptions.create).not.toHaveBeenCalled();
});


test("A1 exam tryout makes a real German AI voice call after the pilot and shared cap are exhausted",async()=>{
  const api=setup();
  const month=new Date().toISOString().slice(0,7);
  api.docs.set("liveSpeakUsage/"+month,{turns:40});
  api.docs.set("liveSpeakPilotCredits/u123",{
    uid:"u123",remaining:0,pilotClaimed:true,expiresAt:"2025-01-01T00:00:00Z",
  });
  const status=await api.call("GET","/live-speak/status");
  expect(status.code).toBe(200);
  expect(status.payload.capReached).toBe(true);
  expect(status.payload.examTryoutAvailable).toBe(true);
  const task={id:"a1-teil-1-introduction",teil:"Teil 1",prompt:"Stellen Sie sich kurz vor"};
  const started=await api.call("POST","/live-speak/session/start",{
    level:"A1",source:"exam-speaking-practice",examTask:task,examinerFlowVersion:1,examMode:"guided",
  });
  expect(started.code).toBe(200);
  expect(started.payload.examTryout).toBe(true);
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(0);
  expect(api.docs.get("liveSpeakPilotCredits/u123").examTryoutMonth).toBe(month);
  const voice=await api.call("POST","/live-speak/session/turn",{sessionId:started.payload.sessionId,intro:true});
  expect(voice.code).toBe(200);
  expect(voice.payload.audioBase64).toBeTruthy();
  expect(api.fakeClient.audio.speech.create).toHaveBeenCalledTimes(1);
  const updated=await api.call("GET","/live-speak/status");
  expect(updated.payload.examTryoutAvailable).toBe(false);
  const second=await api.call("POST","/live-speak/session/start",{level:"A1",
    source:"exam-speaking-practice",examTask:task,examinerFlowVersion:1});
  expect(second.code).toBe(200);
  expect(second.payload.resumed).toBe(true);
});

test("AI tryout does not bypass student identity, one-use allowance, or the extra monthly safety ceiling",async()=>{
  const api=setup();
  const month=new Date().toISOString().slice(0,7);
  const task={id:"a1-teil-1-introduction",teil:"Teil 1",prompt:"Stellen Sie sich kurz vor"};
  const body={level:"A1",source:"exam-speaking-practice",examTask:task,examinerFlowVersion:1};
  api.docs.set("liveSpeakPilotCredits/u123",{pilotClaimed:true,remaining:0,examTryoutMonth:month});
  api.docs.set("liveSpeakUsage/"+month,{turns:40});
  const exhausted=await api.call("POST","/live-speak/session/start",body);
  expect(exhausted.code).toBe(429);
  expect(api.docs.has("liveSpeakSessions/u123")).toBe(false);
  api.docs.set("liveSpeakPilotCredits/u123",{pilotClaimed:true,remaining:0});
  api.docs.set("liveSpeakUsage/"+month,{turns:44});
  const fullySpent=await api.call("POST","/live-speak/session/start",body);
  expect(fullySpent.code).toBe(429);
  expect(api.docs.has("liveSpeakSessions/u123")).toBe(false);
  const standalone=await api.call("POST","/live-speak/session/start",{level:"A1",source:"standalone"});
  expect(standalone.code).toBe(429);
  expect(api.fakeClient.audio.speech.create).not.toHaveBeenCalled();
});


test("a new learner can claim original free sessions before scarce AI tryout reserve",async()=>{
  const api=setup();
  const status=await api.call("GET","/live-speak/status");
  expect(status.payload.pilotAvailable).toBe(true);
  expect(status.payload.examTryoutAvailable).toBe(false);
  const claim=await api.call("POST","/live-speak/pilot/claim");
  expect(claim.code).toBe(200);
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(2);
  expect(api.docs.get("liveSpeakPilotCredits/u123").examTryoutMonth).toBeUndefined();
});
