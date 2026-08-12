import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, value) => fs.writeFileSync(path.join(root, p), value, "utf8");

// 1) Keep the established A2 workbook architecture: teacher lecture -> brain map -> lesson speaking help.
{
  const target = "web/src/components/A2StandardTabbedWorkbookPage.js";
  let source = read(target);
  const importLine = 'import A2TeacherLectureCard from "./A2TeacherLectureCard";';
  if (!source.includes(importLine)) {
    const anchor = 'import SpeakingMindMap from "./SpeakingMindMap";';
    if (!source.includes(anchor)) throw new Error("A2 SpeakingMindMap import anchor missing.");
    source = source.replace(anchor, `${anchor}\n${importLine}`);
  }
  const mindMap = '<SpeakingMindMap config={getA2SpeakingMindMap(day)} />';
  const lectureAndMap = `<A2TeacherLectureCard day={day} />\n      ${mindMap}`;
  if (!source.includes(lectureAndMap)) {
    if (!source.includes(mindMap)) throw new Error("A2 speaking mind map mount missing.");
    source = source.replace(mindMap, lectureAndMap);
  }
  write(target, source);
}

// 2) Day 1 grammar: use the bilingual, reasoning-first note while retaining the historical note file for regression identifiers.
{
  const target = "web/src/components/A2B1WorkbookGrammarNotes.js";
  let source = read(target);
  const importLine = 'import A2Day1BilingualGrammarNotes from "./A2Day1BilingualGrammarNotes";';
  if (!source.includes(importLine)) {
    const anchor = 'import A2StarterConjunctionsPage from "./A2StarterConjunctionsPage";';
    if (!source.includes(anchor)) throw new Error("A2 Day 1 grammar import anchor missing.");
    source = source.replace(anchor, `${anchor}\n${importLine}`);
  }
  source = source.replace('    1: A2StarterConjunctionsPage,', '    1: A2Day1BilingualGrammarNotes,');
  write(target, source);
}

// 3) Day 1 brain map should answer the actual production task, not a second unrelated Small Talk question.
{
  const target = "web/src/data/speakingMindMaps/a2/earlyLessonBranches.js";
  let source = read(target);
  const start = source.indexOf("  1: [");
  const end = source.indexOf("  3: [", start);
  if (start < 0 || end < 0) throw new Error("A2 Day 1 mind-map branch block missing.");
  const replacement = `  1: [\n    branch(\n      "familie",\n      "Familie",\n      "topic",\n      ["Eltern", "Geschwister", "verheiratet/ledig"],\n      "Was möchtest du kurz über deine Familie sagen?",\n      "Ich komme aus einer ... Familie. / Ich habe ...",\n      "Ich komme aus einer großen Familie und habe zwei Brüder. Ich bin ledig.",\n    ),\n    branch(\n      "sprachen",\n      "Sprachen",\n      "detail",\n      ["sprechen", "lernen", "Deutsch"],\n      "Welche Sprachen sprichst oder lernst du?",\n      "Ich spreche ... und lerne ...",\n      "Ich spreche Englisch und Twi. Zurzeit lerne ich Deutsch, weil ich die Sprache interessant finde.",\n    ),\n    branch(\n      "beruf-studium",\n      "Beruf / Studium",\n      "example",\n      ["arbeiten als", "studieren", "Ausbildung"],\n      "Was machst du beruflich oder was studierst du?",\n      "Ich arbeite als ... / Ich studiere ...",\n      "Ich arbeite als Verkäuferin in Accra. Meine Arbeit gefällt mir, weil ich gern mit Menschen spreche.",\n    ),\n    branch(\n      "hobbys",\n      "Hobbys",\n      "closing",\n      ["in meiner Freizeit", "gern", "am Wochenende"],\n      "Was machst du gern in deiner Freizeit?",\n      "In meiner Freizeit ...",\n      "In meiner Freizeit höre ich gern Musik und spiele am Wochenende Fußball mit Freunden.",\n    ),\n  ],\n`;
  source = `${source.slice(0, start)}${replacement}${source.slice(end)}`;
  write(target, source);

  const indexTarget = "web/src/data/speakingMindMaps/a2/index.js";
  let indexSource = read(indexTarget);
  indexSource = indexSource.replace(
    '[1, "a2-day-1-small-talk", "Small Talk", "Wie führst du ein kurzes freundliches Gespräch?", ["Begrüßung", "Kennenlernen", "Arbeit oder Studium", "Freizeit", "Gespräch beenden"], earlyA2LessonBranchesByDay[1]],',
    '[1, "a2-day-1-small-talk", "Deine Vorstellung", "Kannst du dich vorstellen? Erzähl uns etwas über dich!", ["Familie", "Sprachen", "Beruf / Studium", "Hobbys"], earlyA2LessonBranchesByDay[1]],',
  );
  if (!indexSource.includes('"Kannst du dich vorstellen? Erzähl uns etwas über dich!"')) throw new Error("A2 Day 1 central speaking question was not updated.");
  write(indexTarget, indexSource);
}

// 4) Remove Day 1 duplicate speaking scaffolds. The same ideas now live inside the interactive brain map.
{
  const target = "web/src/components/A2Day2SmallTalkWorkbookEnhancedPage.js";
  let source = read(target);
  source = source.replace(/\n\s*<WorkbookTaskCard eyebrow="Sprachliche Hilfen"[\s\S]*?<\/WorkbookTaskCard>\n\n\s*<WorkbookTaskCard eyebrow="Deine Vorstellung"[\s\S]*?<\/WorkbookTaskCard>/, "");
  if (source.includes('eyebrow="Sprachliche Hilfen"') || source.includes('eyebrow="Deine Vorstellung"')) {
    throw new Error("Duplicate A2 Day 1 speaking scaffolds remain.");
  }
  write(target, source);
}

console.log("Preserved the A2 workbook design with bilingual grammar thinking support, teacher lecture, one brain-map question and no duplicate speaking scaffolds.");
