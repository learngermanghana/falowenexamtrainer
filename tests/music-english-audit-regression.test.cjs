const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createLyricsHandler} = require('../server/musicLyrics.cjs');
async function lyrics(key){let status,body;const res={setHeader(){},status(x){status=x;return this},json(x){body=x;return this}};await createLyricsHandler({env:{},fetchImpl:async()=>{throw Error('offline')}})({method:'GET',query:{key}},res);assert.equal(status,200);return body;}
test('C1 Day 1 draft has exact-line English but no fabricated synchronization',async()=>{
 const p=await lyrics('music/c1/day-01/Lernen mit Verstand.mp3');
 assert.equal(p.referenceOnly,true); assert.deepEqual(p.cues,[]); assert.equal(p.englishTranslation.source,'course-draft');
 const lines=p.lyrics.split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!/^\[.*\]$/.test(x));
 assert.deepEqual(p.englishTranslation.lines.map(x=>x.de),lines);assert.equal(lines.length,56);
});
test('B1 Day 4 workbook can use the matching draft English and its pre-existing estimated cues',async()=>{
 const p=await lyrics('music/b1/day-04/Ort zum Leben.mp3');
 assert.equal(p.referenceOnly,true);assert.equal(p.timingStatus,'estimated');assert.equal(p.cues.length,17);
 assert.equal(p.englishTranslation.lines.length,17);assert.equal(p.englishTranslation.source,'course-draft');
});
