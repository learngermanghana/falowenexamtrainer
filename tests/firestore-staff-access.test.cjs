const { test, before, after } = require('node:test');
const fs = require('node:fs');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { collection, collectionGroup, doc, getDoc, getDocs, setDoc, deleteDoc } = require('firebase/firestore');
let env;
before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-falowen-staff',
    firestore: { host: '127.0.0.1', port: 8080, rules: fs.readFileSync('firestore.rules', 'utf8') },
  });
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    for (const path of ['examTutorReviewQueue/review', 'ai_issue_reports/report', 'submissions/flat', 'submissions/A1/posts/nested', 'courses/A1/submissions/legacy', 'answerKeyRegistry/key', 'markingJobs/job', 'markingResults/result', 'aiMarkingAudit/audit']) {
      await setDoc(doc(db, path), { studentId: 'student-owner', userId: 'student-owner', status: 'pending' });
    }
  });
});
after(async () => { await env?.cleanup(); });

for (const [label, token] of [
  ['admin email', { email: 'moxflex@gmail.com' }],
  ['staff email', { email: 'staff@falowen.app' }],
  ['admin claim', { admin: true }],
  ['staff claim', { staff: true }],
  ['admin role', { role: 'admin' }],
  ['staff role', { role: 'staff' }],
]) {
  test(`${label} can load dashboard panels and all submission shapes`, async () => {
    const db = env.authenticatedContext(`operator-${label.replace(/ /g, '-')}`, token).firestore();
    for (const name of ['examTutorReviewQueue', 'ai_issue_reports', 'answerKeyRegistry', 'markingJobs', 'markingResults', 'aiMarkingAudit']) await assertSucceeds(getDocs(collection(db, name)));
    await assertSucceeds(getDocs(collectionGroup(db, 'submissions')));
    await assertSucceeds(getDocs(collectionGroup(db, 'posts')));
    await assertSucceeds(setDoc(doc(db, 'markingJobs/new-job'), { studentId: 'student-owner' }));
    // The MarkingPage saves drafts before the tutor sends a final mark.
    await assertSucceeds(getDoc(doc(db, 'markingResults/result')));
    await assertSucceeds(setDoc(doc(db, 'markingResults/new-result'), {
      submissionId: 'flat', status: 'needs_review', result: { score: 26 },
    }, {merge: true}));
    await assertSucceeds(setDoc(doc(db, 'aiMarkingAudit/new-audit'), {
      submissionId: 'flat', status: 'draft', feedback: 'Staff review only',
    }, {merge: true}));
  });
}

test('ordinary student and signed-out accounts cannot access staff panels or other students submissions', async () => {
  for (const context of [env.authenticatedContext('other-student', { email: 'student@example.com', role: 'student' }), env.unauthenticatedContext()]) {
    const db = context.firestore();
    for (const name of ['examTutorReviewQueue', 'ai_issue_reports', 'answerKeyRegistry', 'markingJobs', 'markingResults', 'aiMarkingAudit']) await assertFails(getDocs(collection(db, name)));
    await assertFails(getDoc(doc(db, 'submissions/flat')));
    await assertFails(getDocs(collectionGroup(db, 'posts')));
    await assertFails(setDoc(doc(db, 'markingJobs/forbidden'), { studentId: 'student-owner' }));
    await assertFails(getDoc(doc(db, 'markingResults/result')));
    await assertFails(getDoc(doc(db, 'aiMarkingAudit/audit')));
    await assertFails(setDoc(doc(db, 'markingResults/forbidden'), {status:'needs_review'}));
    await assertFails(setDoc(doc(db, 'aiMarkingAudit/forbidden'), {status:'draft'}));
  }
});

test('student submission ownership access is preserved', async () => {
  const db = env.authenticatedContext('student-owner', { email: 'owner@example.com' }).firestore();
  await assertSucceeds(getDoc(doc(db, 'submissions/flat')));
});

test('deployed canonical rules give real staff Mock Builder access without student exposure', async () => {
  const operators=[
    {email:'staff@falowen.app'},
    {email:'moxflex@gmail.com'},
    {admin:true},{staff:true},{role:'admin'},{role:'staff'},
  ];
  for(let i=0;i<operators.length;i++){
    const database=env.authenticatedContext('draft-admin-'+i,operators[i]).firestore();
    const id='b2-mock-'+(i+60);
    const ref=doc(database,'mockFactoryDrafts',id);
    await assertSucceeds(getDocs(collection(database,'mockFactoryDrafts')));
    await assertSucceeds(setDoc(ref,{id,level:'B2',status:'draft'}));
    await assertSucceeds(getDoc(ref));
    await assertSucceeds(setDoc(ref,{id,level:'B2',status:'review'}));
    await assertFails(setDoc(ref,{id,level:'B2',status:'published'}));
    await assertFails(deleteDoc(ref));
  }
  for(const context of [
    env.authenticatedContext('student-read',{email:'student@example.com',role:'student'}),
    env.unauthenticatedContext()
  ]){
    const database=context.firestore();
    await assertFails(getDocs(collection(database,'mockFactoryDrafts')));
    await assertFails(getDoc(doc(database,'mockFactoryDrafts','b2-mock-60')));
    await assertFails(setDoc(doc(database,'mockFactoryDrafts','c1-mock-01'),{
      id:'c1-mock-01',level:'C1',status:'draft'
    }));
  }
});

test('Hamburg signup requires an administrator-configured, unexpired invitation', async () => {
  const path = 'universityInvitations/UH-KISWAHILI-A1';
  const adminDb = env.authenticatedContext('invite-admin', {admin: true}).firestore();
  const staffDb = env.authenticatedContext('invite-tutor', {staff: true}).firestore();
  const studentDb = env.authenticatedContext('university-learner').firestore();
  const visitorDb = env.unauthenticatedContext().firestore();
  const expiry = new Date(Date.now() + 600000);
  const profile = {
    uid: 'university-learner', program: 'swahili', level: 'A1', registrationSource: 'university-invite',
    institutionId: 'university-hamburg', cohortId: 'university-hamburg-kiswahili-a1',
    universityInvitationCode: 'UH-KISWAHILI-A1', status: 'registered',
    institutionVerification: 'pending', accessType: 'invitation_pending',
    paymentStatus: 'exempt_pending', trialStatus: 'not_applicable',
  };
  await assertFails(setDoc(doc(studentDb, 'students/invite-missing'), profile));
  await assertFails(setDoc(doc(staffDb, path), {expiresAt: expiry}));
  await assertFails(setDoc(doc(studentDb, path), {expiresAt: expiry}));
  await assertFails(setDoc(doc(adminDb, path), {expiresAt: new Date(0)}));
  await assertSucceeds(setDoc(doc(adminDb, path), {expiresAt: expiry}));
  await assertSucceeds(getDoc(doc(visitorDb, path)));
  await assertFails(getDocs(collection(visitorDb, 'universityInvitations')));
  await assertFails(setDoc(doc(studentDb, 'students/invite-bad-code'), {...profile, universityInvitationCode: 'wrong'}));
  await assertFails(setDoc(doc(studentDb, 'students/invite-contract'), {...profile, contractEnd: ''}));
  await assertFails(setDoc(doc(studentDb, 'students/invite-german'), {...profile, program: 'german'}));
  await assertFails(setDoc(doc(studentDb, 'students/invite-other-level'), {...profile, level: 'B1'}));
  await assertFails(setDoc(doc(studentDb, 'students/invite-class'), {...profile, classRecordId: 'other-class'}));
  const validStudent = doc(studentDb, 'students/invite-valid');
  await assertSucceeds(setDoc(validStudent, profile));
  await assertFails(setDoc(validStudent, {program: 'german'}, {merge: true}));
  await env.withSecurityRulesDisabled(context =>
    setDoc(doc(context.firestore(), path), {expiresAt: new Date(0)}));
  await assertFails(setDoc(doc(studentDb, 'students/invite-expired'), profile));
});
