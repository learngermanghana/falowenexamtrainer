import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { lyricLines, validateCues, activeLyricIndex } from '../web/public/music/lyrics-timing.js';

const require=createRequire(import.meta.url);
const {validateLyrics, createLyricsHandler}=require('../server/musicLyrics.cjs');
const {musicTrackFromKey}=require('../server/musicDiscovery.cjs');
const approved=require('../web/public/music/approved-recording-lyrics.json');
const catalog=require('../web/public/music/catalog.json');
const studio=require('../web/public/music/studio-drafts.json');
const english=require('../web/public/music/english-translations.json');

const key='music/a2/day-14/Pläne für mein Leben.mp3';
const id='r2-a2-day-14-b64_UGzDpG5lIGbDvHIgbWVpbiBMZWJlbi5tcDM';
const hash='479a69d10c7231ace8e8e7689cdbe62f2f9349601c7ab76e613e8388ec4e12fe';
const pack=approved.recordings.find(row=>row.objectKey===key);

test('A2 Day 14 recording metadata matches the owner-supplied MP3',()=>{
  assert.ok(pack);
  assert.equal(pack.trackId,id);
  assert.equal(pack.assignmentKey,'A2-5.14');
  assert.equal(pack.title,'Pläne für mein Leben');
  assert.equal(pack.recordingSha256,hash);
  assert.equal(pack.duration,136.8);
  assert.equal(pack.timingStatus,'estimated');
  assert.equal(pack.strictRecordingLyrics,true);
  const discovered=musicTrackFromKey(key);
  assert.equal(discovered.title,'Pläne für mein Leben');
  assert.equal(discovered.level,'A2');
  assert.equal(discovered.day,14);
  assert.equal(discovered.id,id);
  assert.equal(discovered.assignmentKey,'A2-5.14');
});

test('Do not pin unavailable audio in catalog until Cloudflare R2 upload',()=>{
  assert.ok(!catalog.tracks.some(row=>row.objectKey===key),
    'Day 14 audio has not yet appeared in the R2 discovery library');
});

test('Original Verse-Chorus-Verse-Chorus-Outro lyrics map to all 28 cues',()=>{
  assert.deepEqual(pack.lyrics.match(/\[[^\]]+\]/g),
    ['[Verse 1]','[Chorus]','[Verse 2]','[Chorus]','[Outro]']);
  const lines=lyricLines(pack.lyrics);
  assert.equal(lines.length,28);
  assert.equal(pack.cues.length,28);
  assert.deepEqual(validateCues(pack.cues,pack.lyrics),pack.cues);
  assert.deepEqual(validateLyrics(pack,key)?.cues,pack.cues);
  assert.equal(lines.filter(line=>line==='Ich habe Pläne für mein Leben,').length,2);
  assert.equal(lines.filter(line=>line==='und meine Zukunft selbst gestalten.').length,2);
  let previousEnd=-1;
  for(const cue of pack.cues){
    assert.ok(cue.start>previousEnd);
    assert.ok(cue.end>cue.start&&cue.end<=pack.duration);
    previousEnd=cue.end;
  }
  assert.equal(activeLyricIndex(pack.cues,0),-1);
  assert.equal(activeLyricIndex(pack.cues,65),-1);
  assert.equal(activeLyricIndex(pack.cues,136),-1);
});

test('The old career story draft is replaced without changing assignment identity',()=>{
  const draft=studio.tracks.find(row=>row.level==='A2'&&row.day===14);
  assert.equal(draft.assignmentKey,'A2-5.14');
  assert.equal(draft.title,pack.title);
  assert.equal(draft.lyrics,pack.lyrics);
  assert.equal(draft.recordingObjectKey,key);
  assert.equal(draft.recordingSha256,hash);
  assert.doesNotMatch(draft.lyrics,/Nora arbeitet seit zwei Jahren/);
  const translated=english.recordings.find(row=>row.objectKey===key);
  assert.deepEqual(translated.lines.map(row=>row.de),lyricLines(pack.lyrics));
  assert.ok(translated.lines.every(row=>row.en?.trim()));
});

test('Published owner lyrics are available without recurring AI or R2 metadata scans',async()=>{
  const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test',R2_SECRET_ACCESS_KEY:'test',R2_AUDIO_BUCKET:'test'};
  const handler=createLyricsHandler({env,fetchImpl:async()=>{throw Error('Unexpected R2 metadata fetch')}});
  const res={setHeader(){},status(n){this.statusCode=n;return this},json(v){this.body=v;return this}};
  await handler({method:'GET',query:{key}},res);
  assert.equal(res.statusCode,200);
  assert.equal(res.body.lyrics,pack.lyrics);
  assert.equal(res.body.cues.length,28);
});
