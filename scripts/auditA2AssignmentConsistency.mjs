#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const COMPONENT_ROOT = path.join(ROOT, "web", "src", "components");
const MANIFEST_PATH = path.join(ROOT, "functions", "data", "answerKeyManifest.json");
const WRITING_PATH = path.join(ROOT, "web", "src", "data", "a2GoetheWritingTasks.js");
const READING_PATH = path.join(ROOT, "web", "src", "data", "a2ReadingTasks.js");
const LISTENING_PATH = path.join(ROOT, "web", "src", "data", "a2ListeningTasks.js");
const SHARED_WORKBOOK_PATH = path.join(COMPONENT_ROOT, "A2StandardTabbedWorkbookPage.js");

const failures = [];
const notes = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);
const note = (message) => notes.push(message);
const read = (file) => fs.readFileSync(file, "utf8");

const normalize = (value = "") =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .replace(/[“”„"'’`]/g, "")
    .replace(/[.,;:!?()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const choiceLetter = (value = "") => {
  const match = String(value)
    .replace(/^\s*\d+\.\s*/, "")
    .match(/^\s*([a-z])\s*[).:-]\s*/i);
  return match ? match[1].toUpperCase() : "";
};

const stripChoicePrefix = (value = "") =>
  String(value)
    .replace(/^\s*\d+\.\s*/, "")
    .replace(/^\s*[a-z]\s*[).:-]\s*/i, "")
    .trim();

const sortedAnswers = (answers = {}) =>
  Object.entries(answers)
    .sort(([a], [b]) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, "")))
    .map(([, value]) => String(value));

const manifest = JSON.parse(read(MANIFEST_PATH));
const manifestById = new Map(
  Object.values(manifest)
    .filter((entry) => entry?.assignment_id)
    .map((entry) => [String(entry.assignment_id).toUpperCase(), entry]),
);

const { A2_GOETHE_WRITING_TASKS } = await import(pathToFileURL(WRITING_PATH).href);
const { A2_READING_TASKS } = await import(pathToFileURL(READING_PATH).href);
const {
  A2_LISTENING_MODES,
  A2_LISTENING_TASKS,
  A2_GRADED_LISTENING_DAYS,
  A2_SELF_CHECK_LISTENING_DAYS,
  A2_NO_LISTENING_DAYS,
} = await import(pathToFileURL(LISTENING_PATH).href);

const dayFiles = new Map();
for (const fileName of fs.readdirSync(COMPONENT_ROOT)) {
  if (!fileName.endsWith(".js") || fileName.includes(".test.") || fileName.includes("Legacy")) continue;
  const fullPath = path.join(COMPONENT_ROOT, fileName);
  const source = read(fullPath);
  if (!source.includes("<A2StandardTabbedWorkbookPage")) continue;
  const dayMatch = source.match(/\bday=\{(\d+)\}/);
  const chapterMatch = source.match(/\bchapter="([^"]+)"/);
  if (!dayMatch || !chapterMatch) continue;
  const day = Number(dayMatch[1]);
  if (day < 1 || day > 28) continue;
  if (dayFiles.has(day)) {
    fail(`Day ${day}`, `multiple live standard workbook wrappers: ${dayFiles.get(day).fileName}, ${fileName}`);
    continue;
  }
  dayFiles.set(day, { fileName, source, chapter: chapterMatch[1] });
}

const expectedDays = Array.from({ length: 28 }, (_, index) => index + 1);
for (const day of expectedDays) {
  if (!dayFiles.has(day)) fail(`Day ${day}`, "missing live A2 standard workbook wrapper");
}

if (Object.keys(A2_LISTENING_TASKS).length !== 28) {
  fail("Canonical Hören", `expected 28 day entries, found ${Object.keys(A2_LISTENING_TASKS).length}`);
}
if (A2_GRADED_LISTENING_DAYS.length !== 21) {
  fail("Canonical Hören", `expected 21 graded days, found ${A2_GRADED_LISTENING_DAYS.length}`);
}
if (JSON.stringify(A2_SELF_CHECK_LISTENING_DAYS) !== JSON.stringify([21, 22, 23, 24, 26])) {
  fail("Canonical Hören", `self-check days must be 21,22,23,24,26; found ${A2_SELF_CHECK_LISTENING_DAYS.join(",")}`);
}
if (JSON.stringify(A2_NO_LISTENING_DAYS) !== JSON.stringify([14, 25])) {
  fail("Canonical Hören", `no-Hören days must be 14,25; found ${A2_NO_LISTENING_DAYS.join(",")}`);
}

const sharedSource = read(SHARED_WORKBOOK_PATH);
if (!sharedSource.includes('useState("sprechen")')) {
  fail("Shared workbook", "must open on Teil 1 / Sprechen by default");
}
for (const forbidden of ['get("radio") === "done"', "radioCompleted", "openGrammarAfterRadio"]) {
  if (sharedSource.includes(forbidden)) {
    fail("Shared workbook", `contains forbidden special Radio-opening behavior: ${forbidden}`);
  }
}
if (!sharedSource.includes("const assignmentKey = `A2-${chapter}`;")) {
  fail("Shared workbook", "submission assignmentKey must derive from the workbook chapter");
}
if (!sharedSource.includes("canonicalAssignmentKey: assignmentKey")) {
  fail("Shared workbook", "canonical submission key must equal assignmentKey");
}
if (!sharedSource.includes("<A2ReadingTaskPanel day={day}")) {
  fail("Shared workbook", "Teil 3 must render the canonical A2ReadingTaskPanel");
}
if (!sharedSource.includes("getA2ListeningTask(day)")) {
  fail("Shared workbook", "Teil 4 must resolve canonical Hören with getA2ListeningTask(day)");
}
if (!sharedSource.includes("A2_LISTENING_MODES.SELF_CHECK")) {
  fail("Shared workbook", "Teil 4 self-check behavior must derive from canonical listening mode");
}
if (/hoerenTask, hoerenAudioUrl|hoerenQuestions = \[\]|showHoeren = true|hoerenSelfCheck = false/.test(sharedSource)) {
  fail("Shared workbook", "must not accept legacy per-page Hören source props");
}
if (!sharedSource.includes("Du trägst für diese Übung nichts im Falowen Submit-Tab ein.")) {
  fail("Shared workbook", "self-check Hören must explicitly say that nothing is submitted in Falowen");
}

const day14ForbiddenCopy = [
  "Was bedeutet Gleitzeit?",
  "Was ist der Betriebsrat?",
  "Wie viele Stunden arbeitet man in der Regel pro Woche in Vollzeit?",
  "Was muss man bei einer Kündigung beachten?",
];
const webSourceRoot = path.join(ROOT, "web", "src");
const sourceFilesToCheck = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(?:js|jsx|ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.")) sourceFilesToCheck.push(full);
  }
};
walk(webSourceRoot);
for (const forbidden of day14ForbiddenCopy) {
  const foundIn = sourceFilesToCheck.filter((file) => read(file).includes(forbidden));
  if (foundIn.length) {
    fail(
      "Day 14 legacy guard",
      `legacy 12-question Lesen copy "${forbidden}" remains in live source: ${foundIn.map((file) => path.relative(ROOT, file)).join(", ")}`,
    );
  }
}

const matchesManifestOption = (answer, question) => {
  const letter = choiceLetter(answer);
  const body = normalize(stripChoicePrefix(answer));
  return question.options?.some((option) => {
    const optionLetter = choiceLetter(option);
    const optionBody = normalize(stripChoicePrefix(option));
    return (!letter || letter === optionLetter) && body === optionBody;
  });
};

for (const day of expectedDays) {
  const label = `A2 Day ${day}`;
  const wrapper = dayFiles.get(day);
  const writing = A2_GOETHE_WRITING_TASKS[day];
  const reading = A2_READING_TASKS[day];
  const listening = A2_LISTENING_TASKS[day];

  if (!writing) fail(label, "missing canonical Schreiben task");
  if (!reading) fail(label, "missing canonical Lesen task");
  if (!listening) fail(label, "missing canonical Hören task");
  if (!writing || !reading || !listening) continue;

  const expectedAssignmentId = `A2-${reading.chapter}`.toUpperCase();
  const assignmentId = String(writing.assignmentKey || "").toUpperCase();

  if (writing.points?.length !== 3) {
    fail(label, `Schreiben must have exactly 3 Goethe-style content points; found ${writing.points?.length ?? 0}`);
  }
  if (assignmentId !== expectedAssignmentId) {
    fail(label, `Schreiben assignmentKey ${assignmentId} does not match canonical chapter ${reading.chapter}`);
  }
  if (String(listening.chapter) !== String(reading.chapter)) {
    fail(label, `Hören chapter ${listening.chapter} does not match Lesen chapter ${reading.chapter}`);
  }
  if (wrapper && String(wrapper.chapter) !== String(reading.chapter)) {
    fail(label, `workbook chapter ${wrapper.chapter} does not match canonical chapter ${reading.chapter}`);
  }

  if (!Array.isArray(reading.questions) || reading.questions.length !== 5) {
    fail(label, `Lesen must have exactly 5 questions; found ${reading.questions?.length ?? 0}`);
  }

  const manifestEntry = manifestById.get(expectedAssignmentId);
  if (!manifestEntry) {
    fail(label, `missing ${expectedAssignmentId} from answerKeyManifest.json`);
    continue;
  }

  const readingAnswers = sortedAnswers(manifestEntry.answers?.teil3);
  if (readingAnswers.length !== 5) {
    fail(label, `manifest Teil 3 must contain exactly 5 answers; found ${readingAnswers.length}`);
  }
  reading.questions.forEach((question, index) => {
    const answer = readingAnswers[index];
    if (answer && !matchesManifestOption(answer, question)) {
      fail(label, `Lesen Answer${index + 1} does not match the canonical same-letter option: ${answer}`);
    }
  });

  const listeningAnswers = sortedAnswers(manifestEntry.answers?.teil4);
  const mode = listening.mode;
  if (![A2_LISTENING_MODES.GRADED, A2_LISTENING_MODES.SELF_CHECK, A2_LISTENING_MODES.NONE].includes(mode)) {
    fail(label, `unsupported Hören mode: ${mode}`);
  } else if (mode === A2_LISTENING_MODES.NONE) {
    if (listening.audioUrl || listening.questions?.length || listeningAnswers.length) {
      fail(label, "no-Hören day must have no audio, no questions and no submitted Teil 4 answers");
    }
  } else if (mode === A2_LISTENING_MODES.SELF_CHECK) {
    if (!listening.audioUrl) fail(label, "self-check Hören requires an audio/video URL");
    if (listening.questions?.length) fail(label, "self-check Hören must not carry Falowen graded questions");
    if (listeningAnswers.length) fail(label, "self-check Hören must not carry submitted Teil 4 answers");
  } else {
    if (!listening.audioUrl) fail(label, "graded Hören requires an audio/video URL");
    if (!Array.isArray(listening.questions) || !listening.questions.length) {
      fail(label, "graded Hören requires canonical questions");
    } else {
      if (listeningAnswers.length !== listening.questions.length) {
        fail(label, `graded Hören has ${listening.questions.length} questions but manifest Teil 4 has ${listeningAnswers.length} answers`);
      }
      listening.questions.forEach((question, index) => {
        const answer = listeningAnswers[index];
        if (answer && !matchesManifestOption(answer, question)) {
          fail(label, `Hören Answer${index + 1} does not match the canonical same-letter option: ${answer}`);
        }
      });
    }
  }

  if (wrapper) {
    const source = wrapper.source;
    if (/\blesenText\s*=|\blesenQuestions\s*=/.test(source)) {
      fail(label, "contains obsolete inline Lesen props; a2ReadingTasks.js must be the only A2 Lesen source");
    }
    if (/\b(?:const|let)\s+(?:lesenText|readingText|cultureFreeTimeReadingText|lesenQuestions|readingQuestions)\b/.test(source)) {
      fail(label, "contains obsolete inline Lesen data declarations");
    }
    if (/\b(?:hoerenTask|hoerenAudioUrl|hoerenQuestions|hoerenSelfCheck|showHoeren)\b/.test(source)) {
      fail(label, "contains obsolete per-day Hören props; a2ListeningTasks.js must be the only A2 Hören source");
    }
    if (/\b(?:const|let)\s+(?:hoerenQuestions|listeningQuestions)\b/.test(source)) {
      fail(label, "contains obsolete per-day Hören question declarations");
    }
    if (/openGrammarAfterRadio|radioCompleted|get\("radio"\)/.test(source)) {
      fail(label, "contains day-specific Radio-return tab behavior; A2 days must use the normal shared flow");
    }
  }

  note(
    `${expectedAssignmentId}: Schreiben 3 points · Lesen 5 questions · Hören ${mode}${mode === A2_LISTENING_MODES.GRADED ? ` (${listening.questions.length} questions)` : ""}`,
  );
}

console.log(`A2 assignment consistency audit checked ${dayFiles.size}/28 live workbook wrappers.`);
for (const message of notes) console.log("- " + message);

if (failures.length) {
  console.error("\nA2 assignment consistency audit FAILED:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log("\nPASS A2 Days 1–28 are structurally consistent.");
