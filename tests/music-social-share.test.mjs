import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const handler=require('../api/music-share.js');
const {JSDOM}=createRequire(new URL('../web/package.json',import.meta.url))('jsdom');
import {coverForTrack} from '../web/public/music/cover-art.js';
import {resolveRecordingLesson} from '../web/public/music/lesson-content.js';
import {songStoryForTrack} from '../web/public/music/song-story.js';
import {buildPlaybackQueue,advancePlaybackQueue} from '../web/public/music/playback-queue.js';
import {lyricLines,validateCues,activeLyricIndex} from '../web/public/music/lyrics-timing.js';
import {matchingEnglishTranslation,matchingDraftEnglishTranslation} from '../web/public/music/english-translations.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const catalog=JSON.parse(read('web/public/music/catalog.json'));
const coverage=JSON.parse(read('web/public/music/timing-coverage.json'));
function request(track,method='GET'){
 const headers={};let body;let status;
 const response={setHeader:(key,value)=>{headers[key]=value;},status:code=>{status=code;return response;},end:value=>{body=value;}};
 handler({method,query:{track}},response);
 return {headers,body,status};
}
test('every audited song has crawler-readable title, cover, canonical URL and the shared player',()=>{
 for(const id of [...coverage.courseRecordings.map(row=>row.trackId),...catalog.tracks.filter(row=>row.retired !== true).map(row=>row.id)]){
  const result=request(id);assert.equal(result.status,200,id);
  const dom=new JSDOM(result.body);const doc=dom.window.document;
  assert.equal(doc.body.dataset.track,id);
  assert.equal(doc.querySelector('link[rel="canonical"]').href,'https://music.falowen.app/song/'+encodeURIComponent(id));
  const image=doc.querySelector('meta[property="og:image"]').content;
  assert.match(image,/^https:\/\/music\.falowen\.app\/music\/covers\/photos\/[a-z]+\.jpg$/);
  assert.equal(doc.querySelector('meta[name="twitter:image"]').content,image);
  assert.equal(doc.querySelector('meta[name="twitter:card"]').content,'summary_large_image');
  assert.ok(doc.getElementById('audio'));assert.doesNotMatch(result.body,/r2\.cloudflarestorage|X-Amz-Signature/);
  dom.window.close();
 }
});
test('share metadata rejects private paths, malformed IDs, arrays and writes; supports HEAD',()=>{
 for(const id of ['../../hoeren.mp3','<script>alert(1)</script>','not-a-song',['gemeinsam-schaffen-wir-das'],'r2-a1-day-01-b64_Li4vaG9lcmVuLm1wMw'])assert.equal(request(id).status,404);
 assert.equal(request(catalog.tracks[0].id,'POST').status,405);
 const head=request(catalog.tracks[0].id,'HEAD');assert.equal(head.status,200);assert.equal(head.body,undefined);
});
async function room({nativeShare,clipboardFails=false,multiple=false}={}){
 const track=catalog.tracks[0];
 const dom=new JSDOM(read('web/public/music/index.html'),{url:'https://music.falowen.app/?track='+track.id,runScripts:'outside-only'});
 const w=dom.window;
 Object.assign(w,{coverForTrack,resolveRecordingLesson,songStoryForTrack,buildPlaybackQueue,advancePlaybackQueue,lyricLines,validateCues,activeLyricIndex,matchingEnglishTranslation,matchingDraftEnglishTranslation,matchMedia:()=>({matches:true}),fetch:async url=>({ok:true,json:async()=>String(url).includes('catalog.json')?{tracks:multiple?catalog.tracks.filter(row=>!row.retired):[track]}:String(url).includes('music-library')?{ok:true,tracks:[]}:String(url).includes('english-translations')?{recordings:[],drafts:[]}:String(url).includes('song-stories')?{byObjectKey:{},byTrackId:{}}:{lessons:{},recordings:[],tracks:[]}})});
 const copied=[];Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async value=>{if(clipboardFails)throw Error('denied');copied.push(value);}}});
 if(nativeShare)w.navigator.share=nativeShare;
 const audio=w.document.getElementById('audio');audio.play=()=>Promise.resolve();audio.pause=()=>{};audio.load=()=>{};
 w.eval(read('web/public/music/app.js').replace(/^import .*;\n/gm,''));
 for(let i=0;i<8;i++)await new Promise(resolve=>setImmediate(resolve));
 return {dom,w,track,copied};
}
test('Share shows social choices, copies the canonical song URL and restores focus on Escape',async()=>{
 const {dom,w,track,copied}=await room();const doc=w.document;const trigger=doc.getElementById('detail-share');trigger.focus();trigger.click();
 const dialog=doc.getElementById('song-share-dialog');assert.ok(dialog.hasAttribute('open'));
 const links=[...dialog.querySelectorAll('a')];assert.deepEqual(links.map(a=>a.textContent),['WhatsApp','Facebook','X','Telegram','Email']);
 const url='https://music.falowen.app/song/'+encodeURIComponent(track.id);
 assert.equal(new URL(links[1].href).searchParams.get('u'),url);
 assert.ok(new URL(links[0].href).searchParams.get('text').includes(url));
 assert.equal(dialog.querySelector('input').value,url);
 [...dialog.querySelectorAll('button')].find(b=>b.textContent==='Copy link').click();await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(copied,[url]);assert.match(dialog.querySelector('[role="status"]').textContent,/Link copied/);
 dialog.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
 assert.equal(doc.getElementById('song-share-dialog'),null);assert.equal(doc.activeElement,trigger);dom.window.close();
});
test('native sharing is optional and clipboard denial leaves a selectable URL',async()=>{
 const calls=[];const {dom,w}=await room({nativeShare:async data=>calls.push(data),clipboardFails:true});w.document.getElementById('detail-share').click();
 const dialog=w.document.getElementById('song-share-dialog');const buttons=[...dialog.querySelectorAll('button')];
 buttons.find(b=>b.textContent==='More apps…').click();await new Promise(resolve=>setImmediate(resolve));assert.equal(calls.length,1);assert.match(calls[0].url,/music.falowen.app\/song\//);
 buttons.find(b=>b.textContent==='Copy link').click();await new Promise(resolve=>setImmediate(resolve));assert.match(dialog.querySelector('[role="status"]').textContent,/Select and copy/);assert.equal(w.document.activeElement,dialog.querySelector('input'));dom.window.close();
});

test('browser back and forward recognise the new song URL without autoplay',async()=>{
 const {dom,w}=await room({multiple:true});
 const track=catalog.tracks.filter(row=>!row.retired)[1];
 w.history.pushState({},'', '/song/'+track.id);
 w.dispatchEvent(new w.PopStateEvent('popstate'));
 assert.equal(w.document.getElementById('detail-title').textContent,track.title);
 assert.ok(w.document.getElementById('audio').paused);
 dom.window.close();
});
