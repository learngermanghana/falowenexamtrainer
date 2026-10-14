const {test}=require('node:test');
const assert=require('node:assert/strict');
const {sheetCellValue}=require('../sheetCellValue');
test('preserves Firestore trial dates as ISO strings accepted by Sheets',()=>{
 const expected='2026-10-12T09:48:00.357Z';
 assert.equal(sheetCellValue({_seconds:1791798480,_nanoseconds:357000000}),expected);
 assert.equal(sheetCellValue({seconds:1791798480,nanoseconds:357000000}),expected);
 assert.equal(sheetCellValue({toDate:()=>new Date(expected)}),expected);
 assert.equal(sheetCellValue(new Date(expected)),expected);
});
test('keeps scalar cell values and handles empty or invalid dates',()=>{
 for(const v of ['',0,3000,true,'trial_active'])assert.equal(sheetCellValue(v),v);
 for(const v of [null,undefined,new Date('invalid')])assert.equal(sheetCellValue(v),'');
});
test('student sheet append and update both serialize actual trial timestamps',async()=>{
 const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
 const source=fs.readFileSync(path.join(__dirname,'../functionz/studentsSheet.js'),'utf8');
 for(const existing of [false,true]){
  let written;
  const headers=['StudentCode','Name','Email','UID','TrialStartedAt','TrialEndsAt','TrialPurgeAt','TrialUsedAt','TrialConvertedAt'];
  const sheets={spreadsheets:{values:{
   get:async({range})=>({data:{values:range.endsWith('1:1')?[headers]:existing&&range.includes('!A2:')?[['JerryKweigyah022']]:[]}}),
   append:async({requestBody})=>{written=requestBody.values.flat();},
   batchUpdate:async({requestBody})=>{written=requestBody.data.flatMap(x=>x.values.flat());},
  }}};
  const context={module:{exports:{}},require:name=>name==='googleapis'?{google:{auth:{JWT:function(){}},sheets:()=>sheets}}:require('../sheetCellValue'),process:{env:{STUDENTS_SHEET_ID:'test',STUDENTS_SHEET_TAB:'students',GOOGLE_SERVICE_ACCOUNT_JSON:JSON.stringify({client_email:'test',private_key:'test'})}},console,Buffer,Date};
  vm.runInNewContext(source,context);
  const result=await context.module.exports.upsertStudentToSheet({studentCode:'JerryKweigyah022',trialStartedAt:{toDate:()=>new Date('2026-10-12T09:48:00.357Z')},trialEndsAt:{_seconds:1792403280,_nanoseconds:357000000}});
  assert.equal(result.action,existing?'updated':'appended');
  assert.ok(written.includes('2026-10-12T09:48:00.357Z'));
  assert.ok(written.every(x=>['string','number','boolean'].includes(typeof x)));
 }
});
