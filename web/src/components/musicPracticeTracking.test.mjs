import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MUSIC_PRACTICE_MESSAGE_TYPE, normalizeCampusMusicPractice, saveCampusMusicPractice } from './musicPracticeTracking.js';

const valid = {
  type: MUSIC_PRACTICE_MESSAGE_TYPE,
  kind: 'start', trackId: 'r2-a2-day-11',
  title: 'Mit dem Rad', level: 'A2', day: 11, seconds: 0,
};

test('only the expected bounded playback messages are accepted', () => {
  assert.deepEqual(normalizeCampusMusicPractice(valid), {
    kind: 'start', trackId: 'r2-a2-day-11', title: 'Mit dem Rad',
    level: 'A2', day: 11, seconds: 0,
  });
  assert.equal(normalizeCampusMusicPractice({ ...valid, type: 'foreign' }), null);
  assert.equal(normalizeCampusMusicPractice({ ...valid, trackId: '../private' }), null);
  assert.equal(normalizeCampusMusicPractice({ ...valid, kind: 'listening_answer' }), null);
  assert.equal(normalizeCampusMusicPractice({ ...valid, seconds: 601 }), null);
  assert.equal(normalizeCampusMusicPractice({ ...valid, seconds: -1 }), null);
});

test('anonymous and signed-out listening is never persisted', async () => {
  let requests = 0;
  const fakeFetch = async () => { requests++; return { ok: true }; };
  const event = normalizeCampusMusicPractice(valid);
  assert.equal(await saveCampusMusicPractice(null, event, fakeFetch), false);
  assert.equal(await saveCampusMusicPractice({ isAnonymous: true }, event, fakeFetch), false);
  assert.equal(requests, 0);
});

test('authenticated requests use Firebase ID token; public GA4 is untouched', async () => {
  let request;
  const user = { uid: 'user123', getIdToken: async () => 'test-id-token' };
  const ok = await saveCampusMusicPractice(user, normalizeCampusMusicPractice(valid),
    async (url, init) => {
      request = { url, init };
      return { ok: true };
    });
  assert.equal(ok, true);
  assert.match(request.url, /cloudfunctions\.net\/api\/music-practice\/record/);
  assert.equal(request.init.headers.Authorization, 'Bearer test-id-token');
  assert.equal(request.init.method, 'POST');
  assert.equal(JSON.parse(request.init.body).trackId, 'r2-a2-day-11');
  const campus = readFileSync(new URL('./CampusMusicPage.js', import.meta.url), 'utf8');
  const music = readFileSync(new URL('../../public/music/app.js', import.meta.url), 'utf8');
  const publicAnalytics = readFileSync(new URL('../../public/music/analytics.js', import.meta.url), 'utf8');
  assert.match(campus, /event\.origin !== window\.location\.origin/);
  assert.match(campus, /event\.source !== iframeRef\.current\?\.contentWindow/);
  assert.match(music, /if \(embedded && window\.parent !== window && audio\)/);
  assert.match(music, /postPractice\('start'/);
  assert.match(music, /postPractice\(kind, playingTrack, seconds\)/);
  assert.doesNotMatch(publicAnalytics, /user_id|firebase\.auth/);
});
