import React,{useCallback,useEffect,useRef,useState} from "react";
import {useAuth} from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import {getB1Mock3LesenQuestions,startB1Mock3Lesen,submitB1Mock3Lesen} from "../services/b1Mock3LesenService";
import "./A2Mock2Hoeren.css";

const getKey=uid=>`falowen:b1-mock-03:lesen:${uid}:v1`;
function readLocal(uid){
 if(!uid)return {};
 try{return JSON.parse(localStorage.getItem(getKey(uid))||"{}")||{}}
 catch{return {}}
}
export default function B1Mock3Lesen(){
 const {user,idToken}=useAuth();
 const [exam,setExam]=useState(null);
 const [attempt,setAttempt]=useState(null);
 const [answers,setAnswers]=useState(()=>readLocal(user?.uid).answers||{});
 const [active,setActive]=useState(0);
 const [now,setNow]=useState(Date.now());
 const [result,setResult]=useState(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const autoDone=useRef(false);
 const questionCount=Number(exam?.questionCount||30);
 const answered=Object.keys(answers).filter(k=>Number(k)>=1&&Number(k)<=30).length;
 const part=exam?.parts?.[active];
 const secondsLeft=attempt?Math.max(0,Math.ceil((Number(attempt.deadlineMs)-now)/1000)):null;
 useEffect(()=>{
  const t=window.setInterval(()=>setNow(Date.now()),1000);
  return()=>window.clearInterval(t);
 },[]);
 useEffect(()=>{
  setAnswers(readLocal(user?.uid).answers||{});
  setAttempt(null);setResult(null);autoDone.current=false;
 },[user?.uid]);
 useEffect(()=>{
  if(!idToken)return;
  let open=true;setError("");
  getB1Mock3LesenQuestions(idToken).then(data=>{if(open)setExam(data)})
   .catch(e=>{if(open)setError(e?.response?.data?.error||"Lesen Mock 3 ist noch nicht veröffentlicht.")});
  return()=>{open=false};
 },[idToken]);
 useEffect(()=>{
  if(!user?.uid||result)return;
  localStorage.setItem(getKey(user.uid),JSON.stringify({answers,attemptId:attempt?.attemptId||""}));
 },[answers,attempt,user?.uid,result]);
 const begin=async()=>{
  if(!idToken||busy)return;
  setBusy(true);setError("");
  try{
   const a=await startB1Mock3Lesen(idToken);
   setAttempt(a);autoDone.current=false;
  }catch(e){setError(e?.response?.data?.error||e?.message||"Prüfung konnte nicht gestartet werden.")}
  finally{setBusy(false)}
 };
 const submit=useCallback(async(force=false)=>{
  if(!idToken||!attempt?.attemptId||busy||result||(!force&&answered!==questionCount))return;
  setBusy(true);setError("");
  try{
   const scored=await submitB1Mock3Lesen({idToken,attemptId:attempt.attemptId,answers});
   if(!scored?.saved||!scored?.verified||!Number.isFinite(Number(scored?.result?.correct)))
    throw new Error("Falowen could not verify the saved reading result.");
   setResult(scored.result);
   if(user?.uid)localStorage.removeItem(getKey(user.uid));
  }catch(e){setError(e?.response?.data?.error||e?.message||"Lesen-Bewertung fehlgeschlagen. Antworten bleiben gespeichert.")}
  finally{setBusy(false)}
 },[idToken,attempt,answers,busy,result,answered,questionCount,user?.uid]);
 useEffect(()=>{
  if(attempt&&secondsLeft===0&&!autoDone.current&&!result){
   autoDone.current=true;submit(true);
  }
 },[attempt,secondsLeft,result,submit]);
 const selectAnswer=(number,id)=>{
  if(secondsLeft===0||result)return;
  setAnswers(old=>({...old,[number]:id}));
 };
 return <main className="a2-mock2-shell" lang="de" data-b1-mock3-lesen>
  <div className="a2-mock2-top">
   <AppBackButton label="Zurück zu den Probeprüfungen" fallbackPath="/exams/mocks"/>
   <span>B1 · Mock 3 · Lesen</span>
  </div>
  <header className="a2-mock2-progress">
   <div><strong>B1 Mock 3 – Lesen, Teile 1 bis 5</strong>
    <span>{answered}/{questionCount} Fragen beantwortet</span>
   </div>
   <strong>{secondsLeft!==null?`Restzeit ${Math.floor(secondsLeft/60)}:${String(secondsLeft%60).padStart(2,"0")}`:"65 Minuten"}</strong>
  </header>
  <p>Fünf Teile, insgesamt 30 Aufgaben. Die Antworten bleiben während der Bearbeitung auf diesem Gerät gespeichert.
   Die richtige Lösung wird erst nach der serverseitigen Bewertung berücksichtigt.</p>
  {error?<p role="alert">{error}</p>:null}
  {!exam&&!error?<p role="status">Leseaufgaben werden geladen …</p>:null}
  {!attempt&&!result&&exam?<button type="button" disabled={busy} onClick={begin}>
   {busy?"Wird geöffnet …":"Lesen starten / fortsetzen"}
  </button>:null}
  {result?<section role="status" className="a2-mock2-paper">
   <h2>Lesen: {result.correct}/{result.total} richtig ({result.percentage} %)</h2>
   <p>Ihre Antworten sind serverseitig bewertet und gespeichert. Dies ist eine Übung, kein vollständiges Mock-Ergebnis.</p>
   {result.perPart.map(p=><p key={p.part}>Teil {p.part}: {p.correct}/{p.total}</p>)}
  </section>:null}
  {attempt&&exam&&!result?<><nav className="a2-mock2-nav" aria-label="Lesen Teile">
   {exam.parts.map((p,i)=><button key={p.part} type="button"
    className={active===i?"selected":""} onClick={()=>setActive(i)}>
    Teil {p.part} <small>{p.questions.filter(q=>answers[q.number]).length}/{p.questions.length}</small>
   </button>)}
  </nav>
  {part?<section className="a2-mock2-paper">
   <h1>Lesen Teil {part.part} · {part.label}</h1>
   <p>{part.instruction}</p>
   {part.topic?<h2>{part.topic}</h2>:null}
   {part.passages?.map((p,i)=><article key={i} style={{marginBottom:20}}>
    <h2>{p.title}</h2>
    {p.paragraphs.map((paragraph,j)=><p key={j}>{paragraph}</p>)}
   </article>)}
   {part.example?<p><strong>Beispiel (0):</strong> {part.example.question} – {part.example.answer}</p>:null}
   {part.ads?.length?<section aria-label="Anzeigen A bis H">
    <h2>Anzeigen A–H</h2>
    {part.ads.map(ad=><article key={ad.id} style={{marginBottom:12}}>
     <strong>Anzeige {ad.id} · {ad.title}</strong>
     <p>{ad.text}</p>
    </article>)}
   </section>:null}
   {part.comments?.map((c,i)=><blockquote key={i}>
    <strong>{20+i}. {c.name} · {c.meta}</strong><p>{c.text}</p>
   </blockquote>)}
   {part.questions.map(q=><fieldset className="a2-mock2-question" key={q.number}
    disabled={secondsLeft===0||Boolean(result)}>
    <legend><strong>{q.number}.</strong> {q.question}</legend>
    {q.options.map(o=><label key={o.id} className={answers[q.number]===o.id?"selected":""}>
     <input type="radio" name={`b1m3-les-${q.number}`} value={o.id}
      checked={answers[q.number]===o.id} onChange={()=>selectAnswer(q.number,o.id)}/>
     <span>{q.kind==="multiple-choice"?o.id+") ":""}{o.label}</span>
    </label>)}
   </fieldset>)}
  </section>:null}
  <button type="button" disabled={busy||(secondsLeft>0&&answered!==questionCount)}
   onClick={()=>submit(secondsLeft===0)}>
   {busy?"Wird bewertet …":"Lesen abschließen · 30 Antworten einreichen"}
  </button>
  {secondsLeft===0?<p role="status">Zeit abgelaufen. Bisher gespeicherte Antworten werden eingereicht.</p>:null}
  </>:null}
 </main>;
}
