import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import { B1_MOCK4_LESEN as paper } from "../data/b1Mock4ReadingContent";
import { scoreB1Mock4Lesen } from "../services/b1Mock4LesenService";
import "./B1FinalMockExamPage.css";

const DURATION_MS = 65 * 60 * 1000;
const identity = uid => `falowen:b1-mock-04:lesen:practice:${uid || "guest"}:v1`;
const fresh = () => ({startedAt:null,answers:{},result:null});
const restore = key => {
  try {
    const parsed=JSON.parse(localStorage.getItem(key)||"null");
    return parsed && typeof parsed==="object" ? {...fresh(),...parsed} : fresh();
  } catch { return fresh(); }
};
const ranges=[["Teil 1",1,6,"10 min"],["Teil 2",7,12,"20 min"],["Teil 3",13,19,"10 min"],["Teil 4",20,26,"15 min"],["Teil 5",27,30,"10 min"]];
const totalAnswered = answers => Object.keys(answers||{}).filter(k => Boolean(answers[k])).length;
const Selection=({number,value,onChange,options,disabled=false})=>(
  <div className="b1-final-choices" role="radiogroup" aria-label={`Aufgabe ${number}`}>
    {options.map(([id,label])=><label key={id} className={value===id?"selected":""}>
      <input type="radio" name={`b1-mock04-lesen-${number}`} checked={value===id} disabled={disabled}
        onChange={()=>onChange(number,id)}/>
      <strong>{id.length===1?id.toUpperCase():""}</strong><span>{label}</span>
    </label>)}
  </div>
);
const binary=[["richtig","Richtig"],["falsch","Falsch"]];
const agree=[["ja","Ja"],["nein","Nein"]];
const MC=({question,answers,onAnswer})=><article className="b1-final-question" key={question.number}>
  <strong>{question.number}. {question.question}</strong>
  <Selection number={question.number} value={answers[question.number]||""} onChange={onAnswer}
    options={question.options.map(x=>[x.id,x.label])}/>
</article>;

export default function B1Mock4Lesen(){
  const {idToken,user}=useAuth();
  const uid=user?.uid || "guest";
  const key=identity(uid);
  const [state,setState]=useState(()=>restore(key));
  const [active,setActive]=useState(0);
  const [now,setNow]=useState(Date.now());
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{setState(restore(key));setActive(0);setError("");},[key]);
  useEffect(()=>{
    try{localStorage.setItem(key,JSON.stringify(state));}
    catch{setError("Your answers could not be saved on this device.");}
  },[key,state]);
  useEffect(()=>{
    if(!state.startedAt || state.result)return undefined;
    const timer=window.setInterval(()=>setNow(Date.now()),1000);
    return ()=>window.clearInterval(timer);
  },[state.startedAt,state.result]);
  const answers=state.answers||{};
  const remaining=Math.max(0,Math.ceil(((state.startedAt||now)+DURATION_MS-now)/1000));
  const clock=`${String(Math.floor(remaining/60)).padStart(2,"0")}:${String(remaining%60).padStart(2,"0")}`;
  const count=totalAnswered(answers);
  const usedAds=useMemo(()=>Object.entries(answers).filter(([number,value])=>Number(number)>=13&&Number(number)<=19&&value!=="0").map(([,value])=>value),[answers]);
  const onAnswer=(number,value)=>setState(current=>({
    ...current,answers:{...current.answers,[number]:value},
  }));
  const submit=async()=>{
    if(busy||count!==30||!idToken)return;
    setBusy(true);setError("");
    try {
      const result=await scoreB1Mock4Lesen({idToken,answers});
      if(!result.saved || result.total!==30 || !result.practiceOnly)throw Error("The server did not confirm the reading result.");
      setState(current=>({...current,result}));
      window.scrollTo({top:0,behavior:"smooth"});
    }catch(e){setError(e?.response?.data?.error||e?.message||"The reading assessment could not be saved. Try again.");}
    finally{setBusy(false);}
  };
  const startNew=()=>{
    if(!window.confirm("Start a new Lesen practice? Your previous saved result will remain on the server."))return;
    setState({startedAt:Date.now(),answers:{},result:null});setNow(Date.now());setActive(0);setError("");
  };
  const start=()=>{const startedAt=Date.now();setNow(startedAt);setState(current=>({...current,startedAt}));};
  const next=()=>{setActive(v=>Math.min(4,v+1));window.scrollTo({top:0,behavior:"smooth"});};

  const sectionCount=(start,end)=>Array.from({length:end-start+1},(_,i)=>start+i).filter(n=>answers[n]).length;
  const part=active+1;
  return <main className="b1-final-shell" data-b1-mock4-lesen lang="de">
    <AppBackButton label="Zurück zu den Probeprüfungen" fallbackPath="/exams/mocks"/>
    <header className="b1-final-hero">
      <p>B1 Mock 04 · Leseverstehen · Einzelübung</p>
      <h1>GOETHE-ZERTIFIKAT B1 · Lesen</h1>
      <p>Fünf Teile · 30 Aufgaben · 65 Minuten. Ihre Antworten werden automatisch auf diesem Gerät gespeichert.</p>
    </header>
    {!state.startedAt ? <section className="b1-final-rules">
      <h2>Hinweise zur Leseprüfung</h2>
      <p>Lesen Sie die Texte und wählen Sie die richtige Antwort. Bei Teil 3 dürfen Sie jede Anzeige nur einmal benutzen; Anzeige I gehört zum Beispiel und ist nicht wählbar. Eine Aufgabe hat keine passende Anzeige: 0.</p>
      <p>Dies ist eine eigenständige Leseübung, noch keine abgeschlossene vierteilige B1-Prüfung.</p>
      <button type="button" className="b1-final-primary" onClick={start}>Lesen starten</button>
    </section>:null}
    {state.startedAt && <section className="b1-final-rules">
      <p><strong>Bearbeitet: {count}/30</strong> · {state.result?"Abgeschlossen":remaining===0?"Zeit abgelaufen":`Verbleibende Zeit: ${clock}`}</p>
      {remaining===0 && !state.result ? <p role="status">Die Übungszeit ist abgelaufen. Ihre Antworten bleiben erhalten; Sie können die Übung abschließen und abgeben.</p>:null}
      {error?<p className="b1-final-error" role="alert">{error}</p>:null}
      {state.result ? <div role="status">
        <h2>Lesen-Ergebnis: {state.result.correct}/30 ({state.result.percentage}%)</h2>
        <p>Serverseitig bewertet und gespeichert. Dieses Ergebnis betrifft nur Lesen, nicht den gesamten B1 Mock 04.</p>
        <ul>{state.result.perPart.map(p=><li key={p.teil}>Teil {p.teil}: {p.correct}/{p.total}</li>)}</ul>
        <button type="button" className="b1-final-primary" onClick={startNew}>Neue Lesen-Übung starten</button>
      </div> : <>
        <nav className="b1-final-duration-grid" aria-label="Lesen Teile">
          {ranges.map(([label,first,last,time],index)=><button type="button" key={label}
            aria-current={active===index?"step":undefined}
            onClick={()=>{setActive(index);window.scrollTo({top:0,behavior:"smooth"});}}>
            {label} · {time} · {sectionCount(first,last)}/{last-first+1}
          </button>)}
        </nav>
        {part===1 && <section className="b1-final-paper">
          <h2>Teil 1 · 10 Minuten</h2><p>{paper.teil1.intro}</p>
          <article className="b1-final-reading-text">
            <h3>{paper.teil1.heading}</h3><p><em>{paper.teil1.subheading}</em></p>
            <p><strong>{paper.teil1.date}</strong></p>
            {paper.teil1.paragraphs.map((text,index)=><p key={index}>{text}</p>)}
          </article>
          <p><strong>Beispiel 0:</strong> Zu Mittag klingelte Susannes Telefon. → Richtig</p>
          {paper.teil1.questions.map(q=><article className="b1-final-question" key={q.number}>
            <strong>{q.number}. {q.question}</strong>
            <Selection number={q.number} value={answers[q.number]||""} onChange={onAnswer} options={binary}/>
          </article>)}
        </section>}
        {part===2 && <section className="b1-final-paper">
          <h2>Teil 2 · 20 Minuten</h2>
          <p>Lesen Sie die beiden Texte. Wählen Sie für die Aufgaben 7–12 jeweils a, b oder c.</p>
          <article className="b1-final-reading-text"><h3>{paper.teil2.heading}</h3>
            {paper.teil2.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</article>
          {paper.teil2.questions.map(q=><MC key={q.number} question={q} answers={answers} onAnswer={onAnswer}/>)}
          <article className="b1-final-reading-text"><h3>{paper.teil2.text2.heading}</h3>
            {paper.teil2.text2.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</article>
          {paper.teil2.text2.questions.map(q=><MC key={q.number} question={q} answers={answers} onAnswer={onAnswer}/>)}
        </section>}
        {part===3 && <section className="b1-final-paper">
          <h2>Teil 3 · 10 Minuten</h2><p>{paper.teil3.context}</p>
          <p><strong>Beispiel 0:</strong> Mario sucht in Wien einen Sommersprachkurs. → Anzeige I</p>
          <div className="b1-final-ads">{paper.teil3.ads.map(([letter,title,copy])=><article key={letter}>
            <h3>Anzeige {letter}{letter===paper.teil3.exampleAd?" · Beispiel":""}</h3>
            <strong>{title}</strong><p>{copy}</p>
          </article>)}</div>
          {paper.teil3.situations.map(q=><div className="b1-final-question" key={q.number}>
            <label htmlFor={`b1-mock04-ad-${q.number}`}><strong>{q.number}. {q.text}</strong></label>
            <select id={`b1-mock04-ad-${q.number}`} value={answers[q.number]||""}
              onChange={e=>onAnswer(q.number,e.target.value)}>
              <option value="">Anzeige wählen</option>
              <option value="0">0 · keine passende Anzeige</option>
              {paper.teil3.ads.filter(([letter])=>letter!==paper.teil3.exampleAd).map(([letter])=>
                <option key={letter} value={letter.toLowerCase()} disabled={usedAds.includes(letter.toLowerCase())&&answers[q.number]!==letter.toLowerCase()}>{letter}</option>)}
            </select>
          </div>)}
        </section>}
        {part===4 && <section className="b1-final-paper">
          <h2>Teil 4 · 15 Minuten</h2><p>{paper.teil4.context}</p>
          <p>Ist die Person für ein Verbot? Wählen Sie Ja oder Nein.</p>
          <article className="b1-final-reading-text"><p><strong>Beispiel 0 · Niko, 52, Saarbrücken:</strong> Man hat bis jetzt nicht wissenschaftlich gezeigt, dass sogenannte Gewaltspiele einen Einfluss auf das Verhalten von Jugendlichen haben? So ein Blödsinn! Ist doch logisch, dass so massive Bilder die Gedanken beeinflussen! Für mich ist klar: Durch solche Spiele kann viel Unglück und Schaden entstehen, die müssen weg! → Ja</p></article>
          {paper.teil4.comments.map(q=><article className="b1-final-question" key={q.number}>
            <p><strong>{q.number}. {q.person}:</strong> „{q.text}“</p>
            <Selection number={q.number} value={answers[q.number]||""} onChange={onAnswer} options={agree}/>
          </article>)}
        </section>}
        {part===5 && <section className="b1-final-paper">
          <h2>Teil 5 · 10 Minuten</h2><p>{paper.teil5.context}</p>
          <article className="b1-final-reading-text">
            <h3>{paper.teil5.heading}</h3>
            {paper.teil5.sections.map(([title,body])=><section key={title}><h4>{title}</h4><p>{body}</p></section>)}
          </article>
          {paper.teil5.questions.map(q=><MC key={q.number} question={q} answers={answers} onAnswer={onAnswer}/>)}
        </section>}
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:18}}>
          {active<4 ? <button type="button" className="b1-final-primary" onClick={next}>Weiter zu Teil {part+1}</button> : null}
          <button type="button" className="b1-final-primary" onClick={submit} disabled={busy||count!==30||!idToken}>
            {busy?"Bewertung wird gespeichert …":`Alle Antworten abgeben (${count}/30)`}
          </button>
        </div>
        {count!==30?<p role="note">Für die Abgabe müssen alle 30 Aufgaben beantwortet werden.</p>:null}
      </>}
    </section>}
  </main>;
}
