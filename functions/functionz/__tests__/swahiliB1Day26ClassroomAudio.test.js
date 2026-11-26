const { createClassroomAudioHandler } = require('../../../server/courseMusic.cjs');
const env = { FIREBASE_API_KEY:'test-key', R2_ACCOUNT_ID:'0123456789abcdef0123456789abcdef', R2_ACCESS_KEY_ID:'test-access', R2_SECRET_ACCESS_KEY:'test-secret', R2_AUDIO_BUCKET:'falowen-course-audio' };
const fetchImpl = async () => ({ok:true,json:async()=>({users:[{localId:'teacher-id',email:'teacher@falowen.app'}]})});
const key = 'swahili/B1/day-26/swahili-listening matitizo.mp3';
function response() { return {code:null,body:null,headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(body){this.body=body;return this;},end(){return this;}}; }
async function request(audioKey, authorized=true, level='SWAHILI-B1', day=26) {
 const handler = createClassroomAudioHandler({env,fetchImpl,isAuthorized:()=>authorized});
 const res = response();
 await handler({method:'GET',url:'/course-media/classroom/audio-url?level='+level+'&day='+day+'&key='+encodeURIComponent(audioKey),headers:{authorization:'Bearer test-token',origin:'https://admin.falowen.app'}},res);
 return res;
}
test('Swahili Day 26 staff signer allows only the approved exact object with its space encoded',async()=>{
 const res=await request(key);
 expect(res.code).toBe(200);
 expect(res.body.url).toContain('/swahili/B1/day-26/swahili-listening%20matitizo.mp3?');
 expect(res.headers['Cache-Control']).toBe('private, no-store');
 expect((await request('swahili/B1/day-26/other.mp3')).code).toBe(400);
 expect((await request(key,true,'B1')).code).toBe(400);
 expect((await request(key,true,'SWAHILI-B1',27)).code).toBe(400);
 expect((await request(key,false)).code).toBe(403);
});
