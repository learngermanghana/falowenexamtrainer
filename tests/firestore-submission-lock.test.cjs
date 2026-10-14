const { test, before, after } = require('node:test');
const fs = require('node:fs');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { addDoc, collection, doc, getDoc, getDocs, query, where, setDoc, serverTimestamp } = require('firebase/firestore');
let env;
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-falowen-locks', firestore: { host: '127.0.0.1', port: 8080, rules: fs.readFileSync('firestore.rules', 'utf8') } });
});
after(async () => { await env?.cleanup(); });
test('a missing lock read is denied to a student but allowed to staff', async () => {
  const student = env.authenticatedContext('student-one', { email: 'student@example.com' }).firestore();
  const staff = env.authenticatedContext('staff-one', { staff: true }).firestore();
  await assertFails(getDoc(doc(student, 'submissionLocks/not-created')));
  await assertSucceeds(getDoc(doc(staff, 'submissionLocks/not-created')));
});
test('A1 timed mock can check its own unused lock without exposing another student', async () => {
  const owner = env.authenticatedContext('timed-student', { email: 'student@example.com' }).firestore();
  const other = env.authenticatedContext('student-two').firestore();
  const signedOut = env.unauthenticatedContext().firestore();
  // The UI normalizes both UID and assignment key when constructing the lock ID.
  const path = 'submissionLocks/timed__timed-student__a1-13';
  const unused = await assertSucceeds(getDoc(doc(owner, path)));
  if (unused.exists()) throw new Error('First timed attempt must not already exist');

  await assertFails(getDoc(doc(other, path)));
  await assertFails(getDoc(doc(signedOut, path)));
  await assertFails(getDoc(doc(owner, 'submissionLocks/timed__student-two__a1-13')));
  await assertFails(getDoc(doc(owner, 'submissionLocks/unrelated-missing-lock')));

  const lock = { studentId: 'timed-student', assignmentKey: 'A1-13',
    timerRecord: true, status: 'active', level: 'A1', durationSeconds: 2100 };
  await assertSucceeds(setDoc(doc(owner, path), lock));
  const active = await assertSucceeds(getDoc(doc(owner, path)));
  if (!active.exists() || active.data().status !== 'active') {
    throw new Error('Owner cannot resume their timed attempt');
  }
  await assertFails(getDoc(doc(other, path)));
});

// All A2 and B1 timed workbooks, including their final mocks, share the
// missing-document lookup used by the A1 timed start screen.
for (const [level, assignmentKey, durationSeconds] of [
  ['A2', 'A2-8.21', 40 * 60],
  ['A2', 'A2-10.28', 45 * 60],
  ['B1', 'B1-6.18', 55 * 60],
  ['B1', 'B1-10.28', 60 * 60],
]) {
  test(`${level} ${assignmentKey} verifies an unused attempt and preserves isolation`, async () => {
    const uid = `timed-${level.toLowerCase()}-${assignmentKey.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const owner = env.authenticatedContext(uid, { email: `${level.toLowerCase()}@example.com` }).firestore();
    const outsider = env.authenticatedContext('student-other-level').firestore();
    const lockId = `timed__${uid}__${assignmentKey.toLowerCase()}`;
    const lockRef = doc(owner, 'submissionLocks', lockId);
    const firstLookup = await assertSucceeds(getDoc(lockRef));
    if (firstLookup.exists()) throw new Error('A first timed attempt should have no lock');

    await assertFails(getDoc(doc(outsider, 'submissionLocks', lockId)));
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'submissionLocks', lockId)));
    await assertSucceeds(setDoc(lockRef, {
      studentId: uid,
      studentEmail: `${level.toLowerCase()}@example.com`,
      assignmentKey,
      level,
      timerRecord: true,
      status: 'active',
      durationSeconds,
    }));
    const stored = await assertSucceeds(getDoc(lockRef));
    if (!stored.exists() || stored.data().durationSeconds !== durationSeconds) {
      throw new Error('A timed attempt must remain resumable by its owner');
    }
    await assertFails(getDoc(doc(outsider, 'submissionLocks', lockId)));
    // A second consent click must never make an existing attempt look unused.
    if (!stored.exists()) throw new Error('The attempt lock unexpectedly disappeared');
  });
}

test('owner-scoped lookup permits first submission and saving a draft without broadening access', async () => {
  const db = env.authenticatedContext('student-one', { email: 'student@example.com' }).firestore();
  const locks = query(collection(db, 'submissionLocks'), where('studentId', '==', 'student-one'));
  const before = await assertSucceeds(getDocs(locks));
  if (before.docs.length !== 0) throw new Error('Expected no existing locks');
  const payload = { studentId: 'student-one', assignmentKey: 'A2-4.11', submissionText: 'TEIL 3\n1. B\nTEIL 4\n1. A', level: 'A2' };
  await assertSucceeds(setDoc(doc(db, 'submissionDrafts/first-draft'), { ...payload, status: 'draft' }));
  await assertSucceeds(setDoc(doc(db, 'submissions/first-submission'), { ...payload, status: 'submitted' }));
  await assertSucceeds(setDoc(doc(db, 'submissionLocks/first-lock'), payload));
  const after = await assertSucceeds(getDocs(locks));
  if (after.docs.length !== 1 || after.docs[0].id !== 'first-lock') throw new Error('Expected the newly saved lock');
  const other = env.authenticatedContext('student-two').firestore();
  await assertFails(getDoc(doc(other, 'submissionLocks/first-lock')));
  await assertFails(getDocs(query(collection(other, 'submissionLocks'), where('studentId', '==', 'student-one'))));
});

test('A1, A2 and B1 can read a missing timed attempt, start, expire and submit while other students cannot', async () => {
  for (const [level,key,seconds] of [
    ['A1','A1-12.3',2100],['A2','A2-10.28',2700],['B1','B1-6.18',3300],
  ]) {
    const uid = 'student-' + level.toLowerCase();
    const owner = env.authenticatedContext(uid, {email:uid+'@example.com'}).firestore();
    const outsider = env.authenticatedContext('outsider-'+level.toLowerCase()).firestore();
    const attemptId = 'timed__' + uid + '__' + key.toLowerCase();
    const ref = doc(owner,'timedAssignmentAttempts',attemptId);
    const absent = await assertSucceeds(getDoc(ref));
    if (absent.exists()) throw new Error('First timed attempt must not be used');
    await assertFails(getDoc(doc(outsider,'timedAssignmentAttempts',attemptId)));
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(),'timedAssignmentAttempts',attemptId)));
    await assertFails(getDoc(doc(owner,'timedAssignmentAttempts','timed__other-owner__'+key.toLowerCase())));
    await assertFails(getDoc(doc(owner,'timedAssignmentAttempts','not-an-attempt')));

    await assertSucceeds(setDoc(ref, {
      studentId:uid,studentEmail:uid+'@example.com',timerRecord:true,
      assignmentKey:key,level,status:'active',startedAt:serverTimestamp(),
      clientStartedAt:Date.now(),durationSeconds:seconds,
      createdAt:serverTimestamp(),updatedAt:serverTimestamp(),
    }));
    const saved = await assertSucceeds(getDoc(ref));
    if (saved.data().status !== 'active') throw new Error('Timed attempt did not start');
    await assertSucceeds(setDoc(ref,{
      status:'expired',expiredAt:serverTimestamp(),updatedAt:serverTimestamp(),
    },{merge:true}));
    await assertSucceeds(setDoc(ref,{
      status:'submitted',submittedAt:serverTimestamp(),updatedAt:serverTimestamp(),
    },{merge:true}));
    const done = await assertSucceeds(getDoc(ref));
    if (done.data().status !== 'submitted') throw new Error('Timed submission status not persisted');
    await assertFails(getDoc(doc(outsider,'timedAssignmentAttempts',attemptId)));
  }
});

test('A1–B1 first real submission can create a draft, submission and lock under owner rules',async()=>{
  for(const level of ['A1','A2','B1']){
    const uid='submit-'+level.toLowerCase();
    const store=env.authenticatedContext(uid,{email:uid+'@example.com'}).firestore();
    const answer={studentId:uid,studentEmail:uid+'@example.com',level,
      assignmentKey:level+'-2.3',assignmentTitle:level+' Day 2',submissionText:'Ich lerne Deutsch und ich mache jeden Tag meine Aufgaben.',
      createdAt:serverTimestamp(),updatedAt:serverTimestamp(),status:'draft'};
    await assertSucceeds(setDoc(doc(store,'submissionDrafts',uid+'__day-2'),answer,{merge:true}));
    const row=await assertSucceeds(addDoc(collection(store,'submissions'),{...answer,status:'submitted'}));
    await assertSucceeds(setDoc(doc(store,'submissionLocks',uid+'__day-2'),{
      studentId:uid,level,assignmentKey:answer.assignmentKey,assignmentTitle:answer.assignmentTitle,
      lockedAt:serverTimestamp(),chapterKey:'day-2',
    },{merge:true}));
    const stored=await assertSucceeds(getDoc(row));
    if(stored.data().status!=='submitted')throw new Error('Failed to persist first submission');
  }
});
