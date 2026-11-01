import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {JSDOM}=createRequire(new URL('./music-ui/package.json',import.meta.url))('jsdom');
import {buildPlaybackQueue} from '../web/public/music/playback-queue.js';
import {lyricLines,validateCues,activeLyricIndex} from '../web/public/music/lyrics-timing.js';
import {resolveRecordingLesson} from '../web/public/music/lesson-content.js';
import {approximateScrollTop} from '../web/public/music/follow-lyrics.js';
import {matchingEnglishTranslation,matchingDraftEnglishTranslation} from '../web/public/music/english-translations.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const recordings=JSON.parse(read('web/public/music/timings.json')).recordings;
async function room(track,pack,{studio=null,translations=null}={}){
 const dom=new JSDOM(read('web/public/music/index.html'),{url:'https://music.falowen.app/?track='+track.id,runScripts:'outside-only'});
 const w=dom.window;
 Object.assign(w,{buildPlaybackQueue,lyricLines,validateCues,activeLyricIndex,resolveRecordingLesson,approximateScrollTop,matchingEnglishTranslation,matchingDraftEnglishTranslation,
  matchMedia:()=>({matches:true}),fetch:async url=>({ok:!!(!String(url).startsWith('/api/music-lyrics')||pack),json:async()=>String(url).includes('music-lyrics')?pack:String(url).includes('music-library')?{ok:true,tracks:[track]}:String(url).includes('catalog.json')?{tracks:[]}:String(url).includes('studio-drafts')?{tracks:studio||[{...track,lyrics:'Draft lyrics are different'}]}:String(url).includes('english-translations')?(translations||{recordings:[],drafts:[]}):{lessons:{}}})});
 const a=w.document.getElementById('audio');
 a.play=()=>Promise.resolve(); a.pause=()=>{};a.load=()=>{};Object.defineProperty(a,'readyState',{value:1});
 w.eval(read('web/public/music/app.js').replace(/^import .*;\n/gm,''));
 for(let i=0;i<8;i++)await new Promise(r=>setImmediate(r));
 return {w,a,dom,click:id=>w.document.getElementById(id).click()};
}
for(const [level,day] of [['A2',18],['B1',24],['A1',14],['A1',13]])test(level+' Day '+day+' public music follows exact cues, seeks, repeats and marks quiz answers',async()=>{
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
 click('lyrics-next');assert.equal(d.getElementById('detail-practice').hidden,false);
 const lesson=resolveRecordingLesson(track,{},[],pack);
 const groups=d.querySelectorAll('#listening-questions fieldset');assert.equal(groups.length,2);
 groups.forEach((g,i)=>{g.querySelectorAll('input')[lesson.questions[i].correctIndex].checked=true;});
 click('check-answers');assert.match(d.getElementById('practice-feedback').textContent,/2 of 2 correct/);
 groups[0].querySelectorAll('input')[(lesson.questions[0].correctIndex+1)%3].checked=true;
 click('check-answers');assert.match(d.getElementById('practice-feedback').textContent,/1 of 2 correct/);
 dom.window.close();
});
test('untimed A1 recording still permits approximate page follow without pretending line cues exist',async()=>{
 const track={id:'r2-a1-day-14',title:'Einsteigen',level:'A1',day:14,autoDiscovered:true,coursebook:true,objectKey:'music/a1/day-14/Einsteigen.mp3',audioUrl:'https://www.falowen.app/api/music?track=r2-a1-day-14'};
 const {w,a,dom}=await room(track,null);const d=w.document;d.querySelector('[data-tab="lyrics"]').click();
 const root=d.getElementById('lyrics-text');
 Object.defineProperty(root,'scrollHeight',{value:1000,configurable:true});
 Object.defineProperty(root,'clientHeight',{value:300,configurable:true});
 Object.defineProperty(a,'duration',{value:140,configurable:true});
 a.currentTime=70;a.dispatchEvent(new w.Event('timeupdate'));
 assert.equal(d.getElementById('follow-lyrics').disabled,false);
 assert.equal(d.getElementById('follow-lyrics').checked,true);
 assert.match(d.getElementById('follow-label').textContent,/approximate scroll/);
 assert.ok(root.scrollTop>0,'untimed song auto-scrolls the draft with audio progress');
 assert.equal(root.querySelector('[aria-current="true"]'),null,'no fake line highlight');
 const at=root.scrollTop;d.getElementById('follow-lyrics').click();
 a.currentTime=90;a.dispatchEvent(new w.Event('timeupdate'));
 assert.equal(root.scrollTop,at,'listener can disable approximate follow');
 assert.equal(d.getElementById('lyrics-next').hidden,true);dom.window.close();
});

test('B1 Day 4 course draft can follow estimated lines without claiming a verified recording',async()=>{
 const studio=JSON.parse(read('web/public/music/studio-drafts.json')).tracks.find(x=>x.level==='B1'&&x.day===4);
 const row=JSON.parse(read('web/public/music/english-translations.json')).drafts.find(x=>x.objectKey==='music/b1/day-04/Ort zum Leben.mp3');
 const track={id:'r2-b1-day-04-b64_T3J0IHp1bSBMZWJlbi5tcDM',level:'B1',day:4,
  title:'Ort zum Leben',assignmentKey:'',objectKey:row.objectKey,
  autoDiscovered:true,coursebook:true,
  audioUrl:'https://www.falowen.app/api/music?track=r2-b1-day-04-b64_T3J0IHp1bSBMZWJlbi5tcDM'};
 const {w,dom}=await room(track,null,{studio:[studio],translations:{recordings:[],drafts:[row]}});
 const d=w.document;d.querySelector('[data-tab="lyrics"]').click();
 assert.equal(d.getElementById('show-english').disabled,false);
 assert.equal(d.getElementById('show-english').checked,false,'B1 English starts hidden');
 assert.match(d.getElementById('english-status').textContent,/COURSE DRAFT TRANSLATION/);
 assert.match(d.getElementById('lyrics-text').textContent,/Seit Wochen suche ich eine neue Wohnung/);
 assert.match(d.getElementById('lyrics-text').textContent,/not been teacher-verified/);
 assert.match(d.getElementById('follow-label').textContent,/Follow lyrics \(estimated\)/);
 assert.ok(d.querySelectorAll('.english-line').length===17);
 assert.ok([...d.querySelectorAll('.english-line')].every(x=>x.hidden));
 d.getElementById('show-english').click();
 assert.equal(d.getElementById('show-english').checked,true);
 assert.ok([...d.querySelectorAll('.english-line')].every(x=>!x.hidden));
 assert.match(d.getElementById('lyrics-text').textContent,/I have been looking for a new apartment for weeks/);
 assert.equal(studio.cues.length,17,'B1 Day4 was aligned against the real MP3');
 assert.equal(d.querySelectorAll('.lyric-line:disabled').length,0,'estimated cues allow seeking to each sung line');
 assert.equal(d.querySelector('.lyric-line.is-active'),null,'no line is highlighted in instrumental intro');
 dom.window.close();
});
