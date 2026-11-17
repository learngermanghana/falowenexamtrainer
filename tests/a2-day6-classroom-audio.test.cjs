const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createClassroomBankAudioHandler,signTrack}=require('../server/courseMusic.cjs');
const env={R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test-key',R2_SECRET_ACCESS_KEY:'test-secret',R2_AUDIO_BUCKET:'falowen-course-audio',REACT_APP_FIREBASE_API_KEY:'test-key'};
const key='a2/day-06/mobel-und-raume-kennenlernen.mp3';
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.body=v;return this;},end(){return this;}}}
test('A2 Day 6 signing requires valid teacher auth and the exact approved MP3 key',async()=>{
  const cases=[
    [null,6,key,401],
    [{localId:'student',email:'student@example.com'},6,key,403],
    [{localId:'teacher',email:'moxflex@gmail.com'},6,key,200],
    [{localId:'teacher',email:'moxflex@gmail.com'},5,key,400],
    [{localId:'teacher',email:'moxflex@gmail.com'},6,'a2/day-06/other.mp3',400],
    [{localId:'teacher',email:'moxflex@gmail.com'},6,'a2/day-06/../private.mp3',400]
  ];
  for(const [user,day,requested,expected] of cases){
    const res=response();
    await createClassroomBankAudioHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:user?[user]:[]})})})({
      method:'GET',headers:user?{authorization:'Bearer test',origin:'https://admin.falowen.app'}:{},
      url:'/course-media/a2/classroom-audio-url?'+new URLSearchParams({day:String(day),key:requested})
    },res);
    assert.equal(res.code,expected);
    assert.equal(Boolean(res.body?.url),expected===200);
    if(expected===200){
      const url=new URL(res.body.url);
      assert.equal(url.pathname,'/'+key);
      assert.equal(url.searchParams.get('X-Amz-Expires'),'3600');
      assert.equal(res.headers['Cache-Control'],'private, no-store');
    }
  }
  assert.throws(()=>signTrack('a2-day6-moebel-raeume-classroom',env),/Unknown/);
});
