const { test, before, after } = require('node:test');
const fs = require('node:fs');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { collection, doc, getDoc, getDocs, query, where, setDoc, serverTimestamp, writeBatch } = require('firebase/firestore');
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

for (const level of ['A1', 'A2', 'B1']) {
  test(`${level} first submission: ownership-filtered draft and lock reads, save and verification`, async () => {
    const uid = `first-${level.toLowerCase()}`;
    const student = env.authenticatedContext(uid, {email:`${uid}@example.com`}).firestore();
    const outsider = env.authenticatedContext('unrelated-student').firestore();
    const draftId = `${uid}__${level.toLowerCase()}__chapter`;
    const draftRef = doc(student, 'submissionDrafts', draftId);
    const lockRef = doc(student, 'submissionLocks', draftId);
    const draftsQuery = query(collection(student, 'submissionDrafts'),where('studentId','==',uid));
    const locksQuery = query(collection(student,'submissionLocks'),where('studentId','==',uid));
    // The rules MUST reject unowned missing document gets. Only safe queries
    // are used before creation. This mirrors first-time React submissions.
    await assertFails(getDoc(draftRef));
    await assertFails(getDoc(lockRef));
    const firstDrafts = await assertSucceeds(getDocs(draftsQuery));
    const firstLocks = await assertSucceeds(getDocs(locksQuery));
    if (firstDrafts.docs.length || firstLocks.docs.length) throw new Error('Expected first submission to be empty');
    const body = {studentId:uid,ownerUid:uid,uid,userId:uid,level,
      assignmentKey:`${level}-1.1`,submissionText:'1. A 2. B 3. C',status:'draft'};
    await assertSucceeds(setDoc(draftRef,body,{merge:true}));
    const saved = await assertSucceeds(getDoc(draftRef));
    if (!saved.exists() || saved.data().submissionText !== body.submissionText) throw new Error('Cloud draft failed');
    await assertSucceeds(setDoc(doc(student,'submissions',draftId),{...body,status:'submitted'}));
    await assertSucceeds(setDoc(lockRef,{studentId:uid,ownerUid:uid,assignmentKey:body.assignmentKey,
      level,status:'submitted',submissionId:draftId},{merge:true}));
    const finalLocks = await assertSucceeds(getDocs(locksQuery));
    if (!finalLocks.docs.some(item=>item.id===draftId)) throw new Error('Final submission lock could not be found');
    await assertFails(getDocs(query(collection(outsider,'submissionLocks'),where('studentId','==',uid))));
  });
}

for (const [level, key] of [['A1','A1-12.3'],['A2','A2-8.21'],['B1','B1-6.18']]) {
  test(`${level} timed assignment first-use and expired-to-submitted transition remain writable by its owner`,async()=>{
    const uid=`timer-student-${level.toLowerCase()}`;
    const student=env.authenticatedContext(uid,{email:`${uid}@example.com`}).firestore();
    const other=env.authenticatedContext(`${uid}-other`).firestore();
    const id=`timed__${uid}__${key.toLowerCase()}`;
    const ref=doc(student,'timedAssignmentAttempts',id);
    const missing=await assertSucceeds(getDoc(ref));
    if(missing.exists())throw new Error('New timed attempt must not already exist');
    await assertFails(getDoc(doc(other,'timedAssignmentAttempts',id)));
    const now=Date.now();
    const base={studentId:uid,studentEmail:`${uid}@example.com`,
      assignmentKey:key,level,status:'active',startedAt:serverTimestamp(),
      clientStartedAt:now,durationSeconds:1800,createdAt:serverTimestamp(),
      updatedAt:serverTimestamp()};
    await assertSucceeds(setDoc(ref,base));
    const started=await assertSucceeds(getDoc(ref));
    if(!started.exists()||started.data().status!=='active')throw new Error('Timer failed to start');
    await assertSucceeds(setDoc(ref,{status:'expired',expiredAt:serverTimestamp(),
      updatedAt:serverTimestamp()},{merge:true}));
    await assertSucceeds(setDoc(ref,{status:'submitted',submittedAt:serverTimestamp(),
      updatedAt:serverTimestamp()},{merge:true}));
    const sent=await assertSucceeds(getDoc(ref));
    if(sent.data().status!=='submitted')throw new Error('Timer did not complete');
    await assertFails(setDoc(doc(other,'timedAssignmentAttempts',id),{status:'active'},{merge:true}));
  });
}

// A failed second write must never leave the learner's final answer orphaned.
for (const level of ['A1', 'A2', 'B1']) {
  test(`${level} final work and submission lock commit atomically under owner rules`, async () => {
    const uid = `atomic-${level.toLowerCase()}`;
    const student = env.authenticatedContext(uid, { email: `${uid}@example.com` }).firestore();
    const outsider = env.authenticatedContext(`${uid}-outsider`).firestore();
    const submissionId = `${uid}-answer`;
    const submissionRef = doc(student, 'submissions', submissionId);
    const lockRef = doc(student, 'submissionLocks', submissionId);
    const payload = {
      studentId: uid,
      uid,
      userId: uid,
      ownerUid: uid,
      level,
      assignmentKey: `${level}-1.1`,
      submissionText: 'The student completed part of this timed task.',
      status: 'submitted',
    };
    const batch = writeBatch(student);
    batch.set(submissionRef, payload);
    batch.set(lockRef, {
      studentId: uid,
      level,
      assignmentKey: payload.assignmentKey,
      submissionId,
      status: 'submitted',
    }, { merge: true });
    await assertSucceeds(batch.commit());
    const submitted = await assertSucceeds(getDoc(submissionRef));
    const lock = await assertSucceeds(getDoc(lockRef));
    if (!submitted.exists() || !lock.exists() || lock.data().submissionId !== submissionId) {
      throw new Error('The confirmed answer and submission lock must both exist');
    }
    const failedBatch = writeBatch(outsider);
    const deniedRef = doc(outsider, 'submissionLocks', submissionId);
    const ownRef = doc(outsider, 'submissions', `${uid}-outsider-should-not-write`);
    failedBatch.set(ownRef, { studentId: `${uid}-outsider`, status: 'submitted', level });
    failedBatch.set(deniedRef, { studentId: uid, assignmentKey: payload.assignmentKey });
    await assertFails(failedBatch.commit());
    const ownStillMissing = await assertSucceeds(getDocs(query(
      collection(outsider, 'submissions'), where('studentId', '==', `${uid}-outsider`)
    )));
    if (!ownStillMissing.empty) throw new Error('Rejected batch leaked a partial submission');
  });
}
