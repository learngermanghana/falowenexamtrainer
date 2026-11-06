import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {matchingTranscriptEnglishTranslation} from '../web/public/music/english-translations.js';
const require=createRequire(import.meta.url);
const english=require('../web/public/music/english-translations.json');
const estimates=require('../web/public/music/estimated-timings.json');
const {withEnglishTranslation,createLyricsHandler}=require('../server/musicLyrics.cjs');
const key='music/a2/day-23/Fahrrad zur Schule.mp3';
const pack=estimates.recordings.find(row=>row.objectKey===key);
test('Day 23 has English for every displayed automatic transcript line, bound to recording fingerprint',()=>{
 const row=matchingTranscriptEnglishTranslation(english,{objectKey:key},pack);
 assert.ok(row);
 assert.equal(row.lines.length,36);
 const result=withEnglishTranslation(pack);
 assert.equal(result.englishTranslation.source,'automatic-transcript');
 assert.deepEqual(result.englishTranslation.lines,row.lines);
 assert.equal(result.lyrics,pack.lyrics);
 assert.deepEqual(result.cues,pack.cues);
 for(const changed of [{...pack,recordingSha256:'0'.repeat(64)},
  {...pack,lyrics:pack.lyrics+'\nChanged'}, {...pack,objectKey:key+'.other'}]){
  assert.equal(matchingTranscriptEnglishTranslation(english,{objectKey:changed.objectKey},changed),null);
  assert.equal(withEnglishTranslation(changed).englishTranslation,undefined);
 }
});
test('lyrics API exposes translated Day 23 without promoting automatic text or estimated timings',async()=>{
 const response={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
 await createLyricsHandler({fetchImpl:async()=>new Response('',{status:404})})({method:'GET',query:{key}},response);
 assert.equal(response.code,200);
 assert.equal(response.body.englishTranslation.lines.length,36);
 assert.equal(response.body.referenceOnly,true);
 assert.equal(response.body.transcriptionStatus,'automatic');
 assert.equal(response.body.timingStatus,'estimated');
});
