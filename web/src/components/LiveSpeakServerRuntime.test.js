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
    LIVE_SPEAK_MONTHLY_TURN_CAP:"40",LIVE_SPEAK_TESTING_ACCESS:"false",
    OPENAI_API_KEY:"sk_test_fake",...overrides};
  vm.runInNewContext(source,{
    module:moduleObj,exports:moduleObj.exports, Buffer, Date, console,
    process:{env},
    require:name=>{
      if(name==="crypto")return {randomUUID:()=>"unique-session-id"};
      if(name==="openai")return {toFile:async(_data,name)=>({name})};
      if(name==="./chatModelConfig")return require("../../../functions/functionz/chatModelConfig");
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
  // 675 kB is above the mistaken 630 kB estimate, but within the 700 kB
  // presentation limit advertised by the client.
  const recorded=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,mimeType:"audio/webm",audioBase64:Buffer.alloc(675000,65).toString("base64")});
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

test("B2 receives the four-minute presentation examiner profile",async()=>{
  const api=setup(); const session=await startTaskFlow(api,"B2",1);
  expect(session.examFlow.key).toBe("B2-1");
  expect(session.maxRecordingSeconds).toBe(240);
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
  expect(updated.payload.examTryoutAvailable).toBe(true);
  const second=await api.call("POST","/live-speak/session/start",{level:"A1",
    source:"exam-speaking-practice",examTask:task,examinerFlowVersion:1});
  expect(second.code).toBe(200);
  expect(second.payload.resumed).toBe(true);
});

test("AI tryout does not bypass student identity, or the extra monthly safety ceiling",async()=>{
  const api=setup();
  const month=new Date().toISOString().slice(0,7);
  const task={id:"a1-teil-1-introduction",teil:"Teil 1",prompt:"Stellen Sie sich kurz vor"};
  const body={level:"A1",source:"exam-speaking-practice",examTask:task,examinerFlowVersion:1};
  api.docs.set("liveSpeakPilotCredits/u123",{pilotClaimed:true,remaining:0,examTryoutMonth:month});
  api.docs.set("liveSpeakUsage/"+month,{turns:44});
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

test("previous examiner tryout use does not block repeat testing within the shared budget",async()=>{
  const api=setup(),month=new Date().toISOString().slice(0,7);
  api.docs.set("liveSpeakPilotCredits/u123",{pilotClaimed:true,remaining:0,examTryoutMonth:month});
  api.docs.set("liveSpeakUsage/"+month,{turns:0});
  const status=await api.call("GET","/live-speak/status");
  expect(status.payload.examTryoutAvailable).toBe(true);
  const started=await startTaskFlow(api,"B1",3);
  expect(started.sessionId).toBeTruthy();
});

test("A1 question receives a separate scripted next question and a persistent scored result",async()=>{
  const api=setup();
  const session=await startTaskFlow(api,"A1",2,"guided","Fahrkarte");
  expect(session.examFlow.cardThemes[0]).not.toBe(session.examFlow.cardThemes[1]);
  const first=await answerExam(api,session,"Wie viel kostet die Fahrkarte?");
  expect(first.code).toBe(200);
  expect(first.payload.taskReady).toBe(false);
  expect(first.payload.nextInstruction).toMatch(/\?/);
  expect(first.payload.reply).not.toMatch(/\?/);
  const saved=api.docs.get(sessionKey).messages;
  expect(saved.at(-2).text).toBe(first.payload.reply);
  expect(saved.at(-1).text).toBe(first.payload.nextInstruction);
  expect((await answerExam(api,session,"Am Bahnhof.")).payload.taskReady).toBe(false);
  expect((await answerExam(api,session,"Wo wohnen Sie?")).payload.taskReady).toBe(false);
  expect((await answerExam(api,session,"In Accra.")).payload.taskReady).toBe(true);
  const grades={taskScores:[1,2,3,4].map(step=>({step,score:2,comment:"Task achieved"})),
    summary:"All four tasks completed.",strength:"Clear questions and answers.",
    priority:"Check word order.",correctedExample:"Wo wohnen Sie?",nextPractice:"Practise more word cards."};
  api.fakeClient.chat.completions.create.mockResolvedValueOnce({
    choices:[{message:{content:JSON.stringify(grades)}}]});
  const result=await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId});
  expect(result.code).toBe(200);
  expect(result.payload.assessment).toEqual(expect.objectContaining({percent:100,score:8,maxScore:8,practiceOnly:true}));
  expect(result.payload.assessment.tasks).toHaveLength(4);
  const persisted=api.docs.get("liveSpeakExamResults/"+session.sessionId);
  expect(persisted.uid).toBe("u123");
  expect(persisted.answers).toEqual(["Wie viel kostet die Fahrkarte?","Am Bahnhof.","Wo wohnen Sie?","In Accra."]);
  expect(persisted.assessment.percent).toBe(100);
  const cached=await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId});
  expect(cached.payload.assessment.percent).toBe(100);
});

test.each([["C1",1,300,2],["C1",2,75,4],["C2",1,300,3],["C2",2,90,4]])(
  "%s Teil %s supports long CEFR-level speaking tasks with fixed turn count",
  async(level,part,seconds,turns)=>{
    const api=setup();const started=await startTaskFlow(api,level,part);
    expect(started.code).toBeUndefined(); // startTaskFlow returns the payload, not HTTP wrapper
    expect(started.examFlow.key).toBe(level+"-"+part);
    expect(started.maxRecordingSeconds).toBe(seconds);
    expect(started.answerLimit).toBe(turns);
    expect(started.maxAudioBytes).toBeGreaterThanOrEqual(350000);
  }
);

test("B1 Teil 2 rejects a recording above its advertised 700 kB upload limit",async()=>{
  const api=setup(); const session=await startTaskFlow(api,"B1",2);
  expect(session.maxAudioBytes).toBe(700000);
  const rejected=await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,mimeType:"audio/webm",
    audioBase64:Buffer.alloc(700001,65).toString("base64"),
  });
  expect(rejected.code).toBe(413);
  expect(rejected.payload.code).toBe("audio_too_large");
  expect(api.docs.get(sessionKey).audioBytesUsed || 0).toBe(0);
  expect(api.docs.get(usageKey())?.turns || 0).toBe(0);
});

test.each([
  ["C1",1,420,20],["C1",2,300,20],
  ["C2",1,450,20],["C2",2,360,20],
  ["B1",2,180,10],
])("%s Teil %s session lifetime covers %s seconds of speaking",async(level,part,requiredSpeechSeconds,minimumMinutes)=>{
  const api=setup(); const session=await startTaskFlow(api,level,part);
  const allotted=Date.parse(session.expiresAt)-Date.now();
  expect(session.answerLimit).toBeGreaterThan(0);
  expect(allotted).toBeGreaterThanOrEqual((minimumMinutes*60-3)*1000);
  expect(allotted).toBeLessThanOrEqual((minimumMinutes*60+1)*1000);
  if (level==="C2" && part===1) {
    // 7m30s of speech, with at least 12m30s for three uploads,
    // processing, transcript confirmation and examiner playback.
    expect(allotted/1000-requiredSpeechSeconds).toBeGreaterThan(12*60);
  }
});

test("typed Goethe answer is metered, confirmed and not sent to audio transcription",async()=>{
  const api=setup(); const session=await startExam(api);
  const beforeUsage=api.docs.get(usageKey())?.turns || 0;
  const sent=await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,typedAnswer:"Ich mache Sport, weil ich gesund bleiben möchte."
  });
  expect(sent.code).toBe(200);
  expect(sent.payload).toEqual(expect.objectContaining({
    needsConfirmation:true,typed:true,transcript:"Ich mache Sport, weil ich gesund bleiben möchte."
  }));
  expect(api.docs.get(sessionKey).pendingTranscript).toBe("Ich mache Sport, weil ich gesund bleiben möchte.");
  expect(api.fakeClient.audio.transcriptions.create).not.toHaveBeenCalled();
  expect(api.docs.get(usageKey()).turns).toBeGreaterThan(beforeUsage);
  const done=await api.call("POST","/live-speak/session/confirm",{
    sessionId:session.sessionId,pendingId:sent.payload.pendingId,transcript:sent.payload.transcript
  });
  expect(done.code).toBe(200);
  expect(api.docs.get(sessionKey).confirmedAnswers[0]).toBe(sent.payload.transcript);
});

test("typed answer refuses invalid payload, oversized text and nonexam sessions without provider calls",async()=>{
  const api=setup(); const session=await startExam(api);
  const used=api.docs.get(usageKey())?.turns || 0;
  for (const typedAnswer of ["", "x", "x".repeat(8001)]) {
    const result=await api.call("POST","/live-speak/session/turn",{
      sessionId:session.sessionId,typedAnswer
    });
    expect(result.code).toBe(400);
  }
  expect((await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,typedAnswer:"Hallo",...audioPayload
  })).code).toBe(400);
  expect(api.docs.get(usageKey())?.turns || 0).toBe(used);
  expect(api.fakeClient.audio.transcriptions.create).not.toHaveBeenCalled();
  const normal=setup();
  await normal.call("POST","/live-speak/pilot/claim");
  const other=(await normal.call("POST","/live-speak/session/start",{level:"A2"})).payload;
  const rejected=await normal.call("POST","/live-speak/session/turn",{
    sessionId:other.sessionId,typedAnswer:"Ich lerne Deutsch."
  });
  expect(rejected.code).toBe(400);
  expect(normal.fakeClient.audio.transcriptions.create).not.toHaveBeenCalled();
});

test("typed answers stop at the server quota and cannot bypass a spent cap",async()=>{
  const api=setup(); const session=await startExam(api);
  api.docs.set(usageKey(),{turns:40});
  const response=await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,typedAnswer:"Ich lerne jeden Tag Deutsch."
  });
  expect(response.code).toBe(429);
  expect(response.payload.code).toBe("budget_reached");
  expect(api.docs.get(sessionKey).confirmedAnswers).toHaveLength(0);
});

test("discarding a pending audio answer survives reload without losing confirmed work or usage records",async()=>{
  const api=setup(); const session=await startExam(api);
  await answerExam(api,session,"Ich mache Sport.");
  const recorded=await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,...audioPayload,
  });
  expect(recorded.code).toBe(200);
  const before=api.docs.get(usageKey()).turns;
  const confirmedBefore=api.docs.get(sessionKey).confirmedAnswers;
  const originalId=recorded.payload.pendingId;
  expect((await api.call("GET","/live-speak/status")).payload.activeSession.pending.pendingId).toBe(originalId);
  const discarded=await api.call("POST","/live-speak/session/discard-pending",{
    sessionId:session.sessionId,pendingId:originalId,
  });
  expect(discarded.code).toBe(200);
  expect(discarded.payload.discarded).toBe(true);
  const persisted=api.docs.get(sessionKey);
  expect(persisted.pendingId).toBe(null);
  expect(persisted.pendingTranscript).toBe(null);
  expect(persisted.pendingTyped).toBe(false);
  expect(persisted.confirmedAnswers).toEqual(confirmedBefore);
  expect(persisted.answeredTurns).toBe(1);
  expect(api.docs.get(usageKey()).turns).toBe(before);
  const status=await api.call("GET","/live-speak/status");
  expect(status.payload.activeSession.pending).toBe(null);
  expect((await api.call("POST","/live-speak/session/confirm",{
    sessionId:session.sessionId,pendingId:originalId,transcript:"Old abandoned answer",
  })).payload.code).toBe("transcript_missing");
  const replaced=await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,typedAnswer:"Ich esse oft Gemüse.",
  });
  expect(replaced.code).toBe(200);
  expect(replaced.payload.needsConfirmation).toBe(true);
});

test("discard pending typed answer without ending the exam or consuming extra quota",async()=>{
  const api=setup(); const session=await startExam(api);
  const typed=await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,typedAnswer:"Ich lerne jeden Tag Deutsch.",
  });
  expect(typed.code).toBe(200);
  expect((await api.call("GET","/live-speak/status")).payload.activeSession.pending.typed).toBe(true);
  const usage=api.docs.get(usageKey()).turns;
  const cleared=await api.call("POST","/live-speak/session/discard-pending",{
    sessionId:session.sessionId,pendingId:typed.payload.pendingId,
  });
  expect(cleared.code).toBe(200);
  expect(api.docs.get(usageKey()).turns).toBe(usage);
  expect((await api.call("GET","/live-speak/status")).payload.activeSession.pending).toBe(null);
  const retry=await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,typedAnswer:"Ich lese sehr gern Bücher.",
  });
  expect(retry.code).toBe(200);
  expect(retry.payload.transcript).toBe("Ich lese sehr gern Bücher.");
});

test("discard refuses stale candidates and in-flight work without clearing newer answers",async()=>{
  const api=setup(); const session=await startExam(api);
  const first=await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,typedAnswer:"Mein erstes Beispiel.",
  });
  expect(first.code).toBe(200);
  // Simulate another browser already replacing the pending candidate.
  const newest={...api.docs.get(sessionKey),
    pendingId:"another-browser-candidate",pendingTranscript:"Neue Antwort",pendingTyped:true};
  api.docs.set(sessionKey,newest);
  const stale=await api.call("POST","/live-speak/session/discard-pending",{
    sessionId:session.sessionId,pendingId:first.payload.pendingId,
  });
  expect(stale.code).toBe(409);
  expect(stale.payload.code).toBe("transcript_missing");
  expect(api.docs.get(sessionKey).pendingTranscript).toBe("Neue Antwort");
  api.docs.set(sessionKey,{...api.docs.get(sessionKey),inFlight:true});
  const blocked=await api.call("POST","/live-speak/session/discard-pending",{
    sessionId:session.sessionId,pendingId:"another-browser-candidate",
  });
  expect(blocked.code).toBe(409);
  expect(blocked.payload.code).toBe("turn_in_progress");
  expect(api.docs.get(sessionKey).pendingId).toBe("another-browser-candidate");
  const missing=await api.call("POST","/live-speak/session/discard-pending",{
    sessionId:session.sessionId,
  });
  expect(missing.code).toBe(400);
});

test("German transcription prompt handles naturally fast speech without inventing answers",async()=>{
  const api=setup(); const session=await startExam(api);
  const r=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,...audioPayload});
  expect(r.code).toBe(200);
  const opts=api.fakeClient.audio.transcriptions.create.mock.calls.at(-1)[0];
  expect(opts.language).toBe("de");
  expect(opts.prompt).toMatch(/sehr schnell/);
  expect(opts.prompt).toMatch(/ohne Grammatikfehler zu verbessern/);
  expect(opts.model).toBe("gpt-4o-transcribe");
});

test("recent in-flight turns are not resent; stale timed-out locks may safely be recovered",async()=>{
  const api=setup(); const session=await startExam(api);
  const base=api.docs.get(sessionKey);
  const currentTime=Date.now();
  api.docs.set(sessionKey,{...base,inFlight:true,inFlightSince:currentTime-20_000});
  const during=(await api.call("GET","/live-speak/status")).payload.activeSession;
  expect(during.processingAnswer).toBe(true);
  const blocked=await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,typedAnswer:"Ich spreche jeden Tag Deutsch."
  });
  expect(blocked.code).toBe(409);
  expect(blocked.payload.code).toBe("turn_in_progress");
  expect(api.fakeClient.audio.transcriptions.create).not.toHaveBeenCalled();
  api.docs.set(sessionKey,{...base,inFlight:true,inFlightSince:currentTime-100_000});
  const recovered=(await api.call("GET","/live-speak/status")).payload.activeSession;
  expect(recovered.processingAnswer).toBe(false);
  const resubmitted=await api.call("POST","/live-speak/session/turn",{
    sessionId:session.sessionId,typedAnswer:"Ich spreche jeden Tag Deutsch."
  });
  expect(resubmitted.code).toBe(200);
  expect(resubmitted.payload.needsConfirmation).toBe(true);
  expect(api.docs.get(sessionKey).inFlight).toBe(false);
  expect(api.docs.get(sessionKey).pendingTranscript).toBe("Ich spreche jeden Tag Deutsch.");
});


test("open examiner testing restores real voice for a pilot-exhausted student at the shared cap",async()=>{
  const api=setup({LIVE_SPEAK_TESTING_ACCESS:"true"});
  const month=new Date().toISOString().slice(0,7);
  api.docs.set("liveSpeakUsage/"+month,{turns:52});
  api.docs.set("liveSpeakPilotCredits/u123",{
    uid:"u123",pilotClaimed:true,remaining:0,expiresAt:"2025-01-01T00:00:00Z",
  });
  const status=await api.call("GET","/live-speak/status");
  expect(status.code).toBe(200);
  expect(status.payload).toEqual(expect.objectContaining({
    enabled:true,openTesting:true,capReached:false,
    pilotAvailable:false,remaining:1,
  }));
  const task={id:"a1-teil-1-introduction",teil:"Teil 1",prompt:"Stellen Sie sich kurz vor"};
  const started=await api.call("POST","/live-speak/session/start",{
    level:"A1",source:"exam-speaking-practice",examTask:task,
    examinerFlowVersion:1,examMode:"guided",
  });
  expect(started.code).toBe(200);
  expect(started.payload.sessionId).toBeTruthy();
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(0);
  const opening=await api.call("POST","/live-speak/session/turn",{
    sessionId:started.payload.sessionId,intro:true,
  });
  expect(opening.code).toBe(200);
  expect(opening.payload.audioBase64).toBeTruthy();
  const sent=await api.call("POST","/live-speak/session/turn",{
    sessionId:started.payload.sessionId,typedAnswer:"Ich heiße Anna und lerne Deutsch.",
  });
  expect(sent.code).toBe(200);
  const confirmed=await api.call("POST","/live-speak/session/confirm",{
    sessionId:started.payload.sessionId,pendingId:sent.payload.pendingId,
    transcript:sent.payload.transcript,
  });
  expect(confirmed.code).toBe(200);
  expect(api.docs.get("liveSpeakSessions/u123").confirmedAnswers).toHaveLength(1);
  const readyForFeedback=api.docs.get("liveSpeakSessions/u123");
  api.docs.set("liveSpeakSessions/u123",{
    ...readyForFeedback,taskReady:true,answeredTurns:readyForFeedback.answeredTurns,
  });
  const feedback=await api.call("POST","/live-speak/session/exam-feedback",{
    sessionId:started.payload.sessionId,
  });
  expect(feedback.code).toBe(200);
  expect(api.docs.get("liveSpeakUsage/"+month).turns).toBeGreaterThan(52);
});

test("temporary tester can start again after ending an exam without new credits",async()=>{
  const api=setup({LIVE_SPEAK_TESTING_ACCESS:"true"});
  api.docs.set("liveSpeakUsage/"+new Date().toISOString().slice(0,7),{turns:5000});
  api.docs.set("liveSpeakPilotCredits/u123",{
    pilotClaimed:true,remaining:0,expiresAt:"2025-01-01T00:00:00Z",
  });
  const startBody={
    source:"exam-speaking-practice",level:"A1",
    examTask:{id:"a1-teil-1-introduction",teil:"Teil 1",prompt:"Stellen Sie sich vor"},
    examinerFlowVersion:1,
  };
  const first=await api.call("POST","/live-speak/session/start",startBody);
  expect(first.code).toBe(200);
  const ended=await api.call("POST","/live-speak/session/end",{
    sessionId:first.payload.sessionId,
  });
  expect(ended.code).toBe(200);
  const second=await api.call("POST","/live-speak/session/start",startBody);
  expect(second.code).toBe(200);
  expect(second.payload.resumed).toBe(false);
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(0);
});

test("open examiner testing cannot bypass authentication, emergency off switch, or per-session turns",async()=>{
  const mismatched=setup({LIVE_SPEAK_TESTING_ACCESS:"true"},{
    uid:"outsider",email:"outsider@example.com",
  });
  expect((await mismatched.call("POST","/live-speak/session/start",{
    source:"exam-speaking-practice",level:"A1",
  })).code).toBe(403);
  const off=setup({LIVE_SPEAK_TESTING_ACCESS:"true",LIVE_SPEAK_ENABLED:"false"});
  expect((await off.call("POST","/live-speak/session/start",{level:"A1"})).code).toBe(503);
  const api=setup({LIVE_SPEAK_TESTING_ACCESS:"true"});
  const started=await api.call("POST","/live-speak/session/start",{
    level:"A1",source:"exam-speaking-practice",
    examTask:{id:"a1-teil-1-introduction",teil:"Teil 1",prompt:"Stellen Sie sich kurz vor"},
    examinerFlowVersion:1,
  });
  expect(started.code).toBe(200);
  api.docs.set("liveSpeakSessions/u123",{
    ...api.docs.get("liveSpeakSessions/u123"),turnsUsed:10,
  });
  const blocked=await api.call("POST","/live-speak/session/turn",{
    sessionId:started.payload.sessionId,intro:true,
  });
  expect(blocked.code).toBe(429);
  expect(blocked.payload.code).toBe("turn_limit");
});

test("setting LIVE_SPEAK_TESTING_ACCESS=false restores the monthly and pilot restrictions",async()=>{
  const api=setup({LIVE_SPEAK_TESTING_ACCESS:"false"});
  const month=new Date().toISOString().slice(0,7);
  api.docs.set("liveSpeakUsage/"+month,{turns:52});
  api.docs.set("liveSpeakPilotCredits/u123",{
    pilotClaimed:true,remaining:0,expiresAt:"2025-01-01T00:00:00Z",
  });
  expect((await api.call("GET","/live-speak/status")).payload.capReached).toBe(true);
  const start=await api.call("POST","/live-speak/session/start",{level:"A1"});
  expect(start.code).toBe(429);
  expect(start.payload.code).toBe("budget_reached");
});


test("open examiner testing does not unlock standalone, workbook or unstructured speaking use",async()=>{
  const api=setup({LIVE_SPEAK_TESTING_ACCESS:"true"});
  const month=new Date().toISOString().slice(0,7);
  api.docs.set("liveSpeakUsage/"+month,{turns:52});
  api.docs.set("liveSpeakPilotCredits/u123",{
    pilotClaimed:true,remaining:0,expiresAt:"2025-01-01T00:00:00Z",
  });
  for(const source of ["standalone","course-workbook","a1-workbook","c2-workbook"]){
    const request=await api.call("POST","/live-speak/session/start",{source,level:"A1"});
    expect(request.code).toBe(429);
    expect(request.payload.code).toBe("budget_reached");
  }
  const unstructured=await api.call("POST","/live-speak/session/start",{
    source:"exam-speaking-practice",level:"A1",
    examTask:{id:"legacy-exam",teil:"Teil 1",prompt:"Stellen Sie sich vor"},
  });
  expect(unstructured.code).toBe(429);
  expect(api.docs.has("liveSpeakSessions/u123")).toBe(false);
  // A previously started standalone session does not get the examiner's
  // unlocked provider usage simply because open testing was enabled.
  api.docs.set("liveSpeakSessions/u123",{
    uid:"u123",sessionId:"standalone-old",source:"standalone",
    expiresAt:new Date(Date.now()+100000).toISOString(),
    turnsUsed:0,inFlight:false,endedAt:null,
  });
  const blocked=await api.call("POST","/live-speak/session/turn",{
    sessionId:"standalone-old",intro:true,
  });
  expect(blocked.code).toBe(429);
  expect(blocked.payload.code).toBe("budget_reached");
  expect(api.fakeClient.audio.speech.create).not.toHaveBeenCalled();
});

test("open examiner mode preserves the old standalone credit-claim path",async()=>{
  const api=setup({LIVE_SPEAK_TESTING_ACCESS:"true"});
  const status=await api.call("GET","/live-speak/status");
  expect(status.payload.openTesting).toBe(true);
  expect(status.payload.pilotAvailable).toBe(true);
  expect(status.payload.actualRemaining).toBe(0);
  const claim=await api.call("POST","/live-speak/pilot/claim");
  expect(claim.code).toBe(200);
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(2);
  const session=await api.call("POST","/live-speak/session/start",{
    level:"A2",source:"standalone",
  });
  expect(session.code).toBe(200);
  expect(api.docs.get("liveSpeakPilotCredits/u123").remaining).toBe(1);
});


test("a failed Goethe AI partner reply advances only to the next assigned step",async()=>{
  const api=setup();const session=await startTaskFlow(api,"A1",2,"guided","Frühstück");
  api.fakeClient.chat.completions.create.mockRejectedValueOnce(new Error("temporary model outage"));
  const first=await answerExam(api,session,"Was essen Sie zum Frühstück?");
  expect(first.code).toBe(200);
  expect(first.payload.recovered).toBe(true);
  expect(first.payload.taskReady).toBe(false);
  expect(first.payload.nextInstruction).toMatch(/Frühstück/);
  expect(first.payload.examFlow.step.index).toBe(2);
  const persisted=api.docs.get(sessionKey);
  expect(persisted.answeredTurns).toBe(1);
  expect(persisted.taskReady).toBe(false);
  expect(persisted.inFlight).toBe(false);
  expect(persisted.confirmedAnswers).toEqual(["Was essen Sie zum Frühstück?"]);
  expect(persisted.messages.at(-1).text).toBe(first.payload.nextInstruction);
  const again=await answerExam(api,session,"Ich esse Brot zum Frühstück.");
  expect(again.code).toBe(200);
  expect(again.payload.taskReady).toBe(false);
  expect(again.payload.examFlow.step.index).toBe(3);
  expect(api.docs.get(sessionKey).confirmedAnswers).toHaveLength(2);
});

test("failed examiner TTS after a confirmed answer retains the next step without replaying audio",async()=>{
  const api=setup();const session=await startTaskFlow(api,"A1",2,"guided","Frühstück");
  api.fakeClient.audio.speech.create.mockRejectedValueOnce(new Error("iPhone voice unavailable"));
  const first=await answerExam(api,session,"Was essen Sie zum Frühstück?");
  expect(first.code).toBe(200);
  expect(first.payload.recovered).toBe(true);
  expect(first.payload.audioBase64).toBe("");
  expect(first.payload.nextInstruction).toMatch(/Frühstück/);
  expect(first.payload.taskReady).toBe(false);
  const status=(await api.call("GET","/live-speak/status")).payload.activeSession;
  expect(status.answeredTurns).toBe(1);
  expect(status.examFlow.step.index).toBe(2);
  expect(status.messages.at(-1).text).toBe(first.payload.nextInstruction);
  expect(api.docs.get(sessionKey).inFlight).toBe(false);
});

test("dynamic examiner dialogue asks at most one question in each turn",async()=>{
  const api=setup();const session=await startTaskFlow(api,"B2",2,"guided","Digitalisierung");
  api.fakeClient.chat.completions.create.mockResolvedValueOnce({choices:[{message:{content:JSON.stringify({
    reply:"Ich sehe das anders. Was ist mit der Privatsphäre? Und wie sieht es mit den Kosten aus?",
    decisions:[],
  })}}]});
  const first=await answerExam(api,session,"Datenschutz ist für mich wichtig.");
  expect(first.code).toBe(200);
  expect(first.payload.reply).toContain("Privatsphäre?");
  expect(first.payload.reply).not.toContain("Kosten");
  expect((first.payload.reply.match(/\\?/g) || [])).toHaveLength(1);
  expect(first.payload.taskReady).toBe(false);
});

test("feedback is grounded in actually prompted steps and incomplete sessions are marked partial",async()=>{
  const api=setup();const session=await startTaskFlow(api,"A1",2,"guided","Frühstück");
  const start=await api.call("POST","/live-speak/session/turn",{sessionId:session.sessionId,intro:true});
  expect(start.code).toBe(200);
  const first=await answerExam(api,session,"Was essen Sie zum Frühstück?");
  expect(first.payload.taskReady).toBe(false);
  const original=api.docs.get(sessionKey);
  expect(original.promptedSteps).toHaveLength(1);
  expect(original.promptedSteps[0]).toEqual(expect.objectContaining({
    step:1,action:"ask-question",source:"delivered",
  }));
  const review={taskScores:[{step:1,score:2,comment:"A clear relevant question."}],
    summary:"Good question for this card.",strength:"Clear question.",priority:"Practise more.",
    correctedExample:"Wie viel kostet eine Fahrkarte?",nextPractice:"More question cards."};
  api.fakeClient.chat.completions.create.mockResolvedValueOnce({choices:[{message:{content:JSON.stringify(review)}}]});
  const result=await api.call("POST","/live-speak/session/exam-feedback",{sessionId:session.sessionId});
  expect(result.code).toBe(200);
  expect(result.payload.assessment).toEqual(expect.objectContaining({
    partial:true,complete:false,score:2,maxScore:2,practiceOnly:true,
  }));
  expect(result.payload.feedback).toMatch(/Partial practice/);
  expect(result.payload.assessment.tasks).toHaveLength(1);
  expect(result.payload.assessment.tasks[0]).toEqual(expect.objectContaining({
    action:"ask-question",askedPrompt:original.promptedSteps[0].prompt,
  }));
  const prompt=JSON.parse(api.fakeClient.chat.completions.create.mock.calls.at(-1)[0].messages.at(-1).content);
  expect(prompt.examContext.completedAllTurns).toBe(false);
  expect(prompt.examContext.promptedSteps).toHaveLength(1);
  expect(prompt.studentTranscripts).toHaveLength(1);
});
