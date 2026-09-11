import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const write = (relativePath, source) => fs.writeFileSync(path.join(root, relativePath), source);

const replaceOnceIfNeeded = (source, from, to, sentinel, label) => {
  if (source.includes(sentinel)) return source;
  if (!source.includes(from)) throw new Error(`Could not patch ${label}: source marker missing.`);
  return source.replace(from, to);
};

const insertBeforeOnce = (source, marker, snippet, sentinel, label) => {
  if (source.includes(sentinel)) return source;
  const index = source.indexOf(marker);
  if (index < 0) throw new Error(`Could not patch ${label}: insertion marker missing.`);
  return `${source.slice(0, index)}${snippet}${source.slice(index)}`;
};

function patchDay21Perfekt() {
  const file = "web/src/components/WeatherPerfektLetterPage.js";
  let source = read(file);

  source = replaceOnceIfNeeded(
    source,
    "Learn to describe the weather, use <strong>im/am/um</strong>, give a simple reason with <strong>weil</strong>, and use that language in a short A1 email. Perfekt is available below only as optional review.",
    "Learn to describe the weather, use <strong>im/am/um</strong>, give a simple reason with <strong>weil</strong>, and use that language in a short A1 email. Then continue with a second grammar focus: <strong>Perfekt</strong> for completed actions.",
    "Then continue with a second grammar focus: <strong>Perfekt</strong>",
    "Day 21 introduction",
  );

  source = replaceOnceIfNeeded(
    source,
    "          <li>give a weather reason with <strong>weil</strong> and write a short informal message.</li>\n",
    "          <li>give a weather reason with <strong>weil</strong> and write a short informal message.</li>\n          <li>form common A1 Perfekt sentences with <strong>haben/sein + Partizip II</strong>.</li>\n",
    "form common A1 Perfekt sentences",
    "Day 21 learning targets",
  );

  source = insertBeforeOnce(
    source,
    "];\n\nconst WeatherPerfektLetterPage = () => {",
    `  {\n    prompt: "Ich ___ gestern Deutsch gelernt.",\n    options: ["habe", "bin", "ist"],\n    answer: "habe",\n    explanation: "lernen uses haben in Perfekt: Ich habe Deutsch gelernt.",\n  },\n  {\n    prompt: "Wir ___ nach Kumasi gefahren.",\n    options: ["haben", "sind", "seid"],\n    answer: "sind",\n    explanation: "fahren commonly uses sein when it describes movement to another place: Wir sind gefahren.",\n  },\n  {\n    prompt: "Which Perfekt sentence is correct?",\n    options: ["Er ist gegessen.", "Er hat gegessen.", "Er hat geessen."],\n    answer: "Er hat gegessen.",\n    explanation: "essen uses haben: Er hat gegessen.",\n  },\n  {\n    prompt: "Which Perfekt sentence is correct?",\n    options: ["Sie hat gekommen.", "Sie ist gekommen.", "Sie ist gekommt."],\n    answer: "Sie ist gekommen.",\n    explanation: "kommen uses sein: Sie ist gekommen.",\n  },\n`,
    "Ich ___ gestern Deutsch gelernt.",
    "Day 21 Perfekt practice",
  );

  source = source.replace(
    'score >= 5 ? "You are ready for the Day 21 workbook."',
    'score >= 8 ? "You are ready for the Day 21 workbook."',
  );

  const optionalStart = '      <Section eyebrow="Optional review" title="Perfekt: useful, but not the Day 21 core target">';
  if (!source.includes('Second grammar focus" title="Perfekt: talking about completed actions')) {
    const start = source.indexOf(optionalStart);
    if (start < 0) throw new Error("Could not patch Day 21 Perfekt section: source marker missing.");
    const endMarker = "      </Section>";
    const end = source.indexOf(endMarker, start);
    if (end < 0) throw new Error("Could not patch Day 21 Perfekt section: closing marker missing.");
    const replacement = `      <Section eyebrow="Second grammar focus" title="Perfekt: talking about completed actions">\n        <p style={{ margin: 0, lineHeight: 1.7 }}>\n          Use <strong>Perfekt</strong> to talk about completed actions in everyday German. The basic pattern is <strong>haben/sein + Partizip II</strong>. Most common verbs use <strong>haben</strong>; common movement or change-of-place verbs such as <strong>gehen</strong>, <strong>kommen</strong> and <strong>fahren</strong> often use <strong>sein</strong>.\n        </p>\n        <div style={{ overflowX: "auto" }}>\n          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>\n            <thead><tr style={{ background: "#f8fafc" }}>{["Infinitive", "Helping verb", "Partizip II", "Example"].map((heading) => <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>)}</tr></thead>\n            <tbody>{[["lernen", "haben", "gelernt", "Ich habe Deutsch gelernt."], ["essen", "haben", "gegessen", "Er hat gegessen."], ["spielen", "haben", "gespielt", "Wir haben Fußball gespielt."], ["gehen", "sein", "gegangen", "Ich bin nach Hause gegangen."], ["fahren", "sein", "gefahren", "Wir sind nach Kumasi gefahren."], ["kommen", "sein", "gekommen", "Sie ist spät gekommen."]].map((row) => <tr key={row.join("-")}>{row.map((cell, index) => <td key={index} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{index === 3 ? <strong>{cell}</strong> : cell}</td>)}</tr>)}</tbody>\n          </table>\n        </div>\n        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>\n          <strong>Word order:</strong> the helping verb is conjugated in position 2 and the Partizip II normally goes to the end: <strong>Ich habe gestern Deutsch gelernt.</strong>\n        </div>\n      </Section>`;
    source = `${source.slice(0, start)}${replacement}${source.slice(end + endMarker.length)}`;
  }

  write(file, source);
}

function keepDay23AtA1CaseScope() {
  const file = "web/src/components/DativeAdjectiveDeclensionPage.js";
  let source = read(file);

  source = source.replace(
    /\n\s*<li>use common adjective endings with <strong>ein\/eine<\/strong> in Nominativ, Akkusativ and Dativ\.<\/li>/g,
    "",
  );

  const adjectiveQuizPrompts = [
    "Das ist ein ___ Hund.",
    "Ich sehe einen ___ Hund.",
    "Ich spreche mit einem ___ Lehrer.",
    "Sie kauft ein ___ Buch.",
  ];
  adjectiveQuizPrompts.forEach((prompt) => {
    const escaped = prompt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    source = source.replace(new RegExp(`\\n\\s*\\{\\n\\s*prompt: \"${escaped}\",[\\s\\S]*?\\n\\s*\\},`, "g"), "");
  });

  source = source.replace(
    'score >= 10 ? "Strong work. You can move to the final A1.2 revision."',
    'score >= 7 ? "Strong work. You can move to the final A1.2 revision."',
  );

  const unwantedSections = [
    '      <Section eyebrow="Second grammar focus" title="Adjective endings with ein/eine">',
    '      <Section eyebrow="Optional extra" title="Adjective endings are not the main goal today">',
  ];
  unwantedSections.forEach((marker) => {
    const start = source.indexOf(marker);
    if (start < 0) return;
    const endMarker = "      </Section>";
    const end = source.indexOf(endMarker, start);
    if (end >= 0) source = `${source.slice(0, start)}${source.slice(end + endMarker.length)}`;
  });

  if (/Adjective endings with ein\/eine|adjective declension|optional adjective reminder/i.test(source)) {
    throw new Error("A1 Day 23 still contains adjective-declension teaching after boundary cleanup.");
  }

  write(file, source);
}

function patchDay24PerfektOnly() {
  const file = "web/src/components/ConjunctionNotesPage.js";
  let source = read(file);

  source = source.replace(
    /\n\s*\{\n\s*title: "9\) Task",[\s\S]*?\n\s*\},\n\s*\{\n\s*title: "10\) Task",[\s\S]*?\n\s*\},/g,
    "",
  );

  const mixedMarker = '      <Section title="Final Grammar Check: Perfekt and Adjective Endings">';
  const mixedStart = source.indexOf(mixedMarker);
  if (mixedStart >= 0) {
    const endMarker = "      </Section>";
    const mixedEnd = source.indexOf(endMarker, mixedStart);
    if (mixedEnd >= 0) source = `${source.slice(0, mixedStart)}${source.slice(mixedEnd + endMarker.length)}`;
  }

  source = insertBeforeOnce(
    source,
    "];\n\nconst examGuidance = [",
    `  {\n    title: "7) Task",\n    prompt: "Write in Perfekt: Ich lerne Deutsch.",\n    hint: "Use haben + gelernt.",\n    answer: "Ich habe Deutsch gelernt.",\n  },\n  {\n    title: "8) Task",\n    prompt: "Write in Perfekt: Wir fahren nach Accra.",\n    hint: "fahren uses sein for movement to another place.",\n    answer: "Wir sind nach Accra gefahren.",\n  },\n`,
    'title: "7) Task"',
    "Day 24 Perfekt revision challenges",
  );

  source = insertBeforeOnce(
    source,
    '      <Section title="Final Revision: Sentence Formulation Check">',
    `      <Section title="Final Grammar Check: Perfekt">\n        <p style={{ margin: 0, lineHeight: 1.7 }}>\n          Before you finish A1, make sure you can recognise and build a few common Perfekt sentences. Adjective declension belongs to A2 and is not part of this A1 final check.\n        </p>\n        <div style={{ border: "1px solid #c7d2fe", background: "#eef2ff", borderRadius: 14, padding: 14, display: "grid", gap: 7 }}>\n          <strong>haben/sein + Partizip II</strong>\n          <div>Ich <strong>habe</strong> Deutsch <strong>gelernt</strong>.</div>\n          <div>Wir <strong>sind</strong> nach Accra <strong>gefahren</strong>.</div>\n        </div>\n      </Section>\n\n`,
    'Section title="Final Grammar Check: Perfekt"',
    "Day 24 Perfekt-only final check",
  );

  if (/Adjective Endings|adjective endings|ein guter Kurs|einen guten Kurs|mit einem guten Kurs/i.test(source)) {
    throw new Error("A1 Day 24 still contains adjective-declension revision after boundary cleanup.");
  }

  write(file, source);
}

function removeDuplicateDay24ScheduleVideo() {
  const file = "web/src/data/courseSchedule.js";
  let source = read(file);

  source = source.replace(
    /\n\s*\{\s*title:\s*"Conjunctions and word order",\s*url:\s*"https:\/\/youtu\.be\/LKWf257-d8E",\s*note:\s*"aber\/denn\/sondern \+ weil\/dass in context\."\s*\},?/m,
    "",
  );

  if (source.includes("LKWf257-d8E")) {
    throw new Error("A1 Day 24 duplicate schedule video is still present.");
  }

  write(file, source);
}

patchDay21Perfekt();
keepDay23AtA1CaseScope();
patchDay24PerfektOnly();
removeDuplicateDay24ScheduleVideo();

console.log("Applied A1 late-course grammar boundary and Day 24 media cleanup.");
