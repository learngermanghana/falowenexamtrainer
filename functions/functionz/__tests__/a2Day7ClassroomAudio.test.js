const { createClassroomBankAudioHandler } = require('../../../server/courseMusic.cjs');

const env = {
  FIREBASE_API_KEY: 'test-key',
  R2_ACCOUNT_ID: '0123456789abcdef0123456789abcdef',
  R2_ACCESS_KEY_ID: 'test-access',
  R2_SECRET_ACCESS_KEY: 'test-secret',
  R2_AUDIO_BUCKET: 'falowen-course-audio',
};
const fetchImpl = async () => ({
  ok: true,
  json: async () => ({ users: [{ localId: 'teacher-id', email: 'teacher@falowen.app' }] }),
});
function response() {
  return {
    code: null, body: null, headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
}
function request(key, method = 'GET') {
  return {
    method,
    url: '/course-media/a2/classroom-audio-url?day=7&key=' + encodeURIComponent(key),
    headers: { authorization: 'Bearer valid-test-token', origin: 'https://admin.falowen.app' },
  };
}
const exactKey = 'a2/day-07/eine-wohnung-suchen.mp3';

test('A2 Day 7 signs the exact private classroom MP3 for authenticated staff', async () => {
  const handler = createClassroomBankAudioHandler({ env, fetchImpl, isAuthorized: () => true });
  const res = response();
  await handler(request(exactKey), res);
  expect(res.code).toBe(200);
  expect(res.body.track).toBe('a2-day7-wohnung-suchen-classroom');
  expect(res.body.url).toContain('/a2/day-07/eine-wohnung-suchen.mp3?');
  expect(res.headers['Cache-Control']).toBe('private, no-store');
});

test('A2 Day 7 rejects unapproved R2 paths rather than signing arbitrary objects', async () => {
  const handler = createClassroomBankAudioHandler({ env, fetchImpl, isAuthorized: () => true });
  const res = response();
  await handler(request('a2/day-07/another.mp3'), res);
  expect(res.code).toBe(400);
  expect(res.body.url).toBeUndefined();
});

test('A2 Day 7 does not bypass staff authorization', async () => {
  const handler = createClassroomBankAudioHandler({ env, fetchImpl, isAuthorized: () => false });
  const res = response();
  await handler(request(exactKey), res);
  expect(res.code).toBe(403);
  expect(res.body.url).toBeUndefined();
});
