import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {createSaveHandler,ownerAllowed,validateTimingUpload}=require('../server/musicLyricsSave.cjs');
const objectKey='music/a2/day-19/lieber-online-oder-im-laden.mp3';
const payload={
  version:1,objectKey,lyrics:'[Verse]\nHallo!\nIch bin hier.',
  cues:[{start:1.2,text:'Hallo!'},{start:3.7,text:'Ich bin hier.'}]
};
const env={
  FIREBASE_API_KEY:'firebase-test-key',MUSIC_STUDIO_OWNER_UID:'owner-uid',
  R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'access-test',
  R2_SECRET_ACCESS_KEY:'secret-test',R2_AUDIO_BUCKET:'falowen-course-audio'
};
function fakeRes(){
  return {statusCode:200,headers:{},
    setHeader(key,value){this.headers[key]=value;},
    status(code){this.statusCode=code;return this;},
    json(data){this.body=data;return this;},
    end(){this.ended=true;return this;}
  };
}
function request(body=payload,token='good-token'){
  return {method:'POST',headers:{origin:'https://admin.falowen.app',authorization:'Bearer '+token},body};
}
function fakeFetch(calls,{uid='owner-uid',missing=false,storageFailure=false}={}){
  return async(url,options)=>{
    calls.push({url,options});
    if(url.startsWith('https://identitytoolkit.googleapis.com/'))
      return new Response(JSON.stringify({users:[{localId:uid}]}),{status:200,headers:{'content-type':'application/json'}});
    if(options.method==='GET')
      return new Response(null,{status:missing?404:206});
    if(options.method==='PUT')
      return new Response(null,{status:storageFailure?403:200});
    throw Error('Unexpected fetch');
  };
}
test('direct save validates exact published song, every timestamp and same lyrics',()=>{
  assert.deepEqual(validateTimingUpload(payload),payload);
  for(const bad of [
    {...payload,objectKey:'a2/private.mp3'},
    {...payload,cues:payload.cues.slice(0,1)},
    {...payload,cues:[payload.cues[1],payload.cues[0]]},
    {...payload,version:2},
    {...payload,lyrics:'Different lyric'}
  ])assert.throws(()=>validateTimingUpload(bad));
  assert.equal(ownerAllowed('owner-uid',env),true);
  assert.equal(ownerAllowed('student-uid',env),false);
});
test('owner-only POST stores validated R2 .lyrics.json next to the exact MP3',async()=>{
  const calls=[];
  const handler=createSaveHandler({env,fetchImpl:fakeFetch(calls)});
  const res=fakeRes();await handler(request(),res);
  assert.equal(res.statusCode,200);
  assert.deepEqual(res.body,{ok:true,saved:true,objectKey,cueCount:2});
  assert.equal(res.headers['Access-Control-Allow-Origin'],'https://admin.falowen.app');
  assert.equal(calls.length,3);
  assert.match(calls[1].url,/lieber-online-oder-im-laden\.mp3/);
  assert.equal(calls[1].options.headers.Range,'bytes=0-0');
  assert.match(calls[2].url,/lieber-online-oder-im-laden\.lyrics\.json/);
  assert.equal(calls[2].options.method,'PUT');
  assert.deepEqual(JSON.parse(calls[2].options.body),payload);
  assert.notEqual(new URL(calls[1].url).searchParams.get('X-Amz-Signature'),
    new URL(calls[2].url).searchParams.get('X-Amz-Signature'));
});
test('untrusted callers, invalid timings and missing audio never write to R2',async()=>{
  for(const [req,config,expected] of [
    [request(payload,'good-token'),{uid:'not-owner'},403],
    [request({...payload,cues:[]}),{},400],
    [request(payload),{missing:true},404],
    [request(payload),{storageFailure:true},503],
    [{...request(),headers:{}},{},401],
    [{...request(),headers:{origin:'https://evil.example',authorization:'Bearer good-token'}},{},403]
  ]){
    const calls=[];const res=fakeRes();
    await createSaveHandler({env,fetchImpl:fakeFetch(calls,config)})(req,res);
    assert.equal(res.statusCode,expected);
    if(expected!==503)assert.equal(calls.some(call=>call.options.method==='PUT'),false);
    assert.equal(res.body.saved,undefined);
  }
});
