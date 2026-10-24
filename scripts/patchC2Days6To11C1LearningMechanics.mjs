import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/C2Days6To11GuidedWorkbookPage.js");
let source = fs.readFileSync(file, "utf8");

const coachImport = 'import{C2Days6To11LearnCoach,C2Days6To11SpeakCoach}from"./C2Days6To11LearnSpeakCoach";';
const speechImport = 'import{EmbeddedSpeechPracticePanel}from"./selfLearning/EmbeddedPracticePanels";';
const importAnchor = 'import{getC2Days6To11GuidedWorkbookConfig}from"../data/c2Days6To11GuidedWorkbook";';
if (!source.includes(coachImport)) {
  if (!source.includes(importAnchor)) throw new Error("C2 Days 6-11 import anchor missing.");
  source = source.replace(importAnchor, `${importAnchor}\n${coachImport}\n${speechImport}`);
}

const learnPattern = /\{active==="learn"\?<><Section[\s\S]*?<\/Section><\/\>:null\}/;
const learnReplacement = '{active==="learn"?<C2Days6To11LearnCoach day={day} mastery={mastery} completed={progress.learnDone} onCompleteChange={(learnDone)=>setProgress(p=>({...p,learnDone}))}/>:null}';
if (!source.includes('<C2Days6To11LearnCoach day={day}')) {
  if (!learnPattern.test(source)) throw new Error("C2 Days 6-11 Learn block not found.");
  source = source.replace(learnPattern, learnReplacement);
}

const speakPattern = /\{active==="speak"\?<Section title="Speak · Build the thought before the sentence">[\s\S]*?<\/Section>:null\}/;
const speakReplacement = '{active==="speak"?<Section title="Speaking builder"><C2Days6To11SpeakCoach day={day}/><EmbeddedSpeechPracticePanel/><label style={{display:"flex",gap:8,alignItems:"center",fontWeight:700}}><input type="checkbox" checked={progress.speakDone} onChange={e=>setProgress(p=>({...p,speakDone:e.target.checked}))}/>Ich habe eine 2–3-minütige Antwort gesprochen und die Zielstruktur bewusst eingesetzt.</label></Section>:null}';
if (!source.includes('<C2Days6To11SpeakCoach day={day}/>')) {
  if (!speakPattern.test(source)) throw new Error("C2 Days 6-11 Speak block not found.");
  source = source.replace(speakPattern, speakReplacement);
}

source = source.replace('detail="Target C2 decision understood"','detail="Wissens-Check vollständig · C2-Entscheidung verstanden"');
source = source.replace('detail="Spoken production completed"','detail="Sprechaufgabe mit Ideenaufbau und C2-Kontrolle abgeschlossen"');

if (!source.includes("C2Days6To11LearnCoach")) throw new Error("C2 Days 6-11 Learn coach missing.");
if (!source.includes("C2Days6To11SpeakCoach")) throw new Error("C2 Days 6-11 Speak coach missing.");
if (!source.includes("EmbeddedSpeechPracticePanel")) throw new Error("C2 Days 6-11 speech practice missing.");

fs.writeFileSync(file, source, "utf8");
console.log("C2 Days 6-11 now use German-first C1-style learning mechanics at C2 depth.");
await import("./patchC2Days12To18C1LearningMechanics.mjs");
