const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const http=require('node:http');
const {Readable,Transform}=require('node:stream');
const {pipeline}=require('node:stream/promises');
function handler(upstream){
 const module={exports:{}};
 vm.runInNewContext(fs.readFileSync('api/approved-music.js','utf8'),{module,AbortSignal,Readable,Transform,pipeline,console,fetch:upstream,require:path=>{
  if(path==='node:stream')return {Readable,Transform};
  if(path==='node:stream/promises')return {pipeline};
  if(path.includes('courseHoerenPublishing'))return {signedStudioUrl:()=> 'https://storage.invalid/song.mp3'};
  if(path.includes('courseMusic'))return {signObject:()=>({url:'https://storage.invalid/song.mp3'}),signTrack:()=>({url:'https://storage.invalid/song.mp3'})};
  if(path.includes('musicDiscovery'))return {musicKeyFromAutoId:id=>id==='valid'?'music/b1/day-02/song.mp3':''};
  return {tracks:[]};
 }});
 return module.exports;
}
async function serve(t,fn){
 const server=http.createServer((req,res)=>{
  req.query=Object.fromEntries(new URL(req.url,'http://localhost').searchParams);
  res.status=code=>{res.statusCode=code;return res;};
  res.json=body=>res.end(JSON.stringify(body));
  fn(req,res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>{server.closeAllConnections();server.close();});
 return 'http://127.0.0.1:'+server.address().port;
}
test('export streams readable audio without exposing a signed redirect; ordinary playback remains a redirect',async t=>{
 let calls=0;
 const base=await serve(t,handler(async()=>{calls++;return new Response(new Uint8Array([73,68,51,1,2,3]));}));
 const response=await fetch(base+'/?track=valid&download=1');
 assert.equal(response.status,200);
 assert.equal(response.headers.get('access-control-allow-origin'),'*');
 assert.equal(response.headers.get('content-type'),'audio/mpeg');
 assert.equal(response.headers.get('location'),null);
 assert.deepEqual([...new Uint8Array(await response.arrayBuffer())],[73,68,51,1,2,3]);
 const normal=await fetch(base+'/?track=valid',{redirect:'manual'});
 assert.equal(normal.status,302);
 const denied=await fetch(base+'/?track=private&download=1');
 assert.equal(denied.status,404);
 assert.equal(calls,1);
});
test('oversize and failed upstream downloads return bounded errors',async t=>{
 const oversized=await serve(t,handler(async()=>new Response('x',{headers:{'content-length':'40000001'}})));
 assert.equal((await fetch(oversized+'/?track=valid&download=1')).status,413);
 const unavailable=await serve(t,handler(async()=>new Response('',{status:503})));
 const response=await fetch(unavailable+'/?track=valid&download=1');
 assert.equal(response.status,503);
 assert.doesNotMatch(await response.text(),/storage.invalid/);
});
