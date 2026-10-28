import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {activeLyricIndex,validateCues,lyricLines} from '../web/public/music/lyrics-timing.js';
const require=createRequire(import.meta.url);
const {validateLyrics,createLyricsHandler}=require('../server/musicLyrics.cjs');
const key='music/a2/day-19/lieber-online-oder-im-laden.mp3';
const pack={objectKey:key,lyrics:'[Verse 1]\nHallo\nNoch einmal\n[Chorus]\nHallo',cues:[{start:4,text:'Hallo'},{start:8,text:'Noch einmal'},{start:12,text:'Hallo'}]};
const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test',R2_SECRET_ACCESS_KEY:'test',R2_AUDIO_BUCKET:'test-audio'};
function res(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(v){this.body=v;return this;}};}
test('timing follows audio position through intro, repeated chorus, seek and repeat',()=>{
 assert.equal(lyricLines(pack.lyrics).length,3);
 const cues=validateCues(pack.cues,pack.lyrics);
 for(const [time,index] of [[0,-1],[4,0],[8,1],[12,2],[5,0],[0,-1]]) assert.equal(activeLyricIndex(cues,time),index);
 assert.equal(activeLyricIndex(cues,NaN),-1);
});
test('timings must match every sung line and the exact MP3',()=>{
 assert.ok(validateLyrics(pack,key));
 for(const data of [{...pack,objectKey:'music/a1/day-22/other.mp3'}, {...pack,cues:pack.cues.slice(0,2)}, {...pack,cues:[{start:4,text:'Wrong'},...pack.cues.slice(1)]}, {...pack,cues:[pack.cues[0],{start:4,text:'Noch einmal'},pack.cues[2]]}]) assert.equal(validateLyrics(data,key),null);
 assert.deepEqual(validateCues(pack.cues.slice(0,2),pack.lyrics),[]);
});
test('only a music sidecar is fetched and no signed URL or credentials are returned',async()=>{
 let calls=0;
 const handler=createLyricsHandler({env,fetchImpl:async url=>{calls++;assert.equal(new URL(url).pathname,'/'+key.replace('.mp3','.lyrics.json'));return new Response(JSON.stringify(pack));}});
 const response=res(); await handler({method:'GET',query:{track:'r2-a2-day-19-lieber-online-oder-im-laden'}},response);
 assert.equal(response.code,200);assert.deepEqual(response.body,pack);assert.equal(calls,1);
 assert.doesNotMatch(JSON.stringify(response.body),/X-Amz|test-audio/);
 for(const key of ['a2/day-19/private.mp3','music/a2/day-19/../../private.mp3','music/a2/day-19/file.json']){const r=res();await handler({method:'GET',query:{key}},r);assert.equal(r.code,404);}
 assert.equal(calls,1);
});
test('missing, oversized or mismatched timing never breaks audio or exposes raw errors',async()=>{
 for(const [response,expected] of [[new Response('',{status:404}),404],[new Response('x'.repeat(100001)),503],[new Response(JSON.stringify({...pack,objectKey:'wrong'})),422]]){
 const r=res();await createLyricsHandler({env,fetchImpl:async()=>response})({method:'GET',query:{key}},r);assert.equal(r.code,expected);assert.equal(r.body.cues,undefined);
 }
});
