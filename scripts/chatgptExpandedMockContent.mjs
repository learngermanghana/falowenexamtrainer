// Only learner-facing fields from the same modules Campus Practice Mode uses.
// This module never copies answer keys, audio object keys, or hidden rubrics.
import { A2_MOCK_2_LESEN } from "../web/src/data/a2Mock2Lesen.js";
import { A2_MOCK_2_HOEREN } from "../web/src/data/a2Mock2Hoeren.js";
import { A2_KOMBI_SETS } from "../web/src/data/a2KombiMockSets.js";
import { A2_MOCK_04_HOEREN } from "../web/src/data/a2Mock04Hoeren.js";
import { A2_MOCK_05_HOEREN } from "../web/src/data/a2Mock05Hoeren.js";
import { A2_MOCK_06_HOEREN } from "../web/src/data/a2Mock06Hoeren.js";
import { A2_MOCK_07_HOEREN } from "../web/src/data/a2Mock07Hoeren.js";
import { B1_READING, B1_LISTENING, B1_WRITING_TASKS, B1_SPEAKING } from "../web/src/data/b1FinalMockData.js";
import { B1_MOCK2_READING, B1_MOCK2_WRITING_TASKS, B1_MOCK2_SPEAKING } from "../web/src/data/b1Mock2ExamContent.js";

const text=(v,max=6000)=>typeof v==="string"?v.trim().slice(0,max):"";
const strings=(v,max=30)=>Array.isArray(v)?v.slice(0,max).map(s=>text(s)).filter(Boolean):[];
const options=v=>Array.isArray(v)?v.map(o=>({id:text(Array.isArray(o)?o[0]:o?.id,30).toLowerCase(),label:text(Array.isArray(o)?o[1]:o?.label,500)})).filter(o=>o.id&&o.label):[];
const yesNo=options([["ja","Ja"],["nein","Nein"]]);
const trueFalse=options([["richtig","Richtig"],["falsch","Falsch"]]);
const adChoices=(ads,none)=>[...options(ads.map(a=>[a[0],a[1]])),{id:none,label:"Keine passende Anzeige"}];
const question=(q,fallback=[])=>({
  number:Number(q.number),statement:text(q.question||q.statement||(typeof q.text==="string"?q.text:"")||q.day||q.person,1000),
  options:options(q.options).length?options(q.options):fallback
});
const safeQuestions=(qs,fallback)=>qs.map(q=>question(q,fallback)).filter(q=>Number.isInteger(q.number)&&q.statement&&q.options.length>1);
const adsText=ads=>Array.isArray(ads)?ads.map(a=>Array.isArray(a)?a.slice(0,3).map(s=>text(s)).join(" · "):[a.id,a.title,a.body].map(s=>text(s)).join(" · ")):[];

function a2Reading(parts){
  return Object.fromEntries(parts.map((p,i)=>{
    const fallback=p.ads?.length?adChoices(p.ads,"x"):[];
    return ["teil"+(i+1),{
      title:text(p.title),instruction:text(p.instruction),contextLines:[...strings(p.paragraphs),text(p.passage),...adsText(p.ads)].filter(Boolean),
      questions:safeQuestions(p.questions||[],fallback),
    }];
  }).filter(([,p])=>p.contextLines.length&&p.questions.length));
}
function listening(parts,kind){
  return Object.fromEntries(parts.map((p,i)=>{
    const fallback=p.pictures?.length?options(p.pictures):kind==="a2-2"&&i===3?yesNo:[];
    return ["teil"+(i+1),{title:text(p.title),instruction:text(p.instruction),listenInExamRoom:true,
      questions:safeQuestions(p.questions||[],fallback)}];
  }).filter(([,p])=>p.questions.length));
}
function b1Reading(paper){
  const out={};
  for(const n of [1,2,5]){
    const part=paper["teil"+n];
    if(!part)continue;
    const subparts=n===2?[part,part.text2].filter(Boolean):[part];
    const questions=subparts.flatMap(p=>{
      const contextLines=[text(p.heading),...strings(p.paragraphs),...strings(p.lines),text(p.passage),text(p.text)].filter(Boolean);
      if(!contextLines.length)return [];
      return safeQuestions(p.questions||[],n===1?trueFalse:[]).map(q=>({...q,contextLines}));
    });
    if(questions.length)out["teil"+n]={title:text(part.title),instruction:text(part.intro||part.instruction),questions};
  }
  // Matching and comment parts have different visual layouts; leave them in Campus
  // until each question and all of its context have a reviewed text representation.
  return out;
}
function task(t){
  return {title:text(t.title,250),prompt:text(t.prompt||t.situation||t.context,5000),
    instruction:text(t.instruction,1500),points:strings(t.points,15),topic:text(t.topic,300),
    quote:text(t.quote,1500),quoteBy:text(t.quoteBy,150),wordTarget:Number.isInteger(t.wordTarget)?t.wordTarget:Number.isInteger(t.target)?t.target:null};
}
function tasks(items){
  return Object.fromEntries((Array.isArray(items)?items:Object.values(items||{})).map((t,i)=>["teil"+(i+1),task(t)]).filter(([,t])=>t.prompt||t.points.length||t.topic));
}
function kombiSpeaking(paper){
  return tasks([{title:"Teil 1 · Fragen stellen",prompt:"Stellen Sie Fragen zu diesen Themenkarten.",points:paper.speaking.cards.map(c=>c.theme+": "+c.keyword)},
    {title:"Teil 2 · Von sich erzählen",...paper.speaking.teil2},
    {title:"Teil 3 · Gemeinsam planen",...paper.speaking.teil3}]);
}
export function expandedMockContent(){
  const reading={"a2-mock-02":a2Reading(A2_MOCK_2_LESEN),"b1-final-01":b1Reading(B1_READING),"b1-mock-02":b1Reading(B1_MOCK2_READING)};
  const listeningSets={"a2-mock-02":listening(A2_MOCK_2_HOEREN,"a2-2"),"b1-final-01":listening(B1_LISTENING,"b1")};
  const writing={"b1-final-01":tasks(B1_WRITING_TASKS),"b1-mock-02":tasks(B1_MOCK2_WRITING_TASKS)};
  const speaking={"b1-final-01":tasks(B1_SPEAKING),"b1-mock-02":tasks(B1_MOCK2_SPEAKING)};
  const audio=[A2_MOCK_04_HOEREN,A2_MOCK_05_HOEREN,A2_MOCK_06_HOEREN,A2_MOCK_07_HOEREN];
  for(const [id,p] of Object.entries(A2_KOMBI_SETS)){
    reading[id]=a2Reading(p.reading);
    writing[id]=tasks(p.writing);
    speaking[id]=kombiSpeaking(p);
    const index=Number(id.slice(-2))-4;
    if(audio[index])listeningSets[id]=listening(audio[index],"a2-kombi");
  }
  return {reading,listening:listeningSets,mockWriting:writing,mockSpeaking:speaking};
}
