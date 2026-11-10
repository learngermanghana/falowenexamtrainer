const test = require('node:test');
const assert = require('node:assert/strict');
const { createClassroomBankAudioHandler } = require('../server/courseMusic.cjs');

const env = {
  FIREBASE_API_KEY: 'test-firebase',
  R2_ACCOUNT_ID: 'a'.repeat(32),
  R2_ACCESS_KEY_ID: 'test-access-key',
  R2_SECRET_ACCESS_KEY: 'test-secret-key',
  R2_AUDIO_BUCKET: 'falowen-course-audio',
  COURSE_MEDIA_STAFF_EMAILS: 'staff@falowen.app',
};
const fetchImpl = async () => ({
  ok: true,
  json: async () => ({ users: [{
    localId: 'test-teacher',
    email: 'staff@falowen.app',
    customAttributes: '{"role":"teacher"}',
  }] }),
});
async function request(path, headers = {authorization: 'Bearer test-token'}) {
  let statusCode = 200, response;
  const res = {
    setHeader() { return this; },
    status(code) { statusCode = code; return this; },
    json(value) { response = value; return this; },
    end() { return this; },
  };
  const handler = createClassroomBankAudioHandler({ env, fetchImpl });
  await handler({ url: path, method: 'GET', headers }, res);
  return { statusCode, response };
}

test('teacher can sign only the fixed Day 3 conversation key', async()=>{
  const ok = await request('/course-media/a2/classroom-audio-url?day=3&key=a2%2Fday-03%2Fdinge-und-personen-vergleichen.mp3');
  assert.equal(ok.statusCode,200);
  assert.match(ok.response.url,/a2\/day-03\/dinge-und-personen-vergleichen.mp3/);
  assert.equal(ok.response.track,'a2-day3-dinge-und-personen-vergleichen');

  const wrongKey = await request('/course-media/a2/classroom-audio-url?day=3&key=a2%2Fday-03%2Fother.mp3');
  assert.equal(wrongKey.statusCode,400);
  assert.match(wrongKey.response.error,/Invalid classroom audio request/);

  const wrongDay = await request('/course-media/a2/classroom-audio-url?day=4&key=a2%2Fday-03%2Fdinge-und-personen-vergleichen.mp3');
  assert.equal(wrongDay.statusCode,400);
});

test('signer rejects unauthenticated Hören requests',async()=>{
  const response=await request('/course-media/a2/classroom-audio-url?day=3&key=a2%2Fday-03%2Fdinge-und-personen-vergleichen.mp3',{});
  assert.equal(response.statusCode,401);
  assert.equal(response.response.url,undefined);
});
