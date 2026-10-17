import { preserveSpeakingRecovery, readSpeakingRecovery } from './courseSpeakingRecovery';

const memory = () => {
  const entries = new Map();
  return { getItem: key => entries.get(key) || null, setItem: (key, value) => entries.set(key, value) };
};
test('preserves legacy parts before a new draft replaces them, without duplicate archives', () => {
  const storage = memory();
  const draft = { tasks: [{ id: 'a' }], results: [{ sessionId: 'saved1', assessment: { percent: 80 } }] };
  storage.setItem('A2', JSON.stringify(draft));
  preserveSpeakingRecovery(storage, 'A2', draft);
  preserveSpeakingRecovery(storage, 'A2', draft);
  storage.setItem('A2', JSON.stringify({ attemptId: 'new', results: [] }));
  expect(readSpeakingRecovery(storage, 'A2')).toHaveLength(1);
  expect(readSpeakingRecovery(storage, 'A2')[0].draft).toEqual(draft);
  expect(readSpeakingRecovery(storage, 'B1')).toEqual([]);
});
test('storage errors prevent archiving from silently losing older parts', () => {
  const storage = memory();
  storage.setItem = () => { throw new Error('Storage full'); };
  expect(() => preserveSpeakingRecovery(storage, 'A2', { results: [{ sessionId: 's' }] })).toThrow('Storage full');
});
