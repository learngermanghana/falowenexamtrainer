const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createLyricsHandler } = require('../server/musicLyrics.cjs');
const { musicTrackFromKey, musicKeyFromAutoId } = require('../server/musicDiscovery.cjs');
const catalog = require('../web/public/music/catalog.json');
const key = 'music/c1/day-01/Lernen mit Verstand.mp3';

test('C1 recording is playable via its exact public key and returns an untimed reference draft', async () => {
  const song = catalog.tracks.find(item => item.objectKey === key);
  assert.equal(musicTrackFromKey(key).id, song.id);
  assert.equal(musicKeyFromAutoId(song.id), key);
  let body, status;
  const response = {setHeader() {}, status(code) { status=code; return this; }, json(data) { body=data; return this; }};
  await createLyricsHandler({env:{}, fetchImpl: async () => { throw Error('offline'); }})({method:'GET',query:{track:song.id}}, response);
  assert.equal(status,200);
  assert.equal(body.objectKey,key);
  assert.equal(body.referenceOnly,true);
  assert.deepEqual(body.cues,[]);
  assert.match(body.lyrics,/Je gezielter wir reflektieren/);
  assert.equal(body.source,'course-draft');
});
