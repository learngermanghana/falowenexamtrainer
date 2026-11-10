import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { lyricLines, validateCues, activeLyricIndex } from '../web/public/music/lyrics-timing.js';

const require=createRequire(import.meta.url);
const {validateLyrics,createLyricsHandler}=require('../server/musicLyrics.cjs');
const {musicTrackFromKey}=require('../server/musicDiscovery.cjs');
const catalog=require('../web/public/music/catalog.json');
const approved=require('../web/public/music/approved-recording-lyrics.json');
const drafts=require('../web/public/music/studio-drafts.json');
const english=require('../web/public/music/english-translations.json');

const key='music/a2/day-03/Zwei Städte.mp3';
const id='r2-a2-day-03-b64_WndlaSBTdMOkZHRlLm1wMw';
const fingerprint='52e2d4b834dde2a2ee07850d6e813231e777eef6d95831337b24ac9bd896a361';
const pack=approved.recordings.find(row=>row.objectKey===key);
const track=catalog.tracks.find(row=>row.id===id);

test('A2 day 3 publishes the existing Zwei Städte R2 MP3 with its course identity',()=>{
 assert.ok(track?.approved);
 assert.equal(track.objectKey,key);
 assert.equal(track.title,'Zwei Städte');
 assert.equal(track.level,'A2');
 assert.equal(track.day,3);
 assert.equal(track.assignmentKey,'A2-1.3');
 assert.equal(musicTrackFromKey(key).id,id);
 assert.equal(musicTrackFromKey(key).assignmentKey,'A2-1.3');
 assert.equal(pack.recordingSha256,fingerprint);
 assert.equal(pack.duration,156.384);
 assert.equal(pack.timingStatus,'estimated');
 assert.equal(pack.strictRecordingLyrics,true);
});

test('30 original Berlin and Hamburg sung lines have ordered independent cue intervals',()=>{
 assert.ok(pack);
 assert.deepEqual(pack.lyrics.match(/\[[^\]]+\]/g),[
   '[Verse 1]','[Chorus]','[Verse 2]','[Chorus]','[Outro]'
 ]);
 const lines=lyricLines(pack.lyrics);
 assert.equal(lines.length,30);
 assert.equal(pack.cues.length,30);
 assert.deepEqual(validateCues(pack.cues,pack.lyrics),pack.cues);
 assert.deepEqual(validateLyrics(pack,key)?.cues,pack.cues);
 assert.equal(lines.filter(line=>line==='Zwei Städte, so viel zu erleben,').length,2);
 assert.equal(lines.filter(line=>line==='und denke gern an diese Reise.').length,2);
 assert.equal(lines.at(-1),'doch Hamburg passt ein bisschen besser zu mir.');
 for(let i=0;i<pack.cues.length;i++){
  const cue=pack.cues[i];
  assert.ok(cue.end>cue.start && cue.end<=pack.duration);
  if(i>0)assert.ok(cue.start>pack.cues[i-1].end);
 }
 assert.equal(activeLyricIndex(pack.cues,0),-1);
 assert.equal(activeLyricIndex(pack.cues,70),-1);
 assert.equal(activeLyricIndex(pack.cues,155),-1);
});

test('A2 Day3 music draft and English translation match only the new recording',()=>{
 const draft=drafts.tracks.find(row=>row.level==='A2'&&row.day===3);
 assert.equal(draft.title,'Zwei Städte');
 assert.equal(draft.assignmentKey,'A2-1.3');
 assert.equal(draft.lyrics,pack.lyrics);
 assert.equal(draft.recordingObjectKey,key);
 assert.equal(draft.recordingSha256,fingerprint);
 assert.doesNotMatch(draft.lyrics,/Tom braucht ein Fahrrad/);
 const translation=english.recordings.find(row=>row.objectKey===key);
 assert.deepEqual(translation.lines.map(row=>row.de),lyricLines(pack.lyrics));
 assert.ok(translation.lines.every(row=>row.en?.trim()));
});

test('public lyrics handler returns exact matching text and timing without paid transcription',async()=>{
 const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test',R2_SECRET_ACCESS_KEY:'test',R2_AUDIO_BUCKET:'test'};
 const handler=createLyricsHandler({env,fetchImpl:async()=>{throw Error('Unexpected R2 sidecar fetch')}});
 const res={setHeader(){},status(n){this.statusCode=n;return this},json(v){this.body=v;return this}};
 await handler({method:'GET',query:{track:id}},res);
 assert.equal(res.statusCode,200);
 assert.equal(res.body.lyrics,pack.lyrics);
 assert.deepEqual(res.body.cues,pack.cues);
});

test('both A2 Day 3 choruses highlight slightly before the previous delayed cues',()=>{
  const first=pack.cues.slice(8,12);
  const second=pack.cues.slice(20,24);
  assert.deepEqual(first.map(cue=>cue.start),[49,52.55,56.3,60.2]);
  assert.deepEqual(second.map(cue=>cue.start),[108,111.6,115.35,119.2]);
  assert.equal(activeLyricIndex(pack.cues,48.99),-1);
  assert.equal(activeLyricIndex(pack.cues,49.01),8);
  assert.equal(activeLyricIndex(pack.cues,107.9),-1);
  assert.equal(activeLyricIndex(pack.cues,108.01),20);
  assert.equal(activeLyricIndex(pack.cues,123),-1);
  assert.equal(activeLyricIndex(pack.cues,124.21),24);
  assert.equal(pack.cues[7].start,42.2);
  assert.equal(pack.cues[12].start,77.8);
  assert.equal(pack.cues[19].start,104.5);
  assert.equal(pack.cues[24].start,124.2);
  assert.match(pack.timingMethod,/chorus highlighting lag/);
  assert.equal(pack.timingStatus,'estimated','a small teacher-reported offset is not acoustic certification');
});
