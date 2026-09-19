import React,{useEffect,useMemo,useState}from"react";
import AppBackButton from"./navigation/AppBackButton";
import{EmbeddedSpeechPracticePanel}from"./selfLearning/EmbeddedPracticePanels";
import{AdvancedSelfLearningTabNav}from"./StandardWorkbookComponents";
import{styles}from"../styles";
import{getC2ExamStandard}from"../data/c2ExamStandardContent";
import{getC2TopicKnowledge,getC2TopicChecks}from"../data/c2TopicKnowledge";
import{getC2LessonContentAlignment}from"../data/c2LessonContentAlignment";
import{buildC2OpinionWritingTemplate}from"../data/c2OpinionWritingTemplate";

const card={...styles.card,display:"grid",gap:14,border:"1px solid #e2e8f0",borderRadius:18,boxShadow:"0 10px 26px rgba(15,23,42,.06)"};
const sub={border:"1px solid #dbeafe",borderRadius:14,padding:13,background:"#f8fbff",display:"grid",gap:6};
const Section=({title,children})=><section style={card}><h2 style={{margin:0,fontSize:"1.18rem"}}>{title}</h2>{children}</section>;
const Progress=({label,done,detail})=><div style={{border:`1px solid ${done?"#86efac":"#cbd5e1"}`,borderRadius:14,padding:13,background:done?"#f0fdf4":"#fff",display:"grid",gap:4}}><strong>{done?"Complete":"Not complete"} · {label}</strong><span style={{color:"#64748b",fontSize:13}}>{detail}</span></div>;
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

function Learn({day,standard,knowledge,mastery,completed,onCompleteChange}){
 const checks=getC2TopicChecks(day);
 return <div style={{display:"grid",gap:14}}>
  <TopicFoundation standard={standard} knowledge={knowledge}/>
  <TopicLanguage mastery={mastery}/>
  <GrammarTeaching mastery={mastery} standard={standard}/>
  {standard.writeType==="reformulation"?<Section title="Umformung · Im Learn-Bereich lernen, im Write-Bereich testen">
   <p style={{margin:0,lineHeight:1.75}}>Lerne hier die Transformationsfamilien und die Methode. Die konkreten Lösungen der heutigen Write-Aufgabe werden hier bewusst nicht gezeigt.</p>
   <div style={{display:"grid",gap:9}}>{TRANSFORMATION_FAMILIES.map(([name,example])=><div key={name} style={sub}><strong>{name}</strong><span>{example}</span></div>)}</div>
   <ol style={{margin:0,paddingLeft:22,lineHeight:1.8}}><li>Bedeutung des Ausgangssatzes sichern.</li><li>Vorgabewort unverändert lassen.</li><li>Neue Struktur vollständig aufbauen.</li><li>Kasus, Artikel, Verbform und Wortstellung nachziehen.</li><li>Beide Sätze auf gleiche Bedeutung vergleichen.</li></ol>
  </Section>:<Section title="Argumentation · Inhalt vor Form">
   <p style={{margin:0,lineHeight:1.75}}>Plane zuerst Position → Begründung → Beispiel → Gegenargument → Reaktion → Synthese. Nutze die heutige Grammatik nur dort, wo sie die logische Beziehung oder das Register präziser macht.</p>
  </Section>}
  <Section title="Themen-Check · Vorbereitung auf die Unterrichtsfragen">
   <div style={{display:"grid",gap:10}}>{checks.map((check,index)=><details key={check.question} style={sub}><summary style={{cursor:"pointer",fontWeight:800}}>{index+1}. {check.question}</summary><ol style={{lineHeight:1.7}}>{check.options.map(option=><li key={option}>{option}</li>)}</ol><p><strong>Antwort:</strong> {check.options[check.answerIndex]}</p><p style={{marginBottom:0}}>{check.explanation}</p></details>)}</div>
   <label style={{display:"flex",gap:8,alignItems:"flex-start",fontWeight:700,lineHeight:1.5}}><input type="checkbox" checked={Boolean(completed)} onChange={e=>onCompleteChange?.(e.target.checked)} style={{marginTop:4}}/>Ich verstehe das Thema, kann mindestens einen Zielkonflikt erklären und passende C2-Sprache dafür verwenden.</label>
  </Section>
 </div>;
}

function Speak({standard,knowledge,completed,onCompleteChange}){
 const[support,setSupport]=useState("full");
 const[plan,setPlan]=useState("");
 const branches=speakingBranches(standard,knowledge);
 return <Section title="Sprechen · Erst verstehen, dann argumentieren">
  <div style={{display:"grid",gap:12}}>
   <p style={{margin:0,lineHeight:1.75}}>Halten Sie einen strukturierten 3–5-minütigen Beitrag zu „{standard.title}“. Wägen Sie die drei Kursaussagen ab, geben Sie Beispiele und formulieren Sie eine eigene Synthese.</p>
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
 const key=`falowen:c2:day${day}:unified-opinion`;
 const template=useMemo(()=>buildC2OpinionWritingTemplate(standard),[standard]);
 const[draft,setDraft]=useState(()=>{try{const saved=localStorage.getItem(key);return !String(saved||"").trim()?buildC2OpinionWritingTemplate(standard):saved}catch{return buildC2OpinionWritingTemplate(standard)}});
 useEffect(()=>{try{localStorage.setItem(key,draft)}catch{}},[key,draft]);
 const words=useMemo(()=>draft.trim()?draft.trim().split(/\s+/).length:0,[draft]);
 const placeholders=useMemo(()=>(draft.match(/\[[^\]]+\]/g)||[]).length,[draft]);
 const restoreTemplate=()=>{
  if(draft.trim()&&draft!==template&&typeof window!=="undefined"&&!window.confirm("Die aktuelle Antwort wird durch die C2-Vorlage ersetzt. Fortfahren?"))return;
  setDraft(template);
 };
 return <Section title="Schreiben · Stellungnahme">
  <p style={{margin:0,lineHeight:1.75}}>Schreiben Sie einen ausführlichen Leserbrief bzw. eine E-Mail von circa 350 Wörtern an die Redaktion zum Thema „{standard.title}“. Beziehen Sie sich auf alle drei Beiträge, begründen Sie Ihre Argumentation mit Beispielen und entwickeln Sie eine eigene, differenzierte Position.</p>
  <div style={{display:"grid",gap:9}}>{standard.perspectives.map((quote,index)=><Opinion key={quote} index={index+1}>{quote}</Opinion>)}</div>
  <div style={{...sub,background:"#f0fdf4",borderColor:"#bbf7d0"}}>
   <strong>C2-Schreibvorlage ist bereits im Textfeld gespeichert</strong>
   <span style={{lineHeight:1.65}}>Ersetzen Sie alle eckigen Klammern durch Ihre eigenen Inhalte. Die Vorlage führt Sie durch alle drei Beiträge, Gegenargumente, Synthese und Fazit. Ihre bereits gespeicherte Antwort wird beim erneuten Öffnen beibehalten.</span>
   <div><button type="button" onClick={restoreTemplate} style={styles.secondaryButton}>Vorlage wiederherstellen</button></div>
  </div>
  <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Schreiben Sie hier Ihren vollständigen C2-Text ..." style={{minHeight:520,border:"1px solid #94a3b8",borderRadius:12,padding:14,font:"inherit",lineHeight:1.75}}/>
  <div style={{fontWeight:700,color:"#475569"}}>{words} Wörter · Ziel: circa 350 Wörter · {placeholders} Platzhalter offen</div>
  <label style={{display:"flex",gap:8,alignItems:"center",fontWeight:700}}><input type="checkbox" checked={Boolean(completed)} onChange={e=>onCompleteChange?.(e.target.checked)}/>Ich habe alle drei Beiträge berücksichtigt, alle Platzhalter ersetzt und meinen Text überarbeitet.</label>
 </Section>;
}

function ReformulationWrite({standard,day,completed,onCompleteChange}){
 const key=`falowen:c2:day${day}:unified-reformulations`;
 const[answers,setAnswers]=useState(()=>{try{return JSON.parse(localStorage.getItem(key)||"{}")}catch{return{}}});
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(answers))}catch{}},[key,answers]);
 return <Section title="Schreiben · Umformung">
  <p style={{margin:0,lineHeight:1.75}}><strong>Testbereich:</strong> Formulieren Sie jeden Satz neu. Verwenden Sie das vorgegebene Wort unverändert und erhalten Sie die Bedeutung. Hier werden keine Musterlösungen angezeigt.</p>
  <div style={{display:"grid",gap:12}}>{standard.reformulations.map((item,index)=><article key={item.cue+index} style={{...sub,background:"#fff"}}><strong>{index+1}. {item.source}</strong><div><strong>Vorgegebenes Wort:</strong> <span style={{...styles.badge,background:"#dbeafe",color:"#1e3a8a"}}>{item.cue}</span></div><textarea value={answers[index]||""} onChange={e=>setAnswers(old=>({...old,[index]:e.target.value}))} placeholder="Ihre Umformung" style={{minHeight:92,border:"1px solid #cbd5e1",borderRadius:12,padding:12,font:"inherit",lineHeight:1.65}}/></article>)}</div>
  <label style={{display:"flex",gap:8,alignItems:"center",fontWeight:700}}><input type="checkbox" checked={Boolean(completed)} onChange={e=>onCompleteChange?.(e.target.checked)}/>Ich habe alle Umformungen bearbeitet und jedes Vorgabewort unverändert verwendet.</label>
 </Section>;
}

export default function C2UnifiedGuidedWorkbookPage({lesson}){
 const day=Number(lesson?.day||0);
 const standard=getC2ExamStandard(day);
 const knowledge=getC2TopicKnowledge(day);
 const mastery=lesson?.c2Mastery||getC2LessonContentAlignment(day);
 const storageKey=`falowen:c2:day${day}:unified-progress`;
 const[active,setActive]=useState("learn");
 const[progress,setProgress]=useState(()=>{try{return{learnDone:false,speakDone:false,writeDone:false,confidence:"",reflection:"",...JSON.parse(localStorage.getItem(storageKey)||"{}")}}catch{return{learnDone:false,speakDone:false,writeDone:false,confidence:"",reflection:""}}});
 useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(progress))}catch{}},[storageKey,progress]);
 if(!day||!standard||!knowledge||!mastery)return null;
 const ready=progress.learnDone&&progress.speakDone&&progress.writeDone&&Boolean(progress.confidence);
 return <main style={{...styles.container,display:"grid",gap:18}} data-c2-unified-day={day}>
  <AppBackButton label="Back to Course Book" fallbackPath="/campus/course"/>
  <header style={{...card,padding:"clamp(20px,4vw,34px)",background:"linear-gradient(135deg,#0f172a,#1e3a8a 58%,#2563eb)",color:"#fff"}}>
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><span style={{...styles.badge,background:"rgba(255,255,255,.14)",color:"#fff"}}>C2</span><span style={{...styles.badge,background:"rgba(255,255,255,.14)",color:"#fff"}}>Day {day}</span><span style={{...styles.badge,background:"rgba(37,99,235,.9)",color:"#fff"}}>Chapter {knowledge.chapter}</span></div>
   <h1 style={{margin:0,fontSize:"clamp(2rem,5vw,3.1rem)"}}>{standard.title}</h1>
   <p style={{margin:0,color:"#dbeafe",lineHeight:1.7}}>{standard.topic}</p>
   <div style={{border:"1px solid rgba(255,255,255,.2)",borderRadius:14,padding:13,background:"rgba(255,255,255,.08)"}}><strong>Today’s C2 control:</strong> {standard.grammarFocus}</div>
  </header>
  <AdvancedSelfLearningTabNav level="C2" day={day} activeTab={active} onChange={setActive}/>
  {active==="learn"?<Learn day={day} standard={standard} knowledge={knowledge} mastery={mastery} completed={progress.learnDone} onCompleteChange={learnDone=>setProgress(p=>({...p,learnDone}))}/>:null}
  {active==="speak"?<Speak standard={standard} knowledge={knowledge} completed={progress.speakDone} onCompleteChange={speakDone=>setProgress(p=>({...p,speakDone}))}/>:null}
  {active==="write"?(standard.writeType==="opinion"?<OpinionWrite standard={standard} day={day} completed={progress.writeDone} onCompleteChange={writeDone=>setProgress(p=>({...p,writeDone}))}/>:<ReformulationWrite standard={standard} day={day} completed={progress.writeDone} onCompleteChange={writeDone=>setProgress(p=>({...p,writeDone}))}/>):null}
  {active==="finish"?<Section title={`Finish C2 Day ${day}`}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10}}><Progress label="Learn" done={progress.learnDone} detail="Topic knowledge, language and grammar understood"/><Progress label="Speak" done={progress.speakDone} detail="Structured C2 speaking completed"/><Progress label="Write" done={progress.writeDone} detail={standard.writeType==="opinion"?"Opinion task completed":"Reformulation test completed"}/></div><label style={{display:"grid",gap:7}}><strong>Confidence</strong><select value={progress.confidence} onChange={e=>setProgress(p=>({...p,confidence:e.target.value}))} style={styles.select}><option value="">Select confidence</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label style={{display:"grid",gap:7}}><strong>Reflection</strong><textarea value={progress.reflection} onChange={e=>setProgress(p=>({...p,reflection:e.target.value}))} placeholder="What topic idea or C2 structure still needs work?" style={{minHeight:110,border:"1px solid #cbd5e1",borderRadius:12,padding:12,font:"inherit"}}/></label><div style={{border:`1px solid ${ready?"#86efac":"#fde68a"}`,borderRadius:14,padding:13,background:ready?"#f0fdf4":"#fffbeb"}}>{ready?"Day complete: Learn, Speak and Write are finished.":"Complete Learn, Speak, Write and choose a confidence level."}</div></Section>:null}
  {active==="references"?<><Section title="Topic reference"><p style={{margin:0,lineHeight:1.75}}>{knowledge.de}</p><p><strong>Kernfrage:</strong> {knowledge.core}</p></Section><Section title="C2 control"><p style={{margin:0,lineHeight:1.75}}>{mastery.challenge}</p><strong>Final check: topic knowledge · task fulfilment · grammar function · register · evidence · cohesion · natural collocation.</strong></Section></>:null}
 </main>;
}
