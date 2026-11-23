const { createClassroomBankAudioHandler } = require('../../../server/courseMusic.cjs');
const { validateA2AudioKey } = require('../r2CourseAudio.js');

const AUDIO_KEY = 'a2/day-08/im-restaurant-bestellen-und-reagieren.mp3';
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
const fetchImpl = async () => ({
  ok: true,
  json: async () => ({
    users: [{ localId: 'approved-staff', customAttributes: JSON.stringify({ role: 'teacher' }) }],
  }),
});
const handler = createClassroomBankAudioHandler({ env: ENV, fetchImpl });
async function request(day, key, token = 'teacher-token') {
  const url = new URL('https://www.falowen.app/api/course-media/a2/classroom-audio-url');
  url.searchParams.set('day', String(day));
  url.searchParams.set('key', key);
  const res = makeResponse();
  await handler({ method: 'GET', url: url.pathname + url.search, headers: {
    origin: 'https://admin.falowen.app', authorization: token ? 'Bearer ' + token : '',
  } }, res);
  return res;
}

test('approved A2 Day 8 recording signs only for authenticated teaching staff', async () => {
  const result = await request(8, AUDIO_KEY);
  expect(result.code).toBe(200);
  expect(result.body.url).toContain('/a2/day-08/im-restaurant-bestellen-und-reagieren.mp3?');
  expect(result.body.url).toContain('X-Amz-Signature=');
  expect(result.body.track).toBe('a2-day8-restaurant-classroom');
  expect(validateA2AudioKey({ day: 8, key: AUDIO_KEY })).toEqual({ day: 8, key: AUDIO_KEY });
  // The existing graded workbook recording stays available after this addition.
  expect(validateA2AudioKey({ day: 8, key: 'a2/day-08/day-08.mp3' })).toEqual({ day: 8, key: 'a2/day-08/day-08.mp3' });
});

test('the classroom signer rejects wrong key, wrong day, and requests without a token', async () => {
  for (const [day, key] of [[8, 'a2/day-08/another.mp3'], [7, AUDIO_KEY], [8, '../' + AUDIO_KEY]]) {
    const result = await request(day, key);
    expect(result.code).toBe(400);
    expect(result.body.error).toBe('Invalid classroom audio request.');
  }
  expect((await request(8, AUDIO_KEY, '')).code).toBe(401);
  for (const key of ['a2/day-08/another.mp3', 'a2/day-08/../day-08/im-restaurant-bestellen-und-reagieren.mp3', 'a2/day-08/im-restaurant-bestellen-und-reagieren.wav'])
    expect(validateA2AudioKey({ day: 8, key })).toBeNull();
  expect(validateA2AudioKey({ day: 9, key: AUDIO_KEY })).toBeNull();
});
