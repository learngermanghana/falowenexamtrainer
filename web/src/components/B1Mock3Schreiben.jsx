import React,{useEffect,useState} from "react";
import {useAuth} from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import tasks from "../data/b1Mock3WritingTasks.json";

const storageKey=uid=>"falowen:b1-mock-03:schreiben:"+(uid||"guest")+":draft:v1";
const recover=uid=>{try{return JSON.parse(localStorage.getItem(storageKey(uid))||"{}")||{}}catch{return {}}};

// Teacher-original three writing tasks. Draft autosave does not imply server
// verification or a final /100 result; those require the shared mock attempt.
export default function B1Mock3Schreiben(){
  const {user}=useAuth();
  const [answers,setAnswers]=useState(()=>recover(user?.uid));
  useEffect(()=>setAnswers(recover(user?.uid)),[user?.uid]);
  useEffect(()=>{if(user?.uid)localStorage.setItem(storageKey(user.uid),JSON.stringify(answers));},[answers,user?.uid]);
  const filled=tasks.filter(t=>String(answers[t.id]||"").trim().length>0).length;
  return <main className="a2-mock2-shell" lang="de" data-b1-mock3-schreiben>
    <AppBackButton label="Zurück zu B1 Mock 3" fallbackPath="/campus/course/b1-mock-3"/>
    <header className="a2-mock2-progress"><div><strong>B1 Mock 3 · Schreiben</strong>
      <span>{filled}/3 Texte begonnen</span></div></header>
    <p role="note">Ihre Texte werden auf diesem Gerät als Entwurf gespeichert.
      Eine benotete Abgabe ist erst verfügbar, wenn die gemeinsame Mock-3-Prüfung mit
      überprüfter KI-Bewertung und Ergebnisspeicherung freigegeben ist.</p>
    {tasks.map(task=><section className="a2-mock2-paper" key={task.id} style={{marginBottom:18}}>
      <h2>{task.title}</h2><p>{task.instruction}</p>
      {task.quote?<blockquote>{task.quote}</blockquote>:null}
      <ul>{task.bullets.map(b=><li key={b}>{b}</li>)}</ul>
      {task.note?<p>{task.note}</p>:null}
      <label htmlFor={"b1m3-"+task.id}>Ihre Antwort</label>
      <textarea id={"b1m3-"+task.id} rows={10} style={{width:"100%",boxSizing:"border-box"}}
        value={answers[task.id]||""}
        onChange={e=>setAnswers(prev=>({...prev,[task.id]:e.target.value}))}/>
    </section>)}
    <p role="status">Entwürfe werden automatisch gespeichert. Noch kein benotetes Prüfungsergebnis.</p>
  </main>;
}
