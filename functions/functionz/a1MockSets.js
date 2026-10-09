"use strict";
const registry = require('../data/assessmentTasks.json');
const DEFAULT_A1_MOCK_ID = 'a1-mock-01';
const SECOND_A1_MOCK_ID = 'a1-mock-02';
const validateA1MockId = (mockId = DEFAULT_A1_MOCK_ID) => {
  if (![DEFAULT_A1_MOCK_ID, SECOND_A1_MOCK_ID].includes(mockId)) {
    throw Object.assign(new Error('Unknown A1 mock. Reload the mock library.'), { status: 400, code: 'A1_MOCK_NOT_FOUND' });
  }
  return mockId;
};
const getA1MockSet = (mockId = DEFAULT_A1_MOCK_ID) => {
  validateA1MockId(mockId);
  return mockId === SECOND_A1_MOCK_ID ? registry.mockSets[SECOND_A1_MOCK_ID] : null;
};
// The stored attempt, never a client-supplied task description, owns its marking set.
async function resolveA1MarkingSet({ db, uid, attemptId, mockId = DEFAULT_A1_MOCK_ID }) {
  validateA1MockId(mockId);
  if (!attemptId) {
    if (mockId === SECOND_A1_MOCK_ID) throw Object.assign(new Error('Start Mock 2 before submitting.'), { status: 400 });
    return mockId;
  }
  if (!db) throw Object.assign(new Error('Mock exam storage is unavailable.'), { status: 503 });
  const snapshot = await db.collection('a1MockExamUsers').doc(uid).collection('attempts').doc(attemptId).get();
  if (!snapshot.exists) throw Object.assign(new Error('Mock attempt not found.'), { status: 404 });
  const attempt = snapshot.data() || {};
  if (attempt.uid && attempt.uid !== uid) throw Object.assign(new Error('This mock belongs to another account.'), { status: 403 });
  if ((attempt.mockId || DEFAULT_A1_MOCK_ID) !== mockId) {
    throw Object.assign(new Error('The submitted mock does not match this saved attempt. Reload the correct mock.'), { status: 409, code: 'ASSESSMENT_TASK_CHANGED' });
  }
  return mockId;
}
function scoreA1Mock2Form(formValues = {}) {
  const norm = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/ß/g, 'ss').replace(/[.,]/g, '').replace(/\s+/g, ' ').trim();
  const value = number => norm(formValues[number]);
  const checks = {
    1: /^(3|drei)( (familienmitglieder|personen))?$/.test(value(1)),
    2: /^hotel central haupt(strasse|str)\s*14(?: 10117 berlin)?$/.test(value(2)),
    3: /^(a\s?1|grundkenntnisse)$/.test(value(3)),
    4: value(4) === 'august',
    5: /^(bar|barzahlung)$/.test(value(5)),
  };
  const fields = getA1MockSet(SECOND_A1_MOCK_ID).writing.form.formRows.filter(field => field.number).map(field => ({
    number: field.number, correct: checks[field.number], expected: field.answer,
    submitted: String(formValues[field.number] ?? '').trim(),
  }));
  return { score: fields.filter(field => field.correct).length * 2, maxScore: 10, fields };
}
module.exports = { DEFAULT_A1_MOCK_ID, SECOND_A1_MOCK_ID, validateA1MockId, getA1MockSet, resolveA1MarkingSet, scoreA1Mock2Form };
