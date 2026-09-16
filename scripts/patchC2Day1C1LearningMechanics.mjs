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

const hasGoethePilotSpeak = source.includes("I completed the five-minute C2 presentation practice.");
const speakPattern = /\{active === "speak" \? <>[\s\S]*?<\/\> : null\}\n\n      \{active === "write"/;
if (!hasGoethePilotSpeak && !source.includes('<C2Day1SpeakCoach />')) {
  if (!speakPattern.test(source)) throw new Error("C2 Day 1 Speak section anchor missing.");
  source = source.replace(
    speakPattern,
    `{active === "speak" ? <Section title="Speaking builder">\n          <C2Day1SpeakCoach />\n          <EmbeddedSpeechPracticePanel />\n          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}><input type="checkbox" checked={progress.speakDone} onChange={(e) => setProgress((old) => ({ ...old, speakDone: e.target.checked }))} />Ich habe eine 2–3-minütige Antwort gesprochen und meine Registerwahl bewusst kontrolliert.</label>\n        </Section> : null}\n\n      {active === "write"`,
  );
}

const writePattern = /\{active === "write" \? <>[\s\S]*?<\/\> : null\}/;
const essayOnlyWrite = `{active === "write" ? <Section title="Schreiben · Aufgabe 2">\n        <div style={{ display: "grid", gap: 12 }}>\n          <div>\n            <strong style={{ display: "block", marginBottom: 6 }}>Thema 1: Kreislaufwirtschaft und Wegwerfgesellschaft</strong>\n            <p style={{ margin: 0, lineHeight: 1.75 }}>\n              Sie haben im Fernsehen eine Diskussionsrunde zum Thema „Kreislaufwirtschaft und Wegwerfgesellschaft“ verfolgt. Nach der Sendung wurden die Zuschauer aufgefordert, ihre Meinung abzugeben. Sie schreiben eine ausführliche E-Mail (circa 350 Wörter) an die Redaktion, in der Sie sich auf die drei folgenden Diskussionsbeiträge beziehen und Ihre Meinung dazu äußern.\n            </p>\n          </div>\n          <div style={{ display: "grid", gap: 12, padding: "clamp(14px,3vw,24px)", borderRadius: 16, background: "#f1f5f9" }}>\n            {WRITE_OPINIONS.map((opinion) => <OpinionBox key={opinion}>{opinion}</OpinionBox>)}\n          </div>\n          <label style={{ display: "grid", gap: 7 }}>\n            <strong>Planung</strong>\n            <textarea value={writingPlan} onChange={(event) => setWritingPlan(event.target.value)} placeholder="Beitrag 1 → Beitrag 2 → Beitrag 3 → eigene Position → Beispiele → Schluss" style={{ minHeight: 140, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit", lineHeight: 1.7 }} />\n          </label>\n          <label style={{ display: "grid", gap: 7 }}>\n            <strong>Ihre E-Mail an die Redaktion</strong>\n            <textarea value={writingDraft} onChange={(event) => setWritingDraft(event.target.value)} placeholder="Schreiben Sie hier Ihren vollständigen C2-Text..." style={{ minHeight: 380, border: "1px solid #94a3b8", borderRadius: 12, padding: 14, font: "inherit", lineHeight: 1.75 }} />\n          </label>\n          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", color: "#475569", fontWeight: 700 }}><span>{wordCount} Wörter</span><span>Ziel: circa 350 Wörter</span></div>\n          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>\n            <input type="checkbox" checked={progress.writeDone} onChange={(event) => setProgress((old) => ({ ...old, writeDone: event.target.checked }))} />\n            Ich habe die C2-Schreibaufgabe mit allen drei Diskussionsbeiträgen bearbeitet.\n          </label>\n        </div>\n      </Section> : null}`;
if (writePattern.test(source)) {
  source = source.replace(writePattern, essayOnlyWrite);
}

source = source.replace('detail="Register and nuance understood"', 'detail="Wissens-Check vollständig · Registerentscheidungen begründet"');
source = source.replace('detail="Spoken argument completed"', 'detail="Sprechaufgabe mit Ideenaufbau und Registerkontrolle abgeschlossen"');
source = source.replace(/detail=\{`\$\{wordCount\} words · essay and Umformung practice completed`\}/g, 'detail={wordCount + " Wörter · Goethe-Aufgabe 2 abgeschlossen"}');
source = source.replace('placeholder="What was difficult in the Vortrag, essay or Umformung today?"', 'placeholder="Was war heute beim Vortrag oder beim Schreiben am schwierigsten?"');
source = source.replace(
  /        <Section title="Umformung reference">[\s\S]*?<\/Section>\n/,
  `        <Section title="Schreiben reference">\n          <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Day 1 focus:</strong> Goethe C2 Schreiben Aufgabe 2. Beziehen Sie sich auf alle drei Diskussionsbeiträge, wägen Sie die Positionen ab und machen Sie Ihre eigene Haltung deutlich.</p>\n        </Section>\n`,
);

if (!source.includes("C2Day1LearnCoach")) throw new Error("C2 Day 1 interactive Learn coach missing.");
if (!hasGoethePilotSpeak && !source.includes("C2Day1SpeakCoach")) throw new Error("C2 Day 1 Speak coach missing.");
if (!source.includes("EmbeddedSpeechPracticePanel")) throw new Error("C2 Day 1 embedded speech practice missing.");
if (!source.includes("Goethe-Aufgabe 2 abgeschlossen")) throw new Error("C2 Day 1 essay-only Write task missing.");
if (source.includes("I completed the 350-word writing task and the three Umformungen.")) throw new Error("C2 Day 1 still mixes essay and Umformung tasks.");

fs.writeFileSync(file, source, "utf8");
console.log("C2 Day 1 keeps one Write mission: Goethe C2 Aufgabe 2 opinion writing only.");
await import("./patchC2Days2To5C1LearningMechanics.mjs");
