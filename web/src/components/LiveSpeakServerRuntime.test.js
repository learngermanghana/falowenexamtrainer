import fs from "fs";
import path from "path";
import vm from "vm";

const source = fs.readFileSync(
  path.resolve(__dirname, "../../../functions/functionz/liveSpeak.js"), "utf8",
);
function setup(envOverrides = {}) {
  const docs = new Map();
  const routes = new Map();
  const writes = [];
  let nextId = 0;
  const snapshot = (key) => ({
    exists: docs.has(key),
    data: () => docs.get(key),
  });
  const change = (key, delta, merge) => {
    const old = merge ? { ...(docs.get(key) || {}) } : {};
    for (const [field, value] of Object.entries(delta)) {
      old[field] = value && typeof value === "object" && "incrementBy" in value
        ? (Number(old[field]) || 0) + value.incrementBy
        : value;
    }
    docs.set(key, old);
    writes.push({ key, value: { ...old } });
  };
  const ref = (key) => ({
    key,
    get: async () => snapshot(key),
    create: async value => {
      if (docs.has(key)) throw new Error("Already exists");
      change(key, value, false);
    },
    update: async value => change(key, value, true),
  });
  const db = {
    collection: name => ({ doc: id => ref(name + "/" + id) }),
    runTransaction: fn => fn({
      get: async target => snapshot(target.key),
      set: (target,value,opt) => change(target.key,value,Boolean(opt?.merge)),
      update: (target,value) => change(target.key,value,true),
    }),
  };
  const admin = {
    firestore: Object.assign(() => db, {
      FieldValue: { serverTimestamp:()=> "server", increment:n=>({incrementBy:n}) },
    }),
  };
  const fakeFetch = jest.fn(async (url, opt) => {
    if (url.includes("/transaction/initialize")) {
      const request = JSON.parse(opt.body);
      const key = "liveSpeakPaymentIntents/" + request.reference;
      if (!docs.has(key)) throw new Error("Checkout intent was not persisted before calling Paystack");
      return {ok:true,json:async()=>({status:true,data:{reference:request.reference,authorization_url:"https://checkout.paystack.com/test-ref"}})};
    }
    if (url.includes("/transaction/verify/")) {
      return {ok:true,json:async()=>({status:true,data:{
        reference:url.split("/").pop(),status:"success",currency:"GHS",
        amount:4039,customer:{email:"student@example.com"},
      }})};
    }
    throw new Error("Unexpected network endpoint " + url);
  });
  const fakeClient = {
    audio:{
      transcriptions:{create:jest.fn(async()=>({text:"Ich gehen heute zum Markt."}))},
      speech:{create:jest.fn(async()=>({arrayBuffer:async()=>Uint8Array.from([1,2,3,4]).buffer}))},
    },
    chat:{completions:{create:jest.fn(async()=>({choices:[{message:{content:"Fast richtig: Ich gehe heute zum Markt. Und was kaufst du dort?"}}]}))}},
  };
  const mockModule = {exports:{}};
  const context = {
    module:mockModule, exports:mockModule.exports, Buffer, Date, console, AbortSignal,
    process:{ env:{
      LIVE_SPEAK_ENABLED:"true", LIVE_SPEAK_TRIAL_ENABLED:"false",
      PAYSTACK_SECRET:"sk_test_fake", OPENAI_API_KEY:"sk_fake",
      ...envOverrides,
    }},
    fetch:fakeFetch,
    require:name=>{
      if(name==="crypto") return {randomUUID:()=> "uuid" + String(++nextId).padStart(7,"0")};
      if(name==="openai") return {toFile:async (_buffer,name)=>({name})};
      if(name==="./openaiClient") return {getOpenAIClient:()=>fakeClient};
      throw new Error("Unexpected module "+name);
    },
  };
  vm.runInNewContext(source,context,{filename:"liveSpeak.js"});
  const app = {
    post:(url,fn)=>routes.set("POST "+url,fn),
    get:(url,fn)=>routes.set("GET "+url,fn),
  };
  const student = {
    auth:{uid:"u123",email:"student@example.com"},
    profile:{uid:"u123",email:"student@example.com",studentCode:"FAL-001"},
  };
  mockModule.exports.registerLiveSpeakRoutes(app,{
    admin,
    getAuthedUser:async()=>student.auth,
    findStudentByCodeOrEmail:async()=>({snap:{data:()=>student.profile}}),
    calculateSharedPaystackFee:()=>({checkoutAmount:40.39,studentFeeContribution:0.39}),
  });
  const call = async (method,url,body={}) => {
    const handler=routes.get(method+" "+url);
    if(!handler) throw new Error("Missing route "+url);
    const response = {
      code:200,payload:null,
      status(value){this.code=value;return this;},
      json(value){this.payload=value;return this;},
    };
    await handler({body,headers:{authorization:"Bearer test"}},response);
    return response;
  };
  return {db,docs,writes,call,fakeFetch,fakeClient,exports:mockModule.exports};
}

test("pilot disabled at server denies charging regardless of client request", async()=>{
  const server=setup({LIVE_SPEAK_ENABLED:"false"});
  const buy=await server.call("POST","/live-speak/checkout",{amount:0});
  expect(buy.code).toBe(503);
  expect(buy.payload.code).toBe("pilot_disabled");
  expect(server.fakeFetch).not.toHaveBeenCalled();
});

test("checkout fixes price and stores intent before Paystack initialization", async()=>{
  const server=setup();
  const paid=await server.call("POST","/live-speak/checkout",{amount:1,priceGhs:0});
  expect(paid.code).toBe(200);
  expect(paid.payload.priceGhs).toBe(40);
  const requested=JSON.parse(server.fakeFetch.mock.calls[0][1].body);
  expect(requested.amount).toBe(4039);
  expect(requested.currency).toBe("GHS");
  expect(requested.metadata.product).toBe("falowen_live_speak_basic");
  expect(requested.callback_url).toBe("https://www.falowen.app/campus/live-speak");
  expect(server.docs.get("liveSpeakPaymentIntents/"+requested.reference).status).toBe("pending");
});

test("verified payment grants credits once; double verification is harmless",async()=>{
  const server=setup();
  const checkout=await server.call("POST","/live-speak/checkout");
  const ref=checkout.payload.reference;
  const first=await server.call("POST","/live-speak/payment/verify",{reference:ref});
  expect(first.payload.paid).toBe(true);
  expect(server.docs.get("liveSpeakSubscriptions/u123").remaining).toBe(8);
  const duplicate=await server.call("POST","/live-speak/payment/verify",{reference:ref});
  expect(duplicate.payload.duplicate).toBe(true);
  expect(server.docs.get("liveSpeakSubscriptions/u123").remaining).toBe(8);
});

test("session credit is debited once, microphone turn is metered, expired session is denied",async()=>{
  const server=setup();
  server.docs.set("liveSpeakSubscriptions/u123",{
    uid:"u123",remaining:8,plan:"basic",expiresAt:new Date(Date.now()+60_000).toISOString(),
  });
  const start=await server.call("POST","/live-speak/session/start",{level:"A2"});
  expect(start.payload.sessionId).toBeTruthy();
  expect(server.docs.get("liveSpeakSubscriptions/u123").remaining).toBe(7);
  const again=await server.call("POST","/live-speak/session/start",{level:"A2"});
  expect(again.payload.resumed).toBe(true);
  expect(server.docs.get("liveSpeakSubscriptions/u123").remaining).toBe(7);
  const intro=await server.call("POST","/live-speak/session/turn",{sessionId:start.payload.sessionId,intro:true});
  expect(intro.payload.reply).toMatch(/Hallo/);
  expect(intro.payload.audioBase64).toBeTruthy();
  expect(server.docs.get("liveSpeakSessions/u123").turnsUsed).toBe(1);
  expect(server.docs.get("liveSpeakUsage/"+new Date().toISOString().slice(0,7)).turns).toBe(1);
  const expired=server.docs.get("liveSpeakSessions/u123");
  server.docs.set("liveSpeakSessions/u123",{...expired,expiresAt:"2000-01-01T00:00:00.000Z"});
  const denied=await server.call("POST","/live-speak/session/turn",{sessionId:start.payload.sessionId,intro:true});
  expect(denied.code).toBe(409);
  expect(server.docs.get("liveSpeakUsage/"+new Date().toISOString().slice(0,7)).turns).toBe(1);
});
