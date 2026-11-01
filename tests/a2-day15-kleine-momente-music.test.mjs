import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { lyricLines, validateCues, activeLyricIndex } from '../web/public/music/lyrics-timing.js';

const require = createRequire(import.meta.url);
const {validateLyrics,createLyricsHandler}=require('../server/musicLyrics.cjs');
const {musicTrackFromKey}=require('../server/musicDiscovery.cjs');
const catalog=require('../web/public/music/catalog.json');
const approved=require('../web/public/music/approved-recording-lyrics.json');
const studio=require('../web/public/music/studio-drafts.json');
const english=require('../web/public/music/english-translations.json');

const key='music/a2/day-15/Kleine Momente.mp3';
const id='r2-a2-day-15-b64_S2xlaW5lIE1vbWVudGUubXAz';
const sha='c866522f0eaca9a73bd8c02ca8c1480f963e4bc1526322f98cf70e44f54d9b31';
const pack=approved.recordings.find(item=>item.objectKey===key);
const track=catalog.tracks.find(item=>item.objectKey===key);

test('A2 Day 15 is pinned to the existing Kleine Momente R2 recording',()=>{
  assert.ok(track?.approved);
  assert.equal(track.level,'A2');
  assert.equal(track.day,15);
  assert.equal(track.assignmentKey,'A2-6.15');
  assert.equal(track.title,'Kleine Momente');
  assert.equal(track.id,id);
  assert.equal(musicTrackFromKey(key).title,'Kleine Momente');
  assert.equal(musicTrackFromKey(key).id,id);
  assert.equal(pack.recordingSha256,sha);
  assert.equal(pack.duration,156.432);
  assert.equal(pack.timingStatus,'estimated');
});

test('28 original song lines and both choruses have ordered time cues',()=>{
  assert.deepEqual(pack.lyrics.match(/\[[^\]]+\]/g),['[Verse 1]','[Chorus]','[Verse 2]','[Chorus]','[Outro]']);
  assert.equal(lyricLines(pack.lyrics).length,28);
  assert.equal(pack.cues.length,28);
  assert.deepEqual(validateCues(pack.cues,pack.lyrics),pack.cues);
  assert.deepEqual(validateLyrics(pack,key)?.cues,pack.cues);
  assert.equal(lyricLines(pack.lyrics).filter(line=>line==='Mein Lieblingslied, mein Lieblingsort,').length,2);
  assert.equal(lyricLines(pack.lyrics).filter(line=>line==='sind kleine Momente voller Glück.').length,2);
  let previousEnd=-1;
  for(const cue of pack.cues) {
    assert.ok(cue.start>previousEnd);
    assert.ok(cue.end>cue.start&&cue.end<=pack.duration);
    previousEnd=cue.end;
  }
  assert.equal(activeLyricIndex(pack.cues,0),-1);
  assert.equal(activeLyricIndex(pack.cues,77),-1);
  assert.equal(activeLyricIndex(pack.cues,155),-1);
});

test('Day 15 replaces the previous sports-song draft and has complete English translations',()=>{
  const draft=studio.tracks.find(row=>row.level==='A2'&&row.day===15);
  assert.equal(draft.assignmentKey,'A2-6.15');
  assert.equal(draft.title,pack.title);
  assert.equal(draft.lyrics,pack.lyrics);
  assert.equal(draft.recordingObjectKey,key);
  assert.equal(draft.recordingSha256,sha);
  assert.doesNotMatch(draft.lyrics,/Jeden Mittwoch treffe ich Fatima/);
  const translated=english.recordings.find(row=>row.objectKey===key);
  assert.deepEqual(translated.lines.map(row=>row.de),lyricLines(pack.lyrics));
  assert.ok(translated.lines.every(row=>row.en?.trim()));
});

test('public lyric API delivers approved recording cues without extra R2 reads',async()=>{
  const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test',R2_SECRET_ACCESS_KEY:'test',R2_AUDIO_BUCKET:'test'};
  const handler=createLyricsHandler({env,fetchImpl:async()=>{throw Error('Unexpected R2 request')}});
  const response={setHeader(){},status(n){this.statusCode=n;return this},json(v){this.body=v;return this}};
  await handler({method:'GET',query:{key}},response);
  assert.equal(response.statusCode,200);
  assert.equal(response.body.cues.length,28);
  assert.equal(response.body.lyrics,pack.lyrics);
});
