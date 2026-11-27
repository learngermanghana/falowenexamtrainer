import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const catalog=require('../web/public/music/catalog.json');
const {musicTrackFromKey,musicKeyFromAutoId}=require('../server/musicDiscovery.cjs');
const {createLyricsHandler}=require('../server/musicLyrics.cjs');
const key='music/a2/day-11/Wieder zu spät.mp3';
const oldKey='music/a2/day-11/Mit dem Rad, mit dem Zug.mp3';

test('A2 Day 11 uses the replacement and retires the old public recording',()=>{
 const tracks=catalog.tracks.filter(x=>x.level==='A2' && x.day===11 && x.coursebook && !x.retired);
 assert.equal(tracks.length,1);
 const song=tracks[0]; assert.equal(song.objectKey,key); assert.equal(song.assignmentKey,'A2-4.11');
 assert.equal(song.title,'Mein Zug kommt zu spät');
 assert.equal(musicTrackFromKey(key).id,song.id);
 assert.equal(musicKeyFromAutoId(song.id),key);
 assert.equal(musicTrackFromKey(oldKey),null);
 const oldId='r2-a2-day-11-b64_'+Buffer.from('Mit dem Rad, mit dem Zug.mp3').toString('base64url');
 assert.equal(musicKeyFromAutoId(oldId),'');
});
test('replacement offers exact German and English reference lyrics with no invented timing',async()=>{
 const song=catalog.tracks.find(x=>x.objectKey===key);
 let status,body; const res={setHeader(){},status(n){status=n;return this},json(data){body=data;return this}};
 await createLyricsHandler({env:{},fetchImpl:async()=>{throw Error('offline')}})({method:'GET',query:{track:song.id}},res);
 assert.equal(status,200); assert.equal(body.objectKey,key); assert.equal(body.referenceOnly,true);
 assert.deepEqual(body.cues,[]); assert.match(body.lyrics,/Mein Zug hat Verspätung/);
 assert.equal(body.englishTranslation.source,'course-draft'); assert.equal(body.englishTranslation.lines.length,26);
});
