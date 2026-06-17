import { normalizeWritingFeedback } from '../writingFeedbackNormalizer';

test('parses markdown fenced JSON and numeric strings', () => {
  const result = normalizeWritingFeedback('hello```json\n{"score":"21","maxScore":"25","summary":"Good","strengths":["Clear"],"areasToImprove":["Grammar"]}\n```bye');
  expect(result.parseError).toBe(false);
  expect(result.score).toBe(21);
  expect(result.maxScore).toBe(25);
  expect(result.summary).toBe('Good');
  expect(result.areasToImprove).toEqual(['Grammar']);
});

test('malformed AI responses are safe', () => {
  const result = normalizeWritingFeedback('```json\nnot valid\n```');
  expect(result.parseError).toBe(true);
  expect(result.summary).toMatch(/could not read/i);
});
