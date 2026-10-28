import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {buildPlaybackQueue} from '../web/public/music/playback-queue.js';
const app=readFileSync(new URL('../web/public/music/app.js',import.meta.url),'utf8');
const queueCode=app.slice(app.indexOf('function moveTrack('),app.indexOf('function setTab('));
function setup(loop=false) {
  const songs=[{id:'a',title:'A'},{id:'b',title:'B'},{id:'c',title:'C'}];
  const handlers={}; const played=[];
  const controls={};
  const context={playbackQueue:songs,current:songs[0],selected:null,shuffleEnabled:false,buildPlaybackQueue,
    audio:{loop,addEventListener:(name,fn)=>handlers[name]=fn},
    byId:id=> id==='song-detail'?{hidden:true}:(controls[id]??={addEventListener:(name,fn)=>handlers[id]=fn}),
    setPlayer:(song,start)=>{context.current=song;played.push([song.id,start]);},
    songUrl:song=>new URL('https://music.falowen.app/?track='+song.id),
    history:{replaceState(){}}, renderDetail(){throw Error('closed detail should stay closed');}};
  runInNewContext(queueCode,context);
  return {context,handlers,played};
}
test('ending advances through available songs and wraps to first',()=>{
  const {context,handlers,played}=setup();
  handlers.ended();assert.equal(context.current.id,'b');
  handlers.ended();assert.equal(context.current.id,'c');
  handlers.ended();assert.equal(context.current.id,'a');
  assert.ok(played.every(([,start])=>start===true));
});
test('repeat prevents advancement; explicit next and previous remain available',()=>{
  const {context,handlers,played}=setup(true);
  handlers.ended();assert.equal(played.length,0);
  handlers['next-track']();assert.equal(context.current.id,'b');
  handlers['previous-track']();assert.equal(context.current.id,'a');
});

test('shuffle keeps the current song, includes each song once and does not mutate the source',()=>{
 const tracks=['a','b','c','d'].map(id=>({id}));
 const queue=buildPlaybackQueue(tracks,'b',true,()=>0);
 assert.equal(queue[0].id,'b');
 assert.deepEqual(queue.map(t=>t.id).sort(),['a','b','c','d']);
 assert.equal(new Set(queue.map(t=>t.id)).size,4);
 assert.deepEqual(tracks.map(t=>t.id),['a','b','c','d']);
 assert.notDeepEqual(queue.map(t=>t.id),tracks.map(t=>t.id));
});
test('shuffle advances without repeats and starts a new cycle without repeating the last song',()=>{
 const {context,handlers}=setup();context.shuffleEnabled=true;
 const seen=[context.current.id];
 handlers.ended();seen.push(context.current.id);
 handlers.ended();seen.push(context.current.id);
 assert.equal(new Set(seen).size,3);
 const last=context.current.id;handlers.ended();assert.notEqual(context.current.id,last);
 handlers['previous-track']();assert.equal(context.current.id,last);
});
test('shuffle handles an empty list, one song and duplicate catalogue entries',()=>{
 assert.deepEqual(buildPlaybackQueue([],null,true),[]);
 assert.deepEqual(buildPlaybackQueue([{id:'a'},{id:'a'}],'a',true),[{id:'a'}]);
});
