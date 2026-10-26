const {test}=require('node:test');
const assert=require('node:assert/strict');
const {genericTutorTask,parseGenericTutorScore,saveTutorSpeakingAssessment}=require('../verifiedTutorSpeaking');
test('only registered checkpoint tasks are accepted and score validation fails closed',()=>{
 assert.equal(genericTutorTask('A1 tutor checkpoint A1-4','1').assignmentKey,'A1-4');
 assert.equal(genericTutorTask('A1 tutor checkpoint A1-4','3'),null);
 assert.equal(genericTutorTask('A1 tutor checkpoint A1-99','1'),null);
 for(const score of [null,'8',11,-1]) assert.throws(()=>parseGenericTutorScore(JSON.stringify({score,feedback:'Good'})));
 assert.equal(parseGenericTutorScore('{"score":8,"feedback":"Good"}').score,8);
});
test('receipt is server-owned and stores marks without audio or transcript',async()=>{
 let saved;
 const db={collection:name=>{assert.equal(name,'verifiedTutorSpeakingAssessments');return {doc:()=>({id:'receipt123',create:async data=>{saved=data;}})}}};
 const result=await saveTutorSpeakingAssessment({db,uid:'u1',assignmentKey:'A1-11',scored:{score:8,maxScore:10,feedback:'Good',cardId:'stift',cardLabel:'Stift',transcript:'not persisted',audio:'not persisted'}});
 assert.deepEqual(result,{assessmentId:'receipt123',verified:true});
 assert.equal(saved.uid,'u1');assert.equal(saved.score,8);assert.equal(saved.transcript,undefined);assert.equal(saved.audio,undefined);
});
