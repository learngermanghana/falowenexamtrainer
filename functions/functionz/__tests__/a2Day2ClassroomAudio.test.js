const {createClassroomBankAudioHandler} = require('../../../server/courseMusic.cjs');

const env = {
  FIREBASE_API_KEY: 'unit-test-key',
  R2_ACCOUNT_ID: 'a'.repeat(32),
  R2_ACCESS_KEY_ID: 'test-access-key',
  R2_SECRET_ACCESS_KEY: 'test-secret',
  R2_AUDIO_BUCKET: 'falowen-course-audio',
};
const fetchImpl = async () => ({ok:true,json:async()=>({users:[{localId:'teacher-1',
  customAttributes:JSON.stringify({role:'teacher'}),email:'teacher@falowen.app'}]})});
const request = (day,key) => ({
  method:'GET', headers:{authorization:'Bearer fake-id-token',origin:'https://admin.falowen.app'},
  url:'/course-media/a2/classroom-audio-url?day='+encodeURIComponent(day)+'&key='+encodeURIComponent(key),
});
function response() {
  const res={code:0,body:null,headers:{},setHeader(key,value){this.headers[key]=value;return this;},
    status(code){this.code=code;return this;},json(body){this.body=body;return this;},end(){return this;}};
  return res;
}

test('A2 Day 2 staff-only signer accepts only the configured exact R2 object key',async()=>{
  const handle=createClassroomBankAudioHandler({env,fetchImpl});
  const good=response();
  await handle(request('2','a2/dat-02/personen-beschreiben.mp3'),good);
  expect(good.code).toBe(200);
  expect(good.body.track).toBe('a2-day2-personen-beschreiben');
  expect(good.body.url).toContain('/a2/dat-02/personen-beschreiben.mp3?');
  expect(good.headers['Access-Control-Allow-Origin']).toBe('https://admin.falowen.app');

  const wrongFolder=response();
  await handle(request('2','a2/day-02/personen-beschreiben.mp3'),wrongFolder);
  expect(wrongFolder.code).toBe(400);
  expect(wrongFolder.body.error).toMatch(/Invalid classroom audio request/);
  const wrongName=response();
  await handle(request('2','a2/dat-02/unapproved.mp3'),wrongName);
  expect(wrongName.code).toBe(400);
});

test('A2 Day 2 classroom recording cannot be fetched without staff login',async()=>{
  const handle=createClassroomBankAudioHandler({env,fetchImpl});
  const req=request('2','a2/dat-02/personen-beschreiben.mp3');
  delete req.headers.authorization;
  const res=response();await handle(req,res);
  expect(res.code).toBe(401);
});

test('A2 Day 24 classroom signer accepts the newly uploaded vacation recording and rejects wrong keys',async()=>{
  const handle=createClassroomBankAudioHandler({env,fetchImpl});
  const good=response();
  await handle(request('24','a2/day-24/einen-urlaub-planen.mp3'),good);
  expect(good.code).toBe(200);
  expect(good.body.track).toBe('a2-day24-urlaub-classroom');
  expect(good.body.url).toContain('/a2/day-24/einen-urlaub-planen.mp3?');
  const wrong=response();
  await handle(request('24','a2/day-24/other.mp3'),wrong);
  expect(wrong.code).toBe(400);
  const wrongDay=response();
  await handle(request('23','a2/day-24/einen-urlaub-planen.mp3'),wrongDay);
  expect(wrongDay.code).toBe(400);
});


test('A2 Day 4 teacher signer returns a signed URL only for the uploaded exact key',async()=>{
  const handle=createClassroomBankAudioHandler({env,fetchImpl});
  const key='a2/day-04/wo-mochten-wir-uns-treffen.mp3';
  const good=response();
  await handle(request('4',key),good);
  expect(good.code).toBe(200);
  expect(good.body.track).toBe('a2-day4-meeting-classroom');
  expect(good.body.url).toContain('/a2/day-04/wo-mochten-wir-uns-treffen.mp3?');
  expect(good.headers['Access-Control-Allow-Origin']).toBe('https://admin.falowen.app');

  const wrongKey=response();
  await handle(request('4','a2/day-04/another-recording.mp3'),wrongKey);
  expect(wrongKey.code).toBe(400);
  expect(wrongKey.body.error).toMatch(/Invalid classroom audio request/);

  const wrongDay=response();
  await handle(request('3',key),wrongDay);
  expect(wrongDay.code).toBe(400);

  const unauthenticated=request('4',key);
  delete unauthenticated.headers.authorization;
  const denied=response();
  await handle(unauthenticated,denied);
  expect(denied.code).toBe(401);
});
