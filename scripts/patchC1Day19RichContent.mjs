import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = path.join(root, "web/src/components/C1Day18To20GuidedLessonPage.js");
let source = fs.readFileSync(pagePath, "utf8");

// The current guided page already owns the richer Day 18/19 learning journey
// through C1SpeakGrammarGuide, the shared Day 16–20 speaking scaffold, and the
// guided writing workspace. Older deployments used this script to inject that
// content into a legacy page shape. Once the modern structure is present there
// is nothing left to patch, so exit successfully instead of failing on stale
// search/replace targets.
const hasModernGuidedPage =
  source.includes('import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide";') &&
  source.includes('getC1Day16To20SpeakingScaffold') &&
  source.includes('const day18Writing = {') &&
  source.includes('<C1SpeakGrammarGuide lesson={lesson} branchesOverride={branches} />');

if (hasModernGuidedPage) {
  console.log("C1 Days 18 and 19 already use the modern guided prompt configuration; no legacy patch needed.");
  process.exit(0);
}

const replaceRequired = (pattern, replacement, label) => {
  if (source.includes(replacement)) return;
  const next = source.replace(pattern, replacement);
  if (next === source) throw new Error(`Could not patch ${label}`);
  source = next;
};

if (!source.includes('import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide";')) {
  replaceRequired(
    'import AppBackButton from "./navigation/AppBackButton";',
    'import AppBackButton from "./navigation/AppBackButton";\nimport C1SpeakGrammarGuide from "./C1SpeakGrammarGuide";',
    "C1 speaking guide import",
  );
}

const promptConfig = `const lessonPrompts = {
  18: {
    speakingQuestion: "Was stärkt den gesellschaftlichen Zusammenhalt, und wie kann soziale Spaltung verhindert werden?",
    speakingBranches: [
      { id: "teilhabe", label: "Teilhabe", keywords: ["Bildung", "Arbeit", "Mitbestimmung"], guidingQuestion: "Wie kann echte Teilhabe ermöglicht werden?", sentenceStarter: "Gesellschaftlicher Zusammenhalt wird gestärkt, wenn ...", modelSentence: "Gesellschaftlicher Zusammenhalt wird gestärkt, wenn alle Menschen Zugang zu Bildung, Arbeit und politischer Mitbestimmung erhalten." },
      { id: "begegnung", label: "Begegnung", keywords: ["Dialog", "Vereine", "Nachbarschaft"], guidingQuestion: "Wo können unterschiedliche Gruppen miteinander in Kontakt kommen?", sentenceStarter: "Ein konkretes Beispiel dafür ist ...", modelSentence: "Ein konkretes Beispiel dafür sind lokale Begegnungsprojekte, in denen Menschen verschiedener Herkunft gemeinsam aktiv werden." },
      { id: "ausgrenzung", label: "Ausgrenzung", keywords: ["Diskriminierung", "Armut", "soziale Spaltung"], guidingQuestion: "Welche Ursachen schwächen den Zusammenhalt?", sentenceStarter: "Problematisch ist insbesondere, dass ...", modelSentence: "Problematisch ist insbesondere, dass Diskriminierung und soziale Ungleichheit das Vertrauen in gesellschaftliche Institutionen schwächen." },
      { id: "verantwortung", label: "Verantwortung", keywords: ["Staat", "Schulen", "Medien", "Bürger"], guidingQuestion: "Wer trägt Verantwortung für den Zusammenhalt?", sentenceStarter: "Verantwortung tragen sowohl ... als auch ...", modelSentence: "Verantwortung tragen sowohl staatliche Institutionen als auch Schulen, Medien, Vereine und die Bürgerinnen und Bürger selbst." },
    ],
    writingQuestion: "Verfassen Sie eine C1-Stellungnahme zum Thema gesellschaftlicher Zusammenhalt mit 220–280 Wörtern.",
    writingIdeas: [
      "Erklären Sie, welche Bedeutung gesellschaftlicher Zusammenhalt für eine demokratische Gesellschaft hat.",
      "Argumentieren Sie anhand eines konkreten Beispiels für eine Maßnahme, die gesellschaftlichen Zusammenhalt stärken kann.",
      "Nennen Sie Gründe oder Einwände, die gegen stärkere staatliche Maßnahmen sprechen könnten.",
      "Erläutern Sie eine Alternative oder einen ausgewogenen Lösungsweg zur Förderung des gesellschaftlichen Zusammenhalts.",
    ],
  },
  19: {
    speakingQuestion: "Wie wird sich die Arbeitswelt durch Digitalisierung und Automatisierung verändern? Nehmen Sie Stellung und nennen Sie konkrete Beispiele.",
    speakingBranches: [
      { id: "wandel", label: "Veränderungen", keywords: ["Automatisierung", "künstliche Intelligenz", "neue Berufsfelder"], guidingQuestion: "Welche Tätigkeiten werden sich verändern oder verschwinden?", sentenceStarter: "In Zukunft dürften ...", modelSentence: "In Zukunft dürften vor allem routinemäßige Tätigkeiten automatisiert werden, während neue Berufsfelder im digitalen Bereich entstehen." },
      { id: "kompetenzen", label: "Kompetenzen", keywords: ["digitale Kenntnisse", "Kreativität", "soziale Fähigkeiten"], guidingQuestion: "Welche Fähigkeiten werden künftig wichtiger?", sentenceStarter: "Besonders wichtig werden ...", modelSentence: "Besonders wichtig werden digitale Kenntnisse, Problemlösungskompetenz, Kreativität und die Fähigkeit zur Zusammenarbeit." },
      { id: "arbeitsmodelle", label: "Arbeitsmodelle", keywords: ["Homeoffice", "hybride Arbeit", "Flexibilität"], guidingQuestion: "Welche Chancen bieten neue Arbeitsmodelle?", sentenceStarter: "Flexible Arbeitsmodelle bieten den Vorteil, dass ...", modelSentence: "Flexible Arbeitsmodelle bieten den Vorteil, dass Beschäftigte Beruf und Privatleben besser miteinander vereinbaren können." },
      { id: "risiken", label: "Risiken", keywords: ["Arbeitsplatzverlust", "Überwachung", "Entgrenzung"], guidingQuestion: "Welche sozialen Risiken müssen berücksichtigt werden?", sentenceStarter: "Demgegenüber besteht die Gefahr, dass ...", modelSentence: "Demgegenüber besteht die Gefahr, dass gering qualifizierte Beschäftigte verdrängt werden und die Grenze zwischen Arbeit und Freizeit zunehmend verschwimmt." },
      { id: "weiterbildung", label: "Lösungen", keywords: ["Weiterbildung", "Umschulung", "Recht auf Nichterreichbarkeit"], guidingQuestion: "Wie können Unternehmen und Staat auf den Wandel reagieren?", sentenceStarter: "Damit der Wandel sozial verträglich gelingt, sollten ...", modelSentence: "Damit der Wandel sozial verträglich gelingt, sollten Unternehmen regelmäßige Weiterbildung anbieten und klare Regeln zur Nichterreichbarkeit einführen." },
    ],
    writingQuestion: "Verfassen Sie eine C1-Stellungnahme zu der Frage: Sollten Unternehmen verpflichtet werden, ihre Beschäftigten regelmäßig für die Arbeit der Zukunft weiterzubilden? Schreiben Sie 220–280 Wörter.",
    writingIdeas: [
      "Erklären Sie, nach welchen Kriterien betriebliche Weiterbildung für die Arbeit der Zukunft gestaltet werden sollte.",
      "Argumentieren Sie anhand eines konkreten Beispiels für eine berufliche Weiterbildung.",
      "Nennen Sie Gründe, die gegen eine gesetzliche Weiterbildungspflicht für Unternehmen sprechen könnten.",
      "Erläutern Sie eine Alternative zu einer allgemeinen Weiterbildungspflicht.",
    ],
  },
};`;

replaceRequired(
  /const day18Prompts = \{[\s\S]*?\n\};\n\nconst embedUrl/,
  `${promptConfig}\n\nconst embedUrl`,
  "C1 Days 18 and 19 prompt configuration",
);

replaceRequired(
  '  const speakingQuestion = day === 18 ? day18Prompts.speakingQuestion : (lesson.speakingBuilder?.question || lesson.speakingTopic || lesson.topic);',
  '  const prompt = lessonPrompts[day] || null;\n  const speakingQuestion = prompt?.speakingQuestion || lesson.speakingBuilder?.question || lesson.speakingTopic || lesson.topic;',
  "C1 prompt resolution",
);

replaceRequired(
  '{active === "speak" ? <Section title="Speaking builder"><NoteBox tone="amber"><strong>Sprechfrage:</strong> {speakingQuestion}</NoteBox>{day === 18 ? <div><strong>Ideen für deine Antwort:</strong><ul style={listStyle}>{day18Prompts.speakingIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul></div> : null}<EmbeddedSpeechPracticePanel /><label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label></Section> : null}',
  '{active === "speak" ? <Section title="Speaking builder"><NoteBox tone="amber"><strong>Sprechfrage:</strong> {speakingQuestion}</NoteBox><C1SpeakGrammarGuide lesson={{ ...lesson, speakingTopic: speakingQuestion }} branchesOverride={prompt?.speakingBranches || lesson.speakingBuilder?.branches || []} /><EmbeddedSpeechPracticePanel /><label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label></Section> : null}',
  "C1 Day 19 Day 1-style speaking builder",
);

replaceRequired(
  '{active === "write" ? <Section title="Guided writing builder"><WritingCheatSheetTabs level="C1" day={day}>{day === 18 ? <><NoteBox tone="amber"><strong>Schreibaufgabe:</strong> {day18Prompts.writingQuestion}</NoteBox><div><strong>Bearbeiten Sie diese Punkte:</strong><ol style={listStyle}>{day18Prompts.writingIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ol></div></> : <WritingTaskPrompt lesson={lesson} />}{workbookUrl ? <a href={workbookUrl} style={{ ...styles.linkButton, width: "fit-content" }}>Open lesson workbook</a> : null}<GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} /></WritingCheatSheetTabs></Section> : null}',
  '{active === "write" ? <Section title="Guided writing builder"><WritingCheatSheetTabs level="C1" day={day}>{prompt ? <><NoteBox tone="amber"><strong>Schreibaufgabe:</strong> {prompt.writingQuestion}</NoteBox><div><strong>Bearbeiten Sie diese Punkte:</strong><ol style={listStyle}>{prompt.writingIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ol></div></> : <WritingTaskPrompt lesson={lesson} />}{workbookUrl ? <a href={workbookUrl} style={{ ...styles.linkButton, width: "fit-content" }}>Open lesson workbook</a> : null}<GuidedWritingWorkspace config={getStandardWritingConfig({ ...lesson, writingTopic: prompt?.writingQuestion || lesson.writingTopic, writingPromptBullets: prompt?.writingIdeas || lesson.writingPromptBullets })} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} /></WritingCheatSheetTabs></Section> : null}',
  "C1 Day 19 Goethe writing task",
);

fs.writeFileSync(pagePath, source, "utf8");
console.log("Applied C1 Day 19 Day 1-style speaking guide and Goethe writing task.");
