import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { matchingEnglishTranslation, sungGermanLines } from '../web/public/music/english-translations.js';

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const translated=read('web/public/music/english-translations.json');
const recorded=[
 ...read('web/public/music/approved-recording-lyrics.json').recordings,
 ...read('web/public/music/timings.json').recordings,
];
test('offline English translations exactly match published recording lyric lines, not drafts',()=>{
 assert.ok(translated.recordings.length>=8);
 const keys=new Set();
 let count=0;
 for(const row of translated.recordings){
  assert.ok(!keys.has(row.objectKey)); keys.add(row.objectKey);
  const published=recorded.find(x=>x.objectKey===row.objectKey);
  assert.ok(published,'no exact owner-approved song for '+row.objectKey);
  const match=matchingEnglishTranslation(translated,row.objectKey,published.lyrics);
  assert.equal(match,row);
  assert.equal(row.lines.length,sungGermanLines(published.lyrics).length);
  assert.ok(row.vocabulary.length>0);
  count+=row.lines.length;
 }
 assert.ok(count>=200);
 assert.equal(keys.size,translated.recordings.length);
});
test('never attach translation to a changed lyric, different MP3 or a partial translation',()=>{
 const row=translated.recordings[0];
 const lyrics=row.lines.map(x=>x.de).join('\n');
 assert.ok(matchingEnglishTranslation(translated,row.objectKey,lyrics));
 assert.equal(matchingEnglishTranslation(translated,'music/a1/day-09/Der kleine Hund.mp3',lyrics),null);
 assert.equal(matchingEnglishTranslation(translated,row.objectKey,lyrics.replace(row.lines[0].de,'Different sung words.')),null);
 assert.equal(matchingEnglishTranslation({recordings:[{...row,lines:row.lines.slice(1)}]},row.objectKey,lyrics),null);
 assert.equal(matchingEnglishTranslation({recordings:[{...row,lines:row.lines.map((x,i)=>i?x:{...x,en:''})}]},row.objectKey,lyrics),null);
});
test('both public listening and workbook use matching published words, with level defaults',()=>{
 const publicApp=readFileSync('web/public/music/app.js','utf8');
 const workbook=readFileSync('web/src/components/WorkbookDayMusic.jsx','utf8');
 const template=readFileSync('web/public/music/index.html','utf8');
 assert.match(template,/id="show-english"/);
 assert.match(publicApp,/matchingEnglishTranslation\(/);
 assert.match(publicApp,/!lesson.referenceOnly/);
 assert.match(publicApp,/track.level === "A1"/);
 assert.match(publicApp,/\.english-line/);
 assert.match(workbook,/matchingEnglishTranslation\(/);
 assert.match(workbook,/courseLevel === "A1"/);
 assert.match(workbook,/data-english-line/);
 assert.match(workbook,/English translation is not available/);
 assert.match(publicApp,/fetch\("\/music\/english-translations.json"/);
 assert.match(workbook,/getJson\("\/music\/english-translations.json"\)/);
});
