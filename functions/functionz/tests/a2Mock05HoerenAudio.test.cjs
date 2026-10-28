"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {APPROVED_A2_MOCK_05_AUDIO: audio, verifyA2Mock05Audio:verify}=require("../a2Mock05PublishedAudio");
const expected=[
["bdbba29d8d3f9b1c8dd94db04b1bfb98ac5b5e18dd0f76b13e74dada42a90327",2977056],
["e87f5fcd4da19b50e30e8884151005742e1f5c739562b7d4859a61d8464452a4",1237824],
["fa487393de42c4530b9f25cc4970d2630939dfe4177f8c62c75248a7630df7a3",1490112],
["fd95d07cc74b0a930c71ffee9fb66727516ebc9a19ceb43c0f1c8736a8446033",2721312]];
test("Mock 05 allows only exact four original private R2 audio objects",async()=>{
 assert.deepEqual(Object.keys(audio),["teil-1","teil-2","teil-3","teil-4"]);
 for(let n=1;n<=4;n++){
  const part="teil-"+n,p=audio[part];
  assert.equal(p.key,"a2/mock-hoeren/mock-05/"+part+".mp3");
  assert.deepEqual([p.sha256,p.bytes],expected[n-1]);
  assert.equal(await verify({level:"A2",mockId:"mock-04",part,key:p.key,signedUrl:"https://b.r2.cloudflarestorage.com/a"}),false);
  assert.equal(await verify({level:"A2",mockId:"mock-05",part,key:p.key+"-other",signedUrl:"https://b.r2.cloudflarestorage.com/a"}),false);
 }
});
test("Mock 05 fails closed for missing/wrong recordings",async()=>{
 const p=audio["teil-4"];
 const fetchImpl=async()=>({ok:true,headers:{get:()=>String(p.bytes)},arrayBuffer:async()=>Buffer.alloc(p.bytes)});
 assert.equal(await verify({level:"A2",mockId:"mock-05",part:"teil-4",key:p.key,signedUrl:"https://b.r2.cloudflarestorage.com/a",fetchImpl}),false);
});
