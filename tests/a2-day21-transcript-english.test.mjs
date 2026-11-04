import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createRequire} from 'node:module';
import {matchingTranscriptEnglishTranslation} from '../web/public/music/english-translations.js';
const require=createRequire(import.meta.url),{withEnglishTranslation}=require('../server/musicLyrics.cjs');
const data=JSON.parse(readFileSync('web/public/music/english-translations.json','utf8'));
const estimates=JSON.parse(readFileSync('web/public/music/estimated-timings.json','utf8'));
const row=data.transcripts[0];
function findPack(value){if(value&&typeof value==='object'){if(value.objectKey===row.objectKey && value.lyrics)return value;for(const child of Object.values(value)){const hit=findPack(child);if(hit)return hit;}}}
const pack=findPack(estimates);
test('Day 21 automatic English matches all displayed German lines and the recording fingerprint',()=>{
 assert.ok(pack);assert.equal(row.lines.length,41);
 const source={...pack,transcriptionStatus:'automatic',referenceOnly:true};
 assert.equal(matchingTranscriptEnglishTranslation(data,{objectKey:row.objectKey},source),row);
 assert.equal(withEnglishTranslation(source).englishTranslation?.source,'automatic-transcript');
 for(const altered of [{...source,lyrics:source.lyrics+'\nDifferent'},{...source,recordingSha256:'0'.repeat(64)},{...source,objectKey:'music/a2/day-22/other.mp3'}]){
  assert.equal(matchingTranscriptEnglishTranslation(data,{objectKey:row.objectKey},altered),null);
  assert.equal(withEnglishTranslation(altered).englishTranslation,undefined);
 }
});
