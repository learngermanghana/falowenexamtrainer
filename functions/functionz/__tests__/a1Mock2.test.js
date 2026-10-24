const { getA1MockSet, scoreA1Mock2Form, resolveA1MarkingSet } = require('../a1MockSets');
const { buildVerifiedA1MockScore, buildA1MockCompletionArtifacts, assignmentIdForAttempt } = require('../a1MockCompletionSync');
const { mockTaskPrompt, mockTaskVersion } = require('../assessmentTaskContext');
const mockId = 'a1-mock-02';
const answers = {1:'3',2:'Hotel Central, Hauptstraße 14, 10117 Berlin',3:'A1',4:'August',5:'Bar'};
const dbFor = data => ({collection:()=>({doc:()=>({collection:()=>({doc:()=>({get:async()=>({exists:!!data,data:()=>data})})})})})});

test('marks the five Rossi fields and accepts the supplied alternatives', () => {
  expect(scoreA1Mock2Form(answers).score).toBe(10);
  expect(scoreA1Mock2Form({1:'drei',2:'Hotel Central, Hauptstr. 14',3:'Grundkenntnisse',4:' august ',5:'Barzahlung'}).score).toBe(10);
  expect(scoreA1Mock2Form({...answers,1:'4',2:'Hotel Central, Hauptstraße 14, 99999 Berlin'}).score).toBe(6);
  expect(scoreA1Mock2Form({}).score).toBe(0);
});

test('binds marking to the stored attempt and preserves legacy Mock 1', async () => {
  await expect(resolveA1MarkingSet({mockId,uid:'u',attemptId:'a',db:dbFor({mockId,uid:'u'})})).resolves.toBe(mockId);
  await expect(resolveA1MarkingSet({mockId,uid:'u',attemptId:'a',db:dbFor({mockId:'a1-mock-01'})})).rejects.toMatchObject({status:409});
  await expect(resolveA1MarkingSet({mockId,uid:'u',attemptId:'a',db:dbFor({mockId,uid:'another'})})).rejects.toMatchObject({status:403});
  await expect(resolveA1MarkingSet({mockId,uid:'u',attemptId:'a',db:dbFor(null)})).rejects.toMatchObject({status:404});
  await expect(resolveA1MarkingSet({mockId,uid:'u'})).rejects.toMatchObject({status:400});
  await expect(resolveA1MarkingSet({uid:'u'})).resolves.toBe('a1-mock-01');
  expect(()=>getA1MockSet('unknown')).toThrow(/Unknown A1 mock/);
});

test('recomputes the supplied 15+15 answer keys using the stored mock identity', () => {
  const set = getA1MockSet(mockId);
  expect(Object.values(set.readingAnswerKey)).toEqual(['falsch','richtig','richtig','richtig','falsch','a','b','b','a','b','falsch','richtig','richtig','richtig','falsch']);
  expect(Object.values(set.listeningAnswerKey)).toEqual(['b','b','c','a','a','b','b','c','b','c','b','c','b','c','a']);
  const state={mockId:'a1-mock-01',lesenAnswers:set.readingAnswerKey,hoerenAnswers:set.listeningAnswerKey,overall:{score:100}};
  const result=buildVerifiedA1MockScore({mockId,state,verifiedSections:{schreiben:{verified:true,score:19},sprechen:{verified:true,score:20}}});
  expect(result.sectionScores).toEqual({lesen:25,hoeren:25,schreiben:19,sprechen:20});
  expect(result.overall.score).toBe(89);
});

test('uses the Markus and Bäckerei tasks for server marking with independent versions', () => {
  expect(mockTaskPrompt('A1','writing',undefined,mockId)).toContain('Markus');
  expect(mockTaskPrompt('A1','speaking',undefined,mockId)).toContain('Bäckerei');
  expect(mockTaskPrompt('A1','speaking',undefined,mockId)).toContain('Können Sie mir bitte einen Stift geben');
  expect(mockTaskPrompt('A1','writing')).not.toContain('Markus');
  expect(mockTaskVersion('A1','writing',mockId)).not.toBe(mockTaskVersion('A1','writing'));
});

test('publishes distinct Mock 2 result metadata and retakes', () => {
  const result=buildA1MockCompletionArtifacts({mockId,authedUser:{uid:'u'},attemptId:'a',firstAttempt:true,overall:{score:80,passed:true},sectionScores:{lesen:20,hoeren:20,schreiben:20,sprechen:20}});
  expect(result.scoreDocument).toMatchObject({mockId,assignment:'A1 Mock 2',assignmentId:'A1-MOCK-02',link:'/campus/course/a1-final-mock-2',certificateEligible:false});
  expect(result.notificationDocument.title).toBe('Your A1 Mock 2 result is ready');
  expect(assignmentIdForAttempt({mockId,attemptNumber:2})).toBe('A1-MOCK-02-PRACTICE-2');
});

test('starts and resumes independent first attempts without replacing the legacy pointer', async () => {
  const fs=require('fs'),vm=require('vm'),source=fs.readFileSync(require.resolve('../app'),'utf8');
  const route=source.slice(source.indexOf('app.post("/a1-mock/attempt/start"'),source.indexOf('app.post("/a1-mock/attempt/save"'));
  const docs=new Map();let next=0,handler;
  const merge=(a,b)=>Object.fromEntries([...new Set([...Object.keys(a),...Object.keys(b)])].map(k=>[k,b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])?merge(a[k]||{},b[k]):k in b?b[k]:a[k]]));
  const ref=path=>({id:path.split('/').at(-1),path,collection:name=>({doc:id=>ref(`${path}/${name}/${id||++next}`)})});
  const db={collection:name=>({doc:id=>ref(`${name}/${id}`)}),runTransaction:async fn=>fn({get:async r=>({exists:docs.has(r.path),data:()=>docs.get(r.path)}),set:(r,data,options)=>docs.set(r.path,options?.merge?merge(docs.get(r.path)||{},data):data)})};
  vm.runInNewContext(route,{app:{post:(_path,fn)=>{handler=fn;}},requireAuthenticatedUser:async()=>({uid:'u'}),getFirestoreSafe:()=>db,validateA1MockId:require('../a1MockSets').validateA1MockId,admin:{firestore:{FieldValue:{serverTimestamp:()=>1}}},console});
  const call=async id=>{let result;await handler({body:{mockId:id}},{json:data=>{result=data;},status(){return this;}});return result;};
  const one=await call('a1-mock-01'),two=await call(mockId);
  expect(one.firstAttempt).toBe(true);expect(two.firstAttempt).toBe(true);
  expect(two.attemptId).not.toBe(one.attemptId);
  expect((await call('a1-mock-01')).attemptId).toBe(one.attemptId);
  expect((await call(mockId)).attemptId).toBe(two.attemptId);
  expect(docs.get('a1MockExamUsers/u')).toMatchObject({activeAttemptId:one.attemptId,attemptCounts:{'a1-mock-01':1,'a1-mock-02':1},activeAttemptIds:{'a1-mock-01':one.attemptId,'a1-mock-02':two.attemptId}});
});
