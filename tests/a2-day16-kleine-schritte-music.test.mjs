import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { lyricLines, validateCues, activeLyricIndex } from '../web/public/music/lyrics-timing.js';

const require = createRequire(import.meta.url);
const { validateLyrics, createLyricsHandler } = require('../server/musicLyrics.cjs');
const { musicTrackFromKey } = require('../server/musicDiscovery.cjs');
const catalog = require('../web/public/music/catalog.json');
const approved = require('../web/public/music/approved-recording-lyrics.json');
const drafts = require('../web/public/music/studio-drafts.json');
const english = require('../web/public/music/english-translations.json');
const key = 'music/a2/day-16/Kleine Schritte.mp3';
const hash = '5634b38c73c45f41cdf6c6be4f5e40a43dd9805fcfced693603194d0b113ae4d';
const id = 'r2-a2-day-16-b64_S2xlaW5lIFNjaHJpdHRlLm1wMw';
const pack = approved.recordings.find(row => row.objectKey === key);

test('A2 Wohlbefinden Day 16 publishes the exact Kleine Schritte R2 recording', () => {
  assert.ok(pack);
  const track = catalog.tracks.find(row => row.objectKey === key);
  assert.ok(track?.approved);
  assert.equal(track.id, id);
  assert.equal(track.level, 'A2');
  assert.equal(track.day, 16);
  assert.equal(track.assignmentKey, 'A2-6.16');
  assert.equal(track.title, 'Kleine Schritte');
  assert.equal(musicTrackFromKey(key).id, id);
  assert.equal(musicTrackFromKey(key).title, 'Kleine Schritte');
  assert.equal(pack.recordingSha256, hash);
  assert.equal(pack.duration, 113.64);
  assert.equal(pack.timingStatus, 'estimated');
  assert.equal(pack.strictRecordingLyrics, true);
});

test('24 sung lines have separate ordered timing cues and silent instrumental gaps', () => {
  const lines = lyricLines(pack.lyrics);
  assert.equal(lines.length, 24);
  assert.deepEqual(pack.lyrics.match(/\\[[^\\]]+\\]/g), [
    '[Verse 1]', '[Chorus]', '[Verse 2]', '[Chorus]', '[Outro]'
  ]);
  assert.deepEqual(validateCues(pack.cues, pack.lyrics), pack.cues);
  assert.deepEqual(validateLyrics(pack, key)?.cues, pack.cues);
  let previousEnd = -1;
  for (const cue of pack.cues) {
    assert.ok(cue.start > previousEnd);
    assert.ok(cue.end > cue.start && cue.end <= pack.duration);
    previousEnd = cue.end;
  }
  assert.equal(activeLyricIndex(pack.cues, 0), -1);
  assert.equal(activeLyricIndex(pack.cues, 52), -1);
  assert.equal(activeLyricIndex(pack.cues, 113), -1);
  assert.equal(lines.filter(text => text === 'Ich lebe gesund.').length, 2);
  assert.equal(lines.filter(text => text === 'weil Gesundheit wichtig ist.').length, 2);
});

test('A2 Day 16 draft and English translations exactly match recording lyrics', () => {
  const draft = drafts.tracks.find(row => row.level === 'A2' && row.day === 16);
  assert.equal(draft.title, pack.title);
  assert.equal(draft.lyrics, pack.lyrics);
  assert.equal(draft.recordingObjectKey, key);
  assert.equal(draft.recordingSha256, hash);
  const translation = english.recordings.find(row => row.objectKey === key);
  assert.deepEqual(translation.lines.map(row => row.de), lyricLines(pack.lyrics));
  assert.ok(translation.lines.every(row => row.en && row.en.trim()));
});

test('recording-specific cues are delivered without a second R2 metadata lookup', async () => {
  const env = { R2_ACCOUNT_ID: 'a'.repeat(32), R2_ACCESS_KEY_ID: 'test', R2_SECRET_ACCESS_KEY: 'test', R2_AUDIO_BUCKET: 'test' };
  const res = { setHeader(){}, status(code){ this.statusCode=code; return this; }, json(value){ this.body=value; return this; } };
  const handler = createLyricsHandler({ env, fetchImpl: async()=>{ throw Error('An unexpected R2 fetch'); } });
  await handler({method:'GET', query:{key}}, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.cues.length, 24);
  assert.equal(res.body.timingStatus, undefined); // built-in packs are served directly
});
