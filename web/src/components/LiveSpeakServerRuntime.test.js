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
