"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { APPROVED_A2_MOCK_05_AUDIO, verifyA2Mock05Audio } = require("../a2Mock05PublishedAudio");
const EXPECTED_BYTES = [2977056,1237824,1490112,2721312];
const EXPECTED_HASHES = [
  "bdbba29d8d3f9b1c8dd94db04b1bfb98ac5b5e18dd0f76b13e74dada42a90327",
  "e87f5fcd4da19b50e30e8884151005742e1f5c739562b7d4859a61d8464452a4",
  "fa487393de42c4530b9f25cc4970d2630939dfe4177f8c62c75248a7630df7a3",
  "fd95d07cc74b0a930c71ffee9fb66727516ebc9a19ceb43c0f1c8736a8446033"
];
test("Mock 05 signs only the four exact teacher-supplied MP3 identities",async()=>{
  assert.deepEqual(Object.keys(APPROVED_A2_MOCK_05_AUDIO),["teil-1","teil-2","teil-3","teil-4"]);
  for(let n=1;n<=4;n++){
    const p=APPROVED_A2_MOCK_05_AUDIO[`teil-${n}`];
    assert.equal(p.key,`a2/mock-hoeren/mock-05/teil-${n}.mp3`);
    assert.equal(p.bytes,EXPECTED_BYTES[n-1]);
    assert.equal(p.sha256,EXPECTED_HASHES[n-1]);
    const url="https://bucket.r2.cloudflarestorage.com/test";
    assert.equal(await verifyA2Mock05Audio({level:"A2",mockId:"mock-04",part:`teil-${n}`,key:p.key,signedUrl:url}),false);
    assert.equal(await verifyA2Mock05Audio({level:"A2",mockId:"mock-05",part:`teil-${n}`,key:p.key+"-wrong",signedUrl:url}),false);
  }
});
test("Mock 05 rejects forged audio bytes even at a valid object key",async()=>{
  const p=APPROVED_A2_MOCK_05_AUDIO["teil-1"];
  const fetchImpl=async()=>({ok:true,headers:{get:()=>String(p.bytes)},arrayBuffer:async()=>Buffer.alloc(p.bytes)});
  assert.equal(await verifyA2Mock05Audio({level:"A2",mockId:"mock-05",part:"teil-1",
    key:p.key,signedUrl:"https://example.r2.cloudflarestorage.com/path",fetchImpl}),false);
});
