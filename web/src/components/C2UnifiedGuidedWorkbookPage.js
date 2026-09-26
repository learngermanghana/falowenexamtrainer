import React,{useEffect,useMemo,useRef,useState}from"react";
import{useLocation,useNavigate}from"react-router-dom";
import AppBackButton from"./navigation/AppBackButton";
import{EmbeddedSpeechPracticePanel}from"./selfLearning/EmbeddedPracticePanels";
import{AdvancedSelfLearningTabNav}from"./StandardWorkbookComponents";
import{styles}from"../styles";
import{getC2ExamStandard}from"../data/c2ExamStandardContent";
import{getC2TopicKnowledge,getC2TopicChecks}from"../data/c2TopicKnowledge";
import{getC2ReviewKeyPoints}from"../data/c2ReviewKeyPoints";
import{getC2LessonContentAlignment}from"../data/c2LessonContentAlignment";
import{getC2WritingFormat}from"../data/c2WritingFormats";
import{getC2ReadingPractice}from"../data/c2ReadingPractice";
import{getC2ListeningPractice,hasC2ListeningSource}from"../data/c2ListeningPractice";
import{getC2DayTabs,getC2SkillFocus,getC2SkillLabel,getC2SpeakingSupport,getC2SpeakingSupportNote}from"../data/c2SkillCycle";
import{useC2CloudDraftField}from"../utils/c2CloudDraftSync";
import{useLessonResumeSync}from"../hooks/useLessonResumeSync";
import{useC2CourseProgress}from"../hooks/useC2CourseProgress";
import{useAuth}from"../context/AuthContext";
import{markLetterWithAI}from"../services/coachService";
import{fetchC2AudioPlaybackUrl}from"../services/c2AudioService";
import WritingFeedbackCard from"./WritingFeedbackCard";

const card={...styles.card,display:"grid",gap:14,border:"1px solid #e2e8f0",borderRadius:18,boxShadow:"0 10px 26px rgba(15,23,42,.06)"};
const sub={border:"1px solid #dbeafe",borderRadius:14,padding:13,background:"#f8fbff",display:"grid",gap:6};
const Section=({title,children})=><section style={card}><h2 style={{margin:0,fontSize:"1.18rem"}}>{title}</h2>{children}</section>;
const Opinion=({children,index})=><blockquote style={{margin:0,border:"1px solid #cbd5e1",borderRadius:14,padding:16,background:"#fff",fontStyle:"italic",lineHeight:1.7}}>{index?index+". ":""}„{children}“</blockquote>;

const TRANSFORMATION_FAMILIES=[
 ["obwohl → trotz","Obwohl die Umsetzung teuer ist, ... → Trotz der hohen Umsetzungskosten ..."],
 ["um ... zu → zur + Nominalisierung","..., um den Zugang zu verbessern. → ... zur Verbesserung des Zugangs."],
 ["erkennen/merken → jemandem wird klar","Die Beteiligten erkannten, dass ... → Den Beteiligten wurde klar, dass ..."],
 ["wenn + Mittel/Ursache → durch + Nominalisierung","Wenn Institutionen investieren, ... → Durch gezielte Investitionen ..."],
 ["skeptisch sein → Zweifel haben","Viele waren skeptisch, ob ... → Viele hatten Zweifel daran, ob ..."],
];

const speakingBranches=(standard,knowledge)=>[
 {title:"1. Erste Kursaussage",ideas:[knowledge.vocab?.[0]?.[0],knowledge.actors?.[0]?.[0],knowledge.tensions?.[0]?.[0]].filter(Boolean),prompt:`Was spricht für diese Aussage, und wo liegt ihre Grenze? „${standard.perspectives?.[0]}“`,starter:"Dieser Position lässt sich insofern zustimmen, als ..."},
 {title:"2. Zweite Kursaussage",ideas:[knowledge.vocab?.[1]?.[0],knowledge.actors?.[1]?.[0],knowledge.tensions?.[0]?.[1]].filter(Boolean),prompt:`Welche Bedingungen oder Gegenargumente sind wichtig? „${standard.perspectives?.[1]}“`,starter:"Für diese Sichtweise spricht ..., allerdings ist zu berücksichtigen, dass ..."},
 {title:"3. Dritte Kursaussage",ideas:[knowledge.vocab?.[2]?.[0],knowledge.actors?.[2]?.[0],knowledge.tensions?.[1]?.join(" ↔ ")].filter(Boolean),prompt:`Wie weit trägt die dritte Aussage? „${standard.perspectives?.[2]}“`,starter:"Die Aussage benennt einen wichtigen Aspekt, greift jedoch zu kurz, wenn ..."},
 {title:"4. Zielkonflikt",ideas:(knowledge.tensions||[]).slice(0,3).map(([a,b])=>`${a} ↔ ${b}`),prompt:"Welcher Zielkonflikt ist für deine Bewertung entscheidend?",starter:"Der zentrale Zielkonflikt besteht meines Erachtens zwischen ... und ..."},
 {title:"5. Synthese",ideas:(knowledge.actors||[]).map(([actor])=>actor),prompt:"Wie lassen sich die Perspektiven verbinden, ohne Unterschiede einzuebnen?",starter:"Zusammenfassend erscheint weniger eine einzelne Perspektive entscheidend als vielmehr ..."},
];

function TopicFoundation({standard,knowledge}){
 return <Section title={`Thema verstehen · ${standard.title}`}>
  <div data-c2-topic-foundation-day={standard.day} style={{display:"grid",gap:12}}>
   <div style={{...sub,background:"#eff6ff"}}><strong>In simple English</strong><span style={{lineHeight:1.75}}>{knowledge.en}</span></div>
   <div style={{...sub,background:"#fff"}}><strong>Auf Deutsch</strong><span style={{lineHeight:1.75}}>{knowledge.de}</span></div>
   <div style={{...sub,background:"#f8fafc"}}><strong>Konkretes Beispiel</strong><span style={{lineHeight:1.75}}>{knowledge.example}</span></div>
   <div><strong>Wer ist beteiligt?</strong><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:8,marginTop:8}}>{knowledge.actors.map(([actor,role])=><div key={actor} style={sub}><strong>{actor}</strong><span>{role}</span></div>)}</div></div>
   <div><strong>Welche Interessen oder Werte geraten in Spannung?</strong><div style={{display:"grid",gap:8,marginTop:8}}>{knowledge.tensions.map(([left,right])=><div key={left} style={{...sub,background:"#fffbeb"}}><span><strong>{left}</strong> ↔ <strong>{right}</strong></span></div>)}</div></div>
   <div style={{...sub,background:"#eef2ff"}}><strong>Kernfrage</strong><span style={{lineHeight:1.7}}>{knowledge.core}</span></div>
  </div>
 </Section>;
}

function TopicLanguage({mastery}){
 return <Section title="Wortschatz und Kollokationen">
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>{mastery.vocabulary.map(([word,meaning])=><div key={word} style={sub}><strong>{word}</strong><span style={{color:"#64748b"}}>{meaning}</span></div>)}</div>
  <div style={{display:"grid",gap:10}}>{mastery.collocations.map(([phrase,meaning,example])=><div key={phrase} style={{...sub,background:"#eff6ff"}}><strong>{phrase}</strong><span style={{color:"#64748b"}}>{meaning}</span><span>{example}</span></div>)}</div>
 </Section>;
}

function GrammarTeaching({mastery,standard}){
 const grammar=mastery.grammarNotes;
 return <Section title={`Grammatik · ${standard.grammarFocus}`}>
  <div><strong>Wann und warum?</strong><p style={{lineHeight:1.75,marginBottom:0}}>{grammar.usage}</p></div>
  <div><strong>Struktur kontrollieren</strong><p style={{lineHeight:1.75,marginBottom:0}}>{grammar.wordOrder}</p></div>
  <div><strong>Modelle zum heutigen Thema</strong><div style={{display:"grid",gap:8,marginTop:8}}>{grammar.examples.map((example,index)=><div key={example} style={sub}><strong>{index===0?"Grundmuster":"C2-Anwendung"}</strong><span>{example}</span></div>)}</div></div>
  <div style={{border:"1px solid #fecaca",borderRadius:12,padding:12,background:"#fff7f7"}}><strong>Typischer Fehler</strong><p style={{marginBottom:0}}>{grammar.commonMistakes[0]}</p></div>
 </Section>;
}

function Learn({day,standard,knowledge,mastery,skillFocus,completed,onCompleteChange}){
 const checks=getC2TopicChecks(day);
 return <div style={{display:"grid",gap:14}}>
  <TopicFoundation standard={standard} knowledge={knowledge}/>
  <TopicLanguage mastery={mastery}/>
  <GrammarTeaching mastery={mastery} standard={standard}/>
  {skillFocus==="write"?<Section title="Argumentation · Schreiben vorbereiten">
   <p style={{margin:0,lineHeight:1.75}}>Plane zuerst Position → Begründung → Beispiel → Gegenargument → Reaktion → Synthese. Die heutige Grammatik soll die Argumentation präziser machen, nicht unnötig kompliziert.</p>
  </Section>:standard.writeType==="reformulation"?<Section title="Umformung · kurzes Grammatiktraining">
   <p style={{margin:0,lineHeight:1.75}}>Nutze die Transformationsfamilien heute als Grammatiktraining. Sie sind nicht die Hauptaufgabe des Tages.</p>
   <div style={{display:"grid",gap:9}}>{TRANSFORMATION_FAMILIES.map(([name,example])=><div key={name} style={sub}><strong>{name}</strong><span>{example}</span></div>)}</div>
  </Section>:<Section title="Argumentation · Inhalt vor Form">
   <p style={{margin:0,lineHeight:1.75}}>Plane zuerst Position → Begründung → Beispiel → Gegenargument → Reaktion → Synthese. Nutze die heutige Grammatik nur dort, wo sie die logische Beziehung oder das Register präziser macht.</p>
  </Section>}
  <Section title="Themen-Check · Vorbereitung auf die Unterrichtsfragen">
   <div style={{display:"grid",gap:10}}>{checks.map((check,index)=><details key={check.question} style={sub}><summary style={{cursor:"pointer",fontWeight:800}}>{index+1}. {check.question}</summary><ol style={{lineHeight:1.7}}>{check.options.map(option=><li key={option}>{option}</li>)}</ol><p><strong>Antwort:</strong> {check.options[check.answerIndex]}</p><p style={{marginBottom:0}}>{check.explanation}</p></details>)}</div>
   <label style={{display:"flex",gap:8,alignItems:"flex-start",fontWeight:700,lineHeight:1.5}}><input type="checkbox" checked={Boolean(completed)} onChange={e=>onCompleteChange?.(e.target.checked)} style={{marginTop:4}}/>Ich verstehe das Thema, kann mindestens einen Zielkonflikt erklären und passende C2-Sprache dafür verwenden.</label>
  </Section>
 </div>;
}

function Speak({standard,knowledge,day,completed,onCompleteChange}){
 const recommendedSupport=getC2SpeakingSupport(day);
 const[support,setSupport]=useState(recommendedSupport);
 const planKey=`falowen:c2:day${day}:unified-speech-plan`;
 const[plan,setPlan]=useState(()=>{try{return localStorage.getItem(planKey)||""}catch{return""}});
 const[legacyPlanSeedAllowed]=useState(()=>{try{return Boolean(String(localStorage.getItem(planKey)||"").trim())}catch{return false}});
 useEffect(()=>{try{localStorage.setItem(planKey,plan)}catch{}},[planKey,plan]);
 useC2CloudDraftField({day,field:"speechPlan",value:plan,setValue:setPlan,seedCloudWhenMissing:legacyPlanSeedAllowed,defaultValue:""});
 const branches=speakingBranches(standard,knowledge);
 return <Section title="Sprechen · Erst verstehen, dann argumentieren">
  <div style={{display:"grid",gap:12}}>
   <p style={{margin:0,lineHeight:1.75}}>Halten Sie einen strukturierten 3–5-minütigen Beitrag zu „{standard.title}“. Wägen Sie die drei Kursaussagen ab, geben Sie Beispiele und formulieren Sie eine eigene Synthese.</p>
   <div style={{...sub,background:"#fffbeb",borderColor:"#fde68a"}}><strong>Recommended support for this stage: {recommendedSupport==="full"?"Mit Hilfe":recommendedSupport==="keywords"?"Weniger Hilfe":"Prüfungsmodus"}</strong><span>{getC2SpeakingSupportNote(day)}</span></div>
   <div style={{display:"grid",gap:9}}>{standard.perspectives.map((quote,index)=><Opinion key={quote} index={index+1}>{quote}</Opinion>)}</div>
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[["full","1. Mit Hilfe"],["keywords","2. Weniger Hilfe"],["exam","3. Prüfungsmodus"]].map(([value,label])=><button key={value} type="button" onClick={()=>setSupport(value)} style={support===value?styles.primaryButton:styles.secondaryButton}>{label}</button>)}</div>
   {support!=="exam"?<div style={{display:"grid",gap:10}}>{branches.map(branch=><div key={branch.title} style={{...sub,background:"#eef2ff"}}><strong>{branch.title}</strong><div><strong>Ideen:</strong> {branch.ideas.join(" · ")}</div><div><strong>Leitfrage:</strong> {branch.prompt}</div>{support==="full"?<div style={{color:"#1e3a8a"}}><strong>C2-Satzanfang:</strong> {branch.starter}</div>:null}</div>)}</div>:<div style={{...sub,background:"#f0fdf4"}}><strong>Prüfungsmodus</strong><span>Entwickeln Sie Position, Begründung, Beispiel, Gegenargument und Synthese ohne Ideenbank.</span></div>}
   <textarea value={plan} onChange={e=>setPlan(e.target.value)} placeholder="Vortragsplan: Einleitung → Perspektiven → Beispiel → Gegenargument → Synthese" style={{minHeight:150,border:"1px solid #cbd5e1",borderRadius:12,padding:12,font:"inherit",lineHeight:1.7}}/>
   <EmbeddedSpeechPracticePanel/>
   <label style={{display:"flex",gap:8,alignItems:"center",fontWeight:700}}><input type="checkbox" checked={Boolean(completed)} onChange={e=>onCompleteChange?.(e.target.checked)}/>Ich habe den Vortrag durchgeführt und meine Position begründet.</label>
  </div>
 </Section>;
}

function OpinionWrite({standard,day,completed,onCompleteChange}){
 const{user,idToken,studentProfile}=useAuth();
 const format=useMemo(()=>getC2WritingFormat(day,standard.title),[day,standard.title]);
 const key=`falowen:c2:day${day}:unified-opinion`;
 const feedbackKey=`falowen:c2:day${day}:writing-feedback`;
 const template=format.template;
 const[draft,setDraft]=useState(()=>{try{const saved=localStorage.getItem(key);return !String(saved||"").trim()?template:saved}catch{return template}});
 const[legacyDraftSeedAllowed]=useState(()=>{try{const saved=localStorage.getItem(key)||"";return Boolean(String(saved).trim()&&saved!==template)}catch{return false}});
 const[feedbackData,setFeedbackData]=useState(()=>{try{return JSON.parse(localStorage.getItem(feedbackKey)||"null")}catch{return null}});
 const[legacyFeedbackSeedAllowed]=useState(()=>{try{return Boolean(localStorage.getItem(feedbackKey))}catch{return false}});
 const[analysing,setAnalysing]=useState(false);
 const[analysisError,setAnalysisError]=useState("");
 useEffect(()=>{try{localStorage.setItem(key,draft)}catch{}},[key,draft]);
 useEffect(()=>{try{if(feedbackData)localStorage.setItem(feedbackKey,JSON.stringify(feedbackData));else localStorage.removeItem(feedbackKey)}catch{}},[feedbackKey,feedbackData]);
 useC2CloudDraftField({day,field:"opinionDraft",value:draft,setValue:setDraft,seedCloudWhenMissing:legacyDraftSeedAllowed,defaultValue:template});
 useC2CloudDraftField({day,field:"writingFeedback",value:feedbackData,setValue:setFeedbackData,seedCloudWhenMissing:legacyFeedbackSeedAllowed,defaultValue:null});
 const words=useMemo(()=>draft.trim()?draft.trim().split(/\s+/).length:0,[draft]);
 const hasPlaceholders=/\[[^\]]+\]/.test(draft);
 const restoreTemplate=()=>{
  if(draft.trim()&&draft!==template&&typeof window!=="undefined"&&!window.confirm("Die aktuelle Antwort wird durch die C2-Vorlage ersetzt. Fortfahren?"))return;
  setDraft(template);
  setFeedbackData(null);
 };
 const analyseDraft=async()=>{
  const text=String(draft||"").trim();
  if(!text){setAnalysisError("Write your C2 text first, then click Analyse my text.");return;}
  if(hasPlaceholders){setAnalysisError("Replace the remaining [placeholders] with your own content before AI analysis.");return;}
  if(words<80){setAnalysisError("Develop the text a little further before AI analysis so the feedback is meaningful.");return;}
  setAnalysing(true);
  setAnalysisError("");
  try{
   const result=await markLetterWithAI({
    text,
    level:"C2",
    studentName:String(studentProfile?.name||studentProfile?.fullName||user?.displayName||user?.email||"Student"),
    program:studentProfile?.program,
    submissionContext:`course-task:C2 Day ${day} ${format.label} ${standard.title}`,
    promptType:format.label==="Formelle E-Mail"?"formal-letter":"argument",
    idToken,
   });
   if(String(draft||"").trim()!==text){setAnalysisError("Your text changed while analysis was running. Click Analyse my text again for the newest version.");return;}
   setFeedbackData(result?.structuredFeedback||result);
  }catch(error){
   setAnalysisError(error?.response?.data?.error||error?.message||"Falowen could not analyse your text right now. Please try again.");
  }finally{setAnalysing(false);}
 };
 return <Section title={`Schreiben · ${format.label}`}>
  <p style={{margin:0,lineHeight:1.75}}>{format.instruction}</p>
  <div style={{display:"grid",gap:9}}>{standard.perspectives.map((quote,index)=><Opinion key={quote} index={index+1}>{quote}</Opinion>)}</div>
  <div style={{...sub,background:"#f0fdf4",borderColor:"#bbf7d0"}}>
   <strong>Passende C2-Schreibvorlage ist bereits im Textfeld gespeichert</strong>
   <span style={{lineHeight:1.65}}>Nutzen Sie die Satzanfänge und Abschnittshinweise nur als Gerüst. Entwickeln Sie Ihre eigenen Argumente, Beispiele und Bewertungen. Ihre gespeicherte Antwort bleibt beim erneuten Öffnen erhalten.</span>
   <div><button type="button" onClick={restoreTemplate} style={styles.secondaryButton}>Vorlage wiederherstellen</button></div>
  </div>
  <textarea data-c2-opinion-editor="true" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Schreiben Sie hier Ihren vollständigen C2-Text ..." style={{minHeight:520,border:"1px solid #94a3b8",borderRadius:12,padding:14,font:"inherit",lineHeight:1.75,overflowAnchor:"none"}}/>
  <div style={{fontWeight:700,color:"#475569"}}>{words} Wörter · Ziel: circa {format.targetWords} Wörter · automatisch gespeichert</div>
  <div style={{...sub,background:"#eff6ff",borderColor:"#bfdbfe"}}>
   <strong>AI-Schreibanalyse</strong>
   <span>Wenn Ihr Text fertig ist, kann Falowen ihn auf C2-Niveau bewerten: Aufgabenbezug, Kohäsion, Grammatik, Wortschatz, Register, Nuance und Präzision.</span>
   <div><button type="button" onClick={analyseDraft} disabled={analysing} style={styles.primaryButton}>{analysing?"Analysing your text…":feedbackData?"Analyse again":"Analyse my text"}</button></div>
   {analysisError?<div role="alert" style={{color:"#b91c1c",fontWeight:700}}>{analysisError}</div>:null}
  </div>
  {feedbackData?<WritingFeedbackCard level="C2" draft={draft} structuredFeedback={feedbackData}/>:null}
  <label style={{display:"flex",gap:8,alignItems:"center",fontWeight:700}}><input type="checkbox" checked={Boolean(completed)} onChange={e=>onCompleteChange?.(e.target.checked)}/>Ich habe die Aufgabe vollständig bearbeitet und meinen Text überarbeitet.</label>
 </Section>;
}
function ReadingPractice({day,completed,onCompleteChange}){
 const practice=getC2ReadingPractice(day);
 const answerKey=`falowen:c2:day${day}:reading-answers`;
 const firstAttemptKey=`falowen:c2:day${day}:reading-first-attempts`;
 const[answers,setAnswers]=useState(()=>{try{return JSON.parse(localStorage.getItem(answerKey)||"{}")}catch{return{}}});
 const[firstAttempts,setFirstAttempts]=useState(()=>{try{return JSON.parse(localStorage.getItem(firstAttemptKey)||"{}")}catch{return{}}});
 const[legacyAnswersSeedAllowed]=useState(()=>{try{return Object.keys(JSON.parse(localStorage.getItem(answerKey)||"{}")).length>0}catch{return false}});
 const[legacyFirstAttemptsSeedAllowed]=useState(()=>{try{return Object.keys(JSON.parse(localStorage.getItem(firstAttemptKey)||"{}")).length>0}catch{return false}});
 useEffect(()=>{try{localStorage.setItem(answerKey,JSON.stringify(answers))}catch{}},[answerKey,answers]);
 useEffect(()=>{try{localStorage.setItem(firstAttemptKey,JSON.stringify(firstAttempts))}catch{}},[firstAttemptKey,firstAttempts]);
 useC2CloudDraftField({day,field:"readingAnswers",value:answers,setValue:setAnswers,seedCloudWhenMissing:legacyAnswersSeedAllowed,defaultValue:{}});
 useC2CloudDraftField({day,field:"readingFirstAttempts",value:firstAttempts,setValue:setFirstAttempts,seedCloudWhenMissing:legacyFirstAttemptsSeedAllowed,defaultValue:{}});
 const questions=practice?.questions||[];
 const answered=questions.filter((_,index)=>Number.isInteger(answers[index])).length;
 const firstAttemptAnswered=questions.filter((_,index)=>Number.isInteger(firstAttempts[index])).length;
 const firstAttemptCorrect=questions.filter((item,index)=>firstAttempts[index]===item.answerIndex).length;
 const chooseAnswer=(index,optionIndex)=>{
  setAnswers(old=>({...old,[index]:optionIndex}));
  setFirstAttempts(old=>Number.isInteger(old[index])?old:{...old,[index]:optionIndex});
 };
 useEffect(()=>{if(questions.length&&answered===questions.length&&!completed)onCompleteChange?.(true)},[answered,questions.length,completed,onCompleteChange]);
 if(!practice)return <Section title="Lesen"><p style={{margin:0}}>Für diesen Tag ist keine Leseaufgabe vorgesehen.</p></Section>;
 return <Section title={`Lesen · ${practice.title}`}>
  <div style={{...sub,background:"#eff6ff"}}><strong>So arbeiten Sie</strong><span>Lesen Sie den Text aufmerksam. Klicken Sie bei jeder Frage auf eine Antwort. Sie sehen sofort, ob sie richtig ist und warum. Eine falsche erste Antwort blockiert den Abschluss nicht.</span></div>
  <article style={{display:"grid",gap:12,lineHeight:1.8,fontSize:"1.02rem"}}>{practice.text.map((paragraph,index)=><p key={index} style={{margin:0}}>{paragraph}</p>)}</article>
  <div style={{display:"grid",gap:14}}>{questions.map((item,index)=>{
   const selected=answers[index];
   const hasAnswer=Number.isInteger(selected);
   const correct=selected===item.answerIndex;
   return <article key={item.question} style={{...sub,background:"#fff"}}>
    <strong>{index+1}. {item.question}</strong>
    <div style={{display:"grid",gap:8}}>{item.options.map((option,optionIndex)=>{
     const isSelected=selected===optionIndex;
     const isCorrectOption=hasAnswer&&optionIndex===item.answerIndex;
     const background=isCorrectOption?"#f0fdf4":isSelected?"#fff7ed":"#fff";
     const border=isCorrectOption?"2px solid #86efac":isSelected?"2px solid #fdba74":"1px solid #cbd5e1";
     return <button key={option} type="button" onClick={()=>chooseAnswer(index,optionIndex)} style={{...styles.secondaryButton,textAlign:"left",justifyContent:"flex-start",background,border,color:"#0f172a"}}>{String.fromCharCode(65+optionIndex)}. {option}</button>;
    })}</div>
    {hasAnswer?<div style={{border:`1px solid ${correct?"#86efac":"#fecaca"}`,borderRadius:12,padding:11,background:correct?"#f0fdf4":"#fff7f7",lineHeight:1.65}}><strong>{correct?"Richtig.":"Noch nicht richtig."}</strong> {!correct?<span>Richtige Antwort: <strong>{String.fromCharCode(65+item.answerIndex)}. {item.options[item.answerIndex]}</strong>. </span>:null}<span>{item.explanation}</span></div>:null}
   </article>;
  })}</div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10}}>
   <div style={{...sub,background:answered===questions.length?"#f0fdf4":"#f8fafc"}}><strong>{answered}/{questions.length} Fragen beantwortet</strong><span>{answered===questions.length?"Lesen ist für heute abgeschlossen.":"Beantworten Sie alle Fragen. Fehler sind erlaubt — die Aufgabe dient dem direkten Lernen."}</span></div>
   <div style={{...sub,background:"#f8fafc"}}><strong>Erster Versuch: {firstAttemptCorrect}/{questions.length}</strong><span>{firstAttemptAnswered<questions.length?`${firstAttemptAnswered}/${questions.length} erste Antworten erfasst`:"Dieser Wert dient nur als Lernstand. Er entscheidet nicht über den Kursabschluss."}</span></div>
  </div>
 </Section>;
}
const youtubeEmbedUrl=(url)=>{
 const value=String(url||"").trim();
 if(!value)return"";
 const short=value.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
 const watch=value.match(/[?&]v=([A-Za-z0-9_-]+)/);
 const embed=value.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
 const id=short?.[1]||watch?.[1]||embed?.[1]||"";
 return id?`https://www.youtube.com/embed/${id}`:"";
};

function ListeningPractice({day,completed,onCompleteChange}){
 const{idToken}=useAuth();
 const practice=getC2ListeningPractice(day);
 const audioKey=String(practice?.audioKey||"").trim();
 const audioUrl=String(practice?.audioUrl||"").trim();
 const hasSource=hasC2ListeningSource(practice);
 const embed=!audioKey?youtubeEmbedUrl(audioUrl):"";
 const transcriptParagraphs=Array.isArray(practice?.transcript)
  ?practice.transcript.filter(Boolean)
  :String(practice?.transcript||"").split(/\n\s*\n/).map(value=>value.trim()).filter(Boolean);
 const questions=Array.isArray(practice?.questions)?practice.questions:[];
 const answerKey=`falowen:c2:day${day}:listening-answers`;
 const firstAttemptKey=`falowen:c2:day${day}:listening-first-attempts`;
 const[answers,setAnswers]=useState(()=>{try{return JSON.parse(localStorage.getItem(answerKey)||"{}")}catch{return{}}});
 const[firstAttempts,setFirstAttempts]=useState(()=>{try{return JSON.parse(localStorage.getItem(firstAttemptKey)||"{}")}catch{return{}}});
 const[legacyAnswersSeedAllowed]=useState(()=>{try{return Object.keys(JSON.parse(localStorage.getItem(answerKey)||"{}")).length>0}catch{return false}});
 const[legacyFirstAttemptsSeedAllowed]=useState(()=>{try{return Object.keys(JSON.parse(localStorage.getItem(firstAttemptKey)||"{}")).length>0}catch{return false}});
 const[showTranscript,setShowTranscript]=useState(false);
 const[signedAudioUrl,setSignedAudioUrl]=useState("");
 const[audioState,setAudioState]=useState(audioKey?"loading":"idle");
 const[audioError,setAudioError]=useState("");
 const[refreshNonce,setRefreshNonce]=useState(0);
 const retryRef=useRef(0);

 useEffect(()=>{try{localStorage.setItem(answerKey,JSON.stringify(answers))}catch{}},[answerKey,answers]);
 useEffect(()=>{try{localStorage.setItem(firstAttemptKey,JSON.stringify(firstAttempts))}catch{}},[firstAttemptKey,firstAttempts]);
 useC2CloudDraftField({day,field:"listeningAnswers",value:answers,setValue:setAnswers,seedCloudWhenMissing:legacyAnswersSeedAllowed,defaultValue:{}});
 useC2CloudDraftField({day,field:"listeningFirstAttempts",value:firstAttempts,setValue:setFirstAttempts,seedCloudWhenMissing:legacyFirstAttemptsSeedAllowed,defaultValue:{}});

 const answered=questions.filter((_,index)=>Number.isInteger(answers[index])).length;
 const firstAttemptAnswered=questions.filter((_,index)=>Number.isInteger(firstAttempts[index])).length;
 const firstAttemptCorrect=questions.filter((item,index)=>firstAttempts[index]===item.answerIndex).length;
 const chooseAnswer=(index,optionIndex)=>{
  setAnswers(old=>({...old,[index]:optionIndex}));
  setFirstAttempts(old=>Number.isInteger(old[index])?old:{...old,[index]:optionIndex});
 };

 useEffect(()=>{if(questions.length&&answered===questions.length&&!completed)onCompleteChange?.(true)},[answered,questions.length,completed,onCompleteChange]);

 useEffect(()=>{
  let cancelled=false;
  if(!audioKey){
   setSignedAudioUrl("");
   setAudioState("idle");
   setAudioError("");
   return()=>{cancelled=true};
  }
  if(!idToken){
   setSignedAudioUrl("");
   setAudioState("error");
   setAudioError("Bitte melden Sie sich erneut an, um das Audio abzuspielen.");
   return()=>{cancelled=true};
  }
  setAudioState("loading");
  setAudioError("");
  fetchC2AudioPlaybackUrl({day,key:audioKey,idToken})
   .then(({url})=>{
    if(cancelled)return;
    setSignedAudioUrl(url);
    setAudioState("ready");
   })
   .catch((error)=>{
    if(cancelled)return;
    setSignedAudioUrl("");
    setAudioState("error");
    setAudioError(error?.response?.data?.error||error?.message||"Das Audio konnte nicht geladen werden.");
   });
  return()=>{cancelled=true};
 },[day,audioKey,idToken,refreshNonce]);

 const refreshAudio=()=>{
  retryRef.current=0;
  setRefreshNonce(value=>value+1);
 };
 const handleAudioError=()=>{
  if(!audioKey)return;
  if(retryRef.current<1){
   retryRef.current+=1;
   setRefreshNonce(value=>value+1);
   return;
  }
  setAudioState("error");
  setAudioError("Das Audio konnte nicht abgespielt werden. Bitte laden Sie es erneut.");
 };
 const handleCanPlay=()=>{
  retryRef.current=0;
  setAudioState("ready");
  setAudioError("");
 };

 if(!practice)return <Section title="Hören"><p style={{margin:0}}>Für diesen Tag ist keine Hörübung vorgesehen.</p></Section>;
 return <Section title={`Hören · ${practice.title}`}>
  {!hasSource?<div data-c2-listening-awaiting-source="true" style={{...sub,background:"#fffbeb",borderColor:"#fde68a"}}><strong>Hörquelle wird ergänzt</strong><span>Für dieses Thema ist noch kein Audio- oder YouTube-Link eingetragen. Es werden bewusst noch keine Fragen angezeigt. Die Fragen werden erst aus dem tatsächlichen Transkript erstellt, damit sie genau zum Hörtext passen.</span></div>:<>
   {audioKey?<>
    {audioState==="loading"?<div style={{...sub,background:"#eff6ff"}}><strong>Audio wird geladen …</strong><span>Falowen bereitet die geschützte Hördatei für die Wiedergabe vor.</span></div>:null}
    {signedAudioUrl?<div style={{...sub,background:"#fff"}}><strong>Hörtext</strong><audio data-c2-r2-audio="true" controls preload="metadata" src={signedAudioUrl} onError={handleAudioError} onCanPlay={handleCanPlay} style={{width:"100%"}}>Ihr Browser unterstützt die Audiowiedergabe nicht.</audio><span style={{color:"#64748b",fontSize:13}}>Die Aufnahme wird direkt hier in Falowen abgespielt.</span></div>:null}
    {audioState==="error"?<div data-c2-audio-error="true" style={{...sub,background:"#fff7f7",borderColor:"#fecaca"}}><strong>Audio momentan nicht verfügbar</strong><span>{audioError}</span><div><button type="button" onClick={refreshAudio} style={styles.secondaryButton}>Audio erneut laden</button></div></div>:null}
   </>:embed?<div style={{position:"relative",paddingTop:"56.25%",borderRadius:14,overflow:"hidden",background:"#0f172a"}}><iframe title={`C2 Day ${day} Hören`} src={embed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:"absolute",inset:0,width:"100%",height:"100%",border:0}}/></div>:<div style={{...sub,background:"#fff"}}><strong>Hörtext</strong><audio controls preload="metadata" src={audioUrl} style={{width:"100%"}}>Ihr Browser unterstützt die Audiowiedergabe nicht.</audio></div>}

   {transcriptParagraphs.length?<div style={{...sub,background:"#f8fafc",borderColor:"#cbd5e1"}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
     <div><strong>Transkript</strong><div style={{color:"#64748b",fontSize:13,marginTop:3}}>Versuchen Sie den ersten Durchgang möglichst ohne Transkript. Danach können Sie es zum Mitlesen oder Überprüfen einblenden.</div></div>
     <button type="button" onClick={()=>setShowTranscript(value=>!value)} aria-expanded={showTranscript} style={styles.secondaryButton}>{showTranscript?"Transkript ausblenden":"Transkript anzeigen"}</button>
    </div>
    {showTranscript?<article data-c2-listening-transcript="true" style={{display:"grid",gap:12,lineHeight:1.8,marginTop:6}}>{transcriptParagraphs.map((paragraph,index)=><p key={index} style={{margin:0}}>{paragraph}</p>)}</article>:null}
   </div>:null}

   {questions.length?<>
    <div style={{...sub,background:"#eff6ff"}}><strong>Verständnis und Argumentation</strong><span>Hören Sie den Beitrag aufmerksam und beantworten Sie alle Fragen. Sie erhalten sofort Rückmeldung. Eine falsche erste Antwort blockiert den Abschluss nicht.</span></div>
    <div style={{display:"grid",gap:14}}>{questions.map((item,index)=>{
     const selected=answers[index];
     const hasAnswer=Number.isInteger(selected);
     const correct=selected===item.answerIndex;
     return <article key={item.question} style={{...sub,background:"#fff"}}>
      <strong>{index+1}. {item.question}</strong>
      <div style={{display:"grid",gap:8}}>{item.options.map((option,optionIndex)=>{
       const isSelected=selected===optionIndex;
       const isCorrectOption=hasAnswer&&optionIndex===item.answerIndex;
       const background=isCorrectOption?"#f0fdf4":isSelected?"#fff7ed":"#fff";
       const border=isCorrectOption?"2px solid #86efac":isSelected?"2px solid #fdba74":"1px solid #cbd5e1";
       return <button key={option} type="button" onClick={()=>chooseAnswer(index,optionIndex)} style={{...styles.secondaryButton,textAlign:"left",justifyContent:"flex-start",background,border,color:"#0f172a"}}>{String.fromCharCode(65+optionIndex)}. {option}</button>;
      })}</div>
      {hasAnswer?<div style={{border:`1px solid ${correct?"#86efac":"#fecaca"}`,borderRadius:12,padding:11,background:correct?"#f0fdf4":"#fff7f7",lineHeight:1.65}}><strong>{correct?"Richtig.":"Noch nicht richtig."}</strong> {!correct?<span>Richtige Antwort: <strong>{String.fromCharCode(65+item.answerIndex)}. {item.options[item.answerIndex]}</strong>. </span>:null}<span>{item.explanation}</span></div>:null}
     </article>;
    })}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10}}>
     <div style={{...sub,background:answered===questions.length?"#f0fdf4":"#f8fafc"}}><strong>{answered}/{questions.length} Fragen beantwortet</strong><span>{answered===questions.length?"Hören ist für heute abgeschlossen.":"Beantworten Sie alle Fragen. Fehler sind erlaubt — die Aufgabe dient dem direkten Lernen."}</span></div>
     <div style={{...sub,background:"#f8fafc"}}><strong>Erster Versuch: {firstAttemptCorrect}/{questions.length}</strong><span>{firstAttemptAnswered<questions.length?`${firstAttemptAnswered}/${questions.length} erste Antworten erfasst`:"Dieser Wert dient nur als Lernstand. Er entscheidet nicht über den Kursabschluss."}</span></div>
    </div>
   </>:<div style={{...sub,background:"#eff6ff"}}><strong>Noch keine Verständnisfragen</strong><span>Die Fragen werden ergänzt, sobald das Transkript der endgültigen Aufnahme vorliegt.</span></div>}
   {!questions.length?<label style={{display:"flex",gap:8,alignItems:"flex-start",fontWeight:700,lineHeight:1.5}}><input type="checkbox" checked={Boolean(completed)} onChange={e=>onCompleteChange?.(e.target.checked)} style={{marginTop:4}}/>Ich habe den vollständigen Hörtext aufmerksam gehört.</label>:null}
  </>}
 </Section>;
}

function C2ReviewPage({day,standard,knowledge,skillFocus,skillLabel,progress,setProgress,listeningAvailable,c2CourseProgress,ready,cycleDays}){
 const grammarRule=standard.grammar?.[0]||standard.grammarFocus;
 const grammarExample=standard.grammar?.[1]||"";
 const tension=knowledge.tensions?.[0]?.join(" ↔ ")||"";
 const collocation=knowledge.coll?.[0]?.[0]||knowledge.vocab?.[0]?.[0]||"";
 const readingScore=c2CourseProgress?.[day]?.readingFirstAttemptScore||null;
 const reviewKeyPoints=getC2ReviewKeyPoints(day);
 const writingFormat=skillFocus==="write"?getC2WritingFormat(day,standard.title):null;
 const reviewChecks=[
  "Ich kann die Kernfrage des heutigen Themas in eigenen Worten erklären.",
  tension?`Ich kann den Zielkonflikt „${tension}“ erläutern.`:"Ich kann einen zentralen Zielkonflikt des Themas erläutern.",
  collocation?`Ich kann „${collocation}“ passend in einer C2-Antwort verwenden.`:"Ich kann eine passende C2-Kollokation verwenden.",
 ];
 const nextDay=day<28?day+1:null;
 const nextStandard=nextDay?getC2ExamStandard(nextDay):null;
 const nextSkill=nextDay?getC2SkillLabel(nextDay)?.label:null;
 const skillResult=skillFocus==="lesen"
  ?(readingScore?`First attempt: ${readingScore.correct}/${readingScore.total}. This score is for learning only.`:"Lesen completed. First-attempt score will appear after the questions are answered.")
  :skillFocus==="hoeren"
    ?(!listeningAvailable?"Hören source is still pending and does not block completion.":progress.hoerenDone?"Hören completed.":"Hören is not complete yet.")
    :skillFocus==="speak"
      ?(progress.speakDone?"3–5 minute C2 speaking task completed.":"Complete the speaking task to finish the day.")
      :(progress.writeDone?`${writingFormat?.label||"Writing"} completed. Your draft and AI feedback save across devices.`:`${writingFormat?.label||"Writing"} is still in progress. Your draft saves automatically.`);
 return <Section title={`Review · C2 Day ${day}`}>
  <div style={{...sub,background:ready?"#f0fdf4":"#fffbeb",borderColor:ready?"#86efac":"#fde68a"}}><strong>{ready?"Day complete ✓":"Day not complete yet"}</strong><span>{ready?`Grammar/Learn and ${skillLabel?.label} are complete. Review is revision only — no extra assignment.`:`Complete Grammar/Learn and today’s ${skillLabel?.label} task. Review itself is not graded.`}</span></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
   <div style={sub}><strong>Das Wichtigste heute</strong><span>1. <strong>Kernfrage:</strong> {knowledge.core}</span><span>2. <strong>Konkretes Beispiel:</strong> {knowledge.example}</span>{tension?<span>3. <strong>Zielkonflikt:</strong> {tension}</span>:<span>3. Entwickeln Sie eine differenzierte Position statt einer pauschalen Bewertung.</span>}</div>
   <div style={sub}><strong>Grammatik merken</strong><span>{grammarRule}</span>{grammarExample?<span><strong>Beispiel:</strong> {grammarExample}</span>:null}</div>
  </div>
  {reviewKeyPoints.length?<div data-c2-review-key-points="true" style={{...sub,background:"#f8fafc",borderColor:"#cbd5e1"}}><strong>Kernantwort · 3 Punkte</strong>{reviewKeyPoints.map((point,index)=><span key={point}>{index+1}. {point}</span>)}</div>:null}
  <div style={sub}><strong>Wortschatz · 6 wichtige Ausdrücke</strong><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:8}}>{(knowledge.vocab||[]).slice(0,6).map(([de,en])=><div key={de} style={{border:"1px solid #e2e8f0",borderRadius:10,padding:10,background:"#fff"}}><strong>{de}</strong><div style={{color:"#64748b",marginTop:3}}>{en}</div></div>)}</div></div>
  <div style={sub}><strong>Today's skill result · {skillLabel?.label}</strong><span>{skillResult}</span></div>
  <div style={{...sub,background:"#f8fafc"}}><strong>Kann ich das?</strong>{reviewChecks.map((label,index)=><label key={label} style={{display:"flex",gap:9,alignItems:"flex-start",lineHeight:1.55}}><input type="checkbox" checked={Boolean(progress.reviewChecks?.[index])} onChange={e=>setProgress(p=>({...p,reviewChecks:{...(p.reviewChecks||{}),[index]:e.target.checked}}))} style={{marginTop:4}}/><span>{label}</span></label>)}<span style={{color:"#64748b",fontSize:13}}>Diese Selbstkontrolle ist freiwillig und beeinflusst den Kursabschluss nicht.</span></div>
  {cycleDays.length?<div style={{...sub,background:"#f8fafc"}}><strong>4-day cycle recap</strong><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:8}}>{cycleDays.map(cycleDay=>{const label=getC2SkillLabel(cycleDay)?.label||"Skill";const complete=cycleDay===day?ready:Boolean(c2CourseProgress[cycleDay]?.dayComplete);return <div key={cycleDay} style={{border:"1px solid #e2e8f0",borderRadius:10,padding:10,background:complete?"#f0fdf4":"#fff"}}><strong>Day {cycleDay} · {label}</strong><div style={{marginTop:4,color:complete?"#166534":"#64748b"}}>{complete?"Complete ✓":"Not complete"}</div></div>})}</div><span style={{color:"#64748b"}}>This is a recap only. It does not add another assignment.</span></div>:null}
  <div style={{...sub,background:"#eff6ff",borderColor:"#bfdbfe"}}><strong>Next up</strong>{nextDay?<span>Day {nextDay} · {nextSkill}: {nextStandard?.title}</span>:<span>You have reached Day 28. Use the Course Book to review your full C2 progress.</span>}</div>
 </Section>;
}

function C2WorkbookNextNavigation({day,navigate}){
 const previousDay=day>1?day-1:null;
 const nextDay=day<28?day+1:null;
 const nextStandard=nextDay?getC2ExamStandard(nextDay):null;
 const nextSkill=nextDay?getC2SkillLabel(nextDay)?.label:null;
 const goPrevious=()=>{
  if(!previousDay)return;
  navigate(`/campus/course/lesson/C2/${previousDay}`);
 };
 const goNext=()=>{
  if(!nextDay){navigate("/campus/course");return;}
  navigate(`/campus/course/lesson/C2/${nextDay}`);
 };
 return <nav aria-label="C2 workbook navigation" style={{...card,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
   {previousDay?<button type="button" onClick={goPrevious} style={styles.secondaryButton}>← Previous lesson</button>:null}
   <button type="button" onClick={()=>navigate("/campus/course")} style={styles.secondaryButton}>Course Book</button>
  </div>
  <button type="button" onClick={goNext} style={styles.primaryButton}>{nextDay?`Next assignment · Day ${nextDay} · ${nextSkill} · ${nextStandard?.title}`:"Back to Course Book"}</button>
 </nav>;
}


export default function C2UnifiedGuidedWorkbookPage({lesson}){
 const location=useLocation();
 const navigate=useNavigate();
 const day=Number(lesson?.day||0);
 const standard=getC2ExamStandard(day);
 const knowledge=getC2TopicKnowledge(day);
 const mastery=lesson?.c2Mastery||getC2LessonContentAlignment(day);
 const skillFocus=getC2SkillFocus(day);
 const skillLabel=getC2SkillLabel(day);
 const listening=getC2ListeningPractice(day);
 const listeningAvailable=hasC2ListeningSource(listening);
 const{byDay:c2CourseProgress}=useC2CourseProgress({enabled:true});
 const cycleStart=day%4===0?day-3:null;
 const cycleDays=cycleStart?Array.from({length:4},(_,index)=>cycleStart+index):[];
 const allowedViews=useMemo(()=>new Set(getC2DayTabs(day).map(({key})=>key)),[day]);
 const storageKey=`falowen:c2:day${day}:unified-progress`;
 const requestedView=useMemo(()=>{
  const rawValue=new URLSearchParams(location.search||"").get("view")||"";
  const value=rawValue==="finish"?"review":rawValue;
  return allowedViews.has(value)?value:"learn";
 },[location.search,allowedViews]);
 const[active,setActive]=useState(requestedView);
 const defaultProgress={learnDone:false,lesenDone:false,hoerenDone:false,speakDone:false,writeDone:false,reviewChecks:{}};
 const[progress,setProgress]=useState(()=>{try{return{...defaultProgress,...JSON.parse(localStorage.getItem(storageKey)||"{}")}}catch{return defaultProgress}});
 const[legacyProgressSeedAllowed]=useState(()=>{try{const saved=JSON.parse(localStorage.getItem(storageKey)||"null");return Boolean(saved&&(saved.learnDone||saved.lesenDone||saved.hoerenDone||saved.speakDone||saved.writeDone||Object.keys(saved.reviewChecks||{}).length))}catch{return false}});
 useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(progress))}catch{}},[storageKey,progress]);
 useC2CloudDraftField({day,field:"progress",value:progress,setValue:setProgress,seedCloudWhenMissing:legacyProgressSeedAllowed,defaultValue:defaultProgress});
 useEffect(()=>{setActive(requestedView)},[requestedView]);
 const changeView=(next)=>{
  if(!allowedViews.has(next))return;
  setActive(next);
  const params=new URLSearchParams(location.search||"");
  if(next==="learn")params.delete("view");else params.set("view",next);
  const search=params.toString();
  navigate({pathname:location.pathname,search:search?`?${search}`:""},{replace:true});
 };
 if(!day||!standard||!knowledge||!mastery||!skillFocus)return null;

 const skillDone=skillFocus==="lesen"
  ?Boolean(progress.lesenDone)
  :skillFocus==="hoeren"
    ?(listeningAvailable?Boolean(progress.hoerenDone):true)
    :skillFocus==="speak"
      ?Boolean(progress.speakDone)
      :Boolean(progress.writeDone);
 const ready=Boolean(progress.learnDone&&skillDone);
 useLessonResumeSync({
  level:"C2",
  day,
  chapter:knowledge?.chapter||lesson?.chapter||"",
  title:standard?.title||lesson?.title||"",
  activeView:active,
  route:`${location.pathname}${location.search||""}`,
  radioDone:new URLSearchParams(location.search||"").get("radio")==="done",
  progress,
  setProgress,
  completed:ready,
  source:"c2-unified",
 });

 return <main style={{...styles.container,display:"grid",gap:18}} data-c2-unified-day={day} data-c2-skill-focus={skillFocus}>
  <AppBackButton label="Back to Course Book" fallbackPath="/campus/course"/>
  <header style={{...card,padding:"clamp(20px,4vw,34px)",background:"linear-gradient(135deg,#0f172a,#1e3a8a 58%,#2563eb)",color:"#fff"}}>
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    <span style={{...styles.badge,background:"rgba(255,255,255,.14)",color:"#fff"}}>C2</span>
    <span style={{...styles.badge,background:"rgba(255,255,255,.14)",color:"#fff"}}>Day {day}</span>
    <span style={{...styles.badge,background:"rgba(37,99,235,.9)",color:"#fff"}}>Chapter {knowledge.chapter}</span>
    <span style={{...styles.badge,background:"rgba(250,204,21,.18)",color:"#fef3c7"}}>Main skill: {skillLabel?.label}</span>
   </div>
   <h1 style={{margin:0,fontSize:"clamp(2rem,5vw,3.1rem)"}}>{standard.title}</h1>
   <p style={{margin:0,color:"#dbeafe",lineHeight:1.7}}>{standard.topic}</p>
   <div style={{border:"1px solid rgba(255,255,255,.2)",borderRadius:14,padding:13,background:"rgba(255,255,255,.08)"}}><strong>Today’s C2 control:</strong> {standard.grammarFocus}</div>
   <div style={{color:"#dbeafe",fontWeight:700}}>Today: Grammar/Learn + {skillLabel?.label} + Review. Review is revision only; it does not add another assignment.</div>
   {skillFocus==="write"?<div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}><span style={{color:"#dbeafe",fontWeight:700}}>C2 writing template ready in Write.</span><button type="button" onClick={()=>changeView("write")} style={styles.secondaryButton}>Open writing template</button></div>:null}
  </header>

  <AdvancedSelfLearningTabNav level="C2" day={day} activeTab={active} onChange={changeView}/>

  {active==="learn"?<Learn day={day} standard={standard} knowledge={knowledge} mastery={mastery} skillFocus={skillFocus} completed={progress.learnDone} onCompleteChange={learnDone=>setProgress(p=>({...p,learnDone}))}/>:null}
  {active==="lesen"?<ReadingPractice day={day} completed={progress.lesenDone} onCompleteChange={lesenDone=>setProgress(p=>({...p,lesenDone}))}/>:null}
  {active==="hoeren"?<ListeningPractice day={day} completed={progress.hoerenDone} onCompleteChange={hoerenDone=>setProgress(p=>({...p,hoerenDone}))}/>:null}
  {active==="speak"?<Speak standard={standard} knowledge={knowledge} day={day} completed={progress.speakDone} onCompleteChange={speakDone=>setProgress(p=>({...p,speakDone}))}/>:null}
  {active==="write"?<OpinionWrite standard={standard} day={day} completed={progress.writeDone} onCompleteChange={writeDone=>setProgress(p=>({...p,writeDone}))}/>:null}

  {active==="review"?<C2ReviewPage day={day} standard={standard} knowledge={knowledge} skillFocus={skillFocus} skillLabel={skillLabel} progress={progress} setProgress={setProgress} listeningAvailable={listeningAvailable} c2CourseProgress={c2CourseProgress} ready={ready} cycleDays={cycleDays}/>:null}

  {active==="references"?<><Section title="Topic reference"><p style={{margin:0,lineHeight:1.75}}>{knowledge.de}</p><p><strong>Kernfrage:</strong> {knowledge.core}</p></Section><Section title="C2 control"><p style={{margin:0,lineHeight:1.75}}>{mastery.challenge}</p><strong>Final check: topic knowledge · task fulfilment · grammar function · register · evidence · cohesion · natural collocation.</strong></Section></>:null}
  <C2WorkbookNextNavigation day={day} navigate={navigate}/>
 </main>;
}
