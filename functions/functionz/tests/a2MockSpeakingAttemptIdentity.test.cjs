"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {isA2SpeakingAttemptBindingSafe}=require("../a2MockSpeakingAttemptIdentity");
test("every registered A2 mock must carry its own server attempt ID",()=>{
 for (const mockId of ["a2-mock-01","a2-mock-02"]) {
  assert.equal(isA2SpeakingAttemptBindingSafe({mockId,attemptId:"server-attempt"}),true);
  assert.equal(isA2SpeakingAttemptBindingSafe({mockId,attemptId:""}),false);
 }
 assert.equal(isA2SpeakingAttemptBindingSafe({mockId:"a2-mock-03",attemptId:"server-attempt"}),false);
});
