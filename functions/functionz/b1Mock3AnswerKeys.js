"use strict";
// Mock 3 objective keys are server-only. Match teacher-approved source content.
const {QUESTIONS}=require("./b1Mock3Hoeren");
const READING_KEY=Object.freeze({
  "t1-1": "richtig",
  "t1-2": "richtig",
  "t1-3": "falsch",
  "t1-4": "falsch",
  "t1-5": "richtig",
  "t1-6": "falsch",
  "t2-7": "b",
  "t2-8": "a",
  "t2-9": "b",
  "t2-10": "b",
  "t2-11": "b",
  "t2-12": "c",
  "t3-13": "d",
  "t3-14": "0",
  "t3-15": "f",
  "t3-16": "b",
  "t3-17": "a",
  "t3-18": "c",
  "t3-19": "h",
  "t4-20": "nein",
  "t4-21": "nein",
  "t4-22": "ja",
  "t4-23": "nein",
  "t4-24": "ja",
  "t4-25": "nein",
  "t4-26": "ja",
  "t5-27": "c",
  "t5-28": "a",
  "t5-29": "c",
  "t5-30": "a"
});
const LISTENING_KEY=Object.freeze(Object.fromEntries(QUESTIONS.map(q=>[`t${q.part}-${q.number}`,q.answer])));
if(Object.keys(READING_KEY).length!==30 || Object.keys(LISTENING_KEY).length!==30) throw Error("B1 Mock 3 needs 30 questions per objective module");
module.exports={B1_MOCK3_READING_KEY:READING_KEY,B1_MOCK3_HOEREN_KEY:LISTENING_KEY};
