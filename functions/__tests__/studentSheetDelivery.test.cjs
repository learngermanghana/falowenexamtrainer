const {test}=require('node:test');
const assert=require('node:assert/strict');
const {deliverCurrentStudentToSheet}=require('../studentSheetDelivery');
const snapshot=student=>({ref:{get:async()=>({exists:student!==null,id:'JerryKweigyah022',data:()=>student})}});
test('retries a returned sheet error',async()=>{
 await assert.rejects(deliverCurrentStudentToSheet({snapshot:snapshot({level:'B1'}),appendStudent:async()=>({error:'quota exceeded'})}),/quota exceeded/);
});
test('syncs latest Admin edit and original trial date',async()=>{
 let received;
 const result=await deliverCurrentStudentToSheet({snapshot:snapshot({level:'B1',trialStartedAt:'2026-10-10',status:'trial_active'}),appendStudent:async s=>{received=s;return {action:'appended'};}});
 assert.equal(result.action,'appended');assert.equal(received.level,'B1');assert.equal(received.trialStartedAt,'2026-10-10');assert.equal(received.studentCode,'JerryKweigyah022');
});
test('does not recreate deleted records on retry',async()=>{
 for(const student of [null,{status:'deleted'},{status:'purged'}]){
 const result=await deliverCurrentStudentToSheet({snapshot:snapshot(student),appendStudent:async()=>{throw Error('must not send');}});assert.equal(result.skipped,true);
 }
});
test('requires confirmed delivery and allows successful update',async()=>{
 for(const result of [undefined,{}, {action:'ignored'}])await assert.rejects(deliverCurrentStudentToSheet({snapshot:snapshot({}),appendStudent:async()=>result}));
 assert.equal((await deliverCurrentStudentToSheet({snapshot:snapshot({}),appendStudent:async()=>({action:'updated'})})).action,'updated');
});

test('permanent configuration and authorization failures finish without retry',async()=>{
 for(const result of [
  {error:'Missing STUDENTS_SHEET_ID env var.'},
  {error:'Missing GOOGLE_SERVICE_ACCOUNT_JSON (or GOOGLE_SERVICE_ACCOUNT_JSON_B64).'},
  {error:'Students sheet is missing a StudentCode column header.'},
  {error:'invalid_grant'},
  {error:'denied',errorStatus:403,errorReason:'forbidden'},
 ])assert.equal((await deliverCurrentStudentToSheet({snapshot:snapshot({}),appendStudent:async()=>result})).retryable,false);
});
test('transient Google API errors continue retrying including 403 rate limits',async()=>{
 for(const result of [
  {error:'temporary',errorStatus:503},
  {error:'too many requests',errorStatus:429},
  {error:'limit',errorStatus:403,errorReason:'rateLimitExceeded'},
  {error:'ECONNRESET'},
 ])await assert.rejects(deliverCurrentStudentToSheet({snapshot:snapshot({}),appendStudent:async()=>result}));
});
