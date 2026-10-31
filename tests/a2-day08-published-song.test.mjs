import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const catalog = JSON.parse(readFileSync('web/public/music/catalog.json','utf8'));
const drafts = JSON.parse(readFileSync('web/public/music/studio-drafts.json','utf8'));
const approved = JSON.parse(readFileSync('web/public/music/approved-recording-lyrics.json','utf8'));
const { musicTrackFromKey } = require('../server/musicDiscovery.cjs');
const { validateLyrics } = require('../server/musicLyrics.cjs');

test('A2 day 8 is linked to exactly the uploaded R2 mp3, without guessing a different name', () => {
  const objectKey = 'music/a2/day-08/Ein Abend zu zweit.mp3';
  const pinned = catalog.tracks.find(song => song.assignmentKey === 'A2-3.8');
  assert.equal(pinned.objectKey, objectKey);
  assert.equal(pinned.title, 'Ein Abend zu zweit');
  assert.equal(pinned.id, 'r2-a2-day-08-b64_RWluIEFiZW5kIHp1IHp3ZWl0Lm1wMw');
  assert.equal(pinned.approved, true);
  const discovered = musicTrackFromKey(objectKey);
  assert.equal(discovered.id, pinned.id);
  assert.equal(discovered.title, pinned.title);
  assert.equal(discovered.assignmentKey, pinned.assignmentKey);
});

test('both the draft and the published recording contain the sung restaurant story', () => {
  const draft = drafts.tracks.find(song => song.assignmentKey === 'A2-3.8');
  const recording = approved.recordings.find(song => song.assignmentKey === 'A2-3.8');
  assert.equal(draft.title,'Ein Abend zu zweit');
  assert.equal(draft.lyrics, recording.lyrics);
  assert.equal(recording.recordingSha256,'f13735d3d4954c4925db0c045fe27a9cd6c6c30e8cb5a4ca392eae63a18b0829');
  assert.match(recording.lyrics,/Am Freitagabend geh’ ich mit Mia aus/);
  assert.match(recording.lyrics,/Doch plötzlich steht ein Fisch vor mir/);
  assert.match(recording.lyrics,/Zwei Gläser Wasser, danke sehr/);
  assert.doesNotMatch(recording.lyrics,/Im Restaurant ist heute viel los/);
  assert.equal(recording.cues.length, 0, 'no unverified synced word timings');
  assert.equal(validateLyrics(recording, recording.objectKey)?.lyrics, recording.lyrics);
});
