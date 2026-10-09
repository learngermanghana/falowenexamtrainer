const { resolvePracticeTask, assessmentTaskPrompt, mockTaskPrompt, mockTaskVersion, requireMockTaskVersion } = require('../assessmentTaskContext');
const tasks = require('../../data/assessmentTasks.json');
const versions = require('../../../web/src/data/assessmentTaskVersions.json');
test('writing lookup includes the actual situation and every required point', () => {
  const task = resolvePracticeTask('writing', 'a1-1', 'A1');
  expect(task.situation).toContain('Berliner Hof');
  task.whatToInclude.forEach(point => expect(assessmentTaskPrompt(task)).toContain(point));
});
test('rejects unknown task, wrong level and outdated displayed question', () => {
  expect(() => resolvePracticeTask('writing', 'missing', 'A1')).toThrow(/changed/);
  expect(() => resolvePracticeTask('writing', 'a1-1', 'B2')).toThrow(/changed/);
  expect(() => resolvePracticeTask('writing', 'a1-1', 'A1', { situation: 'old', whatToInclude: [] })).toThrow(/changed/);
});
test('custom practice has no invented catalog question', () => expect(resolvePracticeTask('writing', '', 'B1')).toBeNull());
test('speaking resolves the card from its ID', () => {
  expect(resolvePracticeTask('speaking', 'a1-teil-1-introduction', 'A1').text).toContain('Familie');
});
test.each(['A1', 'A2', 'B1', 'B2'])('%s mock includes complete canonical tasks and matching client versions', level => {
  for (const kind of ['writing', 'speaking']) {
    expect(mockTaskPrompt(level, kind)).toContain(JSON.stringify(tasks.mocks[level][kind]));
    expect(mockTaskVersion(level, kind)).toBe(versions[level][kind]);
  }
});
test('rejects stale mock versions before marking and allows current versions', () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  const req = { method: 'POST', path: '/writing/a2-mock-score', body: { taskVersion: 'old' } };
  requireMockTaskVersion(req, res, next);
  expect(res.status).toHaveBeenCalledWith(409);
  expect(next).not.toHaveBeenCalled();
  req.body.taskVersion = versions.A2.writing;
  requireMockTaskVersion(req, res, next);
  expect(next).toHaveBeenCalledTimes(1);
});
test('B2 grades only the selected canonical presentation theme', () => {
  const prompt = mockTaskPrompt('B2', 'speaking', 'thema2');
  expect(prompt).toContain('Weiterbildung');
  expect(prompt).not.toContain('Konsumverhalten');
  expect(() => mockTaskPrompt('B2', 'speaking', 'invented')).toThrow(/changed/);
});
test('rejects a stale speaking question', () => {
  expect(() => resolvePracticeTask('speaking', 'a1-teil-1-introduction', 'A1', { text: 'old question' })).toThrow(/changed/);
});
