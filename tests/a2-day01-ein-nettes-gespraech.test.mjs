import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { musicKeyFromAutoId, musicTrackFromKey } = require('../server/musicDiscovery.cjs');
const read = path => JSON.parse(readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const key = 'music/a2/day-01/Ein nettes Gespräch.mp3';
const id = 'r2-a2-day-01-b64_RWluIG5ldHRlcyBHZXNwcsOkY2gubXAz';
const catalog = read('web/public/music/catalog.json');
const pack = read('web/public/music/approved-recording-lyrics.json').recordings.find(row => row.objectKey === key);
const translation = read('web/public/music/english-translations.json').recordings.find(row => row.objectKey === key);
const drafts = read('web/public/music/studio-drafts.json').tracks;

const sungLines = lyrics => lyrics.split(/\r?\n/).map(line => line.trim()).filter(line => line && !/^\[.+\]$/.test(line));

test('A2 Day 1.1 only advertises its owner-approved new Small Talk recording', () => {
  const published = catalog.tracks.filter(row => row.level === 'A2' && row.day === 1 && row.retired !== true);
  assert.equal(published.length, 1);
  assert.equal(published[0].id, id);
  assert.equal(published[0].title, 'Ein nettes Gespräch');
  assert.equal(published[0].objectKey, key);
  assert.equal(published[0].assignmentKey, 'A2-1.1');
  assert.equal(published[0].audioUrl, 'https://www.falowen.app/api/music?track=' + id);
  assert.equal(published[0].coursebook, true);
  assert.equal(musicKeyFromAutoId(id), key);
  assert.equal(musicTrackFromKey(key)?.id, id);
  assert.ok(!drafts.some(row => row.level === 'A2' && row.day === 1 && row.assignmentKey === 'A2-1.1'),
    'Old Hallo, das bin ich draft must not appear for the replacement');
});

test('replacement lyrics belong to this 158.4-second recording and have non-overlapping estimated cues', () => {
  assert.ok(pack);
  assert.equal(pack.trackId, id);
  assert.equal(pack.recordingSha256, 'edb408a57611d459cad14f2e13dd57d67ae5e726a665573cf8cfb47618daf928');
  assert.equal(pack.duration, 158.4);
  assert.equal(pack.strictRecordingLyrics, true);
  assert.equal(pack.timingStatus, 'estimated');
  const lines = sungLines(pack.lyrics);
  assert.equal(lines.length, 28);
  assert.equal(pack.cues.length, lines.length);
  for (const [i, cue] of pack.cues.entries()) {
    assert.equal(cue.text, lines[i]);
    assert.ok(cue.start >= 0 && cue.end > cue.start && cue.end <= 158.4);
    if (i) assert.ok(cue.start > pack.cues[i - 1].end);
  }
  assert.ok(pack.cues[0].start > 15, 'intro should not be highlighted');
  assert.ok(pack.cues[8].start > pack.cues[7].end + 5, 'first instrumental break');
  assert.ok(pack.cues[24].start > pack.cues[23].end + 10, 'outro instrumental break');
  assert.equal(lines.filter(line => line === 'Ein nettes Gespräch, wir lernen uns kennen,').length, 2);
  assert.ok(lines.includes('Ein schönes Gespräch, wir lernen uns besser kennen,'));
});

test('English translation matches each new recording-specific German lyric, not the old draft', () => {
  assert.ok(translation);
  const lines = sungLines(pack.lyrics);
  assert.equal(translation.lines.length, lines.length);
  assert.deepEqual(translation.lines.map(row => row.de), lines);
  assert.ok(translation.lines.every(row => typeof row.en === 'string' && row.en.trim()));
});
