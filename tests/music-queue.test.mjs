import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const app=readFileSync(new URL('../web/public/music/app.js',import.meta.url),'utf8');
const queueCode=app.slice(app.indexOf('function moveTrack('),app.indexOf('function setTab('));
function setup(loop=false) {
  const songs=[{id:'a',title:'A'},{id:'b',title:'B'},{id:'c',title:'C'}];
  const handlers={}; const played=[];
  const controls={};
  const context={playbackQueue:songs,current:songs[0],selected:null,
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
