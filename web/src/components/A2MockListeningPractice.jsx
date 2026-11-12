import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {styles} from "../styles";
import A2Mock04Hoeren from "./A2Mock04Hoeren";
import {scoreA2HoerenOnly} from "../services/a2HoerenOnlyService";
import {saveExamRoomResult} from "../services/examRoomResultService";

function readSaved(key){
  if(!key)return {};
  try{return JSON.parse(localStorage.getItem(key)||"{}")||{};}catch{return {};}
}
export function PracticeAttempt({mockNumber,idToken,uid,level="A2",parts,fetchAudio,grade=scoreA2HoerenOnly}){
  const navigate=useNavigate();
  const count=parts ? parts.reduce((sum,p)=>sum+p.questions.length,0) : 20;
  const slug=level.toLowerCase();
  const mockId=`${slug}-mock-0${mockNumber}`;
  const storageKey=uid?`falowen:${slug}:hoeren-only:${mockId}:${uid}:v1`:null;
  const [answers,setAnswers]=useState(()=>readSaved(storageKey));
  const [busy,setBusy]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState("");
  const [saveStatus,setSaveStatus]=useState("idle");
  const answered=Object.keys(answers).filter(k=>answers[k]).length;
  useEffect(()=>{
    if(storageKey)localStorage.setItem(storageKey,JSON.stringify(answers));
  },[storageKey,answers]);
  async function submit(){
    if(busy||result||answered!==count)return;
    if(!idToken){setError("Please sign in again to check your Hören answers.");return;}
    setBusy(true);setError("");
    try{
      const graded=await grade({mockId,answers,idToken});
      if(graded?.total!==count||typeof graded.correct!=="number")throw new Error("Could not verify this Hören result.");
      setResult(graded);
      setSaveStatus("saving");
      try{
        await saveExamRoomResult({
          idToken,level,section:"hoeren",setId:`${slug}-hoeren-sample-${mockNumber}`,
          title:`${level} Hören Sample ${mockNumber}`,score:graded.correct,total:count,
          percent:graded.percent,passed:graded.percent>=60,
          attemptId:`${slug}-hoeren-only-${mockNumber}-${Date.now()}`,
          resultType:"practice",route:`/exams/horen/${slug}/sample-${mockNumber}`,
          sectionScores:graded.partScores,
        });
        setSaveStatus("saved");
      }catch{setSaveStatus("failed");}
    }catch(e){setError(e?.response?.data?.error||e?.message||"Could not check Hören answers.");}
    finally{setBusy(false);}
  }
  return <main style={{display:"grid",gap:12}} data-a2-hoeren-only={mockId}>
    <section style={{...styles.card,display:"grid",gap:8}}>
      <button type="button" style={{...styles.secondaryButton,width:"fit-content"}}
        onClick={()=>navigate("/exams/horen")}>← Back to Hören samples</button>
      <h1 style={{margin:0}}>{level} Hören Sample {mockNumber}</h1>
      <p style={{margin:0}}>From {level} Mock {mockNumber} · 4 listening parts · {count} questions. This is listening-only practice, not a full mock attempt. No AI examiner or writing marks are needed.</p>
    </section>
    <A2Mock04Hoeren parts={parts} fetchAudio={fetchAudio} mockId={mockId} idToken={idToken} value={answers}
      onChange={result?()=>{}:setAnswers} readOnly={Boolean(result)}
      onSubmit={submit} submitDisabled={busy||Boolean(result)||answered!==count}
      submitLabel={busy?"Checking answers…":`Check ${count} Hören answers`}/>
    {!result&&answered<count?<p role="status">Answer all {count} questions to check your result ({answered}/{count}).</p>:null}
    {error?<p role="alert">{error}</p>:null}
    {result?<section style={{...styles.card,display:"grid",gap:8}} role="status" aria-live="polite">
      <h2 style={{margin:0}}>Hören result: {result.correct}/{count} · {result.percent}%</h2>
      <p style={{margin:0}}>{Object.values(result.partScores).map((score,i)=>`Teil ${i+1}: ${score}/${parts?.[i]?.questions.length || 5}`).join(" · ")}</p>
      {saveStatus==="saved"?<small>Practice result saved to your Exam File.</small>:null}
      {saveStatus==="saving"?<small>Saving result…</small>:null}
      {saveStatus==="failed"?<small>Your verified score is shown here, but the Exam File could not be updated.</small>:null}
      <button type="button" style={{...styles.secondaryButton,width:"fit-content"}}
        onClick={()=>{setAnswers({});setResult(null);setError("");setSaveStatus("idle");window.scrollTo?.({top:0,behavior:"smooth"});}}>
        Practise again
      </button>
    </section>:null}
  </main>;
}
export default function A2MockListeningPractice({mockNumber}){
  const {user,idToken}=useAuth();
  if(![4,5,6,7].includes(mockNumber))return <p role="alert">This A2 Hören sample is not available.</p>;
  return <PracticeAttempt key={`${user?.uid||"guest"}-${mockNumber}`}
    mockNumber={mockNumber} idToken={idToken} uid={user?.uid||null}/>;
}
