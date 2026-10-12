const { test, before, after } = require('node:test');
const fs = require('node:fs');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { collection, doc, getDoc, getDocs, query, where, setDoc } = require('firebase/firestore');
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
