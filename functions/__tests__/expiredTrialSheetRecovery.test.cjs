"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {eligibleRows,recoverExpiredTrialSheetRows}=require("../functionz/expiredTrialSheetRecovery");
const now=Date.parse("2026-11-25T12:00:00Z");
const row={rowNumber:26,StudentCode:"A123",UID:"uid1",Email:"trial@example.test",Paid:0,Status:"trial_expired",TrialEndsAt:"2026-10-19T09:48:00Z",TrialPurgeAt:"2026-11-18T09:48:00Z"};
test("only explicitly due unpaid expired trials qualify; no duplicate identity",()=>{
 assert.equal(eligibleRows([row],now).length,1);
 for(const override of [{Paid:1},{Paid:""},{Status:"active"},{TrialConvertedAt:"2026-11-01"},{TrialPurgeAt:"2026-12-01"},{TrialPurgeAt:"2026-10-20"},{TrialPurgeAt:""},{UID:""}])
   assert.equal(eligibleRows([{...row,...override}],now).length,0);
 assert.equal(eligibleRows([row,{...row,rowNumber:27,StudentCode:"B222"}],now).length,0);
});
test("only deletes sheet orphans after backend verification and fresh sheet read",async()=>{
 let calls=0,deleted=[];
 const result=await recoverExpiredTrialSheetRows({now,readStudents:async()=>[{...row,rowNumber:++calls===1?26:33}],
   readProtected:async()=>[],verify:async()=>true,deleteRows:async rows=>{deleted=rows;return rows.length;}});
 assert.deepEqual(deleted,[33]);assert.equal(result.removed,1);
});
test("sheet payment history and surviving backend account protect row",async()=>{
 for(const [protectedRows,verified] of [[[{email:row.Email}],true],[[],false],[ [{ "Student Code":row.StudentCode}],true]]) {
  const result=await recoverExpiredTrialSheetRows({now,readStudents:async()=>[row],readProtected:async()=>protectedRows,
   verify:async()=>verified,deleteRows:async()=>{throw Error("unexpected delete");}});
  assert.equal(result.removed,0);
 }
});
test("missing ledger or ambiguous auth failure fails closed",async()=>{
 for(const [readProtected,verify] of [[async()=>{throw Error("missing ledger");},async()=>true],[async()=>[],async()=>{throw Error("auth unavailable");}]])
  await assert.rejects(recoverExpiredTrialSheetRows({now,readStudents:async()=>[row],readProtected,verify,
   deleteRows:async()=>{throw Error("unexpected delete");}}));
});
