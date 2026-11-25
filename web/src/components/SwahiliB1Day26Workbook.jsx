import SwahiliObjectiveQuestions, { allObjectiveQuestionsAnswered } from "./SwahiliObjectiveQuestions";
import { ReadingExamFrame, ReadingExamDocument } from "./ReadingExamLayout";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { useSwahiliB1Workbook } from "../hooks/useSwahiliB1Workbook";
import { useSwahiliSignedAudio } from "../hooks/useSwahiliSignedAudio";
import { WorkbookTabNav } from "./StandardWorkbookComponents";
import { SWAHILI_B1_WORKBOOK_TABS, useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import { title, readingPassage, listeningDialogue, readingQuestions, listeningQuestions } from "../data/swahili/b1Day26";
import { Day26Grammar, Day26Speaking, Day26Writing } from "./SwahiliB1Day26Learning";
import SwahiliReviewDraft, { SwahiliFinalSubmit } from "./SwahiliReviewDraft";
import "./SwahiliCourseBook.css";

const tabs = SWAHILI_B1_WORKBOOK_TABS;
export default function SwahiliB1Day26Workbook({uid}) {
  const {user} = useAuth();
  const [activeTab, selectTab] = useSwahiliWorkbookTab(tabs);
  const {draft,loading,saving,submitted,notice,feedback,confirmationVersion,storageNotice,canSubmit,update,submit} = useSwahiliB1Workbook({uid,day:26,title,complete: d => Boolean(d.writing.essay?.trim()) && allObjectiveQuestionsAnswered(readingQuestions,d.reading) && allObjectiveQuestionsAnswered(listeningQuestions,d.listening)});
  const {audio,setAudio,loadAudio} = useSwahiliSignedAudio(user,"/api/course-media/swahili/b1/day-26/audio-url");
  const essay = draft.writing.essay || "";
  const complete = Boolean(essay.trim()) && allObjectiveQuestionsAnswered(readingQuestions,draft.reading) && allObjectiveQuestionsAnswered(listeningQuestions,draft.listening);
  return <main className="swahili-book swahili-book--workbook swahili-b1-study" lang="sw">
    <Link to="/campus/course">← Kitabu cha kozi</Link>
    <header className="swahili-book__hero"><p>Kiswahili B1 · Somo la 26 · 9.26</p><h1>{title}</h1><p>Jifunze kueleza changamoto za safari, kutoa suluhisho na ushauri kwa kutumia viunganishi vya B1.</p></header>
    <WorkbookTabNav activeTab={activeTab} onChange={selectTab} tabs={tabs} ariaLabel="Kiswahili B1 Somo la 26" renderLegacyGrammarPanel={false} />
    <section className="swahili-book__card swahili-b1-study__panel" role="tabpanel" tabIndex={-1} aria-label={tabs.find(tab=>tab.key===activeTab).label}>
      {activeTab==="grammar" && <Day26Grammar />}
      {activeTab==="sprechen" && <Day26Speaking />}
      {activeTab==="schreiben" && <Day26Writing value={essay} onChange={value=>update("writing","essay",value)} />}
      {activeTab==="lesen" && <><h2>3 · Kusoma</h2><ReadingExamFrame level="B1" language="sw" title="Matatizo ya Safari na Suluhisho Zake" format="Chagua jibu moja"><ReadingExamDocument label="Maandishi">
        {readingPassage.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
        </ReadingExamDocument></ReadingExamFrame>
        <h3>Maswali 5 ya Ufahamu</h3><SwahiliObjectiveQuestions questions={readingQuestions} answers={draft.reading || {}} onAnswer={(id,value)=>update("reading",id,value)} groupName="reading" /></>}
      {activeTab==="hoeren" && <><h2>4 · Kusikiliza</h2>
        <p>Sikiliza mazungumzo ya Amina na Juma mara mbili, kisha chagua jibu moja kwa kila swali.</p>
        {audio.url ? <audio controls preload="none" src={audio.url} aria-label="Mazungumzo ya Amina na Juma" onError={()=>setAudio({url:"",loading:false,error:"Sauti haikupatikana. Jaribu tena."})} /> :
          <button type="button" disabled={audio.loading} onClick={loadAudio}>{audio.loading ? "Inapakia…" : "Pakua sauti ili usikilize"}</button>}
        {audio.error && <p role="alert">{audio.error}</p>}
        <details><summary>Maandishi ya mazungumzo · Mazoezi / mwalimu</summary>{listeningDialogue.map(([speaker,line],index)=><p key={index}><strong>{speaker}:</strong> {line}</p>)}</details>
        <h3>Maswali 5 ya Kusikiliza</h3><SwahiliObjectiveQuestions questions={listeningQuestions} answers={draft.listening || {}} onAnswer={(id,value)=>update("listening",id,value)} groupName="listening" /></>}
      {activeTab==="submit" && <><h2>Kagua na uwasilishe kazi</h2>
        {submitted && <p>Kazi iliyowasilishwa awali inaweza kusasishwa.</p>}
        <SwahiliReviewDraft writing={{"Insha au ripoti":essay}} questions={readingQuestions} reading={draft.reading || {}} listeningQuestions={listeningQuestions} listening={draft.listening || {}} />
        {!complete && <p>Kamilisha insha na ujibu maswali yote 10 kabla ya kuwasilisha.</p>}
        <SwahiliFinalSubmit key={confirmationVersion} requireListening disabled={!canSubmit || !db || loading || saving || !complete} onSubmit={submit}>
          {saving ? "Inawasilishwa…" : submitted ? "Wasilisha marekebisho" : "Wasilisha kwa mwalimu"}
        </SwahiliFinalSubmit>
        {feedback && <p><strong>Maoni ya mwalimu:</strong> {feedback}</p>}
        {storageNotice && <p role="status">{storageNotice}</p>}
        {notice && <p role="status">{notice}</p>}
      </>}
    </section>
    <SwahiliWorkbookNavigation tabs={tabs} activeTab={activeTab} onChange={selectTab} />
  </main>;
}
