const {createClassroomRecordingPathHandler}=require('../../../server/courseMusic.cjs');
const env={FIREBASE_API_KEY:'test',R2_ACCOUNT_ID:'0123456789abcdef0123456789abcdef',R2_ACCESS_KEY_ID:'test',R2_SECRET_ACCESS_KEY:'test',R2_AUDIO_BUCKET:'falowen-course-audio'};
async function request(path,authorized=true,token=true){
 const handler=createClassroomRecordingPathHandler({env,fetchImpl:async()=>({ok:true,json:async()=>({users:[{localId:'teacher'}]})}),isAuthorized:()=>authorized});
 const res={code:0,body:null,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(x){this.body=x;return this;},end(){return this;}};
 await handler({method:'GET',url:'/course-media/classroom/'+path,headers:token?{authorization:'Bearer token',origin:'https://admin.falowen.app'}:{}},res);
 return res;
}
test.each([
 ['swahili-b1/26/audio-url','swahili/B1/day-26/swahili-listening%20matitizo.mp3'],
 ['swahili-b1/27/audio-url','swahili/B1/day-27/kuntunza.mp3'],
 ['swahili-b1/28/audio-url','swahili/B1/day-28/swahili-listening%20kuntasa.mp3'],
 ['b1/26/audio-url','a2/day-26/reiseprobleme-und-losungen.mp3'],
 ['b1/27/audio-url','b1/day-27/umweltfreundlich-im-alltag.mp3'],
 ['a2/7/audio-url','a2/day-07/eine-wohnung-suchen.mp3'],
 ['a2/1/audio-url','a2/day-01/small-talk.mp3'],
 ['a2/17/audio-url','a2/day-17/apotheken-detektiv.mp3'],
 ['a2/26/audio-url','a2/day-26/gefuhle-beschreiben.mp3'],
 ['a2/28/audio-url','a2/day-28/uber-die-zukunft-sprechen.mp3']
])('signs exact registered path %s',async(path,key)=>{
 const r=await request(path); expect(r.code).toBe(200);expect(new URL(r.body.url).pathname).toBe('/'+key);expect(r.headers['Cache-Control']).toBe('private, no-store');
});
test('rejects arbitrary keys and enforces staff auth',async()=>{
 expect((await request('swahili-b1/27/audio-url?key=other.mp3')).code).toBe(400);
 expect((await request('swahili-b1/1/audio-url')).code).toBe(404);
 expect((await request('swahili-b1/27/audio-url',false)).code).toBe(403);
 expect((await request('swahili-b1/27/audio-url',true,false)).code).toBe(401);
});
