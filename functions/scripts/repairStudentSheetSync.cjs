"use strict";
// Run with the same Firestore and Sheets credentials as the deployed sync.
// Dry-run by default. Supply --apply to repair one existing student by code.
const admin = require('firebase-admin');
const {deliverCurrentStudentToSheet}=require('../studentSheetDelivery');
const {appendStudentToStudentsSheetSafely}=require('../functionz/studentsSheet');
async function main(){
 const args=process.argv.slice(2), code=args.find(a=>!a.startsWith('--'));
 if(!code)throw Error('Usage: node functions/scripts/repairStudentSheetSync.cjs STUDENT_CODE [--apply]');
 if(!admin.apps.length)admin.initializeApp();
 const db=admin.firestore();
 let snap=await db.collection('students').doc(code).get();
 if(!snap.exists){
  const rows=await db.collection('students').where('studentCode','==',code).limit(2).get();
  if(rows.size!==1)throw Error('Expected exactly one student; found '+rows.size);
  snap=rows.docs[0];
 }
 if(!args.includes('--apply')){
  const s=snap.data();console.log(JSON.stringify({dryRun:true,studentId:snap.id,studentCode:s.studentCode,status:s.status,level:s.level,hasTrialStart:Boolean(s.trialStartedAt||s.createdAt||s.enrollDate)}));return;
 }
 const result=await deliverCurrentStudentToSheet({snapshot:snap,appendStudent:appendStudentToStudentsSheetSafely,studentCode:code});
 if(result.failed)throw Error("Permanent sheet configuration failure; check deployment logs and fix credentials/schema before repairing.");
 console.log(JSON.stringify(result));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
