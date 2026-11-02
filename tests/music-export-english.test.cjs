const test=require('node:test');
const assert=require('node:assert/strict');
const {withEnglishTranslation,createLyricsHandler}=require('../server/musicLyrics.cjs');
const translations=require('../web/public/music/english-translations.json');
test('every published translation resolves by exact MP3 path and German lines, without titles',()=>{
 for(const row of translations.recordings){
  const pack={objectKey:row.objectKey,lyrics:row.lines.map(x=>x.de).join('\n'),cues:[]};
  assert.equal(withEnglishTranslation(pack).englishTranslation.lines.length,row.lines.length);
  assert.equal(withEnglishTranslation({...pack,objectKey:'music/b1/day-28/Other.mp3'}).englishTranslation,undefined);
  assert.equal(withEnglishTranslation({...pack,lyrics:pack.lyrics+'\nChanged words'}).englishTranslation,undefined);
 }
});
test('draft English resolves by path and exact wording, remains labeled and never supplies automatic transcript drafts',()=>{
 const row=translations.drafts.find(x=>x.objectKey==='music/b1/day-02/Freundschaft am Fluss.mp3');
 const pack={objectKey:row.objectKey,lyrics:row.lines.map(x=>x.de).join('\n'),referenceOnly:true};
 assert.equal(withEnglishTranslation(pack).englishTranslation.source,'course-draft');
 assert.equal(withEnglishTranslation({...pack,transcriptionStatus:'automatic'}).englishTranslation,undefined);
 assert.equal(withEnglishTranslation({...pack,lyrics:'Different recording words'}).englishTranslation,undefined);
});
test('lyrics API delivers B1 Day 2 English with its existing timed fallback',async()=>{
 const handler=createLyricsHandler({env:{}});
 const res={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
 await handler({method:'GET',query:{key:'music/b1/day-02/Freundschaft am Fluss.mp3'}},res);
 assert.equal(res.code,200);
 assert.equal(res.body.englishTranslation.lines.length,17);
 assert.equal(res.body.cues.length,17);
 assert.equal(res.body.timingStatus,'estimated');
});
