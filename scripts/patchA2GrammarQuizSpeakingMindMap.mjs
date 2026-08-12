import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const patchFile = (relativePath, transform) => {
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const updated = transform(source);
  fs.writeFileSync(filePath, updated, "utf8");
};

patchFile("web/src/components/A2StandardTabbedWorkbookPage.js", (source) => {
  let updated = source;

  const oldSignature = 'const A2StandardTabbedWorkbookPage = ({ day, title, chapter, topicPrompt, workbookId, sprechenContent, schreibenTask, schreibenContent, schreibenPlaceholder = "Liebe/r ...\\n\\nich schreibe, weil ...", lesenText, lesenQuestions = [], hoerenTask, hoerenAudioUrl, hoerenQuestions = [] }) => {';
  const newSignature = 'const A2StandardTabbedWorkbookPage = ({ day, title, chapter, topicPrompt, workbookId, grammarContent, sprechenContent, schreibenTask, schreibenContent, schreibenPlaceholder = "Liebe/r ...\\n\\nich schreibe, weil ...", lesenText, lesenQuestions = [], hoerenTask, hoerenAudioUrl, hoerenQuestions = [] }) => {';
  if (!updated.includes(newSignature)) {
    if (!updated.includes(oldSignature)) throw new Error("A2 workbook signature anchor was not found.");
    updated = updated.replace(oldSignature, newSignature);
  }

  const oldGrammar = '    {activeTab === "grammar" && <div style={card}><A2B1GrammarNotesTab level="A2" day={day} /></div>}';
  const newGrammar = '    {activeTab === "grammar" && <div style={card}><A2B1GrammarNotesTab level="A2" day={day} />{Number(day) >= 6 && Number(day) <= 9 ? <A2Days6To9LearningGuide day={day} /> : null}{grammarContent || null}</div>}';
  if (!updated.includes(newGrammar)) {
    if (!updated.includes(oldGrammar)) throw new Error("A2 grammar tab anchor was not found.");
    updated = updated.replace(oldGrammar, newGrammar);
  }

  const oldSpeaking = `      {Number(day) >= 6 && Number(day) <= 9 ? <A2Days6To9LearningGuide day={day} /> : null}\n      {sprechenContent ? sprechenContent : <><SpeakingMindMap config={getA2SpeakingMindMap(day)} /><WorkbookTaskCard eyebrow="Speaking practice" title={topicPrompt || title} practiceOnly><p style={{ margin: 0 }}>Prepare a short A2 answer. Use a simple structure: Einleitung → 2–3 details → example → short ending.</p><ul style={listSpacing}><li>Use connectors like <strong>und</strong>, <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong>.</li><li>Speak clearly for 30–60 seconds.</li><li>This part is practice only; submit required final answers in the Submit tab.</li></ul></WorkbookTaskCard></>}`;
  const newSpeaking = `      <SpeakingMindMap config={getA2SpeakingMindMap(day)} />\n      {sprechenContent ? sprechenContent : <WorkbookTaskCard eyebrow="Speaking practice" title={topicPrompt || title} practiceOnly><p style={{ margin: 0 }}>Prepare a short A2 answer. Use the ideas in the brain map: Einleitung → 2–3 details → example → short ending.</p><ul style={listSpacing}><li>Use connectors like <strong>und</strong>, <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong>.</li><li>Speak clearly for 30–60 seconds.</li><li>This part is practice only; submit required final answers in the Submit tab.</li></ul></WorkbookTaskCard>}`;
  if (!updated.includes(newSpeaking)) {
    if (!updated.includes(oldSpeaking)) throw new Error("A2 speaking block anchor was not found.");
    updated = updated.replace(oldSpeaking, newSpeaking);
  }

  return updated;
});

patchFile("web/src/components/A2Day4WoMoechtenWirUnsTreffenWorkbookPage.js", (source) => {
  let updated = source;
  updated = updated.replace('const speakingContent = <A2Day4WoWohinPrepositionLesson />;', 'const grammarContent = <A2Day4WoWohinPrepositionLesson />;');
  updated = updated.replace('      sprechenContent={speakingContent}', '      grammarContent={grammarContent}');
  if (!updated.includes('grammarContent={grammarContent}')) {
    throw new Error("A2 Day 4 grammar content was not moved to the Grammar tab.");
  }
  return updated;
});

const shell = fs.readFileSync(path.join(root, "web/src/components/A2StandardTabbedWorkbookPage.js"), "utf8");
const day4 = fs.readFileSync(path.join(root, "web/src/components/A2Day4WoMoechtenWirUnsTreffenWorkbookPage.js"), "utf8");

if (!shell.includes('<SpeakingMindMap config={getA2SpeakingMindMap(day)} />')) {
  throw new Error("A2 speaking mind map is not mounted unconditionally.");
}
if (!shell.includes('{grammarContent || null}')) {
  throw new Error("A2 custom grammar content slot is missing.");
}
if (!day4.includes('grammarContent={grammarContent}') || day4.includes('sprechenContent={speakingContent}')) {
  throw new Error("A2 Day 4 still routes its grammar quiz through Sprechen.");
}

console.log("Restored A2 Grammar quiz placement and Speaking brain-map support.");
