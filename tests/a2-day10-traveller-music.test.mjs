import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { validateCues, activeLyricIndex } from '../web/public/music/lyrics-timing.js';
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

test('The supplied 176-second MP3 has 28 waveform-guided lyric cues with honest estimated status',()=>{
 assert.equal(pack.timingStatus,'estimated');
 assert.equal(pack.strictRecordingLyrics,true);
 assert.equal(pack.duration,176.04);
 assert.equal(pack.recordingSha256,'4bbc08b4fd39ca347cfb7023d74a73f12bcac767d73f7e99b5316116be5fccd3');
 assert.match(pack.timingMethod,/waveform-guided/);
 const cues=validateCues(pack.cues,pack.lyrics);
 assert.equal(cues.length,28);
 assert.equal(validateLyrics(pack,key)?.cues.length,28);
 assert.equal(cues[0].start,9.75);
 assert.equal(cues[8].start,45.7); // first chorus
 assert.equal(cues[12].start,83.75); // verse two after extended wordless break
 assert.equal(cues[20].start,119.65); // repeated chorus
 assert.equal(cues[24].start,138.65); // outro
 assert.equal(cues.at(-1).end,159.15);
 for(let i=0;i<cues.length;i++) {
   assert.ok(cues[i].end>cues[i].start);
   assert.ok(cues[i].end<=pack.duration);
   if(i)assert.ok(cues[i].start>=cues[i-1].end);
 }
 assert.equal(activeLyricIndex(cues,0),-1); // intro instrumental
 assert.equal(activeLyricIndex(cues,10),0);
 assert.equal(activeLyricIndex(cues,74),-1); // wordless post-chorus
 assert.equal(activeLyricIndex(cues,84),12);
 assert.equal(activeLyricIndex(cues,121),20);
 assert.equal(activeLyricIndex(cues,161),-1); // instrumental/humming after outro
});

test('The public lyrics API supplies those estimated cues when the R2 sidecar is missing',async()=>{
 const handler=createLyricsHandler({env,fetchImpl:async()=>new Response('',{status:404})});
 const result=response();
 await handler({method:'GET',query:{track:id}},result);
 assert.equal(result.code,200);
 assert.equal(result.body.timingStatus,'estimated');
 assert.equal(result.body.objectKey,key);
 assert.equal(result.body.cues.length,28);
});

test('A stale R2 lyrics sidecar cannot replace current recording-specific timings',async()=>{
 const wrong={objectKey:key,lyrics:pack.lyrics.replace('Morgen fliege ich nach Nigeria,','Morgen fliege ich nach Kanada,'),cues:[]};
 const handler=createLyricsHandler({env,fetchImpl:async()=>new Response(JSON.stringify(wrong))});
 const result=response();
 await handler({method:'GET',query:{track:id}},result);
 assert.equal(result.code,200);
 assert.equal(result.body.lyrics,pack.lyrics);
 assert.equal(result.body.cues.length,28);
 assert.equal(result.body.timingStatus,'estimated');
});

test('A valid but untimed sidecar does not suppress 28 bundled waveform-guided cues',async()=>{
 const untimed={objectKey:key,lyrics:pack.lyrics,cues:[]};
 const handler=createLyricsHandler({env,fetchImpl:async()=>new Response(JSON.stringify(untimed))});
 const result=response();
 await handler({method:'GET',query:{track:id}},result);
 assert.equal(result.code,200);
 assert.equal(result.body.timingStatus,'estimated');
 assert.equal(result.body.cues.length,28);
});
