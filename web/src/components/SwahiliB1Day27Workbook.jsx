import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, doc, getDoc } from "../firebase";
import { saveSwahiliWorkbook } from "../services/swahiliWorkbookService";
import { canSubmitSwahiliWorkbook } from "../utils/campusProgram";
import { WorkbookTabNav } from "./StandardWorkbookComponents";
import { SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import { title, listeningDialogue, listeningQuestions } from "../data/swahili/b1Day27";
import "./SwahiliCourseBook.css";

const tabs = [{key:"hoeren",label:"4 · Kusikiliza"},{key:"submit",label:"Kagua na uwasilishe"}];
function Questions({questions, answers, update, review = false}) {
  return <ol>{questions.map(({id,prompt,english}) => <li key={id}>
    <label htmlFor={review ? undefined : id}>{prompt}</label>
    {english && <p lang="en">{english}</p>}
    {review ? <p>{answers[id] || "Hakuna jibu"}</p> :
      <textarea id={id} rows={3} value={answers[id] || ""} onChange={event => update(id,event.target.value)} />}
  </li>)}</ol>;
}
export default function SwahiliB1Day27Workbook({uid}) {
  const {user,studentProfile} = useAuth();
  const canSubmit = canSubmitSwahiliWorkbook({user,studentProfile}) && uid === user?.uid;
  const [params,setParams] = useSearchParams();
  const activeTab = tabs.some(tab => tab.key === params.get("view")) ? params.get("view") : "hoeren";
  function selectTab(key) { const next = new URLSearchParams(params); next.set("view",key); setParams(next,{replace:true}); }
  const draftKey = uid && "swahili-b1-day-27:" + uid;
  const [draft,setDraft] = useState(() => {
    try { return (draftKey && JSON.parse(sessionStorage.getItem(draftKey))) || {listening:{}}; }
    catch { return {listening:{}}; }
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
      const response = await fetch("/api/course-media/swahili/b1/day-27/audio-url",{headers:{Authorization:`Bearer ${token}`}});
      const result = await response.json();
      if (!response.ok || !result?.url) throw new Error(result?.error || "Sauti haikupatikana.");
      setAudio({url:result.url,loading:false,error:""});
    } catch (error) { setAudio({url:"",loading:false,error:error.message || "Sauti haikupatikana. Jaribu tena."}); }
  }
  const complete = listeningQuestions.every(({id}) => draft.listening?.[id]?.trim());
  useEffect(() => {
    if (!canSubmit || !db) { setLoading(false); return; }
    let active = true;
    getDoc(doc(db,"users",uid,"swahiliLessons","b1-day-27")).then(snapshot => {
      if (!active || !snapshot.exists()) return;
      const prior = snapshot.data();
      setDraft(current => ({listening:{...prior.listeningAnswers,...current.listening}}));
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
      await saveSwahiliWorkbook(user,{program:"swahili",level:"B1",day:27,lessonId:"swahili-b1-day-27",title,writing:{},readingAnswers:{},listeningAnswers:draft.listening});
      setSubmitted(true); setConfirmed(false); setNotice("Kazi yako imewasilishwa kwa mwalimu.");
    } catch { setNotice("Imeshindikana kuwasilisha kazi. Jaribu tena."); }
    finally { setSaving(false); }
  }
  return <main className="swahili-book swahili-book--workbook" lang="sw">
    <Link to="/campus/course">← Kitabu cha kozi</Link>
    <header className="swahili-book__hero"><p>Kiswahili B1 · Somo la 27 · 10.27</p><h1>{title}</h1><p>Sikiliza mazungumzo kuhusu kupunguza plastiki na kutumia bidhaa zinazoweza kutumiwa tena.</p></header>
    <WorkbookTabNav activeTab={activeTab} onChange={selectTab} tabs={tabs} ariaLabel="Kiswahili B1 Somo la 27" renderLegacyGrammarPanel={false} />
    <section className="swahili-book__card" role="tabpanel" tabIndex={-1} aria-label={tabs.find(tab=>tab.key===activeTab).label}>
      {activeTab==="hoeren" && <><h2>4 · Kusikiliza</h2>
        <p>Sikiliza mazungumzo ya Amina na Juma mara mbili, kisha jibu maswali kwa Kiswahili.</p>
        {audio.url ? <audio controls preload="none" src={audio.url} aria-label="Mazungumzo ya Amina na Juma" onError={()=>setAudio({url:"",loading:false,error:"Sauti haikupatikana. Jaribu tena."})} /> :
          <button type="button" disabled={audio.loading} onClick={loadAudio}>{audio.loading ? "Inapakia…" : "Pakua sauti ili usikilize"}</button>}
        {audio.error && <p role="alert">{audio.error}</p>}
        <details><summary>Maandishi ya mazungumzo · Soma baada ya kusikiliza</summary>{listeningDialogue.map(([speaker,line],index)=><p key={index}><strong>{speaker}:</strong> {line}</p>)}</details>
        <h3>Maswali 5 ya Kusikiliza</h3><Questions questions={listeningQuestions} answers={draft.listening || {}} update={(id,value)=>update("listening",id,value)} /></>}
      {activeTab==="submit" && <><h2>Kagua na uwasilishe kazi</h2>
        {submitted && <p>Kazi iliyowasilishwa awali inaweza kusasishwa.</p>}
        <h3>4 · Kusikiliza</h3><Questions questions={listeningQuestions} answers={draft.listening || {}} review />
        {!complete && <p>Jibu maswali yote matano kabla ya kuwasilisha.</p>}
        <label><input type="checkbox" checked={confirmed} disabled={!complete || saving} onChange={event=>setConfirmed(event.target.checked)} /> Nimekagua majibu yangu yote.</label>
        <button type="button" className="swahili-book__button" disabled={!canSubmit || loading || saving || !complete || !confirmed} onClick={submit}>{saving ? "Inawasilishwa…" : submitted ? "Wasilisha marekebisho" : "Wasilisha kwa mwalimu"}</button>
        {notice && <p role="status">{notice}</p>}
      </>}
    </section>
    <SwahiliWorkbookNavigation tabs={tabs} activeTab={activeTab} onChange={selectTab} />
  </main>;
}
