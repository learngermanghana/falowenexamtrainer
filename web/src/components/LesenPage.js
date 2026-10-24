import React from "react";
import {useNavigate} from "react-router-dom";
import {useExam} from "../context/ExamContext";
import {useAuth} from "../context/AuthContext";
import {announceExamSuccess} from "../services/interactionFeedback";
import {
  getReadingPracticeHistory,getReadingPracticeStudentKey
} from "../services/readingPracticeHistory";
import {readingLevelConfig,ReadingPracticeSampleList} from "./ReadingPracticeShell";
import A1ReadingPracticeSamples,{A1_READING_PRACTICE_SAMPLES} from "./A1ReadingPracticeSamples";
import A2ReadingPracticeSamples,{A2_READING_PRACTICE_SAMPLES} from "./A2ReadingPracticeSamples";
import B1ReadingPracticeSamples from "./B1ReadingPracticeSamples";
import {B1_READING_PRACTICE_SAMPLES} from "../data/b1ReadingPracticeSamples";
import C1FinalMockExamPage from "./C1FinalMockExamPage";
import {C1_READING_PRACTICE_STORAGE_KEY} from "../data/c1FinalMockData";
import {getStudentMockStorageKey} from "../utils/mockReviewAccess";
import "./ReadingPracticeShell.css";

const LEVELS=["A1","A2","B1","B2","C1","C2"];
const C1_SAMPLES=Object.freeze([{
  id:"c1-reading-01",slug:"sample-1",label:"Lesen Sample 1",
  detail:"26 current tasks · 4 Teile · reading practice"
}]);
const samplesForLevel=level=>{
  if(level==="C1")return C1_SAMPLES;
  const sets=level==="B1"?B1_READING_PRACTICE_SAMPLES
    :level==="A2"?A2_READING_PRACTICE_SAMPLES:A1_READING_PRACTICE_SAMPLES;
  const config=readingLevelConfig[level];
  return sets.map((sample,index)=>({
    id:sample.id,slug:`sample-${index+1}`,label:`Lesen Sample ${index+1}`,
    detail:`${config.questions} questions · ${config.parts} Teile · ${config.minutes} minutes`,
  }));
};
const progressFor=(level,studentKey,userId)=>{
  if(typeof window==="undefined")return {};
  if(level==="C1"){
    try{
      const c1=JSON.parse(window.localStorage.getItem(
        getStudentMockStorageKey(C1_READING_PRACTICE_STORAGE_KEY,userId))||"null");
      if(!c1)return {};
      const keys=["teil1Answers","teil2Answers","teil3Answers","teil4Answers"];
      const responses=Object.assign({},...keys.map(key=>c1[key]||{}));
      return {submittedBySample:{"c1-reading-01":Boolean(c1.completed)},
        answersBySample:{"c1-reading-01":responses}};
    }catch{return {};}
  }
  if(!["A1","A2","B1"].includes(level))return {};
  try{
    const saved=JSON.parse(window.localStorage.getItem(
      `falowen:exams:lesen:${level.toLowerCase()}:three-samples:${studentKey||"guest"}`
    )||"null");
    return saved&&typeof saved==="object"?saved:{};
  }catch{return {};}
};
export default function LesenPage({practiceLevel="",sampleId=""}){
  const navigate=useNavigate();
  const {level,setLevel,accessibleLevels=[]}=useExam();
  const {studentProfile,user}=useAuth();
  const examOnly=studentProfile?.accountType==="exam_only";
  const availableLevels=examOnly?[String(studentProfile?.level||"A1").toUpperCase()]:accessibleLevels;
  const routeLevel=String(practiceLevel||"").toUpperCase();
  const currentLevel=String(level||"A1").toUpperCase();
  const requested=LEVELS.includes(routeLevel)?routeLevel:currentLevel;
  const permitted=availableLevels.includes(requested);
  const normalizedLevel=permitted?requested:currentLevel;
  const studentKey=getReadingPracticeStudentKey({studentProfile,user});
  const open=(item)=>{
    announceExamSuccess(`${normalizedLevel} ${item.label} opened.`);
    navigate(`/exams/lesen/${normalizedLevel.toLowerCase()}/${item.slug}`);
  };
  const selectLevel=next=>{
    if(!availableLevels.includes(next))return;
    setLevel(next);
    navigate(`/exams/lesen/${next.toLowerCase()}`);
  };
  const cfg=readingLevelConfig[normalizedLevel];
  const samples=cfg?.available?samplesForLevel(normalizedLevel):[];
  const selected=sampleId?samples.find(item=>item.slug===sampleId):null;
  if(sampleId && selected && cfg?.available){
    if(normalizedLevel==="C1")return <C1FinalMockExamPage readingPractice/>;
    if(normalizedLevel==="B1")return <B1ReadingPracticeSamples initialSampleId={selected.id} standalone/>;
    if(normalizedLevel==="A2")return <A2ReadingPracticeSamples initialSampleId={selected.id} standalone/>;
    return <A1ReadingPracticeSamples initialSampleId={selected.id} standalone/>;
  }
  const progress=progressFor(normalizedLevel,studentKey,user?.uid);
  const history=getReadingPracticeHistory(normalizedLevel,studentKey);
  const enriched=samples.map(sample=>({
    ...sample,
    status:progress.submittedBySample?.[sample.id]||history.some(row=>row.setId===sample.id)
      ?"Completed":Object.keys(progress.answersBySample?.[sample.id]||{}).length?"In progress":"Not started",
  }));
  return <main className="reading-standard-hub" data-reading-level={normalizedLevel}>
    <header className="reading-standard-hub-header">
      <p>FALOWEN · EXAMS ROOM</p>
      <h1>Lesen Practice</h1>
      <span>Choose your level, select a reading sample, then practise each Teil using the same navigation.</span>
    </header>
    <nav className="reading-standard-levels" aria-label="Choose Lesen level">
      {LEVELS.map(item=>{
        const allowed=availableLevels.includes(item);
        const ready=readingLevelConfig[item].available;
        return <button type="button" key={item} disabled={!allowed}
          aria-current={item===normalizedLevel?"page":undefined}
          className={item===normalizedLevel?"is-active":""}
          aria-label={`${item} Lesen${!allowed?", level locked":!ready?", practice coming soon":""}`}
          onClick={()=>selectLevel(item)}>
          <strong>{item}</strong>
          <small>{!allowed?"Locked":ready?"Practice":"Coming soon"}</small>
        </button>;
      })}
    </nav>
    {!permitted?<p role="status" className="reading-standard-notice">
      This level is not included in your current exam access. Showing your available level instead.
    </p>:null}
    {sampleId&&!selected?<p role="alert" className="reading-standard-notice">
      That reading sample was not found. Choose one of the available samples below.
    </p>:null}
    {cfg?.available ? <ReadingPracticeSampleList level={normalizedLevel}
      samples={enriched} results={history} onOpen={open}/> :
      <section className="reading-standard-library" role="status">
        <h2>{normalizedLevel} · Lesen samples</h2>
        <p>A complete interactive practice sample has not been published for this level yet.
          We will show the same Lesen interface here when the question bank is ready.</p>
        <button type="button" className="reading-standard-back" onClick={()=>navigate("/exams/overview")}>
          ← Back to Exams Room
        </button>
      </section>}
  </main>;
}
