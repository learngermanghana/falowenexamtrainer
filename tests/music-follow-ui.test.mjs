import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {JSDOM}=createRequire(new URL('./music-ui/package.json',import.meta.url))('jsdom');
import {buildPlaybackQueue} from '../web/public/music/playback-queue.js';
import {lyricLines,validateCues,activeLyricIndex} from '../web/public/music/lyrics-timing.js';
import {resolveRecordingLesson} from '../web/public/music/lesson-content.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const recordings=JSON.parse(read('web/public/music/timings.json')).recordings;
async function room(track,pack){
 const dom=new JSDOM(read('web/public/music/index.html'),{url:'https://music.falowen.app/?track='+track.id,runScripts:'outside-only'});
 const w=dom.window;
 Object.assign(w,{buildPlaybackQueue,lyricLines,validateCues,activeLyricIndex,resolveRecordingLesson,
  matchMedia:()=>({matches:true}),fetch:async url=>({ok:!!(!String(url).startsWith('/api/music-lyrics')||pack),json:async()=>String(url).includes('music-lyrics')?pack:String(url).includes('music-library')?{ok:true,tracks:[track]}:String(url).includes('catalog.json')?{tracks:[]}:String(url).includes('studio-drafts')?{tracks:[{...track,lyrics:'Draft lyrics are different'}]}:{lessons:{}}})});
 const a=w.document.getElementById('audio');
 a.play=()=>Promise.resolve(); a.pause=()=>{};a.load=()=>{};Object.defineProperty(a,'readyState',{value:1});
 w.eval(read('web/public/music/app.js').replace(/^import .*;\n/gm,''));
 for(let i=0;i<8;i++)await new Promise(r=>setImmediate(r));
 return {w,a,dom,click:id=>w.document.getElementById(id).click()};
}
for(const [level,day] of [['A1',4],['A2',18],['B1',24],['A1',14]])test(level+' Day '+day+' public music follows exact cues, seeks, repeats and marks quiz answers',async()=>{
 const pack=recordings.find(p=>p.objectKey.startsWith('music/'+level.toLowerCase()+'/day-'+String(day).padStart(2,'0')+'/'));
 const track={id:'r2-test-'+level,level,day,title:'Test '+level,objectKey:pack.objectKey,autoDiscovered:true,coursebook:true,audioUrl:'https://www.falowen.app/api/music?track=r2-test-'+level};
 const {w,a,dom,click}=await room(track,pack);const d=w.document;
 d.querySelector('[data-tab="lyrics"]').click();
 assert.equal(d.getElementById('follow-lyrics').disabled,false);
 const root=d.getElementById('lyrics-text');let scrolls=0;
 Object.defineProperty(root,'clientHeight',{value:100});root.getBoundingClientRect=()=>({top:0});
 root.scrollTo=({top})=>{scrolls++;root.scrollTop=top;};
 root.querySelectorAll('.lyric-line').forEach((line,i)=>{line.getBoundingClientRect=()=>({top:i*50-root.scrollTop});Object.defineProperty(line,'offsetHeight',{value:40});});
 for(const index of [0,Math.min(4,pack.cues.length-1),1]){
  a.currentTime=pack.cues[index].start+0.01;a.dispatchEvent(new w.Event('timeupdate'));
  assert.equal(root.querySelector('[aria-current="true"]').dataset.line,String(index));
 }
 assert.ok(scrolls>0,'follow scrolls the lyric container');
 click('follow-lyrics'); const before=scrolls;
 a.currentTime=pack.cues.at(-1).start+0.01;a.dispatchEvent(new w.Event('seeked'));assert.equal(scrolls,before);
 click('follow-lyrics');assert.ok(scrolls>before,'enabling follow scrolls without needing a new cue');
 root.querySelector('[data-line="1"]').click();assert.equal(a.currentTime,pack.cues[1].start);
 a.currentTime=0;a.dispatchEvent(new w.Event('seeked'));assert.equal(root.querySelector('[aria-current="true"]'),null);
 d.querySelector('[data-tab="practice"]').click();assert.equal(d.getElementById('detail-practice').hidden,false);
 const lesson=resolveRecordingLesson(track,{},[],pack);
 const groups=d.querySelectorAll('#listening-questions fieldset');assert.equal(groups.length,2);
 groups.forEach((g,i)=>{g.querySelectorAll('input')[lesson.questions[i].correctIndex].checked=true;});
 click('check-answers');assert.match(d.getElementById('practice-feedback').textContent,/2 of 2 correct/);
 dom.window.close();
});
test('Day14 without recording timings cannot advertise working Follow or a dead questions button',async()=>{
 const track={id:'r2-a1-day-14',title:'Einsteigen',level:'A1',day:14,autoDiscovered:true,coursebook:true,objectKey:'music/a1/day-14/Einsteigen.mp3',audioUrl:'https://www.falowen.app/api/music?track=r2-a1-day-14'};
 const {w,dom}=await room(track,null);const d=w.document;d.querySelector('[data-tab="lyrics"]').click();
 assert.equal(d.getElementById('follow-lyrics').disabled,true);assert.equal(d.getElementById('follow-lyrics').checked,false);
 assert.equal(d.getElementById('lyrics-next').hidden,true);dom.window.close();
});
