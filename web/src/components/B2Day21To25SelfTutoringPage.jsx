import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import B2Day21To24GrammarNotes from "./B2Day21To24GrammarNotes";
import B2Day25To28GrammarNotes from "./B2Day25To28GrammarNotes";
import B2KnowledgeChoicePractice from "./B2KnowledgeChoicePractice";
import B2SpeakingSupportGuide from "./B2SpeakingSupportGuide";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { useToast } from "../context/ToastContext";
import { getStandardLessonStorageKey, getStandardWritingCloudField, getStandardWritingConfig } from "../data/standardLessonJourney";
import { getB2Days21To25Tutoring } from "../data/b2Days21To25SelfTutoring";
import { styles } from "../styles";

const tabs = ["learn", "speak", "write", "finish", "references"];
const labels = { learn: "1. Learn", speak: "2. Speak", write: "3. Write", finish: "4. Finish", references: "5. Ref" };
const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };
const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;
const NoteBox = ({ children, tone = "blue" }) => { const tones = { blue:["#bfdbfe","#eff6ff","#1e3a8a"], green:["#bbf7d0","#f0fdf4","#14532d"], amber:["#fde68a","#fffbeb","#92400e"] }; const [border,background,color] = tones[tone] || tones.blue; return <div style={{ border:`1px solid ${border}`, borderRadius:14, padding:12, background, color, lineHeight:1.65 }}>{children}</div>; };

const enhanceLesson = (lesson) => {
  const extra = getB2Days21To25Tutoring(lesson?.day);
  if (!extra) return lesson;
  return {
    ...lesson,
    grammarLesson: { ...(lesson.grammarLesson || {}), knowledgeTest: extra.quiz },
    speakingBuilder: { ...(lesson.speakingBuilder || {}), question: extra.question, branches: extra.branches },
  };
};

const GrammarNotes = ({ day, checked, onCheckedChange }) =>
  day === 25
    ? <B2Day25To28GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />
    : <B2Day21To24GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;

const embedUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const id = host === "youtu.be" ? parsed.pathname.replace(/^\//, "") : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch { return ""; }
};

export default function B2Day21To25SelfTutoringPage({ lesson, canonicalLesson = null }) {
  const { showToast } = useToast();
  const guidedLesson = useMemo(() => enhanceLesson(lesson), [lesson]);
  const day = Number(guidedLesson.day);
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !radio);
  const [active, setActive] = useState("learn");
  const storageKey = getStandardLessonStorageKey(guidedLesson, "progress");
  const [progress, setProgress] = useState(() => {
    try { return { learnNotesDone:false, quizDone:false, speakDone:false, completed:false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; }
    catch { return { learnNotesDone:false, quizDone:false, speakDone:false, completed:false }; }
  });
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);

  if (!entered && radio) return <div style={{ ...styles.container, display:"grid", gap:18 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ ...card, borderColor:"#bfdbfe", background:"linear-gradient(135deg,#eff6ff,#f8fafc)" }}>
      <span style={{ ...styles.badge, width:"fit-content", background:"#dbeafe", color:"#1e3a8a" }}>Start here</span>
      <h1 style={{ margin:0 }}>B2 · Day {day} · {guidedLesson.title}</h1>
      <p style={{ margin:0, color:"#475569" }}>Listen to Falowen Radio first. Continue opens Learn, Speak, Write and Finish.</p>
    </header>
    <FalowenRadioTabContent level="B2" day={day} resource={radio} onContinue={() => { setEntered(true); window.scrollTo({ top:0, behavior:"smooth" }); }} />
  </div>;

  const video = guidedLesson.videoResource || canonicalLesson?.resources?.aiVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || guidedLesson.resources?.workbook?.url || "";
  const finish = () => { const completedAt = new Date().toISOString(); setProgress((old) => ({ ...old, completed:true, completedAt })); showToast(`B2 Day ${day} completed. Your progress was saved.`, "success"); };

  return <div style={{ ...styles.container, display:"grid", gap:18 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ borderRadius:22, overflow:"hidden", color:"#fff", backgroundImage:`linear-gradient(135deg,rgba(2,6,23,.94),rgba(30,64,175,.72)),url(${guidedLesson.heroImage || ""})`, backgroundSize:"cover", backgroundPosition:"center", padding:"clamp(22px,4vw,42px)", display:"grid", gap:16, minHeight:240, alignContent:"space-between" }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}><span style={{ ...styles.badge, background:"rgba(255,255,255,.16)", color:"#fff" }}>B2</span><span style={{ ...styles.badge, background:"rgba(255,255,255,.16)", color:"#fff" }}>Day {day}</span><span style={{ ...styles.badge, background:"rgba(37,99,235,.9)", color:"#fff" }}>Chapter {guidedLesson.chapter}</span></div>
      <div><h1 style={{ margin:0, fontSize:"clamp(2rem,5vw,3.4rem)" }}>{guidedLesson.title}</h1><p style={{ margin:"10px 0 0", color:"#e2e8f0" }}>{guidedLesson.topic}</p></div>
    </header>
    <div style={{ position:"sticky", top:0, zIndex:5, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:8, padding:10, border:"1px solid #e2e8f0", borderRadius:18, background:"rgba(248,250,252,.94)" }}>{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActive(tab)} style={{ ...(active===tab ? styles.primaryButton : styles.secondaryButton), borderRadius:999, minHeight:44 }}>{labels[tab]}</button>)}</div>

    {active === "learn" ? <>
      <Section title="AI video">{video?.url ? <div style={{ display:"grid", gap:10 }}><strong>{video.title || "Lesson video"}</strong>{video.description ? <p style={{ margin:0, color:"#475569", lineHeight:1.6 }}>{video.description}</p> : null}{videoEmbed ? <div style={{ position:"relative", width:"100%", paddingTop:"56.25%", borderRadius:16, overflow:"hidden", background:"#0f172a" }}><iframe title={video.title || "B2 lesson video"} src={videoEmbed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:0 }} /></div> : null}</div> : <NoteBox tone="amber">No dedicated AI video has been added yet. Continue with the grammar notes below.</NoteBox>}</Section>
      <GrammarNotes day={day} checked={progress.learnNotesDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnNotesDone:checked }))} />
      <B2KnowledgeChoicePractice lesson={guidedLesson} onCompleteChange={(quizDone) => setProgress((old) => ({ ...old, quizDone }))} />
    </> : null}

    {active === "speak" ? <Section title="Speaking builder"><B2SpeakingSupportGuide lesson={guidedLesson} /><EmbeddedSpeechPracticePanel /><label style={{ display:"flex", gap:9, alignItems:"center", fontWeight:800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone:event.target.checked }))} />I completed a speaking practice.</label></Section> : null}

    {active === "write" ? <Section title="Guided writing builder"><WritingCheatSheetTabs level="B2" day={day}><WritingTaskPrompt lesson={guidedLesson} />{workbookUrl ? <a href={workbookUrl} style={{ ...styles.linkButton, width:"fit-content" }}>Open lesson workbook</a> : null}<GuidedWritingWorkspace config={getStandardWritingConfig(guidedLesson)} storageKey={getStandardLessonStorageKey(guidedLesson, "writing")} cloudField={getStandardWritingCloudField(guidedLesson)} /></WritingCheatSheetTabs></Section> : null}
    {active === "references" ? <WorkbookReferenceAnswers level="B2" lesson={guidedLesson} workbookId={`B2-day-${day}`} /> : null}
    {active === "finish" ? <Section title={`Summary B2 Day ${day}`}><NoteBox tone={progress.learnNotesDone && progress.quizDone && progress.speakDone ? "green" : "amber"}><strong>Progress:</strong> Grammar notes {progress.learnNotesDone ? "✓" : "—"} · Grammar check {progress.quizDone ? "✓" : "—"} · Speaking {progress.speakDone ? "✓" : "—"}</NoteBox>{progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}<button type="button" style={{ ...styles.primaryButton, width:"fit-content" }} onClick={finish}>I have completed</button></Section> : null}
  </div>;
}
