const {
  createClassroomRecordingPathHandler,
  createClassroomAudioHandler,
  createClassroomBankAudioHandler,
} = require('../../../server/courseMusic.cjs');

const env = {
  FIREBASE_API_KEY: 'test-key',
  COURSE_MEDIA_STAFF_EMAILS: 'legacy@example.test',
  R2_ACCOUNT_ID: 'a'.repeat(32),
  R2_ACCESS_KEY_ID: 'test-access',
  R2_SECRET_ACCESS_KEY: 'test-secret',
  R2_AUDIO_BUCKET: 'private-audio',
};
const swahili = { staff: true, staffPages: ['teaching-slides'], staffLanguages: ['swahili'] };
const german = { ...swahili, staffLanguages: ['german'] };
const recordings = [
  [26, 'swahili/B1/day-26/swahili-listening matitizo.mp3'],
  [27, 'swahili/B1/day-27/kuntunza.mp3'],
  [28, 'swahili/B1/day-28/swahili-listening kuntasa.mp3'],
];

async function request(factory, url, claims, { token = 'test-token', disabled = false } = {}) {
  const fetchImpl = jest.fn(async () => ({
    ok: true, json: async () => ({
      users: [{ localId: 'test-uid', email: 'teacher@example.test', disabled,
        customAttributes: JSON.stringify(claims) }],
    }),
  }));
  const res = {
    setHeader: jest.fn(), status: jest.fn(function(code) { this.code = code; return this; }),
    json: jest.fn(function(body) { this.body = body; return this; }),
  };
  await factory({ env, fetchImpl })({
    url, method: 'GET', headers: { authorization: token ? 'Bearer ' + token : '' },
  }, res);
  return res;
}
function fixed(day) { return '/course-media/classroom/swahili-b1/' + day + '/audio-url'; }
function query(day, key, level = 'SWAHILI-B1') {
  return '/course-media/classroom/audio-url?' + new URLSearchParams({ level, day: String(day), key });
}

test.each(recordings)('scoped Kiswahili staff can sign day %s on both classroom routes', async (day, key) => {
  for (const [factory, path] of [
    [createClassroomRecordingPathHandler, fixed(day)],
    [createClassroomAudioHandler, query(day, key)],
  ]) {
    const res = await request(factory, path, swahili);
    expect(res.code).toBe(200);
    expect(decodeURIComponent(new URL(res.body.url).pathname)).toBe('/' + key);
    expect(new URL(res.body.url).searchParams.has('X-Amz-Signature')).toBe(true);
  }
});

test.each([
  {},
  german,
  { ...swahili, staffPages: ['attendance'] },
  { ...swahili, staff: false, role: 'teacher' },
  { ...swahili, role: 'teacher', staffLanguages: ['german'] },
  { staff: true },
])('unauthorized or out-of-scope staff cannot sign Kiswahili audio: %j', async claims => {
  expect((await request(createClassroomRecordingPathHandler, fixed(28), claims)).code).toBe(403);
  expect((await request(createClassroomAudioHandler, query(...recordings[2]), claims)).code).toBe(403);
});

test('German scoped staff can use all three classroom routes, Kiswahili-only staff cannot', async () => {
  const key = 'a2/day-01/small-talk.mp3';
  for (const [factory, path] of [
    [createClassroomRecordingPathHandler, '/course-media/classroom/a2/1/audio-url'],
    [createClassroomAudioHandler, query(1, key, 'A2')],
    [createClassroomBankAudioHandler, '/course-media/a2/classroom-audio-url?' + new URLSearchParams({ day: '1', key })],
  ]) {
    expect((await request(factory, path, german)).code).toBe(200);
    expect((await request(factory, path, swahili)).code).toBe(403);
  }
});

test('existing admins and legacy teachers retain access; invalid keys and unauthenticated requests are rejected', async () => {
  expect((await request(createClassroomRecordingPathHandler, fixed(28), { admin: true })).code).toBe(200);
  expect((await request(createClassroomRecordingPathHandler, fixed(28), { role: 'teacher' })).code).toBe(200);
  expect((await request(createClassroomAudioHandler, query(28, 'unregistered.mp3'), swahili)).code).toBe(400);
  expect((await request(createClassroomRecordingPathHandler, fixed(28) + '?key=unregistered.mp3', swahili)).code).toBe(400);
  expect((await request(createClassroomRecordingPathHandler, fixed(99), swahili)).code).toBe(404);
  expect((await request(createClassroomRecordingPathHandler, fixed(28), swahili, { token: '' })).code).toBe(401);
  expect((await request(createClassroomRecordingPathHandler, fixed(28), swahili, { disabled: true })).code).toBe(401);
});
