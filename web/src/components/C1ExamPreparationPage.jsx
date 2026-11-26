import React, {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {styles} from "../styles";
import AppBackButton from "./navigation/AppBackButton";
import C1AcademicExamPractice,{C1AcademicGrammarPractice} from "./C1AcademicExamPractice";
import {getC1Phase2Lesson} from "../data/c1Phase2Lessons";
import {C1_PREPARATION_PATH,C1_REVISION_SECTIONS,C1_REVISION_GRAMMAR,C1_SIMULATION_MODULES,C1_SIMULATION_WRITING,C1_SIMULATION_SPEAKING,C1_SIMULATION_RUBRIC,C1_OFFICIAL_MODEL,c1SimulationResult} from "../data/c1ExamPreparation";
const card={...styles.card,display:"grid",gap:12,lineHeight:1.6};
const countWords=s=>s.trim()?s.trim().split(/\s+/).length:0;
export function C1PreparationLink(){return <Link to={C1_PREPARATION_PATH} style={styles.linkButton}>C1 · Prüfungsvorbereitung (Tag 29–30)</Link>;}
function Revision({state,update}){
 const [day,setDay]=useState(1);
 const lesson=getC1Phase2Lesson(day);
 const tab=lesson.skill==="Sprechen"?"speak":lesson.skill==="Schreiben"?"write":"learn";
 return <>
 <section style={card}><h2>Tag 29 · Intensive Prüfungsvorbereitung</h2><p>Wählen Sie besonders die Module, in denen Sie noch unsicher sind. Bearbeiten Sie die Aufgaben erneut ohne Lösungshilfe und notieren Sie Fehler.</p>
 {C1_REVISION_SECTIONS.map(section=><div key={section.skill}><h3>{section.skill}</h3><p>{section.strategy}</p><p><strong>Stolperfalle:</strong> {section.pitfall}</p><label><input type="checkbox" checked={Boolean(state.review?.[section.skill])} onChange={e=>update(old=>({...old,review:{...old.review,[section.skill]:e.target.checked}}))}/> Modul wiederholt</label></div>)}
 <label><strong>Gezielt üben</strong><select style={styles.select} value={day} onChange={e=>setDay(Number(e.target.value))}>{C1_REVISION_SECTIONS.map(s=><optgroup key={s.skill} label={s.skill}>{s.days.map(n=><option key={n} value={n}>Tag {n} · {getC1Phase2Lesson(n).title}</option>)}</optgroup>)}</select></label></section>
 <C1AcademicGrammarPractice key={day} day={day}/><C1AcademicExamPractice day={day} tab={tab}/>
 <section style={card}><h2>Grammatik · Kurzcheck</h2>{C1_REVISION_GRAMMAR.map(([name,prompt,answer,reason])=><details key={name}><summary>{name}: {prompt}</summary><p><strong>Lösung:</strong> {answer}</p><p>{reason}</p></details>)}
 <label>Meine häufigsten Fehler und nächste Übung<textarea style={styles.input} value={state.reflection||""} onChange={e=>update(old=>({...old,reflection:e.target.value}))} rows={4}/></label></section>
 </>;
}
function Simulation({state,update}){
 const [now,setNow]=useState(Date.now);
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id);},[]);
 const timer=(key,minutes)=>{
  const entry=state.timers?.[key];const remaining=entry?Math.max(0,Math.ceil((entry.deadline-now)/1000)):minutes*60;const done=Boolean(entry&&(entry.finished||remaining===0));
  return <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}><strong role="timer">{Math.floor(remaining/60)}:{String(remaining%60).padStart(2,"0")}</strong>{!entry?<button type="button" style={styles.secondaryButton} onClick={()=>{setNow(Date.now());update(old=>({...old,timers:{...old.timers,[key]:{deadline:Date.now()+minutes*60000}}}));}}>Start</button>:done?<span>Beendet</span>:<button type="button" style={styles.secondaryButton} onClick={()=>update(old=>({...old,timers:{...old.timers,[key]:{...old.timers[key],finished:true}}}))}>Beenden</button>}</div>;
 };
 const result=c1SimulationResult(state.scores);
 const writing=state.timers?.Schreiben;
 const canWrite=Boolean(writing&&!writing.finished&&writing.deadline>now);
 const [reset,setReset]=useState(false);
 return <>
 <section style={card}><h2>Tag 30 · Prüfungssimulation</h2><p>Vier Module unter möglichst realistischen Bedingungen. Lesen und Hören verwenden bestehende Falowen-Prüfungsübungen; Schreiben und Sprechen enthalten neue Aufgaben. Dies ist eine Übung, keine offizielle Prüfung oder automatische Tutorbewertung.</p><p>Starten Sie den jeweiligen Timer. Öffnen Sie Lesen/Hören in einem neuen Tab und verwenden Sie die vorgesehenen Prüfungsbedingungen. Die hiesigen Timer sind Orientierung und sperren andere Prüfungsseiten nicht.</p><a href={C1_OFFICIAL_MODEL} target="_blank" rel="noreferrer">Offizieller Goethe-Modellsatz (Alternative)</a></section>
 {C1_SIMULATION_MODULES.map(m=><section style={card} key={m.skill}><h3>{m.skill} · {m.minutes} Minuten</h3><p>{m.description}</p>{m.skill==="Sprechen"&&<><strong>Vorbereitung · 20 Minuten</strong>{timer("Sprechen Vorbereitung",20)}</>}{timer(m.skill,m.minutes)}
 {m.route&&<a style={styles.linkButton} href={m.route} target="_blank" rel="noreferrer">{m.skill} Sample öffnen</a>}
 {m.skill==="Lesen"&&<a href="/exams/lesen" target="_blank" rel="noreferrer">Anderes C1-Lesesample auswählen</a>}
 {m.skill==="Schreiben"&&<>{!writing?<p>Die Schreibaufgaben werden nach Timerstart angezeigt.</p>:C1_SIMULATION_WRITING.map((task,i)=><div key={task.title}><h4>{task.title}</h4><p>{task.situation}</p><ol>{task.points.map(p=><li key={p}>{p}</li>)}</ol><label>Antwort (ca. {task.words} Wörter)<textarea style={{...styles.input,width:"100%",boxSizing:"border-box"}} rows={9} value={state.drafts?.[i]||""} readOnly={!canWrite} onChange={e=>update(old=>({...old,drafts:{...old.drafts,[i]:e.target.value}}))}/></label><p>{countWords(state.drafts?.[i]||"")} Wörter · {canWrite?"Bearbeitung läuft":"Nur lesen / kopieren"}</p></div>)}<p>Nach Abschluss kopieren Sie Ihre Texte zur Bewertung an Ihre Lehrkraft. Es erfolgt keine automatische Übermittlung.</p></>}
 {m.skill==="Sprechen"&&state.timers?.["Sprechen Vorbereitung"]&&<><p>Person A wählt A oder B, Person B wählt C oder D. Bereiten Sie nur Ihr eigenes Thema vor. Danach je Vortrag mit Nachfragen und gemeinsame Diskussion.</p>{C1_SIMULATION_SPEAKING.topics.map(topic=><details key={topic.title}><summary>{topic.title}</summary><ol>{topic.points.map(p=><li key={p}>{p}</li>)}</ol></details>)}<p><strong>Teil 2:</strong> {C1_SIMULATION_SPEAKING.discussion}</p><p><strong>Nachfragen:</strong> {C1_SIMULATION_SPEAKING.followups.join(" · ")}</p></>}
 {C1_SIMULATION_RUBRIC[m.skill]&&<details><summary>Bewertungshinweise für die Lehrkraft</summary><ul>{C1_SIMULATION_RUBRIC[m.skill].map(x=><li key={x}>{x}</li>)}</ul><p>Nutzen Sie zur Punktevergabe das offizielle Bewertungsraster des Goethe-Instituts.</p></details>}
 </section>)}
 <section style={card}><h2>Ergebnisübersicht · pro Modul / 100</h2><p>Tragen Sie die Ergebnisse aus Lesen/Hören und die von Ihrer Lehrkraft bewerteten Ergebnisse aus Schreiben/Sprechen ein. Keine automatische Bewertung oder Zertifikatsfreigabe.</p>
 {result.modules.map(m=><label key={m.skill}>{m.skill}<input style={styles.input} type="number" min={0} max={100} step={1} value={state.scores?.[m.skill]??""} onChange={e=>update(old=>({...old,scores:{...old.scores,[m.skill]:e.target.value}}))}/>{m.score===null?" · Ergebnis fehlt/ungültig":m.passed?" · Übungsziel erreicht":" · Weiter üben"}</label>)}
 <strong role="status">{!result.complete?"Noch nicht alle Module bewertet.":result.passed?"Übungsziel erreicht: alle vier Module mindestens 60 Punkte.":"Übungsziel noch nicht erreicht: mindestens ein Modul unter 60 Punkten."}</strong>
 {!reset?<button type="button" style={styles.secondaryButton} onClick={()=>setReset(true)}>Simulation zurücksetzen</button>:<><p>Timer, Texte und eingetragene Ergebnisse dieser Simulation löschen?</p><button type="button" style={styles.primaryButton} onClick={()=>{update(old=>({...old,timers:{},scores:{},drafts:{}}));setReset(false);}}>Ja, zurücksetzen</button><button type="button" onClick={()=>setReset(false)}>Abbrechen</button></>}
 </section>
 </>;
}
function Preparation({uid}){
 const storageKey=uid?"falowen-c1-exam-prep-v1:"+uid:null;
 const [state,setState]=useState(()=>{try{return storageKey?JSON.parse(localStorage.getItem(storageKey)||"{}")||{}:{}}catch{return {}}});
 const [tab,setTab]=useState("revision");
 useEffect(()=>{if(storageKey)try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{}},[storageKey,state]);
 return <main style={{...styles.container,display:"grid",gap:16}}><AppBackButton label="Back to Course Book" fallbackPath="/campus/course"/><h1>C1 · Prüfungsvorbereitung</h1><p>Optionale Einheiten nach Tag 28. Keine neuen Pflichtaufgaben. Ergebnisse und Entwürfe bleiben {uid?"lokal auf diesem Gerät":"nur in dieser Sitzung"}.</p><div style={{display:"flex",flexWrap:"wrap",gap:8}}><button type="button" style={tab==="revision"?styles.primaryButton:styles.secondaryButton} onClick={()=>setTab("revision")}>Tag 29 · Wiederholen</button><button type="button" style={tab==="simulation"?styles.primaryButton:styles.secondaryButton} onClick={()=>setTab("simulation")}>Tag 30 · Simulation</button></div>{tab==="revision"?<Revision state={state} update={setState}/>:<Simulation state={state} update={setState}/>}</main>;
}
export default function C1ExamPreparationPage(){const {user}=useAuth();return <Preparation key={user?.uid||"guest"} uid={user?.uid}/>;}
