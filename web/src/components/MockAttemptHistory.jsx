import React,{useState,useRef,useEffect} from "react";
import {getBackendUrl} from "../services/backendUrl";
import "./MockAttemptHistory.css";

const LABELS={lesen:"Lesen",hoeren:"Hören",schreiben:"Schreiben",sprechen:"Sprechen"};
export const historyMockId=mock=>{
  const id=mock?.questionSetId;
  return /^(?:(?:a1|a2)-mock-0[1-8]|b1-mock-0[1-4])$/.test(id||"")?id:mock?.id==="a2-final-01"?"a2-mock-01":mock?.id==="b1-final-01"?"b1-mock-01":null;
};
const sortAttempts=rows=>[...rows].sort((a,b)=>(b.attemptNumber||0)-(a.attemptNumber||0)||(b.startedAt||0)-(a.startedAt||0));
export function mergeHistory(existing,incoming){return sortAttempts(Array.from(new Map([...existing,...incoming].map(row=>[row.id,row])).values()));}
const dateLabel=ms=>Number.isFinite(ms)?new Date(ms).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}):"Date unavailable";
const statusLabel=row=>row.status==="verified"?(row.passed===true?"Passed":row.passed===false?"More practice needed":"Verified"):row.status==="pending"?"Awaiting verification":"In progress";
async function requestHistory(user,action,body,signal){
  const token=await user.getIdToken();
  const response=await fetch(`${getBackendUrl()}/mock/history/${action}`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(body),signal});
  const data=await response.json();
  if(!response.ok)throw new Error(data.error||"Unable to load history.");
  return data;
}

function ObjectiveReview({section,data,labels}){
  const [mistakes,setMistakes]=useState(true);
  const rows=data.rows||[];
  if(!rows.length)return <p>{data.reason||"Saved corrections unavailable."}</p>;
  const visible=mistakes?rows.filter(row=>row.status!=="correct"):rows;
  const answer=(row,value)=>value==null||value===""?"Not answered":labels?.(section,row,value)||String(value).toUpperCase();
  return <div className="mock-history-objective"><p>{rows.filter(r=>r.status==="correct").length}/{rows.length} correct</p>
    <label><input type="checkbox" checked={mistakes} onChange={e=>setMistakes(e.target.checked)}/> Show mistakes only</label>
    <p className="mock-history-muted">Saved answer IDs are shown where the original option text is unavailable. Letter order in the paper may differ.</p>
    {visible.length?visible.map(row=><div className="mock-history-answer" key={row.number}><strong>Aufgabe {row.number} · {row.status==="correct"?"Correct":row.status==="unanswered"?"Not answered":"Incorrect"}</strong><p>Your answer: {answer(row,row.submitted)} · Correct answer: {answer(row,row.expected)}</p></div>):<p>No mistakes in this module.</p>}
  </div>;
}
function Feedback({entries=[]}){
  if(!entries.length)return <p>No detailed feedback was saved with this attempt. The verified module score is unchanged.</p>;
  return entries.map((entry,i)=><div className="mock-history-answer" key={i}><strong>{entry.label}</strong>{entry.text?<p>{entry.text}</p>:null}{entry.corrections?.map((c,j)=><div key={j}>{c.original?<p>Your sentence: {c.original}</p>:null}{c.corrected?<p>Correction: {c.corrected}</p>:null}{c.text?<p>{c.text}</p>:null}</div>)}</div>);
}
function AttemptReview({review,labels}){
  const scores=review.attempt.sectionScores;
  const weakest=Object.entries(scores).sort((a,b)=>a[1]-b[1])[0];
  return <div className="mock-history-review">
    <div className="mock-history-skills">{Object.entries(scores).map(([key,score])=><span key={key}>{LABELS[key]} <strong>{score}/25</strong></span>)}</div>
    {weakest?<p className="mock-history-muted">Practise next: {LABELS[weakest[0]]} ({weakest[1]}/25).</p>:null}
    {Object.entries(scores).map(([key])=><details key={key}><summary>{LABELS[key]} {review.objective?.[key]?"corrections":"feedback"}</summary>
      {review.objective?.[key]?<ObjectiveReview section={key} data={review.objective[key]} labels={labels}/>:<Feedback entries={review.feedback?.[key]}/>}
    </details>)}
  </div>;
}
export default function MockAttemptHistory({user,mockId,onPractice}){
  const [expanded,setExpanded]=useState(false),[rows,setRows]=useState([]),[loaded,setLoaded]=useState(false),[cursor,setCursor]=useState(null),[loading,setLoading]=useState(false),[error,setError]=useState("");
  const [selected,setSelected]=useState(null),[details,setDetails]=useState({}),[detailBusy,setDetailBusy]=useState(false),[detailError,setDetailError]=useState(""),[labels,setLabels]=useState(null);
  const controller=useRef(null),detailController=useRef(null),labelRef=useRef(false);
  useEffect(()=>()=>{controller.current?.abort();detailController.current?.abort()},[]);
  async function load(next=null){
    if(controller.current)return;
    const active=new AbortController();controller.current=active;setLoading(true);setError("");
    try{
      const data=await requestHistory(user,"list",{mockId,...(next?{cursor:next}:{})},active.signal);
      if(active.signal.aborted)return;
      if(!Array.isArray(data.attempts))throw new Error("Invalid history response.");
      setRows(old=>next?mergeHistory(old,data.attempts):mergeHistory([],data.attempts));setCursor(data.nextCursor||null);setLoaded(true);
    }catch(e){if(!active.signal.aborted)setError(e.message||"Could not load attempt history.")}
    finally{if(controller.current===active)controller.current=null;if(!active.signal.aborted)setLoading(false);}
  }
  function toggle(){const next=!expanded;setExpanded(next);if(next&&!loaded&&!loading)load();}
  async function openReview(id,retry=false){
    if(selected===id&&!retry){setSelected(null);detailController.current?.abort();detailController.current=null;setDetailBusy(false);return;}
    detailController.current?.abort();detailController.current=null;setSelected(id);setDetailError("");setDetailBusy(false);
    if(details[id])return;
    const active=new AbortController();detailController.current=active;setDetailBusy(true);
    try{
      const data=await requestHistory(user,"review",{mockId,attemptId:id},active.signal);
      if(active.signal.aborted)return;
      if(data.attempt?.id!==id)throw new Error("Invalid attempt response.");
      setDetails(old=>({...old,[id]:data}));
      if(!labelRef.current){labelRef.current=true;import("./mockHistoryAnswerLabels").then(m=>m.loadHistoryAnswerLabels(mockId)).then(format=>{setLabels(()=>format)}).catch(()=>{});}
    }catch(e){if(!active.signal.aborted)setDetailError(e.message||"Could not load corrections.")}
    finally{if(detailController.current===active)detailController.current=null;if(!active.signal.aborted)setDetailBusy(false);}
  }
  const verified=rows.filter(row=>row.status==="verified"&&Number.isFinite(row.score));
  const comparable=verified.filter(row=>row.maxPoints===verified[0]?.maxPoints&&row.assessmentVersion===verified[0]?.assessmentVersion);
  const best=comparable.length?Math.max(...comparable.map(row=>row.score)):null;
  return <section className="mock-attempt-history">
    <button className="mock-history-toggle" type="button" aria-expanded={expanded} onClick={toggle}>Attempt history <span aria-hidden="true">{expanded?"▴":"▾"}</span></button>
    {expanded?<div className="mock-history-body">
      <p className="mock-history-muted">Timed exams only. Practice history remains in Practice Mode.</p>
      {loaded&&rows.length?<p><strong>{rows.length}{cursor?"+":""} saved attempt{rows.length===1&&!cursor?"":"s"}</strong>{best!==null?<> · {cursor?"Best loaded score":"Best score"}: <strong>{best}%</strong>{comparable.length!==verified.length?` (comparable ${verified[0]?.maxPoints}-point attempts)`:""}</>:null}</p>:null}
      {loading?<p role="status">Loading saved attempts…</p>:null}
      {error?<p role="alert">{error} <button type="button" disabled={loading} onClick={()=>load(loaded?cursor:null)}>Retry</button></p>:null}
      {loaded&&!rows.length&&!cursor?<p>No saved timed attempts for this mock yet.</p>:null}
      {cursor?<p className="mock-history-muted">Showing loaded records in attempt order. Load more for the complete history.</p>:null}
      {rows.map(row=><div className="mock-history-row" key={row.id}>
        <div className="mock-history-row-main"><div><strong>Attempt {row.attemptNumber??"—"}</strong><small>{dateLabel(row.completedAt||row.startedAt)}</small></div><div><strong>{row.score===null?"—":`${row.score}%`}</strong><small>{statusLabel(row)}{row.maxPoints===75?" · /75":""}</small></div>
        {row.status==="verified"?<button type="button" aria-expanded={selected===row.id} onClick={()=>openReview(row.id)}>{selected===row.id?"Hide review":"View review"}</button>:null}</div>
        {selected===row.id?<>{detailBusy?<p role="status">Loading saved corrections…</p>:null}{detailError?<p role="alert">{detailError} <button type="button" onClick={()=>openReview(row.id,true)} disabled={detailBusy}>Retry review</button></p>:null}{details[row.id]?<AttemptReview key={row.id} review={details[row.id]} labels={labels}/>:null}</>:null}
      </div>)}
      {cursor?<button type="button" disabled={loading} onClick={()=>load(cursor)}>Load more attempts</button>:null}
      {loaded&&!loading?<button type="button" onClick={()=>{detailController.current?.abort();detailController.current=null;setDetailBusy(false);setSelected(null);setDetails({});load();}}>Refresh history</button>:null}
      {verified.length&&onPractice?<button type="button" onClick={onPractice}>Practise this mock</button>:null}
    </div>:null}
  </section>;
}
