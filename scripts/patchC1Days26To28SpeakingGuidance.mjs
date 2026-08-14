import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const updateFile = (relativePath, transform) => {
  const file = path.join(root, relativePath);
  const source = fs.readFileSync(file, "utf8");
  const updated = transform(source);
  fs.writeFileSync(file, updated, "utf8");
};

const guidanceImport = 'import C1SpeakingGuidanceCards from "./C1SpeakingGuidanceCards";';

updateFile("web/src/components/C1Day24To26GuidedLessonPage.js", (source) => {
  let updated = source;
  const importAnchor = 'import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";';
  if (!updated.includes(guidanceImport)) {
    if (!updated.includes(importAnchor)) throw new Error("C1 Day 24-26 speaking import anchor missing.");
    updated = updated.replace(importAnchor, `${importAnchor}\n${guidanceImport}`);
  }

  if (!updated.includes('<C1SpeakingGuidanceCards\n          question={speaking.question || effectiveLesson.speakingTopic || effectiveLesson.topic}')) {
    const pattern = /\{active === "speak" \? <Section title="Speaking builder">[\s\S]*?<EmbeddedSpeechPracticePanel \/>[\s\S]*?<\/Section> : null\}/;
    if (!pattern.test(updated)) throw new Error("C1 Day 24-26 speaking section not found.");
    const replacement = `{active === "speak" ? <Section title="Speaking builder">\n        <C1SpeakingGuidanceCards\n          question={speaking.question || effectiveLesson.speakingTopic || effectiveLesson.topic}\n          intro={speaking.intro}\n          branches={branches}\n        />\n        <EmbeddedSpeechPracticePanel />\n        <label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label>\n      </Section> : null}`;
    updated = updated.replace(pattern, replacement);
  }

  return updated;
});

updateFile("web/src/components/C1Day27To28GuidedLessonPage.js", (source) => {
  let updated = source;
  const importAnchor = 'import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";';
  if (!updated.includes(guidanceImport)) {
    if (!updated.includes(importAnchor)) throw new Error("C1 Day 27-28 speaking import anchor missing.");
    updated = updated.replace(importAnchor, `${importAnchor}\n${guidanceImport}`);
  }

  const oldSpeak = '{active === "speak" ? <Section title="Speaking builder"><NoteBox tone="amber"><strong>Sprechfrage:</strong> {lesson.speakingBuilder?.question || lesson.speakingTopic || lesson.topic}</NoteBox><EmbeddedSpeechPracticePanel /><label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label></Section> : null}';
  const newSpeak = `{active === "speak" ? <Section title="Speaking builder">\n      <C1SpeakingGuidanceCards\n        question={lesson.speakingBuilder?.question || lesson.speakingTopic || lesson.topic}\n        intro={lesson.speakingBuilder?.intro}\n        branches={lesson.speakingBuilder?.branches || []}\n      />\n      <EmbeddedSpeechPracticePanel />\n      <label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label>\n    </Section> : null}`;

  if (!updated.includes(newSpeak)) {
    if (!updated.includes(oldSpeak)) throw new Error("C1 Day 27-28 speaking section not found.");
    updated = updated.replace(oldSpeak, newSpeak);
  }

  return updated;
});

const day26 = fs.readFileSync(path.join(root, "web/src/components/C1Day24To26GuidedLessonPage.js"), "utf8");
const day2728 = fs.readFileSync(path.join(root, "web/src/components/C1Day27To28GuidedLessonPage.js"), "utf8");
if (!day26.includes("C1SpeakingGuidanceCards")) throw new Error("C1 Day 26 rich speaking guidance missing.");
if (!day2728.includes("C1SpeakingGuidanceCards")) throw new Error("C1 Days 27-28 rich speaking guidance missing.");

console.log("C1 Days 26-28 now show speaking idea examples, guidance questions and sentence starters.");
