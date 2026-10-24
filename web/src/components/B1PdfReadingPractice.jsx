import React, {useEffect,useMemo,useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {saveExamRoomResult} from "../services/examRoomResultService";
import {getReadingPracticeStudentKey,saveReadingPracticeAttempt} from "../services/readingPracticeHistory";
import B1_PDF_TESTS from "../data/b1ReadingPdfTests1to8.json";

const duration=65*60;
const bounds=[[1,6],[7,12],[13,19],[20,26],[27,30]];
const labels={richtig:"Richtig",falsch:"Falsch",ja:"Ja",nein:"Nein"};
const opts=n=> n<=6?["richtig","falsch"]:n<=12?["a","b","c"]:
 n<=19?["a","b","c","d","e","f","g","h","i","j","X"]:
 n<=26?["ja","nein"]:["a","b","c"];
const pad=n=>String(n).padStart(2,"0");
export default function B1PdfReadingPractice({initialSampleId,standalone=false}){
 const navigate=useNavigate();
 const {user,idToken,studentProfile}=useAuth();
 const [selected,setSelected]=useState(initialSampleId||B1_PDF_TESTS[0].id);
 const [part,setPart]=useState(0);
 const [state,setState]=useState({});
 const [now,setNow]=useState(Date.now());
 const [sync,setSync]=useState("");
 const sample=useMemo(()=>B1_PDF_TESTS.find(x=>x.id===selected)||B1_PDF_TESTS[0],[selected]);
 const studentKey=getReadingPracticeStudentKey({user,studentProfile});
 const storageKey="falowen:exams:lesen:b1:uploaded-tests:"+(studentKey||"guest");
 useEffect(()=>{if(initialSampleId){setSelected(initialSampleId);setPart(0)}},[initialSampleId]);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(storageKey)||"{}");setState(saved&&typeof saved==="object"?saved:{})}catch{setState({})}},[storageKey]);
 useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(state))}catch{}},[state,storageKey]);
 useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t)},[]);
 const entry=state[sample.id]||{};
 const answers=entry.answers||{};
 const count=Object.values(answers).filter(Boolean).length;
 const remain=entry.startedAt?Math.max(0,Math.ceil((entry.startedAt+duration*1000-now)/1000)):duration;
 const score=sample.answerKey.filter((answer,index)=>answers[index+1]===answer).length;
 const start=()=>setState(v=>({...v,[sample.id]:{...v[sample.id],startedAt:Date.now(),answers:{},submitted:false}}));
 const answer=(n,value)=>setState(v=>({...v,[sample.id]:{...v[sample.id],answers:{...(v[sample.id]?.answers||{}),[n]:value}}}));
 const submit=()=>{
  if(entry.submitted||count!==30)return;
  const percent=Math.round(score/30*100);
  const sections=bounds.map(([a,b],index)=>({label:"Teil "+(index+1),score:sample.answerKey.slice(a-1,b).filter((v,k)=>answers[a+k]===v).length,total:b-a+1}));
  const attempt=saveReadingPracticeAttempt({level:"B1",setId:sample.id,score,total:30,elapsedSeconds:duration-remain,sectionScores:sections,studentKey});
  setState(v=>({...v,[sample.id]:{...v[sample.id],submitted:true,score,attemptNumber:attempt?.attemptNumber||null}}));
  if(idToken&&attempt){setSync("saving");void saveExamRoomResult({idToken,level:"B1",section:"lesen",setId:sample.id,title:"B1 "+sample.label,score,total:30,percent,passed:percent>=60,attemptId:attempt.id,attemptNumber:attempt.attemptNumber,resultType:"practice",route:"/exams/lesen",sectionScores:Object.fromEntries(sections.map(x=>[x.label.toLowerCase().replace(/\\s+/g,""),x.score]))}).then(()=>setSync("saved")).catch(()=>setSync("failed"))}
 };
 const formatTime=s=>pad(Math.floor(s/60))+":"+pad(s%60);
 return <main style={{maxWidth:980,margin:"20px auto",padding:18,background:"white",borderRadius:12}}>
  <button type="button" onClick={()=>navigate("/exams/lesen")}>← Back to B1 Lesen samples</button>
  <h1>B1 {sample.label}</h1><p>65 Minuten · 30 Aufgaben · Teil 1–5 · Bestehensgrenze 60%</p>
  <p role="status"><strong>Verbleibende Zeit: {formatTime(remain)}</strong> · {count}/30 beantwortet</p>
  {!entry.startedAt?<button type="button" onClick={start}>Prüfung beginnen</button>:<>
   <nav aria-label="Lesen Teile" style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>{bounds.map(([a,b],i)=><button type="button" key={i} onClick={()=>setPart(i)} disabled={entry.submitted&&false} aria-current={part===i?"page":undefined}>Teil {i+1} ({a}–{b})</button>)}</nav>
   <article style={{whiteSpace:"pre-wrap",fontFamily:"inherit",lineHeight:1.55,border:"1px solid #d5dce8",padding:18,borderRadius:10,marginBottom:20}}>{sample.sections[part+1]}</article>
   <section><h2>Antwortbogen · Teil {part+1}</h2>
   {Array.from({length:bounds[part][1]-bounds[part][0]+1},(_,k)=>bounds[part][0]+k).map(n=><fieldset key={n} style={{margin:"10px 0",padding:12,border:"1px solid #dce3ee",borderRadius:8}}>
    <legend><strong>Aufgabe {n}</strong></legend>
    <div style={{display:"flex",flexWrap:"wrap",gap:12}}>{opts(n).map(choice=><label key={choice}><input type="radio" name={sample.id+"-"+n} checked={answers[n]===choice} disabled={Boolean(entry.submitted)||remain===0} onChange={()=>answer(n,choice)}/> {labels[choice]||choice.toUpperCase()}</label>)}</div>
    {entry.submitted?<p role="status">{answers[n]===sample.answerKey[n-1]?"Richtig":"Lösung: "+(labels[sample.answerKey[n-1]]||sample.answerKey[n-1].toUpperCase())}</p>:null}
   </fieldset>)}
   </section>
   {!entry.submitted?<button type="button" disabled={count!==30} onClick={submit}>Antworten bewerten ({count}/30)</button>:<section role="status"><h2>Ergebnis: {score}/30 · {Math.round(score/30*100)}%</h2><p>{sync==="saving"?"Synchronisierung läuft …":sync==="saved"?"Ergebnis gespeichert.":sync==="failed"?"Synchronisierung nicht bestätigt; lokale Antworten bleiben verfügbar.":""}</p><button type="button" onClick={start}>Noch einmal üben</button></section>}
  </>}
 </main>;
}
