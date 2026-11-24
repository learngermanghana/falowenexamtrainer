import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, doc, getDoc } from "../firebase";
import { saveSwahiliWorkbook } from "../services/swahiliWorkbookService";
import { canSubmitSwahiliWorkbook } from "../utils/campusProgram";
import { WorkbookTabNav } from "./StandardWorkbookComponents";
import { SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import { title, readingPassage, listeningDialogue, readingQuestions, listeningQuestions } from "../data/swahili/b1Day26";
import { Day26Grammar, Day26Speaking, Day26Writing } from "./SwahiliB1Day26Learning";
import "./SwahiliCourseBook.css";

const tabs = [{key:"grammar",label:"Sarufi na msamiati"},{key:"sprechen",label:"1 · Kuzungumza"},{key:"schreiben",label:"2 · Kuandika"},{key:"lesen",label:"3 · Kusoma"},{key:"hoeren",label:"4 · Kusikiliza"},{key:"submit",label:"Kagua na uwasilishe"}];
function Questions({questions, answers, update, review = false}) {
  return <ol>{questions.map(({id,prompt,english}) => <li key={id}>
    <label htmlFor={review ? undefined : id}>{prompt}</label>
    {english && <p lang="en">{english}</p>}
    {review ? <p>{answers[id] || "Hakuna jibu"}</p> :
      <textarea id={id} rows={3} value={answers[id] || ""} onChange={event => update(id,event.target.value)} />}
  </li>)}</ol>;
}
export default function SwahiliB1Day26Workbook({uid}) {
  const {user,studentProfile} = useAuth();
  const canSubmit = canSubmitSwahiliWorkbook({user,studentProfile}) && uid === user?.uid;
  const [params,setParams] = useSearchParams();
  const activeTab = tabs.some(tab => tab.key === params.get("view")) ? params.get("view") : "grammar";
  function selectTab(key) { const next = new URLSearchParams(params); next.set("view",key); setParams(next,{replace:true}); }
  const draftKey = uid && "swahili-b1-day-26:" + uid;
  const [draft,setDraft] = useState(() => {
    try { return (draftKey && JSON.parse(sessionStorage.getItem(draftKey))) || {writing:{essay:""},reading:{},listening:{}}; }
    catch { return {writing:{essay:""},reading:{},listening:{}}; }
  });
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [submitted,setSubmitted] = useState(false);
  const [confirmed,setConfirmed] = useState(false);
  const [notice,setNotice] = useState("");
  const [audio,setAudio] = useState({url:"",loading:false,error:""});
  async function loadAudio() {
    if (audio.loading) return;
    if (!user?.getIdToken) { setAudio({url:"",loading:false,error:"Ingia kwenye akaunti yako ili kusikiliza sauti."}); return; }
    setAudio({url:"",loading:true,error:""});
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/course-media/swahili/b1/day-26/audio-url",{headers:{Authorization:`Bearer ${token}`}});
      const result = await response.json();
      if (!response.ok || !result?.url) throw new Error(result?.error || "Sauti haikupatikana.");
      setAudio({url:result.url,loading:false,error:""});
    } catch (error) { setAudio({url:"",loading:false,error:error.message || "Sauti haikupatikana. Jaribu tena."}); }
  }
  const essay = draft.writing?.essay || "";
  const complete = essay.trim().length > 0 && readingQuestions.every(({id}) => draft.reading?.[id]?.trim()) && listeningQuestions.every(({id}) => draft.listening?.[id]?.trim());
  useEffect(() => {
    if (!canSubmit || !db) { setLoading(false); return; }
    let active = true;
    getDoc(doc(db,"users",uid,"swahiliLessons","b1-day-26")).then(snapshot => {
      if (!active || !snapshot.exists()) return;
      const prior = snapshot.data();
      setDraft(current => ({writing:{essay:current.writing?.essay || prior.writing?.essay || ""},reading:{...prior.readingAnswers,...current.reading},listening:{...prior.listeningAnswers,...current.listening}}));
      setSubmitted(true);
    }).catch(() => { if(active) setNotice("Imeshindikana kupakia kazi ya awali."); })
      .finally(() => { if(active) setLoading(false); });
    return () => { active=false; };
  },[uid,canSubmit]);
  function update(section,id,value) {
    const next = {...draft,[section]:{...draft[section],[id]:value}};
    setDraft(next); setConfirmed(false); setNotice("");
    try { if(draftKey) sessionStorage.setItem(draftKey,JSON.stringify(next)); } catch { /* keep in memory */ }
  }
  async function submit() {
    if (!canSubmit || !db || loading || saving || !complete || !confirmed) return;
    setSaving(true); setNotice("");
    try {
      await saveSwahiliWorkbook(user,{program:"swahili",level:"B1",day:26,lessonId:"swahili-b1-day-26",title,writing:{essay:essay.trim()},readingAnswers:draft.reading,listeningAnswers:draft.listening});
      setSubmitted(true); setConfirmed(false); setNotice("Kazi yako imewasilishwa kwa mwalimu.");
    } catch { setNotice("Imeshindikana kuwasilisha kazi. Jaribu tena."); }
    finally { setSaving(false); }
  }
  return <main className="swahili-book swahili-book--workbook" lang="sw">
    <Link to="/campus/course">← Kitabu cha kozi</Link>
    <header className="swahili-book__hero"><p>Kiswahili B1 · Somo la 26 · 9.26</p><h1>{title}</h1><p>Jifunze kueleza changamoto za safari, kutoa suluhisho na ushauri kwa kutumia viunganishi vya B1.</p></header>
    <WorkbookTabNav activeTab={activeTab} onChange={selectTab} tabs={tabs} ariaLabel="Kiswahili B1 Somo la 26" renderLegacyGrammarPanel={false} />
    <section className="swahili-book__card" role="tabpanel" tabIndex={-1} aria-label={tabs.find(tab=>tab.key===activeTab).label}>
      {activeTab==="grammar" && <Day26Grammar />}
      {activeTab==="sprechen" && <Day26Speaking />}
      {activeTab==="schreiben" && <Day26Writing value={essay} onChange={value=>update("writing","essay",value)} />}
      {activeTab==="lesen" && <><h2>3 · Kusoma</h2><h3>Matatizo ya Safari na Suluhisho Zake</h3>
        {readingPassage.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
        <h3>Maswali 5 ya Ufahamu</h3><Questions questions={readingQuestions} answers={draft.reading || {}} update={(id,value)=>update("reading",id,value)} /></>}
      {activeTab==="hoeren" && <><h2>4 · Kusikiliza</h2>
        <p>Sikiliza mazungumzo ya Amina na Juma mara mbili, kisha jibu maswali kwa Kiswahili.</p>
        {audio.url ? <audio controls preload="none" src={audio.url} aria-label="Mazungumzo ya Amina na Juma" onError={()=>setAudio({url:"",loading:false,error:"Sauti haikupatikana. Jaribu tena."})} /> :
          <button type="button" disabled={audio.loading} onClick={loadAudio}>{audio.loading ? "Inapakia…" : "Pakua sauti ili usikilize"}</button>}
        {audio.error && <p role="alert">{audio.error}</p>}
        <details><summary>Maandishi ya mazungumzo · Mazoezi / mwalimu</summary>{listeningDialogue.map(([speaker,line],index)=><p key={index}><strong>{speaker}:</strong> {line}</p>)}</details>
        <h3>Maswali 5 ya Kusikiliza</h3><Questions questions={listeningQuestions} answers={draft.listening || {}} update={(id,value)=>update("listening",id,value)} /></>}
      {activeTab==="submit" && <><h2>Kagua na uwasilishe kazi</h2>
        {submitted && <p>Kazi iliyowasilishwa awali inaweza kusasishwa.</p>}
        <h3>2 · Kuandika</h3><p style={{whiteSpace:"pre-wrap"}}>{essay || "Hakuna jibu"}</p>
        <h3>3 · Kusoma</h3><Questions questions={readingQuestions} answers={draft.reading || {}} review />
        <h3>4 · Kusikiliza</h3><Questions questions={listeningQuestions} answers={draft.listening || {}} review />
        {!complete && <p>Kamilisha insha na ujibu maswali yote 10 kabla ya kuwasilisha.</p>}
        <label><input type="checkbox" checked={confirmed} disabled={!complete || saving} onChange={event=>setConfirmed(event.target.checked)} /> Nimekagua majibu yangu yote.</label>
        <button type="button" className="swahili-book__button" disabled={!canSubmit || loading || saving || !complete || !confirmed} onClick={submit}>{saving ? "Inawasilishwa…" : submitted ? "Wasilisha marekebisho" : "Wasilisha kwa mwalimu"}</button>
        {notice && <p role="status">{notice}</p>}
      </>}
    </section>
    <SwahiliWorkbookNavigation tabs={tabs} activeTab={activeTab} onChange={selectTab} />
  </main>;
}
