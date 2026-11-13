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

test('B1 Day 25 private consumer-service recording uses existing staff-only R2 signer, not workbook Hören', async () => {
 const {createClassroomAudioHandler}=require('../server/courseMusic.cjs');
 const key='b1/day-25/online-shopping-verbraucherservice.mp3';
 const cases=[
   {account:null,level:'B1',day:25,key,expected:401},
   {account:{localId:'student',email:'student@example.com'},level:'B1',day:25,key,expected:403},
   {account:{localId:'teacher',email:'moxflex@gmail.com'},level:'B1',day:25,key,expected:200},
   {account:{localId:'teacher',email:'moxflex@gmail.com'},level:'B1',day:25,key:'b1/day-25/day-25.mp3',expected:400},
   {account:{localId:'teacher',email:'moxflex@gmail.com'},level:'B1',day:24,key,expected:400},
   {account:{localId:'teacher',email:'moxflex@gmail.com'},level:'A2',day:25,key,expected:400},
   {account:{localId:'teacher',email:'moxflex@gmail.com'},level:'B1',day:25,key:'b1/day-25/../secret.mp3',expected:400},
 ];
 for(const {account,level,day,key:requestKey,expected} of cases){
  const res=response();
  const handler=createClassroomAudioHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:account?[account]:[]})})});
  await handler({method:'GET',headers:account?{authorization:'Bearer teacher-token',origin:'https://admin.falowen.app'}:{},
    url:`/course-media/classroom/audio-url?${new URLSearchParams({level,day:String(day),key:requestKey})}`},res);
  assert.equal(res.code,expected,level+' '+day+' '+requestKey);
  assert.equal(Boolean(res.body.url),expected===200);
  if(expected===200) {
    const parsed=new URL(res.body.url);
    assert.equal(parsed.pathname,'/'+key);
    assert.equal(parsed.hostname,`falowen-course-audio.${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
    assert.equal(res.headers['Cache-Control'],'private, no-store');
    assert.ok(parsed.searchParams.get('X-Amz-Signature'));
  }
 }
 assert.throws(()=>signTrack('b1-day25-consumer-service',env),/Unknown/);
 const index=require('node:fs').readFileSync(require('node:path').join(__dirname,'../api/index.js'),'utf8');
 assert.match(index,/\/course-media\/classroom\/audio-url/);
 assert.match(index,/createClassroomAudioHandler/);
});


test('A2 Day 20 complaint playback signs the exact private object only for verified staff', async () => {
 const {createClassroomBankAudioHandler,createClassroomAudioHandler}=require('../server/courseMusic.cjs');
 const key='a2/day-20/reklamation-falsches-hemd.mp3';
 const staff={localId:'teacher',customAttributes:'{"role":"teacher"}'};
 const cases=[
  [null,key,20,401],
  [{localId:'student',email:'student@example.com'},key,20,403],
  [staff,key,20,200],
  [{...staff,disabled:true},key,20,401],
  [staff,key,19,400],
  [staff,'a2/day-20/other.mp3',20,400],
  [staff,'a2/day-20/../private.mp3',20,400],
  [staff,'a2/day-20/reklamation-falsches-hemd.wav',20,400],
 ];
 for(const createHandler of [createClassroomBankAudioHandler,createClassroomAudioHandler]){
  for(const [account,requested,day,expected] of cases){
   const res=response();
   await createHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:account?[account]:[]})})})({method:'GET',
    headers:account?{authorization:'Bearer verified-token',origin:'https://admin.falowen.app'}:{},
    url:`/?${new URLSearchParams({level:'A2',day:String(day),key:requested})}`},res);
   assert.equal(res.code,expected,`${day} ${requested}`);
   assert.equal(Boolean(res.body.url),expected===200);
   if(expected===200){
    const url=new URL(res.body.url);
    assert.equal(url.pathname,'/'+key);
    assert.equal(url.hostname,`falowen-course-audio.${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
    assert.equal(url.searchParams.get('X-Amz-Expires'),'3600');
    assert.match(url.searchParams.get('X-Amz-Signature'),/^[a-f0-9]{64}$/);
    assert.equal(res.headers['Cache-Control'],'private, no-store');
    assert.equal(res.headers['Access-Control-Allow-Origin'],'https://admin.falowen.app');
   }
  }
 }
 assert.throws(()=>signTrack('a2-day20-complaint',env),/Unknown/);
});


// The uploaded Day 21 Lisa–Tom dialogue is a teacher-only slide recording.
// Its key differs from the graded workbook's Claudia–Thomas MP3; never
// expose either through the public music map or the other's audio route.
test('A2 Day 21 weekend classroom Hören signs only the supplied teacher recording', async () => {
 const {createClassroomBankAudioHandler,createClassroomAudioHandler}=require('../server/courseMusic.cjs');
 const key='a2/day-21/ein-wochenende-planen.mp3';
 const staff={localId:'teacher',customAttributes:'{"role":"teacher"}'};
 const cases=[
  [null,key,21,401],
  [{localId:'student',email:'student@example.com'},key,21,403],
  [staff,key,21,200],
  [{...staff,disabled:true},key,21,401],
  [staff,key,20,400],
  [staff,'a2/day-21/day-21.mp3',21,400],
  [staff,'a2/day-21/another.mp3',21,400],
  [staff,'a2/day-21/../private.mp3',21,400],
 ];
 for(const createHandler of [createClassroomBankAudioHandler,createClassroomAudioHandler]) {
  for(const [account,requested,day,expected] of cases) {
   const res=response();
   await createHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:account?[account]:[]})})})({
    method:'GET',
    headers:account?{authorization:'Bearer verified-token',origin:'https://admin.falowen.app'}:{},
    url:'/?'+new URLSearchParams({level:'A2',day:String(day),key:requested})
   },res);
   assert.equal(res.code,expected,day+' '+requested);
   assert.equal(Boolean(res.body.url),expected===200);
   if(expected===200) {
    const url=new URL(res.body.url);
    assert.equal(url.pathname,'/'+key);
    assert.match(url.searchParams.get('X-Amz-Signature'),/^[a-f0-9]{64}$/);
    assert.equal(res.headers['Cache-Control'],'private, no-store');
   }
  }
 }
 assert.throws(()=>signTrack('a2-day21-weekend-classroom',env),/Unknown/);
});

test('B1 Day 26 signs the supplied a2-prefix upload only for the exact lesson and staff', async () => {
 const {createClassroomAudioHandler,createClassroomBankAudioHandler}=require('../server/courseMusic.cjs');
 const key='a2/day-26/reiseprobleme-und-losungen.mp3';
 const staff={localId:'teacher',customAttributes:'{"role":"teacher"}'};
 const cases=[
  [null,'B1',26,key,401],
  [{localId:'student',email:'student@example.com'},'B1',26,key,403],
  [staff,'B1',26,key,200],
  [{...staff,disabled:true},'B1',26,key,401],
  [staff,'A2',26,key,400],
  [staff,'B1',25,key,400],
  [staff,'B1',26,'b1/day-26/reiseprobleme-und-losungen.mp3',400],
  [staff,'B1',26,'a2/day-26/day-26.mp3',400],
  [staff,'B1',26,'a2/day-26/../secret.mp3',400],
  [staff,'B1',26,'a2/day-26/reiseprobleme-und-losungen.wav',400],
 ];
 for(const [account,level,day,requested,expected] of cases){
  const handler=createClassroomAudioHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:account?[account]:[]})})});
  const res=response();
  await handler({method:'GET',headers:account?{authorization:'Bearer test-teacher-token',origin:'https://admin.falowen.app'}:{},url:'/course-media/classroom/audio-url?'+new URLSearchParams({level,day:String(day),key:requested})},res);
  assert.equal(res.code,expected,level+' '+day+' '+requested);
  assert.equal(Boolean(res.body.url),expected===200);
  if(expected===200){
   assert.equal(new URL(res.body.url).pathname,'/'+key);
   assert.equal(res.headers['Cache-Control'],'private, no-store');
   assert.equal(res.headers['Access-Control-Allow-Origin'],'https://admin.falowen.app');
  }
 }
 const legacy=createClassroomBankAudioHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:[staff]})})});
 const res=response();
 await legacy({method:'GET',headers:{authorization:'Bearer test-teacher-token'},url:'/course-media/a2/classroom-audio-url?'+new URLSearchParams({day:'26',key})},res);
 assert.equal(res.code,400,'the legacy A2 signer must not gain this B1 permission');
 assert.throws(()=>signTrack('b1-day26-travel-problems',env),/Unknown/,'never expose private classroom Hören as public music');
});


test('A2 Day 23 commute conversation requires staff and the exact private object key', async () => {
 const {createClassroomBankAudioHandler,createClassroomAudioHandler}=require('../server/courseMusic.cjs');
 const key='a2/day-23/wie-kommst-du-zur-schule-oder-zur-arbeit.mp3';
 const teacher={localId:'teacher',customAttributes:'{"role":"teacher"}'};
 for(const createHandler of [createClassroomBankAudioHandler,createClassroomAudioHandler]) {
  for(const [account,requested,day,level,expected] of [
   [null,key,23,'A2',401], [{localId:'student',email:'student@example.test'},key,23,'A2',403],
   [teacher,key,23,'A2',200], [{...teacher,disabled:true},key,23,'A2',401],
   [teacher,key,21,'A2',400], [teacher,'a2/day-23/day-23.mp3',23,'A2',400],
   [teacher,'music/a2/day-23/Fahrrad zur Schule.mp3',23,'A2',400],
   [teacher,'a2/day-23/../private.mp3',23,'A2',400],
  ]) {
   const res=response();
   await createHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:account?[account]:[]})})})({method:'GET',headers:account?{authorization:'Bearer test',origin:'https://admin.falowen.app'}:{},url:'/?'+new URLSearchParams({level,day:String(day),key:requested})},res);
   assert.equal(res.code,expected,requested);
   if(expected===200) { assert.equal(new URL(res.body.url).pathname,'/'+key); assert.equal(res.headers['Cache-Control'],'private, no-store'); }
  }
 }
 assert.throws(()=>signTrack('a2-day23-commute-classroom',env),/Unknown/);
});

test('Day 27 classroom audio signs the exact supplied object for staff only', async () => {
 const {createClassroomAudioHandler}=require('../server/courseMusic.cjs');
 const key='b1/day-27/umweltfreundlich-im-alltag.mp3';
 const staff={localId:'teacher',customAttributes:'{"role":"teacher"}'};
 for(const [account,level,day,requested,expected] of [
  [null,'B1',27,key,401],
  [{localId:'student',email:'student@example.com'},'B1',27,key,403],
  [staff,'B1',27,key,200],
  [staff,'A2',27,key,400],
  [staff,'B1',28,key,400],
  [staff,'B1',27,'b1/day-27/other.mp3',400],
 ]) {
  const res=response();
  await createClassroomAudioHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:account?[account]:[]})})})({method:'GET',headers:account?{authorization:'Bearer test-token',origin:'https://admin.falowen.app'}:{},url:'/?'+new URLSearchParams({level,day:String(day),key:requested})},res);
  assert.equal(res.code,expected);
  assert.equal(Boolean(res.body.url),expected===200);
  if(expected===200) assert.equal(new URL(res.body.url).pathname,'/'+key);
 }
 assert.throws(()=>signTrack('b1-day27-environment-everyday',env),/Unknown/);
});

test('B1 Day 28 climate-friendly classroom Hören signs only its exact staff-approved R2 key', async () => {
 const {createClassroomAudioHandler,createClassroomBankAudioHandler}=require('../server/courseMusic.cjs');
 const key='b1/day-28/klimafreundlich-leben.mp3';
 const teacher={localId:'teacher',customAttributes:'{"role":"teacher"}'};
 const scenarios=[
   [null,'B1',28,key,401],
   [{localId:'student',email:'learner@example.com'},'B1',28,key,403],
   [teacher,'B1',28,key,200],
   [{...teacher,disabled:true},'B1',28,key,401],
   [teacher,'A2',28,key,400],
   [teacher,'B1',27,key,400],
   [teacher,'B1',28,'b1/day-28/other.mp3',400],
   [teacher,'B1',28,'b1/day-28/../private.mp3',400],
   [teacher,'B1',28,'b1/day-28/klimafreundlich-leben.wav',400],
 ];
 for (const [account,level,day,requestKey,expected] of scenarios) {
   const responseObject=response();
   const handler=createClassroomAudioHandler({
     env,fetchImpl:async()=>({ok:true,json:async()=>({users:account?[account]:[]})}),
   });
   await handler({
     method:'GET',
     headers:account?{authorization:'Bearer test-staff-token',origin:'https://admin.falowen.app'}:{},
     url:'/course-media/classroom/audio-url?'+new URLSearchParams({level,day:String(day),key:requestKey})
   },responseObject);
   assert.equal(responseObject.code,expected,`${level} ${day} ${requestKey}`);
   assert.equal(Boolean(responseObject.body.url),expected===200);
   if (expected===200) {
     const url=new URL(responseObject.body.url);
     assert.equal(url.pathname,'/'+key);
     assert.equal(url.hostname,`falowen-course-audio.${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
     assert.match(url.searchParams.get('X-Amz-Signature'),/^[a-f0-9]{64}$/);
     assert.equal(responseObject.headers['Cache-Control'],'private, no-store');
     assert.equal(responseObject.headers['Access-Control-Allow-Origin'],'https://admin.falowen.app');
   }
 }
 const legacy=createClassroomBankAudioHandler({
   env,fetchImpl:async()=>({ok:true,json:async()=>({users:[teacher]})}),
 });
 const legacyResult=response();
 await legacy({method:'GET',headers:{authorization:'Bearer staff'},url:'/?'+new URLSearchParams({level:'B1',day:'28',key})},legacyResult);
 assert.equal(legacyResult.code,400,'legacy A2 playback must not expose B1 Day 28');
 assert.throws(()=>signTrack('b1-day28-klimafreundlich-leben',env),/Unknown/,'not part of the public music library');
});
