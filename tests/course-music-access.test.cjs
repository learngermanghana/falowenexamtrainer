const {test}=require('node:test');
const assert=require('node:assert/strict');
const {TRACKS,signTrack,isMusicStaff,createMusicHandler}=require('../server/courseMusic.cjs');
const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test-key',R2_SECRET_ACCESS_KEY:'test-secret',R2_AUDIO_BUCKET:'falowen-course-audio',REACT_APP_FIREBASE_API_KEY:'test-public-key'};
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(data){this.body=data;return this},end(){return this}}}
test('only the exact approved Day 22 song can be signed, never arbitrary or inherited keys',()=>{
 const id=Object.keys(TRACKS)[0], signed=signTrack(id,env,new Date('2026-10-28T11:00:00Z'));
 const url=new URL(signed.url);
 assert.equal(url.pathname,'/music/a1/day-22/mein-kopf-tut-weh.mp3');
 assert.equal(url.searchParams.get('X-Amz-Expires'),'3600');
 assert.match(url.searchParams.get('X-Amz-Signature'),/^[a-f0-9]{64}$/);
 for(const key of ['__proto__','constructor','a1/day-22/day-22.mp3','../private.mp3'])assert.throws(()=>signTrack(key,env),/Unknown/);
 assert.throws(()=>signTrack(id,{...env,R2_SECRET_ACCESS_KEY:''}),/not configured/);
});
test('staff claims or existing staff/owner emails grant access; ordinary students do not',()=>{
 assert.equal(isMusicStaff({email:'moxflex@gmail.com'}),true);
 assert.equal(isMusicStaff({email:'staff@falowen.app'}),true);
 assert.equal(isMusicStaff({customAttributes:'{"admin":true}'}),true);
 assert.equal(isMusicStaff({email:'student@example.com'}),false);
 assert.equal(isMusicStaff({customAttributes:'broken'}),false);
});
test('unauthenticated requests never sign or contact the auth provider',async()=>{
 const res=response();await createMusicHandler({env,fetchImpl:()=>{throw Error('unexpected')}})({method:'GET',headers:{},url:'/?track=a1-day22-mein-kopf-tut-weh'},res);
 assert.equal(res.code,401);assert.equal(res.body.url,undefined);
});
test('authenticated student is rejected while verified staff receives a private short-lived URL',async()=>{
 for(const [email,code] of [['student@example.com',403],['moxflex@gmail.com',200]]){
  const res=response();await createMusicHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:[{localId:'user',email}]})})})({method:'GET',headers:{authorization:'Bearer token',origin:'https://admin.falowen.app'},url:'/?track=a1-day22-mein-kopf-tut-weh'},res);
  assert.equal(res.code,code);assert.equal(res.headers['Cache-Control'],'private, no-store');
  assert.equal(res.headers['Access-Control-Allow-Origin'],'https://admin.falowen.app');
  assert.equal(Boolean(res.body.url),code===200);
 }
});
test('expired tokens, disabled accounts and untrusted origins do not gain access',async()=>{
 for(const account of [null,{localId:'disabled',email:'moxflex@gmail.com',disabled:true}]){
  const res=response();await createMusicHandler({env,fetchImpl:async()=>({ok:Boolean(account),json:async()=>({users:account?[account]:[]})})})({method:'GET',headers:{authorization:'Bearer token',origin:'https://example.com'},url:'/?track=a1-day22-mein-kopf-tut-weh'},res);
  assert.equal(res.code,401);assert.equal(res.headers['Access-Control-Allow-Origin'],undefined);
 }
});

test('private bank telephone audio requires staff and signs only the uploaded Day 18 object', async () => {
 const {createClassroomBankAudioHandler}=require('../server/courseMusic.cjs');
 const key='a2/day-18/bank-telefonat.mp3';
 for(const [account,requestKey,day,expected] of [
  [null,key,18,401],
  [{localId:'student',email:'student@example.com'},key,18,403],
  [{localId:'staff',email:'moxflex@gmail.com'},key,18,200],
  [{localId:'staff',email:'moxflex@gmail.com'},'a2/day-18/other.mp3',18,400],
  [{localId:'staff',email:'moxflex@gmail.com'},key,17,400],
  [{localId:'staff',email:'moxflex@gmail.com'},'a2/day-18/../private.mp3',18,400],
  [{localId:'disabled',email:'moxflex@gmail.com',disabled:true},key,18,401],
 ]) {
  const res=response();
  await createClassroomBankAudioHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:account?[account]:[]})})})({method:'GET',
   headers:account?{authorization:'Bearer test',origin:'https://admin.falowen.app'}:{},
   url:`/course-media/a2/classroom-audio-url?${new URLSearchParams({day:String(day),key:requestKey})}`},res);
  assert.equal(res.code,expected);
  assert.equal(Boolean(res.body.url),expected===200);
  if(expected===200) {
   const url=new URL(res.body.url);
   assert.match(url.pathname,/^\/a2\/day-18\/bank-telefonat\.mp3$/);
   assert.equal(url.hostname,`falowen-course-audio.${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
   assert.match(url.searchParams.get('X-Amz-Signature'),/^[a-f0-9]{64}$/);
   assert.equal(res.headers['Cache-Control'],'private, no-store');
  }
 }
});

test('Day 19 is a staff-only exact-key conversation; private keys cannot use public music playback', async () => {
 const {createClassroomBankAudioHandler}=require('../server/courseMusic.cjs');
 const key='a2/day-19/einkaufen-wo-und-wie.mp3';
 for(const [account,requested,day,expected] of [
  [null,key,19,401],
  [{localId:'student',email:'student@example.com'},key,19,403],
  [{localId:'staff',email:'moxflex@gmail.com'},key,19,200],
  [{localId:'staff',email:'moxflex@gmail.com'},key,18,400],
  [{localId:'staff',email:'moxflex@gmail.com'},'a2/day-19/another.mp3',19,400],
 ]) {
  const res=response();
  await createClassroomBankAudioHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:account?[account]:[]})})})({method:'GET',
   headers:account?{authorization:'Bearer test',origin:'https://admin.falowen.app'}:{},
   url:`/course-media/a2/classroom-audio-url?${new URLSearchParams({day:String(day),key:requested})}`},res);
  assert.equal(res.code,expected);
  if(expected===200) assert.equal(new URL(res.body.url).pathname,'/'+key);
 }
 assert.throws(()=>signTrack('a2-day19-shopping',env),/Unknown/);
 const song=signTrack('a2-day-18-bank',env);
 assert.equal(new URL(song.url).pathname,'/music/a2/day-18/die-karte-funktioniert-nicht.mp3');
});
