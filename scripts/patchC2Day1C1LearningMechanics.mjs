import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/C2Day1GuidedWorkbookPage.js");
let source = fs.readFileSync(file, "utf8");

const coachImport = 'import { C2Day1LearnCoach, C2Day1SpeakCoach } from "./C2Day1LearnSpeakCoach";';
const speechImport = 'import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";';
const importAnchor = 'import { getC2Day1To7Mastery } from "../data/c2Day1To7Mastery";';

if (!source.includes(coachImport)) {
  if (!source.includes(importAnchor)) throw new Error("C2 Day 1 mastery import anchor missing.");
  source = source.replace(importAnchor, `${importAnchor}\n${coachImport}\n${speechImport}`);
}

const learnPattern = /\{active === "learn" \? <>[\s\S]*?<\/\> : null\}\n\n      \{active === "speak"/;
if (!source.includes('<C2Day1LearnCoach completed={progress.learnDone}')) {
  if (!learnPattern.test(source)) throw new Error("C2 Day 1 Learn section anchor missing.");
  source = source.replace(
    learnPattern,
    `{active === "learn" ? <C2Day1LearnCoach completed={progress.learnDone} onCompleteChange={(learnDone) => setProgress((old) => ({ ...old, learnDone }))} /> : null}\n\n      {active === "speak"`,
  );
}

const speakPattern = /\{active === "speak" \? <>[\s\S]*?<\/\> : null\}\n\n      \{active === "write"/;
if (!source.includes('<C2Day1SpeakCoach />')) {
  if (!speakPattern.test(source)) throw new Error("C2 Day 1 Speak section anchor missing.");
  source = source.replace(
    speakPattern,
    `{active === "speak" ? <Section title="Speaking builder">\n          <C2Day1SpeakCoach />\n          <EmbeddedSpeechPracticePanel />\n          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}><input type="checkbox" checked={progress.speakDone} onChange={(e) => setProgress((old) => ({ ...old, speakDone: e.target.checked }))} />Ich habe eine 2–3-minütige Antwort gesprochen und meine Registerwahl bewusst kontrolliert.</label>\n        </Section> : null}\n\n      {active === "write"`,
  );
}

source = source.replace('detail="Register and nuance understood"', 'detail="Wissens-Check vollständig · Registerentscheidungen begründet"');
source = source.replace('detail="Spoken argument completed"', 'detail="Sprechaufgabe mit Ideenaufbau und Registerkontrolle abgeschlossen"');

if (!source.includes("C2Day1LearnCoach")) throw new Error("C2 Day 1 interactive Learn coach missing.");
if (!source.includes("C2Day1SpeakCoach")) throw new Error("C2 Day 1 Speak coach missing.");
if (!source.includes("EmbeddedSpeechPracticePanel")) throw new Error("C2 Day 1 embedded speech practice missing.");

fs.writeFileSync(file, source, "utf8");
console.log("C2 Day 1 now mirrors C1 learning mechanics with C2-level German scaffolding, knowledge choices and speaking support modes.");
