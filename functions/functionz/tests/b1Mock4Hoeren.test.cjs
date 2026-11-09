"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {PARTS,QUESTIONS,publicB1Mock4Hoeren,markB1Mock4Hoeren}=require("../b1Mock4Hoeren");
const {PART_KEYS,EXPECTED_SIZES,verifyB1Mock4Audio}=require("../b1Mock4PublishedAudio");

test("Mock 04 source has 10/5/7/8 questions and private answers",()=>{
  assert.deepEqual(PARTS.map(p=>p.count),[10,5,7,8]);
  assert.equal(QUESTIONS.length,30);
  assert.deepEqual(QUESTIONS.map(q=>q.number),Array.from({length:30},(_,i)=>i+1));
  const publicExam=publicB1Mock4Hoeren();
  assert.equal(publicExam.mockId,"b1-mock-04");
  assert.equal(publicExam.practiceOnly,true);
  assert.equal(publicExam.parts.flatMap(p=>p.questions).length,30);
  for(const q of publicExam.parts.flatMap(p=>p.questions))assert.equal(Object.hasOwn(q,"answer"),false);
  assert.equal(publicExam.parts[0].questions[1].kind,"multiple-choice");
});
test("Mock 04 uses its 30 teacher-owned keys, ignores client marks and validates inputs",()=>{
  const correct=Object.fromEntries(QUESTIONS.map(q=>[q.number,q.answer]));
  assert.deepEqual(markB1Mock4Hoeren(correct).perPart.map(p=>p.correct),[10,5,7,8]);
  assert.equal(markB1Mock4Hoeren(correct).percentage,100);
  const wrong={...correct,1:"richtig",2:"b"};
  assert.equal(markB1Mock4Hoeren(wrong).correct,28);
  assert.throws(()=>markB1Mock4Hoeren({1:"richtig"}),/30/);
  assert.throws(()=>markB1Mock4Hoeren({...correct,2:"wrong"}),/30/);
});
test("Mock 04 only accepts the planned R2 objects with teacher MP3 byte sizes",async()=>{
  assert.equal(Object.keys(PART_KEYS).length,4);
  assert.deepEqual(Object.values(EXPECTED_SIZES),[4057056,1035072,1135296,4183488]);
  const input={level:"B1",mockId:"mock-04",part:"teil-2",
    key:PART_KEYS["teil-2"],signedUrl:"https://example.r2.cloudflarestorage.com/object"};
  const validRange=()=>({status:206,
    headers:{get:()=>`bytes 0-2/${EXPECTED_SIZES["teil-2"]}`},
    arrayBuffer:async()=>Uint8Array.from([73,68,51]).buffer});
  assert.equal(await verifyB1Mock4Audio({...input,fetchImpl:async()=>validRange()}),true);
  assert.equal(await verifyB1Mock4Audio({...input,key:PART_KEYS["teil-1"],fetchImpl:async()=>validRange()}),false);
  assert.equal(await verifyB1Mock4Audio({...input,mockId:"mock-03",fetchImpl:async()=>validRange()}),false);
});
