"use strict";
// Mock 04 unified exam private 30-question answer map. The key is identical
// to independent Lesen practice; no client-side answer exposure.
const {ANSWERS}=require("./b1Mock4Lesen");
const {QUESTIONS}=require("./b1Mock4Hoeren");
const READING=Object.freeze(Object.fromEntries(Object.entries(ANSWERS).map(([number,value])=>{
  const n=Number(number); const part=n<=6?1:n<=12?2:n<=19?3:n<=26?4:5;
  return [`t${part}-${n}`,value];
})));
const LISTENING=Object.freeze(Object.fromEntries(QUESTIONS.map(q=>[`t${q.part}-${q.number}`,q.answer])));
if(Object.keys(READING).length!==30 || Object.keys(LISTENING).length!==30) throw Error("B1 Mock 04 must have 30 questions per module");
module.exports={B1_MOCK4_READING_KEY:READING,B1_MOCK4_HOEREN_KEY:LISTENING};
