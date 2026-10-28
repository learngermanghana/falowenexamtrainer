"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {APPROVED_A2_MOCK_04_AUDIO,verifyA2Mock04Audio}=require("../a2Mock04PublishedAudio");
test("Mock 04 permits only four exact teacher-uploaded audio identities",async()=>{
  assert.deepEqual(Object.keys(APPROVED_A2_MOCK_04_AUDIO),["teil-1","teil-2","teil-3","teil-4"]);
  for(let n=1;n<=4;n++){
    const p=APPROVED_A2_MOCK_04_AUDIO[`teil-${n}`];
    assert.equal(p.key,`a2/mock-hoeren/mock-04/teil-${n}.mp3`);
    assert.match(p.sha256,/^[a-f0-9]{64}$/);
    assert.ok(p.bytes>100_000&&p.bytes<4_000_000);
    assert.equal(await verifyA2Mock04Audio({level:"A2",mockId:"mock-05",
      part:`teil-${n}`,key:p.key,signedUrl:"https://bucket.example.r2.cloudflarestorage.com/test"}),false);
    assert.equal(await verifyA2Mock04Audio({level:"A2",mockId:"mock-04",
      part:`teil-${n}`,key:p.key+"-wrong",signedUrl:"https://bucket.example.r2.cloudflarestorage.com/test"}),false);
  }
});
test("Mock 04 fails closed if the claimed upload bytes do not match original ZIP",async()=>{
  const expected=APPROVED_A2_MOCK_04_AUDIO["teil-1"];
  const fetchImpl=async()=>({ok:true,headers:{get:()=>String(expected.bytes)},arrayBuffer:async()=>Buffer.alloc(expected.bytes)});
  assert.equal(await verifyA2Mock04Audio({level:"A2",mockId:"mock-04",part:"teil-1",
    key:expected.key,signedUrl:"https://example.r2.cloudflarestorage.com/path",
    fetchImpl}),false);
});
