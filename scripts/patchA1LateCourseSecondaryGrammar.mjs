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
  const source = read(file);

  if (!source.includes('data-a1-day21-three-point-grammar="true"')) {
    throw new Error("A1 Day 21 must use the three-point weather-letter grammar page.");
  }

  const staleDay21Grammar = [
    "Perfekt: talking about completed actions",
    "Perfekt: useful, but not the Day 21 core target",
    "im, am and um",
    "Use weil to explain why",
    "give a weather reason with <strong>weil</strong>",
  ];

  const remaining = staleDay21Grammar.filter((marker) => source.includes(marker));
  if (remaining.length) {
    throw new Error(`A1 Day 21 still contains stale grammar markers: ${remaining.join(", ")}`);
  }

  if (!source.includes("exactly three content points") || !source.includes("Greeting, closing and name")) {
    throw new Error("A1 Day 21 must teach exactly three content points and keep letter form separate.");
  }
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

  if (/Adjective endings with ein\/eine|optional adjective reminder/i.test(source)) {
    throw new Error("A1 Day 23 still contains adjective-ending teaching after boundary cleanup.");
  }

  write(file, source);
}

function validateDay23FinalMock() {
  const componentFile = "web/src/components/A1FinalMockExamPage.jsx";
  const componentSource = read(componentFile);
  const scheduleSource = read("web/src/data/courseSchedule.js");

  const requiredMarkers = [
    'data-a1-final-mock',
    "A1 Final Mock Exam",
    "SECTION_DURATIONS",
    "lesen: 25 * 60",
    "hoeren: 20 * 60",
    "schreiben: 20 * 60",
    "sprechen: 15 * 60",
    "scoreA1MockWriting",
    "A1GoetheSpeakingMockPreview",
    'href="/exams/overview"',
    '<FullMockRecovery level="A1"',
  ];

  const missing = requiredMarkers.filter((marker) => !componentSource.includes(marker));
  if (missing.length) {
    throw new Error(`A1 Day 23 final mock is missing: ${missing.join(", ")}`);
  }

  const staleScheduleMarkers = [
    'topic: "Conjunctions"',
    'grammar_topic: "German Conjunctions"',
    'workbook_link: "/campus/course/conjunctions-5-10"',
  ];
  const stale = staleScheduleMarkers.filter((marker) => scheduleSource.includes(marker));
  if (stale.length) {
    throw new Error(`A1 Day 23 still points to the old conjunction lesson: ${stale.join(", ")}`);
  }

  if (!scheduleSource.includes('workbook_link: "/campus/course/a1-final-mock-exam"')) {
    throw new Error("A1 Day 23 schedule must route to the final mock exam.");
  }
}

function removeDuplicateFinalMockScheduleVideo() {
  const file = "web/src/data/courseSchedule.js";
  let source = read(file);

  source = source.replace(
    /\n\s*\{\s*title:\s*"Conjunctions and word order",\s*url:\s*"https:\/\/youtu\.be\/LKWf257-d8E",\s*note:\s*"aber\/denn\/sondern \+ weil\/dass in context\."\s*\},?/m,
    "",
  );

  if (source.includes("LKWf257-d8E")) {
    throw new Error("A1 final mock duplicate schedule video is still present.");
  }

  write(file, source);
}

patchDay21Perfekt();
validateDay23FinalMock();
removeDuplicateFinalMockScheduleVideo();

console.log("Applied A1 late-course grammar boundary and validated the Day 23 final mock exam.");