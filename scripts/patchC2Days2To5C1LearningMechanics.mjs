import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/C2Days2To5GuidedWorkbookPage.js");
let source = fs.readFileSync(file, "utf8");

const coachImport = 'import{C2Days2To5LearnCoach,C2Days2To5SpeakCoach}from"./C2Days2To5LearnSpeakCoach";';
const speechImport = 'import{EmbeddedSpeechPracticePanel}from"./selfLearning/EmbeddedPracticePanels";';
const importAnchor = 'import{getC2GuidedWorkbookConfig}from"../data/c2Days2To5GuidedWorkbook";';
if (!source.includes(coachImport)) {
  if (!source.includes(importAnchor)) throw new Error("C2 Days 2-5 import anchor missing.");
  source = source.replace(importAnchor, `${importAnchor}\n${coachImport}\n${speechImport}`);
}

const learnPattern = /\{active==="learn"\?<><Section[\s\S]*?<\/Section><\/\>:null\}/;
const learnReplacement = '{active==="learn"?<C2Days2To5LearnCoach day={day} mastery={mastery} completed={progress.learnDone} onCompleteChange={(learnDone)=>setProgress(p=>({...p,learnDone}))}/>:null}';
if (!source.includes('<C2Days2To5LearnCoach day={day}')) {
  if (!learnPattern.test(source)) throw new Error("C2 Days 2-5 Learn block not found.");
  source = source.replace(learnPattern, learnReplacement);
}

const speakPattern = /\{active==="speak"\?<Section title="Speak · Build the thought before the sentence">[\s\S]*?<\/Section>:null\}/;
const speakReplacement = '{active==="speak"?<Section title="Speaking builder"><C2Days2To5SpeakCoach day={day}/><EmbeddedSpeechPracticePanel/><label style={{display:"flex",gap:8,alignItems:"center",fontWeight:700}}><input type="checkbox" checked={progress.speakDone} onChange={e=>setProgress(p=>({...p,speakDone:e.target.checked}))}/>Ich habe eine 2–3-minütige Antwort gesprochen und die Zielstruktur bewusst eingesetzt.</label></Section>:null}';
if (!source.includes('<C2Days2To5SpeakCoach day={day}/>')) {
  if (!speakPattern.test(source)) throw new Error("C2 Days 2-5 Speak block not found.");
  source = source.replace(speakPattern, speakReplacement);
}

const day2Helper = `
const DAY2_UMFORMUNGEN=[
 {source:"Viele Eltern waren gegenüber der Reform zunächst skeptisch.",cue:"Zweifel",solution:"Viele Eltern hatten zunächst Zweifel an der Reform."},
 {source:"Die Schule führt zusätzliche Förderprogramme ein, um die Bildungschancen zu verbessern.",cue:"zur",solution:"Die Schule führt zusätzliche Förderprogramme zur Verbesserung der Bildungschancen ein."},
 {source:"Die Verantwortlichen erkannten, dass zusätzliche Förderung notwendig war.",cue:"klar",solution:"Den Verantwortlichen wurde klar, dass zusätzliche Förderung notwendig war."},
 {source:"Obwohl die Maßnahme teuer ist, halten viele Fachleute sie für notwendig.",cue:"trotz",solution:"Viele Fachleute halten die Maßnahme trotz der hohen Kosten für notwendig."},
 {source:"Wenn Kinder früh unterstützt werden, verbessern sich ihre Bildungschancen.",cue:"durch",solution:"Durch frühe Unterstützung verbessern sich die Bildungschancen der Kinder."}
];
const C2Day2UmformungWrite=({progress,setProgress})=>{
 const[answers,setAnswers]=useState({});
 return <Section title="Schreiben · Aufgabe 1 · Umformung">
  <div style={{border:"1px solid #bfdbfe",borderRadius:14,padding:13,background:"#eff6ff",lineHeight:1.7}}><strong>Thema: Schulpflicht und Bildungsgerechtigkeit</strong><br/>Formulieren Sie die Aussagen neu. Verwenden Sie das jeweils vorgegebene Wort unverändert. Die Bedeutung muss erhalten bleiben.</div>
  <div style={{display:"grid",gap:12}}>{DAY2_UMFORMUNGEN.map((item,index)=><article key={item.cue+index} style={{border:"1px solid #dbeafe",borderRadius:14,padding:14,background:"#f8fbff",display:"grid",gap:10}}>
   <strong>{index+1}. {item.source}</strong>
   <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><span style={{color:"#475569",fontWeight:700}}>Vorgegebenes Wort – nicht verändern:</span><span style={{...styles.badge,background:"#dbeafe",color:"#1e3a8a"}}>{item.cue}</span></div>
   <textarea value={answers[index]||""} onChange={e=>setAnswers(old=>({...old,[index]:e.target.value}))} placeholder={"Formulieren Sie den Satz mit „"+item.cue+"“ neu."} style={{minHeight:96,border:"1px solid #cbd5e1",borderRadius:12,padding:12,font:"inherit",lineHeight:1.65}}/>
   <details><summary style={{cursor:"pointer",fontWeight:800}}>Musterlösung anzeigen</summary><p style={{marginBottom:0,lineHeight:1.7}}>{item.solution}</p></details>
  </article>)}</div>
  <label style={{display:"flex",gap:8,alignItems:"center",fontWeight:700}}><input type="checkbox" checked={progress.writeDone} onChange={e=>setProgress(p=>({...p,writeDone:e.target.checked}))}/>Ich habe alle fünf Umformungen bearbeitet und die vorgegebenen Wörter unverändert verwendet.</label>
 </Section>;
};
`;
if (!source.includes("const DAY2_UMFORMUNGEN=")) {
  const exportAnchor = "export default function C2Days2To5GuidedWorkbookPage";
  if (!source.includes(exportAnchor)) throw new Error("C2 Days 2-5 export anchor missing.");
  source = source.replace(exportAnchor, `${day2Helper}\n${exportAnchor}`);
}

const writePattern = /\{active==="write"\?(<Section title="Write · From idea to controlled C2 production">[\s\S]*?<\/Section>):null\}/;
if (!source.includes('day===2?<C2Day2UmformungWrite')) {
  const match = source.match(writePattern);
  if (!match) throw new Error("C2 Days 2-5 Write block not found.");
  const genericWrite = match[1];
  source = source.replace(writePattern, `{active==="write"?(day===2?<C2Day2UmformungWrite progress={progress} setProgress={setProgress}/>:${genericWrite}):null}`);
}

source = source.replace('detail="Target C2 decision understood"','detail="Wissens-Check vollständig · C2-Entscheidung verstanden"');
source = source.replace('detail="Spoken production completed"','detail="Sprechaufgabe mit Ideenaufbau und C2-Kontrolle abgeschlossen"');
source = source.replace('<Progress label="Write" done={progress.writeDone} detail={`${wordCount} words · revision completed`}/>', '<Progress label="Write" done={progress.writeDone} detail={day===2?"5 Umformungen abgeschlossen":wordCount+" words · revision completed"}/>');
source = source.replace('placeholder="What decision became easier today?"', 'placeholder={day===2?"Welche Umformung war heute am schwierigsten?":"What decision became easier today?"}');

if (!source.includes("C2Days2To5LearnCoach")) throw new Error("C2 Days 2-5 Learn coach missing.");
if (!source.includes("C2Days2To5SpeakCoach")) throw new Error("C2 Days 2-5 Speak coach missing.");
if (!source.includes("EmbeddedSpeechPracticePanel")) throw new Error("C2 Days 2-5 speech practice missing.");
if (!source.includes("DAY2_UMFORMUNGEN")) throw new Error("C2 Day 2 Umformung task missing.");
if (!source.includes('day===2?<C2Day2UmformungWrite')) throw new Error("C2 Day 2 Write task is not Umformung-only.");

fs.writeFileSync(file, source, "utf8");
console.log("C2 Day 2 now uses one Write mission: Goethe-style Umformung; Days 3-5 keep their existing writing tasks.");
await import("./patchC2Days6To11C1LearningMechanics.mjs");
