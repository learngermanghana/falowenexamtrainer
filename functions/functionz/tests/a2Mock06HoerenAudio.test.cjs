"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {APPROVED_A2_MOCK_06_AUDIO,verifyA2Mock06Audio}=require("../a2Mock06PublishedAudio");
const keys=require("../a2Mock06HoerenKeys");
test("Mock06 exact source ZIP manifest and private answer keys",()=>{
  assert.deepEqual(Object.keys(keys),Array.from({length:20},(_,i)=>String(i+1)));
  assert.deepEqual([1,2,3,4].map(i=>APPROVED_A2_MOCK_06_AUDIO[`teil-${i}`].bytes),[3784032,1138752,1367136,3128256]);
  assert.deepEqual([1,2,3,4].map(i=>APPROVED_A2_MOCK_06_AUDIO[`teil-${i}`].key),
    [1,2,3,4].map(i=>`a2/mock-hoeren/mock-06/teil-${i}.mp3`));
  for(const item of Object.values(APPROVED_A2_MOCK_06_AUDIO))assert.match(item.sha256,/^[0-9a-f]{64}$/);
  assert.deepEqual([16,17,18,19,20].map(i=>keys[i]),["richtig","falsch","richtig","falsch","richtig"]);
});
test("Mock06 protected playback rejects other mocks, wrong keys, missing or changed bytes",async()=>{
  const entry=APPROVED_A2_MOCK_06_AUDIO["teil-1"];
  const valid={level:"A2",mockId:"mock-06",part:"teil-1",key:entry.key,
    signedUrl:"https://bucket.r2.cloudflarestorage.com/audio"};
  const wrong=async()=>({ok:true,headers:{get:()=>String(entry.bytes)},arrayBuffer:async()=>Buffer.alloc(entry.bytes)});
  assert.equal(await verifyA2Mock06Audio({...valid,mockId:"mock-05"}),false);
  assert.equal(await verifyA2Mock06Audio({...valid,key:entry.key+"-other"}),false);
  assert.equal(await verifyA2Mock06Audio({...valid,fetchImpl:wrong}),false);
  assert.equal(await verifyA2Mock06Audio({...valid,fetchImpl:async()=>({ok:false})}),false);
  assert.equal(await verifyA2Mock06Audio({...valid,signedUrl:"http://evil.example.test/thing"}),false);
});
