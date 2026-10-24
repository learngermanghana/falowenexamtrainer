const {
  getA1MockSet, scoreA1Mock3Form, resolveA1MarkingSet, validateA1MockId,
} = require('../a1MockSets');
const { mockTaskPrompt, mockTaskVersion } = require('../assessmentTaskContext');
const { buildVerifiedA1MockScore, buildA1MockCompletionArtifacts, assignmentIdForAttempt } = require('../a1MockCompletionSync');
const versions = require('../../../web/src/data/assessmentTaskVersions.json');
const mockId = 'a1-mock-03';

test('Mock 3 form accepts appropriate spelling, capitalization and postal-code order', () => {
  const full = { 1: '10115 Berlin', 2: 'Kanada', 3: 'Architektin', 4: 'Abendkurs', 5: 'A1' };
  expect(scoreA1Mock3Form(full).score).toBe(10);
  expect(scoreA1Mock3Form({ 1: ' Berlin, 10115 ', 2: 'Canada', 3: 'ARCHITEKTIN', 4: 'abendkurs', 5: 'A 1' }).score).toBe(10);
  expect(scoreA1Mock3Form({ ...full, 1: '10117 Berlin', 4: 'Vormittagskurs' }).score).toBe(6);
  expect(scoreA1Mock3Form({}).score).toBe(0);
  expect(scoreA1Mock3Form(full).fields.map((field) => field.expected)).toEqual([
    '10115 Berlin', 'Kanada', 'Architektin', 'Abendkurs', 'A1',
  ]);
});

test('Mock 3 task is server authoritative with distinct writing and speaking version hashes', () => {
  validateA1MockId(mockId);
  const set = getA1MockSet(mockId);
  expect(set.writing.id).toBe('a1-mock-03-anna-dinner');
  expect(set.writing.form.formRows.filter((field) => field.number)).toHaveLength(5);
  expect(mockTaskPrompt('A1', 'writing', undefined, mockId)).toContain('Anna');
  expect(mockTaskPrompt('A1', 'writing', undefined, mockId)).not.toContain('Markus');
  expect(mockTaskPrompt('A1', 'speaking', undefined, mockId)).toContain('Brot');
  expect(mockTaskPrompt('A1', 'speaking', undefined, mockId)).toContain('Ein Glas Wasser');
  expect(mockTaskVersion('A1', 'writing', mockId)).toBe(versions.A1_MOCK_3.writing);
  expect(mockTaskVersion('A1', 'speaking', mockId)).toBe(versions.A1_MOCK_3.speaking);
  expect(mockTaskVersion('A1', 'writing', mockId)).not.toBe(versions.A1_MOCK_2.writing);
});

test('Mock 3 has complete server-side Lesen and Hören answer keys', () => {
  const set = getA1MockSet(mockId);
  expect(Object.keys(set.readingAnswerKey)).toHaveLength(15);
  expect(Object.values(set.readingAnswerKey)).toEqual([
    'richtig', 'falsch', 'richtig', 'falsch', 'richtig', 'a', 'a', 'b', 'a', 'a',
    'falsch', 'richtig', 'richtig', 'falsch', 'falsch',
  ]);
  expect(Object.keys(set.listeningAnswerKey)).toHaveLength(15);
  expect(Object.values(set.listeningAnswerKey)).toEqual([
    'b', 'a', 'b', 'a', 'b', 'b', 'a', 'c', 'b', 'b', 'b', 'c', 'c', 'b', 'b',
  ]);
  const score = buildVerifiedA1MockScore({
    mockId,
    state: { lesenAnswers: set.readingAnswerKey, hoerenAnswers: set.listeningAnswerKey },
    verifiedSections: { schreiben: { verified: true, score: 20 }, sprechen: { verified: true, score: 22 } },
  });
  expect(score.sectionScores).toEqual({ lesen: 25, hoeren: 25, schreiben: 20, sprechen: 22 });
  expect(score.overall.score).toBe(92);
});

test('Mock 3 attempt identity and result history are separate from Mock 1 and 2', async () => {
  const db = (data) => ({
    collection: () => ({ doc: () => ({ collection: () => ({ doc: () => ({
      get: async () => ({ exists: Boolean(data), data: () => data }),
    }) }) }) }),
  });
  await expect(resolveA1MarkingSet({ mockId, uid: 'u', attemptId: 'a', db: db({ mockId, uid: 'u' }) }))
    .resolves.toBe(mockId);
  await expect(resolveA1MarkingSet({ mockId, uid: 'u', attemptId: 'a', db: db({ mockId: 'a1-mock-02' }) }))
    .rejects.toMatchObject({ status: 409 });
  await expect(resolveA1MarkingSet({ mockId, uid: 'u' })).rejects.toMatchObject({ status: 400 });

  const record = buildA1MockCompletionArtifacts({
    mockId, authedUser: { uid: 'u', email: 'learner@example.org' },
    attemptId: 'm3', firstAttempt: true, overall: { score: 85, passed: true },
    sectionScores: { lesen: 25, hoeren: 20, schreiben: 20, sprechen: 20 },
  });
  expect(record.scoreDocument).toMatchObject({
    mockId, assignment: 'A1 Mock 3', assignmentId: 'A1-MOCK-03',
    link: '/campus/course/a1-final-mock-3', certificateEligible: false,
  });
  expect(record.notificationDocument.title).toBe('Your A1 Mock 3 result is ready');
  expect(assignmentIdForAttempt({ mockId, attemptNumber: 2 })).toBe('A1-MOCK-03-PRACTICE-2');
});
