"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {normalizeWorkbook} = require("../swahiliSubmission");
const readingAnswers=Object.fromEntries(["read-purpose","read-delays","read-documents","read-label","read-message"].map(k=>[k,"jibu"]));
const listeningAnswers=Object.fromEntries(["listen-delay","listen-repair","listen-alternative","listen-advice","listen-next"].map(k=>[k,"jibu"]));
const input={level:"B1",day:26,title:"Matatizo ya safari na suluhisho zake",writing:{essay:"Insha yangu"},readingAnswers,listeningAnswers};
test("Day 26 stores essay and ten answers, with listening audio",()=>{
  const result=normalizeWorkbook(input);
  assert.equal(result.id,"b1-day-26");
  assert.equal(result.data.writing.essay,"Insha yangu");
  assert.equal(result.data.listeningTeacherLed,false);
  assert.equal(Object.keys(result.data.readingAnswers).length,5);
  assert.equal(Object.keys(result.data.listeningAnswers).length,5);
});
test("Day 26 requires the essay and each reading/listening answer",()=>{
  for (const writing of [{},{essay:"  "},{unrelated:"text"}]) assert.equal(normalizeWorkbook({...input,writing}),null);
  assert.equal(normalizeWorkbook({...input,readingAnswers:{...readingAnswers,"read-purpose":""}}),null);
  assert.equal(normalizeWorkbook({...input,listeningAnswers:{...listeningAnswers,"listen-delay":""}}),null);
});
