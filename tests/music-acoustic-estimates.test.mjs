import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {validateCues,activeLyricIndex} from '../web/public/music/lyrics-timing.js';
import {resolveRecordingLesson} from '../web/public/music/lesson-content.js';
import {matchingDraftEnglishTranslation} from '../web/public/music/english-translations.js';
const require=createRequire(import.meta.url);
const {validateEstimate,createLyricsHandler}=require('../server/musicLyrics.cjs');
const estimates=require('../web/public/music/estimated-timings.json');
const english=require('../web/public/music/english-translations.json');
const pack=estimates.recordings.find(p=>p.objectKey==='music/b1/day-02/Freundschaft am Fluss.mp3');
const res=()=>({setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}});
test('B1 Day 2 follows actual acoustic cue windows, with intro and instrumental gaps left clear',()=>{
 assert.equal(pack.objectKey,'music/b1/day-02/Freundschaft am Fluss.mp3');
 const checked=validateEstimate(pack,pack.objectKey,null);
 assert.ok(checked?.referenceOnly);
 const cues=validateCues(checked.cues,checked.lyrics);
 assert.equal(cues.length,17);
 assert.equal(activeLyricIndex(cues,0),-1);
 for(let i=0;i<cues.length;i++)assert.equal(activeLyricIndex(cues,(cues[i].start+cues[i].end)/2),i);
 assert.equal(activeLyricIndex(cues,55),-1);
 assert.equal(activeLyricIndex(cues,0),-1,'repeat clears the last highlight');
 assert.equal(resolveRecordingLesson({id:pack.trackId,objectKey:pack.objectKey},{},[],checked),null);
 assert.ok(matchingDraftEnglishTranslation(english,{objectKey:pack.objectKey,level:'B1',day:2},checked));
});
test('estimates reject changed lyrics, keys, weak acoustic matches and overlapping boundaries',()=>{
 for(const bad of [{...pack,recordingSha256:''},{...pack,lyrics:pack.lyrics+'\nExtra words'},
  {...pack,matchCoverage:.69},{...pack,weakestLineCoverage:.44},
  {...pack,cues:pack.cues.map((c,i)=>i===1?{...c,start:pack.cues[0].start+.01}:c)}])
  assert.equal(validateEstimate(bad,pack.objectKey,null),null);
 assert.equal(validateEstimate(pack,'music/b1/day-03/Freundschaft am Fluss.mp3',null),null);
});
test('API serves an explicit estimate without pretending the draft words were approved',async()=>{
 const r=res();await createLyricsHandler({fetchImpl:async()=>new Response('',{status:404})})({method:'GET',query:{key:pack.objectKey}},r);
 assert.equal(r.code,200);assert.equal(r.body.source,'acoustic-estimate');
 assert.equal(r.body.timingStatus,'estimated');assert.equal(r.body.referenceOnly,true);
 assert.equal(r.body.cues.length,17);
});

test('all course timing drafts validate without promoting automatic transcripts to approved lyrics',()=>{
 const approved=require('../web/public/music/approved-recording-lyrics.json');
 assert.equal(estimates.recordings.length,49);
 assert.equal(estimates.recordings.filter(p=>p.transcriptionStatus==='automatic').length,25);
 const keys=new Set();
 for(const row of estimates.recordings){
  assert.ok(!keys.has(row.objectKey));keys.add(row.objectKey);
  const checked=validateEstimate(row,row.objectKey,approved.recordings.find(p=>p.objectKey===row.objectKey));
  assert.ok(checked,row.objectKey);
  assert.equal(checked.cues.length,validateCues(checked.cues,checked.lyrics).length);
  if(row.transcriptionStatus==='automatic'){
   assert.equal(checked.referenceOnly,true);
   assert.equal(checked.transcriptionStatus,'automatic');
   assert.equal(validateEstimate({...row,lyrics:row.lyrics+' Extra'},row.objectKey,null),null);
  }
 }
});

test('the complete current library has timing coverage: 65 course recordings plus two class songs',()=>{
 const manifest=require('../web/public/music/timing-coverage.json');
 const known=[...require('../web/public/music/timings.json').recordings,
  ...require('../web/public/music/approved-recording-lyrics.json').recordings,
  ...estimates.recordings];
 const drafts=require('../web/public/music/studio-drafts.json').tracks;
 const classes=require('../web/public/music/class-timings.json').recordings;
 assert.equal(manifest.courseRecordings.length,65);
 for(const track of manifest.courseRecordings){
  const pack=known.find(p=>p.objectKey===track.objectKey && validateCues(p.cues,p.lyrics).length)
    || drafts.find(p=>p.recordingObjectKey===track.objectKey && validateCues(p.cues,p.lyrics).length);
  assert.ok(pack,track.objectKey+' is missing complete line timing');
 }
 assert.deepEqual(new Set(classes.map(p=>p.trackId)),new Set(manifest.classTrackIds));
 for(const pack of classes)assert.equal(validateCues(pack.cues,pack.lyrics).length,pack.cues.length);
});
