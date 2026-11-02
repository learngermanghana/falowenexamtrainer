"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {APPROVED_A2_MOCK_08_AUDIO,verifyA2Mock08Audio}=require("../a2Mock08PublishedAudio");
const key=require("../a2Mock08HoerenKeys");
test("private answer key and four original ZIP recording hashes are fixed",()=>{
  assert.deepEqual(Object.keys(key),Array.from({length:20},(_,i)=>String(i+1)));
  assert.deepEqual([16,17,18,19,20].map(n=>key[n]),["richtig","falsch","richtig","falsch","richtig"]);
  assert.deepEqual([1,2,3,4].map(n=>APPROVED_A2_MOCK_08_AUDIO[`teil-${n}`].bytes),[3809088,1126656,1886400,3401568]);
  for(let n=1;n<=4;n++){
    const item=APPROVED_A2_MOCK_08_AUDIO[`teil-${n}`];
    assert.equal(item.key,`a2/mock-hoeren/mock-08/teil-${n}.mp3`);
    assert.match(item.sha256,/^[0-9a-f]{64}$/);
  }
});
test("R2 audio must match original bytes, mock ID and object path",async()=>{
  const p=APPROVED_A2_MOCK_08_AUDIO["teil-1"];
  const valid={level:"A2",mockId:"mock-08",part:"teil-1",key:p.key,signedUrl:"https://bucket.r2.cloudflarestorage.com/recording"};
  assert.equal(await verifyA2Mock08Audio({...valid,mockId:"mock-07"}),false);
  assert.equal(await verifyA2Mock08Audio({...valid,key:p.key+"-wrong"}),false);
  assert.equal(await verifyA2Mock08Audio({...valid,signedUrl:"https://example.invalid/path"}),false);
  const zeros=async()=>({ok:true,headers:{get:()=>String(p.bytes)},arrayBuffer:async()=>Buffer.alloc(p.bytes)});
  assert.equal(await verifyA2Mock08Audio({...valid,fetchImpl:zeros}),false);
  assert.equal(await verifyA2Mock08Audio({...valid,fetchImpl:async()=>({ok:false})}),false);
});
