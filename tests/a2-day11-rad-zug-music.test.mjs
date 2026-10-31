import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { lyricLines } from '../web/public/music/lyrics-timing.js';
const require=createRequire(import.meta.url);
const { musicTrackFromKey }=require('../server/musicDiscovery.cjs');
const { createLyricsHandler,validateLyrics }=require('../server/musicLyrics.cjs');
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const catalog=read('web/public/music/catalog.json');
const drafts=read('web/public/music/studio-drafts.json');
const approved=read('web/public/music/approved-recording-lyrics.json');
const lessons=read('web/public/music/learning.json').lessons;
const key='music/a2/day-11/Mit dem Rad, mit dem Zug.mp3';
const id='r2-a2-day-11-b64_TWl0IGRlbSBSYWQsIG1pdCBkZW0gWnVnLm1wMw';
const pack=approved.recordings.find(x=>x.objectKey===key);
const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test',R2_SECRET_ACCESS_KEY:'test',R2_AUDIO_BUCKET:'test-audio'};
function res(){return{code:200,setHeader(){return this},status(x){this.code=x;return this},json(x){this.body=x;return this}};}

test('A2 Day 11 uses the exact owner-supplied bike-and-train recording',()=>{
 const pin=catalog.tracks.find(x=>x.assignmentKey==='A2-4.11');
 assert.equal(pin.id,id);
 assert.equal(pin.objectKey,key);
 assert.equal(pin.approved,true);
 assert.equal(musicTrackFromKey(key).id,id);
 assert.equal(musicTrackFromKey(key).title,'Mit dem Rad, mit dem Zug');
 assert.equal(Buffer.from(id.split('b64_')[1],'base64url').toString('utf8'),'Mit dem Rad, mit dem Zug.mp3');
 assert.equal(drafts.tracks.find(x=>x.assignmentKey==='A2-4.11').lyrics,pack.lyrics);
 assert.equal(lessons[id].lyrics,pack.lyrics);
 assert.equal(pack.recordingSha256,'208e3be5013d24a27c17d51b5d5f574fffd9e0df28af6a118a87ec1baef59d1d');
 assert.equal(pack.duration,141.6);
 assert.equal(pack.strictRecordingLyrics,true);
 assert.deepEqual(pack.cues,[],'Do not invent lyric timestamps');
 assert.equal(validateLyrics(pack,key).cues.length,0);
});
test('A2 Day 11 lyrics match the song structure and lesson questions',()=>{
 const lyrics=pack.lyrics;
 assert.equal((lyrics.match(/\\[Chorus\\]/g)||[]).length,2);
 assert.equal((lyrics.match(/\\[Verse/g)||[]).length,2);
 assert.ok(lyrics.startsWith('[Intro]\\nMit dem Rad, mit dem Zug.'));
 assert.match(lyrics,/Am Nachmittag nehme ich den Zug,/);
 assert.match(lyrics,/Am Bahnhof wartest du auf mich,/);
 assert.doesNotMatch(lyrics,/Ben fährt jeden Morgen zur Arbeit/);
 const sections=[...lyrics.matchAll(/\\[(Verse 1|Verse 2|Chorus|Outro)\\]\\n([^[]*)/g)].map(m=>({label:m[1],lines:m[2].trim().split('\\n').filter(Boolean)}));
 assert.deepEqual(sections.map(x=>x.lines.length),[4,3,8,4,4]);
 const sung=lyricLines(lyrics);
 for(const q of lessons[id].questions.filter(q=>q.type==='listening'))
   assert.ok(sung.includes(q.evidence),'Question must match recorded line: '+q.evidence);
});
test('A2 Day 11 API returns unsynchronized approved lyrics when no R2 timing sidecar exists',async()=>{
 const handler=createLyricsHandler({env,fetchImpl:async()=>new Response('',{status:404})});
 const response=res();
 await handler({method:'GET',query:{track:id}},response);
 assert.equal(response.code,200);
 assert.equal(response.body.lyrics,pack.lyrics);
 assert.equal(response.body.cues.length,0);
 assert.equal(response.body.timingStatus,'missing');
});
test('A2 Day 11 rejects mismatched old R2 lyrics for the replaced song',async()=>{
 const stale={objectKey:key,lyrics:pack.lyrics.replace('Am Morgen fahre ich mit dem Rad,','Ben fährt jeden Morgen mit dem Bus,'),cues:[]};
 const handler=createLyricsHandler({env,fetchImpl:async()=>new Response(JSON.stringify(stale))});
 const response=res();
 await handler({method:'GET',query:{track:id}},response);
 assert.equal(response.code,200);
 assert.equal(response.body.lyrics,pack.lyrics);
});
