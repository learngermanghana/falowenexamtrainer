import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {recordingQuestions} from '../web/public/music/lesson-content.js';
import {lyricLines} from '../web/public/music/lyrics-timing.js';
const require=createRequire(import.meta.url);
const {createLyricsHandler}=require('../server/musicLyrics.cjs');
const {musicTrackFromKey,musicKeyFromAutoId}=require('../server/musicDiscovery.cjs');
const allRecordings=require('../web/public/music/approved-recording-lyrics.json').recordings;
const recordings=allRecordings.filter(pack=>['A1-0.2','A1-1.1'].includes(pack.assignmentKey));
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(body){this.body=body;return this;}});
const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test',R2_SECRET_ACCESS_KEY:'test',R2_AUDIO_BUCKET:'test-audio'};

test('exact Day 2 and 3 music keys retain punctuation, correct lesson identity and owner lyrics without invented timings',()=>{
 assert.equal(recordings.length,2);
 for(const [index,pack]of recordings.entries()){
  const track=musicTrackFromKey(pack.objectKey);
  assert.equal(track.id,pack.trackId);assert.equal(musicKeyFromAutoId(track.id),pack.objectKey);
  assert.equal(track.assignmentKey,pack.assignmentKey);assert.equal(track.title,pack.title);assert.ok(track.genre);
  assert.equal(track.day,index+2);assert.equal(track.level,'A1');
  assert.deepEqual(pack.cues,[]);assert.match(pack.recordingSha256,/^[a-f0-9]{64}$/);assert.ok(pack.duration>100);
  assert.equal(lyricLines(pack.lyrics).length,index===0?39:37);
  const questions=recordingQuestions(pack.lyrics);assert.equal(questions.length,3);
  for(const q of questions.filter(q=>q.type==='listening')){assert.equal(q.options[q.correctIndex],q.answer);assert.ok(pack.lyrics.includes(q.evidence));}
 }
 assert.match(recordings[0].lyrics,/B – I – N – A/);assert.match(recordings[0].lyrics,/beginnt am Montag/);
 assert.match(recordings[1].lyrics,/komme aus Berlin/);assert.match(recordings[1].lyrics,/wohne hier in Bonn/);
});
test('missing or unavailable sidecars return exact owner lyrics and zero cues; reviewed sidecars take precedence',async()=>{
 for(const pack of recordings){
  for(const fail of ['missing','unavailable']){
   const res=response();const handler=createLyricsHandler({env,fetchImpl:async()=>{if(fail==='unavailable')throw Error('offline');return new Response('',{status:404});}});
   await handler({method:'GET',query:{track:pack.trackId}},res);
   assert.equal(res.code,200);assert.equal(res.body.objectKey,pack.objectKey);assert.equal(res.body.lyrics,pack.lyrics);assert.deepEqual(res.body.cues,[]);assert.equal(res.body.timingStatus,'missing');
  }
  const reviewed={objectKey:pack.objectKey,lyrics:pack.lyrics,cues:lyricLines(pack.lyrics).map((text,index)=>({text,start:index+1}))};
  const res=response();await createLyricsHandler({env,fetchImpl:async()=>new Response(JSON.stringify(reviewed))})({method:'GET',query:{track:pack.trackId}},res);
  assert.equal(res.code,200);assert.deepEqual(res.body.cues,reviewed.cues);assert.equal(res.body.timingStatus,undefined);
 }
});
test('approved text never applies to another filename, day or private Hören key',async()=>{
 for(const key of ['a1/day-02/private.mp3','music/a1/day-02/other.mp3','music/a1/day-03/Ich heiße Bina.mp3']){
  const res=response();await createLyricsHandler({env,fetchImpl:async()=>new Response('',{status:404})})({method:'GET',query:{key}},res);
  assert.equal(res.code,404);assert.equal(res.body.lyrics,undefined);
 }
});

test('A1 Day21 stays untimed while Day22 uses estimated real-MP3 timestamps',()=>{
 for(const key of ['A1-13','A1-14.1']){
  const pack=allRecordings.find(p=>p.assignmentKey===key);assert.ok(pack);
  if(key==='A1-13') assert.deepEqual(pack.cues,[]);
  else {assert.equal(pack.cues.length,33);assert.equal(pack.timingStatus,'estimated');}
  assert.equal(musicTrackFromKey(pack.objectKey).assignmentKey,key);
  const questions=recordingQuestions(pack.lyrics);assert.equal(questions.length,3);
  for(const q of questions.filter(q=>q.type==='listening')){assert.equal(q.options[q.correctIndex],q.answer);assert.ok(pack.lyrics.includes(q.evidence));}
 }
 const doctor=allRecordings.find(p=>p.assignmentKey==='A1-14.1');assert.equal(doctor.recordingSha256,'2ec00cb7004809e6b34e103e943ac1a6fe29d9bab4d410f4febe0d00412a349b');
 assert.equal(recordingQuestions(doctor.lyrics)[0].answer,'Um zehn Uhr.');
});
