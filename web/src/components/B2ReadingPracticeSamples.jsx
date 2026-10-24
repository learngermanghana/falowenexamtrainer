import React, {useEffect,useMemo,useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {saveExamRoomResult} from "../services/examRoomResultService";
import {getReadingPracticeStudentKey,getReadingReadinessLabel,getWeakestReadingSection,saveReadingPracticeAttempt} from "../services/readingPracticeHistory";
import tests from "../data/b2ReadingExtractedTests.json";
import "./B1FinalMockExamPage.css";

export const B2_READING_PRACTICE_SAMPLES=tests;
const PARTS=[{from:1,to:9},{from:10,to:15},{from:16,to:21},{from:22,to:27},{from:28,to:30}];
const DURATION=65*60;
const labelOf=value=>({a:"A",b:"B",c:"C",d:"D",e:"E",f:"F",g:"G",h:"H"})[value]||value.toUpperCase();
const optionsFor=n=>n<=9?["a","b","c","d"]:n<=15?["a","b","c","d","e","f","g","h"]:["a","b","c"];
const format=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");

export default function B2ReadingPracticeSamples({initialSampleId="",standalone=false}){
 const navigate=useNavigate();
 const {user,idToken,studentProfile}=useAuth();
 const [selected,setSelected]=useState(initialSampleId||tests[0].id);
 const [part,setPart]=useState(0);
 const [attempts,setAttempts]=useState({});
 const [sync,setSync]=useState({});
 const [timerOn,setTimerOn]=useState(false);
 const [time,setTime]=useState({});
 const sample=useMemo(()=>tests.find(x=>x.id===selected)||tests[0],[selected]);
 const answers=attempts[sample.id]?.answers||{};
 const submitted=Boolean(attempts[sample.id]?.submitted);
 const remaining=time[sample.id]??DURATION;
 const count=Object.values(answers).filter(Boolean).length;
 const score=sample.answers.filter((v,i)=>v===answers[i+1]).length;
 const pct=Math.round(score/30*100);
 const studentKey=getReadingPracticeStudentKey({studentProfile,user});
 const sectionScores=PARTS.map(({from,to},i)=>({label:"Teil "+(i+1),total:to-from+1,score:sample.answers.slice(from-1,to).filter((v,j)=>v===answers[from+j]).length}));
 const weakest=getWeakestReadingSection(sectionScores);
 useEffect(()=>{if(initialSampleId){setSelected(initialSampleId);setPart(0);setTimerOn(false)}},[initialSampleId]);
 useEffect(()=>{if(!timerOn||submitted||remaining<=0)return;const t=setInterval(()=>setTime(v=>({...v,[sample.id]:Math.max(0,(v[sample.id]??DURATION)-1)})),1000);return()=>clearInterval(t)},[timerOn,submitted,remaining,sample.id]);
 useEffect(()=>{if(remaining===0)setTimerOn(false)},[remaining]);
 const answer=(n,value)=>{if(!submitted)setAttempts(v=>({...v,[sample.id]:{...v[sample.id],answers:{...v[sample.id]?.answers,[n]:value}}}))};
 const submit=()=>{
  if(submitted||count!==30)return;
  setTimerOn(false);
  const attempt=saveReadingPracticeAttempt({level:"B2",setId:sample.id,score,total:30,elapsedSeconds:DURATION-remaining,sectionScores,studentKey});
  setAttempts(v=>({...v,[sample.id]:{...v[sample.id],submitted:true,attemptNumber:attempt?.attemptNumber}}));
  if(idToken&&attempt){
   setSync(v=>({...v,[sample.id]:"saving"}));
   void saveExamRoomResult({idToken,level:"B2",section:"lesen",setId:sample.id,title:"B2 "+sample.label,score,total:30,percent:pct,passed:pct>=60,attemptId:attempt.id,attemptNumber:attempt.attemptNumber,resultType:"practice",route:"/exams/lesen/b2/sample-"+(tests.indexOf(sample)+1),sectionScores:Object.fromEntries(sectionScores.map(x=>[x.label.toLowerCase().replace(/\\s/g,""),x.score]))}).then(()=>setSync(v=>({...v,[sample.id]:"saved"}))).catch(()=>setSync(v=>({...v,[sample.id]:"failed"})));
  }
 };
 const reset=()=>{setTimerOn(false);setTime(v=>({...v,[sample.id]:DURATION}));setAttempts(v=>({...v,[sample.id]:{answers:{},submitted:false}}));setSync(v=>({...v,[sample.id]:"idle"}));setPart(0)};
 const bounds=PARTS[part];
 return <main className="b1-final-shell" data-b2-reading-practice>
  <header className="b1-final-module-header">
   <p>B2 · Lesen · Exams Room</p><h1>{sample.label}</h1>
   <p>30 Aufgaben · Fünf Teile · 65 Minuten</p>
   <button type="button" onClick={()=>navigate(standalone?"/exams/lesen":"/exams/overview")}>Back to Lesen samples</button>
  </header>
  {!standalone?<nav aria-label="B2 reading sample selector">{tests.map((x,i)=><button type="button" key={x.id} onClick={()=>{setSelected(x.id);setPart(0);setTimerOn(false)}}>Lesen Sample {i+1}</button>)}</nav>:null}
  <section className="b1-final-paper">
   <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",justifyContent:"space-between"}}>
    <strong>Time left: {format(remaining)}</strong>
    <button type="button" disabled={submitted||remaining===0} onClick={()=>setTimerOn(v=>!v)}>{timerOn?"Pause timer":remaining===DURATION?"Start timer":"Resume timer"}</button>
    <span>{count}/30 answered</span>
   </div>
   <nav aria-label="B2 Lesen Teil selector" style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:14}}>
    {PARTS.map(({from,to},i)=><button type="button" key={i} disabled={part===i} onClick={()=>setPart(i)}>Teil {i+1} · {Array.from({length:to-from+1},(_,j)=>answers[from+j]).filter(Boolean).length}/{to-from+1}</button>)}
   </nav>
  </section>
  <section className="b1-final-paper">
   <h2>Teil {part+1}</h2>
   <div className="b1-final-reading-text" style={{whiteSpace:"pre-wrap",lineHeight:1.7}}>{sample.sectionTexts[part]}</div>
   <h3>Antwortbogen</h3>
   {Array.from({length:bounds.to-bounds.from+1},(_,j)=>bounds.from+j).map(n=><fieldset key={n} style={{padding:12,margin:"12px 0",border:"1px solid #d6dbe5",borderRadius:9}}>
    <legend><strong>Aufgabe {n}</strong></legend>
    <div className="b1-final-choices" role="radiogroup" aria-label={"Aufgabe "+n}>
     {optionsFor(n).map(val=><label key={val} className={answers[n]===val?"selected":""}>
       <input type="radio" name={sample.id+"-"+n} checked={answers[n]===val} disabled={submitted||remaining===0} onChange={()=>answer(n,val)}/>
       <span>{labelOf(val)}</span>
     </label>)}
    </div>
    {submitted?<p role="status">{answers[n]===sample.answers[n-1]?"Correct.":"Correct answer: "+labelOf(sample.answers[n-1])}</p>:null}
   </fieldset>)}
  </section>
  <footer className="b1-final-paper">
   {!submitted?<><p>Complete all 30 questions before checking your answers.</p><button className="b1-final-primary" type="button" disabled={count!==30} onClick={submit}>Check answers ({count}/30)</button></>:
   <div role="status"><h2>Result: {score}/30 · {pct}% · {getReadingReadinessLabel(pct)}</h2><p>{weakest?"Practise next: "+weakest.label:""}</p><p>{sectionScores.map(x=>x.label+": "+x.score+"/"+x.total).join(" · ")}</p><p>{sync[sample.id]==="saved"?"Your result is synced.":sync[sample.id]==="saving"?"Syncing result…":sync[sample.id]==="failed"?"Cloud sync not confirmed.":"Practice submitted."}</p><button type="button" onClick={reset}>Try again</button></div>}
  </footer>
 </main>;
}
