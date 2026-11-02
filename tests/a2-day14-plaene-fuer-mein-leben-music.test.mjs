import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { lyricLines, validateCues, activeLyricIndex } from '../web/public/music/lyrics-timing.js';

const require = createRequire(import.meta.url);
const { validateLyrics } = require('../server/musicLyrics.cjs');
const { musicKeyFromAutoId, musicTrackFromKey } = require('../server/musicDiscovery.cjs');
const approved = require('../web/public/music/approved-recording-lyrics.json');
const catalog = require('../web/public/music/catalog.json');
const studio = require('../web/public/music/studio-drafts.json');
const english = require('../web/public/music/english-translations.json');

const key = 'music/a2/day-14/Mein Traumberuf.mp3';
const id = 'r2-a2-day-14-b64_TWVpbiBUcmF1bWJlcnVmLm1wMw';
const sha = '9c97516632a35b75629e865ee5eb97b44acbda7f91ca3a23fa3155bde5c93530';
const retired = 'music/a2/day-14/Pläne für mein Leben.mp3';
const pack = approved.recordings.find(row=>row.objectKey===key);

test('A2-5.14 matches the actual teacher-supplied 185.88s audio and not the retired song',()=>{
  assert.ok(pack);
  assert.equal(pack.trackId,id);
  assert.equal(pack.assignmentKey,'A2-5.14');
  assert.equal(pack.title,'Mein Traumberuf');
  assert.equal(pack.recordingSha256,sha);
  assert.equal(pack.duration,185.88);
  assert.equal(pack.timingStatus,'estimated');
  assert.equal(pack.strictRecordingLyrics,true);
  assert.equal(musicTrackFromKey(key)?.id,id);
  assert.equal(musicKeyFromAutoId(id),key);
  assert.equal(musicTrackFromKey(retired),null);
  assert.equal(musicKeyFromAutoId('r2-a2-day-14-b64_UGzDpG5lIGbDvHIgbWVpbiBMZWJlbi5tcDM'),'');
  assert.ok(!approved.recordings.some(x=>x.objectKey===retired));
});

test('Do not pin a new R2 object before it is confirmed uploaded',()=>{
  assert.ok(!catalog.tracks.some(x=>x.level==='A2' && x.day===14 && !x.retired));
});

test('Exact new song has 30 cues, bridge, a distinct extended final chorus and closing outro',()=>{
  assert.deepEqual(pack.lyrics.match(/\[[^\]]+\]/g),
    ['[Verse 1]','[Bridge]','[Chorus]','[Verse 2]','[Chorus]','[Outro]']);
  const lines=lyricLines(pack.lyrics);
  assert.equal(lines.length,30);
  assert.equal(pack.cues.length,30);
  assert.deepEqual(validateCues(pack.cues,pack.lyrics),pack.cues);
  assert.deepEqual(validateLyrics(pack,key)?.cues,pack.cues);
  assert.equal(lines.filter(x=>x==='Mein Traumberuf, mein großer Plan,').length,2);
  assert.ok(lines.includes('Mein Traumberuf, mein großes Ziel,'));
  assert.ok(lines.includes('Ingenieur zu sein, das ist mein Ziel.'));
  assert.ok(lines.includes('und eigene Projekte leiten.'));
  assert.equal(activeLyricIndex(pack.cues,0),-1);
  assert.equal(activeLyricIndex(pack.cues,82),-1);
  assert.equal(activeLyricIndex(pack.cues,185.85),-1);
  let end=-1;
  for(const cue of pack.cues){ assert.ok(cue.start>end); assert.ok(cue.end>cue.start && cue.end<=pack.duration); end=cue.end; }
});

test('Studio text and English only match the new exact recording, never old lyrics',()=>{
  const draft=studio.tracks.find(x=>x.level==='A2'&&x.day===14);
  assert.equal(draft.assignmentKey,'A2-5.14');
  assert.equal(draft.title,pack.title);
  assert.equal(draft.lyrics,pack.lyrics);
  assert.equal(draft.recordingObjectKey,key);
  assert.equal(draft.recordingSha256,sha);
  assert.deepEqual(draft.cues,pack.cues);
  assert.doesNotMatch(draft.lyrics,/Ich arbeite seit zwei Jahren im Büro|Nora arbeitet seit zwei Jahren/);
  const translation=english.recordings.find(x=>x.objectKey===key);
  assert.ok(translation);
  assert.deepEqual(translation.lines.map(x=>x.de),lyricLines(pack.lyrics));
  assert.ok(translation.lines.every(x=>x.en?.trim()));
  assert.ok(!english.recordings.some(x=>x.objectKey===retired));
});
