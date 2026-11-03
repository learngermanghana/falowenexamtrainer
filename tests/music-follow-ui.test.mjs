import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {JSDOM}=createRequire(new URL('./music-ui/package.json',import.meta.url))('jsdom');
import {buildPlaybackQueue} from '../web/public/music/playback-queue.js';
import {lyricLines,validateCues,activeLyricIndex} from '../web/public/music/lyrics-timing.js';
import {resolveRecordingLesson} from '../web/public/music/lesson-content.js';
import {songStoryForTrack} from '../web/public/music/song-story.js';
import {coverForTrack} from '../web/public/music/cover-art.js';
import {approximateScrollTop} from '../web/public/music/follow-lyrics.js';
import {matchingEnglishTranslation,matchingDraftEnglishTranslation} from '../web/public/music/english-translations.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const recordings=JSON.parse(read('web/public/music/timings.json')).recordings;
async function room(track,pack,{studio=null,translations=null,classTimings=null,initiallySelected=true,requests=[]}={}){
 const dom=new JSDOM(read('web/public/music/index.html'),{url:'https://music.falowen.app/'+(initiallySelected?'?track='+track.id:''),runScripts:'outside-only'});
 const w=dom.window;
 Object.assign(w,{buildPlaybackQueue,lyricLines,validateCues,activeLyricIndex,resolveRecordingLesson,coverForTrack,songStoryForTrack,approximateScrollTop,matchingEnglishTranslation,matchingDraftEnglishTranslation,
  matchMedia:()=>({matches:true}),fetch:async url=>{
    requests.push(String(url));
    return {ok:!!(!String(url).startsWith('/api/music-lyrics')||pack),json:async()=>String(url).includes('music-lyrics')?pack:String(url).includes('class-timings')?{recordings:classTimings||[]}:String(url).includes('music-library')?{ok:true,tracks:[track]}:String(url).includes('catalog.json')?{tracks:classTimings?[track]:[]}:String(url).includes('studio-drafts')?{tracks:studio||[{...track,lyrics:'Draft lyrics are different'}]}:String(url).includes('english-translations')?(translations||{recordings:[],drafts:[]}):{lessons:{}}};
  }});
 const a=w.document.getElementById('audio');
 a.play=()=>Promise.resolve(); a.pause=()=>{};a.load=()=>{};Object.defineProperty(a,'readyState',{value:1});
 w.eval(read('web/public/music/app.js').replace(/^import .*;\n/gm,''));
 for(let i=0;i<8;i++)await new Promise(r=>setImmediate(r));
 return {w,a,dom,requests,click:id=>w.document.getElementById(id).click()};
}
test('a library-only visit defers five lesson metadata requests until a song opens', async () => {
 const track={id:'r2-test-a2',level:'A2',day:13,title:'Test song',
   objectKey:'music/a2/day-13/test-song.mp3',autoDiscovered:true,
   coursebook:true,audioUrl:'https://www.falowen.app/api/music?track=r2-test-a2'};
 const requests=[];
 const {w,dom}=await room(track,null,{initiallySelected:false,requests});
 try {
   assert.ok(requests.includes('/music/catalog.json'));
   assert.ok(requests.includes('/api/music-library'));
   const packs=['learning','studio-drafts','english-translations','song-stories','class-timings'];
   for(const name of packs) assert.ok(!requests.includes('/music/'+name+'.json'),name+' loaded on library-only view');
   const open=w.document.querySelector('.track-card .track-link');
   assert.ok(open,'discovered song must still appear');
   open.click();
   for(let i=0;i<8;i++) await new Promise(r=>setImmediate(r));
   for(const name of packs) assert.ok(requests.includes('/music/'+name+'.json'),name+' missing after song opened');
 } finally {dom.window.close();}
});

test('all translated live course drafts expose matching English without enabling fake timed lines',async()=>{
 const translations=JSON.parse(read('web/public/music/english-translations.json'));
 const studio=JSON.parse(read('web/public/music/studio-drafts.json')).tracks;
 for(const row of translations.drafts){
  const source=studio.find(x=>x.level===row.level&&x.day===row.day&&x.assignmentKey===row.assignmentKey&&x.title===row.draftTitle);
  const track={id:'draft-'+row.level+'-'+row.day,objectKey:row.objectKey,level:row.level,day:row.day,title:row.objectKey.split('/').at(-1).slice(0,-4),autoDiscovered:true,coursebook:true,audioUrl:'/api/music?track=draft'};
  const {w,dom}=await room(track,null,{studio:[source],translations});
  try {
   const d=w.document;
   d.querySelector('[data-tab="lyrics"]').click();
   const toggle=d.getElementById('show-english');
   assert.equal(toggle.disabled,false,row.objectKey);
   assert.match(d.getElementById('english-status').textContent,/COURSE DRAFT TRANSLATION/);
   const lines=d.querySelectorAll('.english-line');
   assert.deepEqual(Array.from(lines,x=>x.textContent),row.lines.map(x=>x.en),row.objectKey);
   if(!toggle.checked) toggle.click();
   assert.ok(Array.from(lines).every(x=>!x.hidden));
   if(!source.cues?.length) assert.ok(Array.from(d.querySelectorAll('.lyric-line')).every(x=>x.disabled),'translation must not manufacture timing');
  } finally {dom.window.close();}
 }
});
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
for (const [level,day,title,key] of [['A1',14,'Einsteigen','music/a1/day-14/Einsteigen.mp3'],['B1',2,'Freundschaft am Fluss','music/b1/day-02/Freundschaft am Fluss.mp3']]) test(`untimed ${level} Day ${day} stays still and never substitutes duration scrolling for line timing`,async()=>{
 const track={id:'r2-untimed-'+level,title,level,day,autoDiscovered:true,coursebook:true,objectKey:key,audioUrl:'https://www.falowen.app/api/music?track=r2-untimed'};
 const {w,a,dom}=await room(track,null);const d=w.document;d.querySelector('[data-tab="lyrics"]').click();
 const root=d.getElementById('lyrics-text');
 Object.defineProperty(root,'scrollHeight',{value:1000,configurable:true});
 Object.defineProperty(root,'clientHeight',{value:300,configurable:true});
 Object.defineProperty(a,'duration',{value:140,configurable:true});
 a.currentTime=70;a.dispatchEvent(new w.Event('timeupdate'));
 assert.equal(d.getElementById('follow-lyrics').disabled,true);
 assert.equal(d.getElementById('follow-lyrics').checked,false);
 assert.match(d.getElementById('follow-label').textContent,/Line highlighting unavailable/);
 assert.equal(root.scrollTop,0,'untimed lyrics must not scroll with elapsed duration');
 assert.equal(root.querySelector('[aria-current="true"]'),null,'no fake line highlight');
 root.scrollTop=120; const at=root.scrollTop;
 a.currentTime=90;a.dispatchEvent(new w.Event('timeupdate'));
 assert.equal(root.scrollTop,at,'manual reading position stays fixed while audio plays');
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

test('all 48 new acoustic packs highlight the played line and retain estimate labels',async()=>{
 const rows=JSON.parse(read('web/public/music/estimated-timings.json')).recordings;
 for(const pack of rows){
  const [,level,day]=pack.objectKey.match(/^music\/(a1|a2|b1)\/day-(\d+)/);
  const track={id:pack.trackId,level:level.toUpperCase(),day:Number(day),title:pack.objectKey.split('/').at(-1).slice(0,-4),objectKey:pack.objectKey,autoDiscovered:true,coursebook:true,audioUrl:'/api/music?track='+pack.trackId};
  const {w,a,dom}=await room(track,pack);
  try{
   const d=w.document;d.querySelector('[data-tab="lyrics"]').click();
   assert.equal(d.getElementById('follow-lyrics').disabled,false,pack.objectKey);
   const root=d.getElementById('lyrics-text');
   for(const i of [0,pack.cues.length-1]){
    a.currentTime=(pack.cues[i].start+pack.cues[i].end)/2;a.dispatchEvent(new w.Event('timeupdate'));
    assert.equal(root.querySelector('[aria-current="true"]')?.dataset.line,String(i),pack.objectKey);
   }
   if(pack.transcriptionStatus==='automatic')assert.match(root.textContent,/AUTOMATIC TRANSCRIPT DRAFT/);
   else assert.match(root.textContent,/DRAFT/);
  }finally{dom.window.close();}
 }
});
test('both catalogued class songs have native line timing tied to the exact audio URL',async()=>{
 const rows=JSON.parse(read('web/public/music/class-timings.json')).recordings;
 const catalog=JSON.parse(read('web/public/music/catalog.json')).tracks;
 assert.equal(rows.length,2);
 for(const pack of rows){
  const track=catalog.find(t=>t.id===pack.trackId);
  const {w,a,dom}=await room(track,null,{classTimings:[pack]});
  try{
   const d=w.document;d.querySelector('[data-tab="lyrics"]').click();
   assert.equal(d.getElementById('follow-lyrics').disabled,false);
   a.currentTime=(pack.cues[2].start+pack.cues[2].end)/2;a.dispatchEvent(new w.Event('timeupdate'));
   assert.equal(d.querySelector('[aria-current="true"]')?.dataset.line,'2');
  }finally{dom.window.close();}
 }
});
