import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import { A2_MOCK_2_LESEN_QUESTIONS } from "../data/a2Mock2Lesen";
import { A2_MOCK_2_HOEREN_QUESTIONS } from "../data/a2Mock2Hoeren";
import "./A2Mock2Lesen.css";
const sections=[
 {key:"lesen",label:"Lesen",route:"/campus/course/a2-mock-2-lesen",duration:"30 Minuten",storage:"falowen:a2:mock-02:lesen:v1"},
 {key:"hoeren",label:"Hören",route:"/campus/course/a2-mock-2-hoeren",duration:"Hörprüfung",storage:"falowen:a2:mock-02:hoeren:v1"},
 {key:"schreiben",label:"Schreiben",route:"/campus/course/a2-mock-2-schreiben",duration:"30 Minuten",storage:"falowen:a2:mock-02:schreiben:v1"},
 {key:"sprechen",label:"Sprechen",route:"/campus/course/a2-mock-2-sprechen",duration:"ca. 15 Minuten",storage:"falowen:a2:mock-02:sprechen:v1"},
];
const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||"null")||{}}catch{return {}}};
export const snapshotMock2=()=>{
 const lesen=read(sections[0].storage),hoeren=read(sections[1].storage),schreiben=read(sections[2].storage),sprechen=read(sections[3].storage);
 const entries={
  lesen:{done:Boolean(lesen.completedAt),answered:Object.values(lesen.answers||{}).filter(Boolean).length,score:A2_MOCK_2_LESEN_QUESTIONS.filter(q=>lesen.answers?.[q.number]===q.answer).length*1.25},
  hoeren:{done:Boolean(hoeren.completedAt),answered:Object.values(hoeren.answers||{}).filter(Boolean).length,score:A2_MOCK_2_HOEREN_QUESTIONS.filter(q=>hoeren.answers?.[q.number]===q.answer).length*1.25},
  schreiben:{done:Boolean(schreiben.submittedAt),answered:[schreiben.sms,schreiben.email].filter(s=>String(s||"").trim()).length,score:null},
  sprechen:{done:["t1_questions","t1_answers","t2_main","t2_followups","t3_plan"].every(k=>Boolean(sprechen[k]?.transcript)),answered:Object.values(sprechen).filter(x=>x?.transcript).length,score:null},
 };
 return {entries,allSubmitted:Object.values(entries).every(x=>x.done)};
};
export default function A2Mock2ExamHub(){
 const [snapshot,setSnapshot]=useState(snapshotMock2);
 useEffect(()=>{
  const refresh=()=>setSnapshot(snapshotMock2());
  window.addEventListener("focus",refresh);window.addEventListener("storage",refresh);document.addEventListener("visibilitychange",refresh);
  return()=>{window.removeEventListener("focus",refresh);window.removeEventListener("storage",refresh);document.removeEventListener("visibilitychange",refresh)};
 },[]);
 const count=useMemo(()=>Object.values(snapshot.entries).filter(x=>x.done).length,[snapshot]);
 return <main className="a2-mock2-shell" lang="de">
  <div className="a2-mock2-top"><AppBackButton label="Zurück zu den Mocktests" fallbackPath="/exams/mocks"/><span>A2 · Mock 2</span></div>
  <section className="a2-mock2-intro">
   <p className="a2-mock2-kicker">Übungstest 2 · A2</p><h1>Ihr zweiter A2-Mocktest</h1>
   <p>Bearbeiten Sie Lesen, Hören, Schreiben und Sprechen. Ihre Antworten werden auf diesem Gerät gespeichert. Sie können die Bereiche nacheinander bearbeiten und hierher zurückkehren.</p>
   <div className="a2-mock2-stat"><span>{count} / 4 Bereiche eingereicht</span><span>Lesen 20 Aufgaben</span><span>Hören 20 Aufgaben</span></div>
   <div style={{display:"grid",gap:12,marginTop:18}}>
    {sections.map(section=>{const item=snapshot.entries[section.key];return <article key={section.key} style={{border:"1px solid #d7e7dc",borderRadius:12,padding:18,display:"flex",gap:14,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
     <div><h2 style={{margin:"0 0 6px"}}>{section.label}</h2><p style={{margin:0}}>{section.duration} · {item.done?"Eingereicht":item.answered?"In Bearbeitung":"Noch nicht gestartet"}</p></div>
     <Link to={section.route} className="a2-mock2-primary" style={{textDecoration:"none"}}>{item.done?"Ergebnis / Antworten öffnen":item.answered?"Fortsetzen":"Starten"}</Link>
    </article>})}
   </div>
   <section style={{marginTop:28}}>
    <h2>Ergebnisstand</h2>
    <p>Lesen: {snapshot.entries.lesen.done?`${snapshot.entries.lesen.score.toFixed(1)}/25`:"offen"} · Hören: {snapshot.entries.hoeren.done?`${snapshot.entries.hoeren.score.toFixed(1)}/25`:"offen"}</p>
    <p>Schreiben und Sprechen benötigen eine gesonderte KI-Bewertung für Mock 2. Ein Gesamtergebnis von 100 Punkten wird erst angezeigt, wenn beide Bewertungen zuverlässig verfügbar sind.</p>
    {snapshot.allSubmitted?<p><strong>Alle vier Bereiche eingereicht.</strong> Die abschließende Bewertung ist noch nicht verfügbar.</p>:null}
   </section>
  </section>
 </main>;
}
