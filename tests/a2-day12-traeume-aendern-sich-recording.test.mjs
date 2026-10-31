import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { musicTrackFromKey } = require('../server/musicDiscovery.cjs');
const { createLyricsHandler, validateLyrics } = require('../server/musicLyrics.cjs');
const read = path => JSON.parse(readFileSync(path,'utf8'));
const catalog = read('web/public/music/catalog.json');
const approved = read('web/public/music/approved-recording-lyrics.json');
const drafts = read('web/public/music/studio-drafts.json');
const key = 'music/a2/day-12/Träume ändern sich.mp3';
const id = 'r2-a2-day-12-b64_VHLDpHVtZSDDpG5kZXJuIHNpY2gubXAz';
const pack = approved.recordings.find(x=>x.objectKey===key);
const env = {R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test',R2_SECRET_ACCESS_KEY:'test',R2_AUDIO_BUCKET:'test-audio'};
const res = () => ({statusCode:200,setHeader(){return this},status(code){this.statusCode=code;return this},json(body){this.body=body;return this}});

test('Day 12 public catalog and public draft use the exact owner-approved MP3 and song',()=>{
 const track=catalog.tracks.find(x=>x.assignmentKey==='A2-5.12');
 assert.equal(track.title,'Träume ändern sich');
 assert.equal(track.id,id);
 assert.equal(track.objectKey,key);
 assert.equal(track.approved,true);
 assert.equal(musicTrackFromKey(key).id,id);
 assert.equal(musicTrackFromKey(key).title,'Träume ändern sich');
 const draft=drafts.tracks.find(x=>x.assignmentKey==='A2-5.12');
 assert.equal(draft.title,track.title);
 assert.equal(draft.lyrics,pack.lyrics);
 assert.equal(pack.recordingSha256,'3a0fa44ba3a83261bda42fa23e0759bcda6ba7c518e6af9e35960e80563de281');
 assert.equal(pack.duration,113.232);
});

test('The sung 8/4/8/4/4 lyrics match Day 12 and do not fabricate timings',()=>{
 const sections=[...pack.lyrics.matchAll(/\\[(Verse 1|Verse 2|Chorus|Outro)\\]([\\s\\S]*?)(?=\\[(?:Verse 1|Verse 2|Chorus|Outro)\\]|$)/g)];
 assert.deepEqual(sections.map(x=>x[1]),['Verse 1','Chorus','Verse 2','Chorus','Outro']);
 assert.deepEqual(sections.map(x=>x[2].split(/\\r?\\n/).map(y=>y.trim()).filter(Boolean).length),[8,4,8,4,4]);
 assert.match(pack.lyrics,/Als Kind wollte ich Pilot werden,/);
 assert.match(pack.lyrics,/Jetzt interessiert mich die Medizin,/);
 assert.match(pack.lyrics,/weil jeder Traum sich ändern kann\\./);
 assert.match(pack.lyrics,/Bei Falowen sprechen wir von Träumen,/);
 assert.doesNotMatch(pack.lyrics,/Dein Weg beginnt mit einem kleinen Schritt/);
 assert.equal(pack.timingStatus,'missing');
 assert.deepEqual(pack.cues,[]);
 assert.equal(validateLyrics(pack,key).lyrics,pack.lyrics);
});

test('Public lyrics endpoint serves exact Day 12 lyrics if no sidecar exists',async()=>{
 const handler=createLyricsHandler({env,fetchImpl:async()=>new Response('',{status:404})});
 const response=res();
 await handler({method:'GET',query:{track:id}},response);
 assert.equal(response.statusCode,200);
 assert.equal(response.body.lyrics,pack.lyrics);
 assert.equal(response.body.objectKey,key);
 assert.equal(response.body.source,'owner-supplied');
 assert.equal(response.body.timingStatus,'missing');
 assert.deepEqual(response.body.cues,[]);
});

test('An outdated R2 sidecar cannot replace the owner-approved recording',async()=>{
 const stale={objectKey:key,lyrics:'[Verse 1]\\nAls Kind wollte ich Pilot werden.\\nHeute interessiere ich mich für Medizin.',cues:[]};
 const handler=createLyricsHandler({env,fetchImpl:async()=>new Response(JSON.stringify(stale))});
 const response=res();
 await handler({method:'GET',query:{key}},response);
 assert.equal(response.statusCode,200);
 assert.equal(response.body.lyrics,pack.lyrics);
 assert.equal(response.body.timingStatus,'missing');
});
