import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { matchingEnglishTranslation, matchingDraftEnglishTranslation, sungGermanLines } from '../web/public/music/english-translations.js';

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const translated=read('web/public/music/english-translations.json');
const recorded=[
 ...read('web/public/music/approved-recording-lyrics.json').recordings,
 ...read('web/public/music/timings.json').recordings,
];
test('offline English translations exactly match published recording lyric lines, not drafts',()=>{
 assert.equal(translated.recordings.length,19);
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
 assert.equal(count,564);
 assert.equal(keys.size,translated.recordings.length);
 const publishedKeys=new Set(recorded.map(x=>x.objectKey));
 assert.deepEqual(keys,publishedKeys,'all owner-reviewed recording packs have English translations');
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
 assert.match(publicApp,/matchingDraftEnglishTranslation\(/);
 assert.match(publicApp,/track.level === "A1"/);
 assert.match(publicApp,/\.english-line/);
 assert.match(workbook,/matchingEnglishTranslation\(/);
 assert.match(workbook,/courseLevel === "A1"/);
 assert.match(workbook,/data-english-line/);
 assert.match(workbook,/English translation is not available/);
 assert.match(publicApp,/fetch\("\/music\/english-translations.json"/);
 assert.match(workbook,/getJson\("\/music\/english-translations.json"\)/);
});

test('B1 Day 4 Ort zum Leben can show English for its exact studio draft without claiming audio verification',()=>{
 const row=translated.drafts.find(x=>x.objectKey==='music/b1/day-04/Ort zum Leben.mp3');
 const studio=read('web/public/music/studio-drafts.json').tracks.find(x=>x.level==='B1'&&x.day===4);
 assert.equal(row.source,'course-draft');
 assert.equal(row.draftTitle,studio.title);
 assert.equal(row.assignmentKey,studio.assignmentKey);
 assert.equal(row.lines.length,17);
 const track={objectKey:row.objectKey,level:'B1',day:4};
 const draft={lyrics:studio.lyrics,assignmentKey:studio.assignmentKey,draftTitle:studio.title,referenceOnly:true};
 assert.equal(matchingDraftEnglishTranslation(translated,track,draft),row);
 assert.equal(matchingEnglishTranslation(translated,row.objectKey,studio.lyrics),null,
  'no draft may masquerade as owner-reviewed recording lyrics');
 assert.equal(matchingDraftEnglishTranslation(translated,{...track,objectKey:'music/b1/day-05/Ort zum Leben.mp3'},draft),null);
 assert.equal(matchingDraftEnglishTranslation(translated,track,{...draft,referenceOnly:false}),null);
 assert.equal(matchingDraftEnglishTranslation(translated,track,{...draft,lyrics:studio.lyrics.replace('Seit Wochen','Seit Tagen')}),null);
 assert.equal(matchingDraftEnglishTranslation(translated,track,{...draft,draftTitle:'Different draft'}),null);
 assert.equal(matchingDraftEnglishTranslation(translated,{...track,level:'A2'},draft),null);
 assert.equal(matchingDraftEnglishTranslation(translated,track,{...draft,assignmentKey:'B1-10.4'}),null);
});
