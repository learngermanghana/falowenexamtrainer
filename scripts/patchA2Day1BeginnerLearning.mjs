import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, value) => fs.writeFileSync(path.join(root, p), value, "utf8");

// Keep the original A2 workbook design, but remove the duplicated speaking lecture/help blocks.
const workbookPath = "web/src/components/A2Day2SmallTalkWorkbookEnhancedPage.js";
let workbook = read(workbookPath);
if (!workbook.includes('import A2Day1TeacherLectureCard from "./A2Day1TeacherLectureCard";')) {
  workbook = workbook.replace(
    'import { WorkbookTaskCard } from "./StandardWorkbookComponents";',
    'import { WorkbookTaskCard } from "./StandardWorkbookComponents";\nimport A2Day1TeacherLectureCard from "./A2Day1TeacherLectureCard";',
  );
}
workbook = workbook.replace(
  /const speakingContent = \([\s\S]*?\n\);\n\nconst writingContent =/,
  'const speakingContent = <A2Day1TeacherLectureCard />;\n\nconst writingContent =',
);
write(workbookPath, workbook);

// Day 1 grammar: balanced English support + German examples + explicit thinking process.
const grammarPath = "web/src/components/A2StarterConjunctionsPage.js";
write(grammarPath, `import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 10 };
const p = { margin: 0, lineHeight: 1.7 };

export default function A2StarterConjunctionsPage() {
  return <div style={{ ...styles.container, display:"grid", gap:16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={card}>
      <h1 style={{ ...styles.title, margin:0 }}>A2 Starter Grammar Note: weil, deshalb, denn</h1>
      <p style={{ ...styles.subtitle, margin:0 }}>Topic: Small talk • Day 1 • Chapter 1.1</p>
      <p style={p}><strong>Goal:</strong> Learn how to give a reason and a result in German. You do not need previous knowledge; follow the thinking steps below.</p>
    </header>

    <section style={card}>
      <h2 style={{ margin: 0 }}>1. First understand the meaning</h2>
      <p style={p}><strong>weil = because</strong> and <strong>denn = because</strong>. They answer <strong>WHY?</strong> <strong>deshalb = therefore / that is why</strong>. It shows the <strong>RESULT</strong>.</p>
      <p style={p}>Think before choosing the word: <strong>Am I explaining why?</strong> → weil / denn. <strong>Am I showing what happens because of it?</strong> → deshalb.</p>
      <p style={p}>Idea: <em>I am tired → I go home.</em><br/><strong>Reason:</strong> Ich gehe nach Hause, weil ich müde bin.<br/><strong>Result:</strong> Ich bin müde. Deshalb gehe ich nach Hause.</p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>2. Then check the word order</h2>
      <p style={p}><strong>weil:</strong> the conjugated verb goes to the end. Think: <em>weil → the verb waits at the end.</em></p>
      <p style={p}><strong>denn:</strong> normal word order stays. Think: <em>denn changes the meaning, not the sentence order.</em></p>
      <p style={p}><strong>deshalb:</strong> deshalb takes position 1, so the verb comes immediately after it in position 2.</p>
    </section>

    <A2MiniLearningBlock
      title="3. See the three patterns"
      rule="WHY? → weil / denn. RESULT? → deshalb. weil sends the conjugated verb to the end; denn keeps normal word order; after deshalb the verb comes directly next."
      examples={[
        "weil (because): Ich bleibe zu Hause, weil ich krank bin. → bin is at the end.",
        "denn (because): Ich bleibe zu Hause, denn ich bin krank. → ich bin stays normal.",
        "deshalb (therefore): Ich bin krank. Deshalb bleibe ich zu Hause. → deshalb + verb + subject.",
        "Small Talk: Mir geht es gut, weil ich heute frei habe. → I give the reason why I feel good."
      ]}
      questions={[
        { stem:"You want to say WHY you learn German. Which sentence is correct?", options:["Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.","Ich lerne Deutsch, weil ich möchte in Deutschland arbeiten."], answer:0, explanation:"weil introduces the reason. In the weil-clause, möchte goes to the end." },
        { stem:"The first sentence gives the reason. Now show the RESULT: Ich bin müde. ___ gehe ich früh schlafen.", options:["Weil","Deshalb","Denn"], answer:1, explanation:"deshalb means therefore / that is why. After deshalb, gehe is immediately in position 2." },
        { stem:"Which denn sentence is correct?", options:["Ich trinke Tee, denn Kaffee ist mir zu stark.","Ich trinke Tee, denn Kaffee mir zu stark ist."], answer:0, explanation:"denn keeps normal main-clause word order: Kaffee + ist + ..." },
        { stem:"Mir geht es gut, ___ ich heute frei habe. You are giving a reason. What fits?", options:["weil","deshalb"], answer:0, explanation:"You answer WHY you feel good, so weil fits. The verb habe is at the end." }
      ]}
      outputPrompt="Build three useful Small-Talk sentences: one with weil, one with denn and one with deshalb. First decide: reason or result? Then choose the connector."
      starters={["Ich lerne Deutsch, weil ...", "Ich bin heute ..., denn ...", "Ich habe heute frei. Deshalb ..."]}
    />
  </div>;
}
`);

// The speaking mind map should answer the actual production task, not a different Small-Talk essay question.
const branchesPath = "web/src/data/speakingMindMaps/a2/earlyLessonBranches.js";
let branches = read(branchesPath);
const day1Branches = `  1: [
    branch("familie", "Familie", "topic", ["Eltern", "Geschwister", "wohnen"], "Was möchtest du über deine Familie sagen?", "Ich komme aus einer ... Familie. / Ich habe ...", "Ich komme aus einer großen Familie und habe zwei Geschwister. Meine Familie lebt in Accra."),
    branch("sprachen", "Sprachen", "detail", ["sprechen", "Deutsch", "Englisch"], "Welche Sprachen sprichst du und welche lernst du?", "Ich spreche ... und lerne ...", "Ich spreche Englisch und Twi. Außerdem lerne ich Deutsch, weil ich meine Sprachkenntnisse verbessern möchte."),
    branch("beruf-studium", "Beruf / Studium", "example", ["arbeiten als", "studieren", "Ausbildung"], "Was machst du beruflich oder was studierst du?", "Ich arbeite als ... / Ich studiere ...", "Ich arbeite als Verkäufer. Meine Arbeit gefällt mir, denn ich spreche jeden Tag mit vielen Menschen."),
    branch("hobbys", "Hobbys", "closing", ["gern", "Freizeit", "Sport", "Musik"], "Was machst du gern in deiner Freizeit?", "In meiner Freizeit ...", "In meiner Freizeit höre ich gern Musik und spiele Fußball. Das macht mir Spaß."),
  ],
  3:`;
if (!/  1: \[[\s\S]*?\n  \],\n  3:/.test(branches)) throw new Error("A2 Day 1 mind-map branch block not found.");
branches = branches.replace(/  1: \[[\s\S]*?\n  \],\n  3:/, day1Branches);
write(branchesPath, branches);

const mapIndexPath = "web/src/data/speakingMindMaps/a2/index.js";
let mapIndex = read(mapIndexPath);
mapIndex = mapIndex.replace(
  '[1, "a2-day-1-small-talk", "Small Talk", "Wie führst du ein kurzes freundliches Gespräch?", ["Begrüßung", "Kennenlernen", "Arbeit oder Studium", "Freizeit", "Gespräch beenden"], earlyA2LessonBranchesByDay[1]],',
  '[1, "a2-day-1-small-talk", "Deine Vorstellung", "Kannst du dich vorstellen? Erzähl uns etwas über dich!", ["Familie", "Sprachen", "Beruf / Studium", "Hobbys"], earlyA2LessonBranchesByDay[1]],',
);
write(mapIndexPath, mapIndex);

console.log("Restored A2 Day 1 beginner grammar, teacher lecture placement and one coherent speaking mind map.");
