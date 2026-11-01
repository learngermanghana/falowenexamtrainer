import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { lyricLines, validateCues } from '../web/public/music/lyrics-timing.js';

const require=createRequire(import.meta.url);
const {validateLyrics,createLyricsHandler}=require('../server/musicLyrics.cjs');
const {musicTrackFromKey}=require('../server/musicDiscovery.cjs');
const catalog=require('../web/public/music/catalog.json');
const approved=require('../web/public/music/approved-recording-lyrics.json');
const drafts=require('../web/public/music/studio-drafts.json');
const translations=require('../web/public/music/english-translations.json');

const key='music/a2/day-17/Ich gehe zur Apotheke.mp3';
const id='r2-a2-day-17-b64_SWNoIGdlaGUgenVyIEFwb3RoZWtlLm1wMw';
const track=catalog.tracks.find(row=>row.objectKey===key);
const lyricsPack=approved.recordings.find(row=>row.objectKey===key);

test('A2 Day 17 uses verified existing R2 key and the correct lesson identity',()=>{
 assert.ok(track?.approved);
 assert.equal(track.id,id);
 assert.equal(track.day,17);
 assert.equal(track.level,'A2');
 assert.equal(track.title,'Ich gehe zur Apotheke');
 assert.equal(track.assignmentKey,'A2-6.17');
 const discovered=musicTrackFromKey(key);
 assert.equal(discovered?.id,id);
 assert.equal(discovered?.title,track.title);
 assert.equal(discovered?.assignmentKey,track.assignmentKey);
});

test('owner lyrics contain all 28 sung lines, including each chorus',()=>{
 assert.ok(lyricsPack);
 assert.deepEqual(lyricsPack.lyrics.match(/\[[^\]]+\]/g),[
  '[Verse 1]','[Chorus]','[Verse 2]','[Chorus]','[Outro]'
 ]);
 const sung=lyricLines(lyricsPack.lyrics);
 assert.equal(sung.length,28);
 assert.equal(sung.filter(line=>line==='Ich gehe heute zur Apotheke,').length,2);
 assert.equal(sung.filter(line=>line==='damit es mir bald besser geht.').length,2);
 assert.ok(sung.includes('„Was fehlt Ihnen? Was tut Ihnen weh?“'));
 assert.ok(sung.includes('Ich sage: „Ich habe starke Kopfschmerzen,'));
 assert.equal(lyricsPack.strictRecordingLyrics,true);
 assert.equal(lyricsPack.timingStatus,'missing');
 assert.deepEqual(lyricsPack.cues,[]);
 assert.deepEqual(validateCues(lyricsPack.cues,lyricsPack.lyrics),[]);
});

test('updated studio draft and English lines match exact published German',()=>{
 const draft=drafts.tracks.find(row=>row.level==='A2'&&row.day===17);
 assert.equal(draft.assignmentKey,'A2-6.17');
 assert.equal(draft.title,track.title);
 assert.equal(draft.lyrics,lyricsPack.lyrics);
 assert.equal(draft.recordingObjectKey,key);
 assert.doesNotMatch(draft.lyrics,/Seit gestern habe ich starken Husten/);
 const translation=translations.recordings.find(row=>row.objectKey===key);
 assert.ok(translation);
 assert.deepEqual(translation.lines.map(row=>row.de),lyricLines(lyricsPack.lyrics));
 assert.ok(translation.lines.every(row=>row.en?.trim()));
});

test('lyrics are available without claiming fake karaoke timing or extra network requests',async()=>{
 const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'demo',R2_SECRET_ACCESS_KEY:'demo',R2_AUDIO_BUCKET:'test'};
 const handler=createLyricsHandler({env,fetchImpl:async()=>{throw Error('Unexpected network request')}});
 const res={setHeader(){},status(n){this.statusCode=n;return this},json(v){this.body=v;return this}};
 await handler({method:'GET',query:{key}},res);
 assert.equal(res.statusCode,200);
 assert.equal(res.body.lyrics,lyricsPack.lyrics);
 assert.deepEqual(res.body.cues,[]);
});
