"use strict";
const {PARTS,QUESTIONS,publicB1Mock2Hoeren,markB1Mock2Hoeren}=require("../b1Mock2Hoeren");
const {PART_KEYS,verifyB1Mock2Audio}=require("../b1Mock2PublishedAudio");

test("exact teacher-provided paths and 30 source-grounded questions",()=>{
 expect(PARTS.map(p=>p.count)).toEqual([10,5,7,8]);
 expect(QUESTIONS.map(q=>q.number)).toEqual(Array.from({length:30},(_,i)=>i+1));
 for(let i=1;i<=4;i++)expect(PART_KEYS["teil-"+i]).toBe("b1/mock-hoeren/mock-02/teil-"+i+".mp3");
 for(const question of QUESTIONS)expect(question.options.map(o=>o.id)).toContain(question.answer);
 expect(QUESTIONS.find(q=>q.number===20).question).toBe("Julias Schwester bringt das Partylicht mit.");
});

test("public question payload never exposes answer keys or evidentiary text",()=>{
 const publicData=publicB1Mock2Hoeren();
 expect(publicData.practiceOnly).toBe(true);
 expect(publicData.parts.flatMap(p=>p.questions)).toHaveLength(30);
 for(const q of publicData.parts.flatMap(p=>p.questions)){
  expect(q).not.toHaveProperty("answer");
  expect(q).not.toHaveProperty("evidence");
 }
 expect(publicData.introductionNotice).toMatch(/ältere Audio-Ansage/);
});

test("server marks complete submissions deterministically and rejects malformed requests",()=>{
 const perfect=Object.fromEntries(QUESTIONS.map(q=>[q.number,q.answer]));
 expect(markB1Mock2Hoeren(perfect)).toMatchObject({correct:30,total:30,percentage:100});
 const wrong={...perfect,1:"richtig",11:"a"};
 expect(markB1Mock2Hoeren(wrong).correct).toBe(28);
 expect(()=>markB1Mock2Hoeren({})).toThrow(/Answer all 30/);
 expect(()=>markB1Mock2Hoeren({...perfect,2:"d"})).toThrow(/Invalid answer/);
});

test("range verifier refuses wildcard, other mocks, and unavailable R2 objects",async()=>{
 const key=PART_KEYS["teil-1"];
 const url="https://falowen-course-audio.abc.r2.cloudflarestorage.com/"+key;
 const fetchImpl=jest.fn(async()=>({status:404}));
 for(const patch of [{level:"A2"},{mockId:"mock-01"},{part:"teil-9"},{key:key+"-copy"},{signedUrl:"https://example.com/"+key}]){
  expect(await verifyB1Mock2Audio({level:"B1",mockId:"mock-02",part:"teil-1",key,signedUrl:url,fetchImpl,...patch})).toBe(false);
 }
 expect(fetchImpl).not.toHaveBeenCalled();
 expect(await verifyB1Mock2Audio({level:"B1",mockId:"mock-02",part:"teil-1",key,signedUrl:url,fetchImpl})).toBe(false);
});

test("bounded, three-byte ID3 response authorizes only exact teacher-approved R2 key",async()=>{
 const part="teil-4",key=PART_KEYS[part];
 const url="https://falowen-course-audio.abc.r2.cloudflarestorage.com/"+key;
 const fetchImpl=jest.fn(async(_url,opts)=>({
  status:206, headers:{get:name=>name==="content-range"?"bytes 0-2/532000":""},
  arrayBuffer:async()=>Buffer.from("ID3")
 }));
 expect(await verifyB1Mock2Audio({level:"B1",mockId:"mock-02",part,key,signedUrl:url,fetchImpl})).toBe(true);
 expect(fetchImpl).toHaveBeenCalledTimes(1);
 expect(fetchImpl.mock.calls[0][1].headers.Range).toBe("bytes=0-2");
});
