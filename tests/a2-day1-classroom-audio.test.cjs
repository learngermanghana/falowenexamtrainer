const test=require('node:test');
const assert=require('node:assert/strict');
const {createClassroomBankAudioHandler,TRACKS}=require('../server/courseMusic.cjs');
const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test-key',R2_SECRET_ACCESS_KEY:'test-secret',R2_AUDIO_BUCKET:'falowen-course-audio',REACT_APP_FIREBASE_API_KEY:'test-public-key'};
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(body){this.body=body;return this;},end(){return this;}};}
const key='a2/day-01/small-talk.mp3';
test('A2 Day 1 classroom signer admits only staff and the teacher-confirmed exact key',async()=>{
 for(const [account,day,object,expected] of [
  [null,1,key,401],
  [{localId:'student',email:'student@example.com'},1,key,403],
  [{localId:'staff',customAttributes:'{"admin":true}'},1,key,200],
  [{localId:'staff',customAttributes:'{"admin":true}'},2,key,400],
  [{localId:'staff',customAttributes:'{"admin":true}'},1,'a2/day-1/small-talk.mp3',400],
  [{localId:'staff',customAttributes:'{"admin":true}'},1,'a2/day-01/other.mp3',400],
  [{localId:'staff',customAttributes:'{"admin":true}'},1,'a2/day-01/../small-talk.mp3',400],
 ]){
  const res=response();
  await createClassroomBankAudioHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:account?[account]:[]})})})({method:'GET',headers:account?{authorization:'Bearer test',origin:'https://admin.falowen.app'}:{},url:'/?'+new URLSearchParams({day:String(day),key:object})},res);
  assert.equal(res.code,expected);assert.equal(Boolean(res.body.url),expected===200);
  if(expected===200){assert.equal(new URL(res.body.url).pathname,'/'+key);assert.equal(res.headers['Cache-Control'],'private, no-store');}
 }
 assert.ok(!JSON.stringify(TRACKS).includes(key));
});
