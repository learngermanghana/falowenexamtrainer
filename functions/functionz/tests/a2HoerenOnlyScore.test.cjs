"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {gradeA2HoerenOnly}=require("../a2HoerenOnlyScore");
const {APPROVED_A2_MOCK_05_AUDIO,verifyA2Mock05Audio}=require("../a2Mock05PublishedAudio");
const keys={
  "mock-04":require("../a2Mock04HoerenKeys"),
  "mock-05":require("../a2Mock05HoerenKeys"),
  "mock-06":require("../a2Mock06HoerenKeys"),
  "mock-07":require("../a2Mock07HoerenKeys"),
};
for(const [mockId,answers] of Object.entries(keys)){
  test(`${mockId} listening-only reuses 20 private mock answers without creating an exam attempt`,()=>{
    const perfect=gradeA2HoerenOnly({mockId,answers});
    assert.equal(perfect.correct,20);
    assert.equal(perfect.total,20);
    assert.equal(perfect.percent,100);
    assert.deepEqual(perfect.partScores,{teil1:5,teil2:5,teil3:5,teil4:5});
    assert.deepEqual(Object.keys(perfect).sort(),["correct","mockId","partScores","percent","total"].sort());
    const missed={...answers,1:answers[1]==="a"?"b":"a"};
    assert.equal(gradeA2HoerenOnly({mockId,answers:missed}).correct,19);
    assert.throws(()=>gradeA2HoerenOnly({mockId,answers:{1:"a"}}),/20/);
  });
}
test("Unpublished mock IDs, malformed keys and values do not receive scores",()=>{
  assert.throws(()=>gradeA2HoerenOnly({mockId:"mock-08",answers:keys["mock-07"]}),/Unknown/);
  assert.throws(()=>gradeA2HoerenOnly({mockId:"mock-05",answers:{...keys["mock-05"],extra:"a"}}),/20/);
  assert.throws(()=>gradeA2HoerenOnly({mockId:"mock-05",answers:{...keys["mock-05"],1:"__proto__"}}),/Invalid/);
});
test("Mock 05 playback accepts only exact original MP3 identity and rejects missing or changed R2 bytes",async()=>{
  assert.deepEqual(Object.keys(APPROVED_A2_MOCK_05_AUDIO),["teil-1","teil-2","teil-3","teil-4"]);
  const item=APPROVED_A2_MOCK_05_AUDIO["teil-1"];
  const params={level:"A2",mockId:"mock-05",part:"teil-1",key:item.key,
    signedUrl:"https://bucket.r2.cloudflarestorage.com/audio"};
  assert.equal(await verifyA2Mock05Audio({...params,mockId:"mock-06"}),false);
  assert.equal(await verifyA2Mock05Audio({...params,key:item.key+"-fake"}),false);
  assert.equal(await verifyA2Mock05Audio({...params,fetchImpl:async()=>({ok:false})}),false);
  assert.equal(await verifyA2Mock05Audio({...params,fetchImpl:async()=>({
    ok:true,headers:{get:()=>String(item.bytes)},arrayBuffer:async()=>Buffer.alloc(item.bytes)
  })}),false);
});
