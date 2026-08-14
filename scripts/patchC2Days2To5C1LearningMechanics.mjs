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

source = source.replace('detail="Target C2 decision understood"','detail="Wissens-Check vollständig · C2-Entscheidung verstanden"');
source = source.replace('detail="Spoken production completed"','detail="Sprechaufgabe mit Ideenaufbau und C2-Kontrolle abgeschlossen"');

if (!source.includes("C2Days2To5LearnCoach")) throw new Error("C2 Days 2-5 Learn coach missing.");
if (!source.includes("C2Days2To5SpeakCoach")) throw new Error("C2 Days 2-5 Speak coach missing.");
if (!source.includes("EmbeddedSpeechPracticePanel")) throw new Error("C2 Days 2-5 speech practice missing.");

fs.writeFileSync(file, source, "utf8");
console.log("C2 Days 2-5 now mirror the C1 learning mechanics with German-first C2 scaffolding.");
