import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { lyricLines, validateCues, activeLyricIndex } from '../web/public/music/lyrics-timing.js';

const require=createRequire(import.meta.url);
const {validateLyrics,createLyricsHandler}=require('../server/musicLyrics.cjs');
const {musicTrackFromKey}=require('../server/musicDiscovery.cjs');
const catalog=require('../web/public/music/catalog.json');
const approved=require('../web/public/music/approved-recording-lyrics.json');
const studio=require('../web/public/music/studio-drafts.json');
const translations=require('../web/public/music/english-translations.json');

const key='music/a2/day-18/Ein neues Leben.mp3';
const id='r2-a2-day-18-b64_RWluIG5ldWVzIExlYmVuLm1wMw';
const hash='43a22c6d964966f63cd0bf31439d7e2c3273adce14ad5002fe7c582156aadc06';
const pack=approved.recordings.find(x=>x.objectKey===key);
const track=catalog.tracks.find(x=>x.id===id);

test('A2 Day 18 promotes Ein neues Leben without altering older banking audio',()=>{
  assert.ok(pack);
  assert.ok(track?.approved);
  assert.equal(track.objectKey,key);
  assert.equal(track.title,'Ein neues Leben');
  assert.equal(track.level,'A2');
  assert.equal(track.day,18);
  assert.equal(track.assignmentKey,'A2-7.18');
  assert.ok(track.coursebook&&track.slides&&track.attendance);
  assert.equal(musicTrackFromKey(key).id,id);
  assert.equal(musicTrackFromKey(key).title,'Ein neues Leben');
  assert.equal(musicTrackFromKey(key).assignmentKey,'A2-7.18');
  assert.equal(pack.duration,134.24);
  assert.equal(pack.recordingSha256,hash);
  assert.equal(pack.timingStatus,'estimated');
  const legacy=catalog.tracks.find(x=>x.id==='a2-day-18-bank');
  assert.ok(legacy?.approved);
  assert.equal(legacy.objectKey,'music/a2/day-18/die-karte-funktioniert-nicht.mp3');
  assert.equal(legacy.retired,true);
  assert.equal(legacy.slides,false);
  assert.equal(legacy.coursebook,true); // retained for legacy signed playback, hidden by retired flag
  assert.equal(catalog.tracks.filter(x=>x.slides===true).length,3);
  assert.equal(catalog.tracks.filter(x=>x.level==='A2'&&x.day===18&&x.slides===true).length,1);
  assert.ok(require('../web/public/music/timings.json').recordings.some(x=>x.trackId==='a2-day-18-bank'));
  const app=readFileSync('web/public/music/app.js','utf8');
  assert.match(app,/filter\(row => row\.retired !== true\)/);
});

test('all 28 exact song lines have unique ordered estimated cue windows',()=>{
 const sections=pack.lyrics.match(/\[[^\]]+\]/g);
 assert.deepEqual(sections,['[Verse 1]','[Chorus]','[Verse 2]','[Chorus]','[Outro]']);
 const lines=lyricLines(pack.lyrics);
 assert.equal(lines.length,28);
 assert.equal(pack.cues.length,28);
 assert.deepEqual(validateCues(pack.cues,pack.lyrics),pack.cues);
 assert.deepEqual(validateLyrics(pack,key)?.cues,pack.cues);
 assert.equal(lines.filter(x=>x==='Ein neues Land, ein neues Leben,').length,2);
 assert.equal(lines.filter(x=>x==='und finde meinen Weg hier in Deutschland.').length,2);
 let end=-1;
 for(const c of pack.cues){
   assert.ok(c.start>end);
   assert.ok(c.end>c.start && c.end<=pack.duration);
   end=c.end;
 }
 assert.equal(activeLyricIndex(pack.cues,0),-1);
 assert.equal(activeLyricIndex(pack.cues,52),-1);
 assert.equal(activeLyricIndex(pack.cues,110),-1);
 assert.equal(activeLyricIndex(pack.cues,133),-1);
});

test('new lyrics and English align to studio draft without changing original exercises',()=>{
 const draft=studio.tracks.find(x=>x.level==='A2'&&x.day===18);
 assert.equal(draft.title,'Ein neues Leben');
 assert.equal(draft.assignmentKey,'A2-7.18');
 assert.equal(draft.lyrics,pack.lyrics);
 assert.equal(draft.recordingObjectKey,key);
 assert.equal(draft.recordingSha256,hash);
 assert.doesNotMatch(draft.lyrics,/Heute möchte ich mit meiner Karte bezahlen/);
 const translated=translations.recordings.find(x=>x.objectKey===key);
 assert.deepEqual(translated.lines.map(x=>x.de),lyricLines(pack.lyrics));
 assert.ok(translated.lines.every(x=>typeof x.en==='string'&&x.en.trim()));
 assert.ok(translations.recordings.some(x=>x.objectKey==='music/a2/day-18/die-karte-funktioniert-nicht.mp3'));
});

test('published lyrics API serves exact song cues without new R2 requests',async()=>{
 const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'demo',R2_SECRET_ACCESS_KEY:'demo',R2_AUDIO_BUCKET:'demo'};
 const handler=createLyricsHandler({env,fetchImpl:async()=>{throw Error('Unexpected R2 lyrics lookup')}});
 const res={setHeader(){},status(n){this.statusCode=n;return this},json(v){this.body=v;return this}};
 await handler({method:'GET',query:{track:id}},res);
 assert.equal(res.statusCode,200);
 assert.equal(res.body.lyrics,pack.lyrics);
 assert.deepEqual(res.body.cues,pack.cues);
});
