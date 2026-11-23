const { createClassroomBankAudioHandler } = require('../../../server/courseMusic.cjs');
const { validateA2AudioKey } = require('../r2CourseAudio.js');

const AUDIO_KEY = 'a2/day-10/eine-stadt-entdecken-und-etwas-erleben.mp3';
const ENV = {
  FIREBASE_API_KEY: 'test-key',
  R2_ACCOUNT_ID: '0123456789abcdef0123456789abcdef',
  R2_ACCESS_KEY_ID: 'test-access-key',
  R2_SECRET_ACCESS_KEY: 'test-secret-key',
  R2_AUDIO_BUCKET: 'falowen-course-audio',
};
function makeResponse() {
  return {
    code: 0, body: null,
    setHeader() { return this; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
}
function handlerForRole(role) {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({
      users: [{ localId: 'test-user', customAttributes: JSON.stringify({ role }) }],
    }),
  });
  return createClassroomBankAudioHandler({ env: ENV, fetchImpl });
}
async function request(day, key, {token = 'teacher-token', role = 'teacher'} = {}) {
  const url = new URL('https://www.falowen.app/api/course-media/a2/classroom-audio-url');
  url.searchParams.set('day', String(day));
  url.searchParams.set('key', key);
  const res = makeResponse();
  await handlerForRole(role)({
    method: 'GET',
    url: url.pathname + url.search,
    headers: { origin: 'https://admin.falowen.app', authorization: token ? 'Bearer ' + token : '' },
  }, res);
  return res;
}
test('Day 10 Stadt exact-key recording returns an authenticated private signed URL', async () => {
  const result = await request(10, AUDIO_KEY);
  expect(result.code).toBe(200);
  expect(result.body.track).toBe('a2-day10-stadt-classroom');
  expect(result.body.url).toContain('/a2/day-10/eine-stadt-entdecken-und-etwas-erleben.mp3?');
  expect(result.body.url).toContain('X-Amz-Signature=');
  expect(validateA2AudioKey({day: 10, key: AUDIO_KEY})).toEqual({day: 10, key: AUDIO_KEY});
  // This is a separate teaching MP3; do not remove existing workbook audio.
  expect(validateA2AudioKey({day: 10, key: 'a2/day-10/day-10.mp3'})).toEqual({day: 10, key: 'a2/day-10/day-10.mp3'});
});
test('wrong day, wrong key, student and missing token cannot obtain a classroom signed URL', async () => {
  for (const [day, key] of [
    [9, AUDIO_KEY],
    [10, 'a2/day-10/other.mp3'],
    [10, 'a2/day-10/../eine-stadt-entdecken-und-etwas-erleben.mp3'],
  ]) {
    const result = await request(day, key);
    expect(result.code).toBe(400);
    expect(result.body.error).toBe('Invalid classroom audio request.');
  }
  expect((await request(10, AUDIO_KEY, {token: ''})).code).toBe(401);
  expect((await request(10, AUDIO_KEY, {role: 'student'})).code).toBe(403);
});
