import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { validateCues } from '../web/public/music/lyrics-timing.js';
const require=createRequire(import.meta.url);
const { musicTrackFromKey }=require('../server/musicDiscovery.cjs');
const { createLyricsHandler,validateLyrics }=require('../server/musicLyrics.cjs');
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const catalog=read('web/public/music/catalog.json');
const draft=read('web/public/music/studio-drafts.json');
const approved=read('web/public/music/approved-recording-lyrics.json');
const lessons=read('web/public/music/learning.json').lessons;
const key='music/a2/day-10/Die Welt entdecken.mp3';
const id='r2-a2-day-10-b64_RGllIFdlbHQgZW50ZGVja2VuLm1wMw';
const pack=approved.recordings.find(x=>x.objectKey===key);
const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test',R2_SECRET_ACCESS_KEY:'test',R2_AUDIO_BUCKET:'test-audio'};
function response(){return{code:200,headers:{},setHeader(k,v){this.headers[k]=v;return this},status(x){this.code=x;return this},json(x){this.body=x;return this}};}

test('Day 10 pin resolves exactly to the uploaded recording, with current lessons and draft',()=>{
 const pin=catalog.tracks.find(x=>x.assignmentKey==='A2-4.10');
 assert.equal(pin.id,id);
 assert.equal(pin.objectKey,key);
 assert.equal(pin.approved,true);
 assert.equal(musicTrackFromKey(key).id,id);
 assert.equal(musicTrackFromKey(key).title,'Die Welt entdecken – The Traveller');
 const studio=draft.tracks.find(x=>x.assignmentKey==='A2-4.10');
 assert.equal(studio.lyrics,pack.lyrics);
 assert.equal(lessons[id].lyrics,pack.lyrics);
 assert.equal(lessons[id].questions.length,3);
 assert.match(pack.lyrics,/Gott segne mein Heimatland/);
 assert.equal((pack.lyrics.match(/\[Chorus\]/g)||[]).length,2);
 assert.doesNotMatch(pack.lyrics,/Links ist ein Platz, rechts ein Café/);
});

test('Do not claim timing accuracy without an audio review or guess timestamps',()=>{
 assert.equal(pack.timingStatus,'missing');
 assert.equal(pack.strictRecordingLyrics,true);
 assert.deepEqual(pack.cues,[]);
 assert.deepEqual(validateCues(pack.cues,pack.lyrics),[]);
 assert.equal(validateLyrics(pack,key)?.lyrics,pack.lyrics);
});

test('A stale R2 lyrics sidecar cannot supply mismatched timings for this recording',async()=>{
 const wrong={objectKey:key,lyrics:pack.lyrics.replace('Morgen fliege ich nach Nigeria,','Morgen fliege ich nach Kanada,'),cues:[]};
 const handler=createLyricsHandler({env,fetchImpl:async()=>new Response(JSON.stringify(wrong))});
 const result=response();
 await handler({method:'GET',query:{track:id}},result);
 assert.equal(result.code,200);
 assert.equal(result.body.lyrics,pack.lyrics);
 assert.deepEqual(result.body.cues,[]);
 assert.equal(result.body.timingStatus,'missing');
});
