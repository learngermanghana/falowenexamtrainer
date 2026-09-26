#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const COMPONENT_ROOT = path.join(ROOT, "web", "src", "components");
const MANIFEST_PATH = path.join(ROOT, "functions", "data", "answerKeyManifest.json");
const WRITING_PATH = path.join(ROOT, "web", "src", "data", "a2GoetheWritingTasks.js");
const READING_PATH = path.join(ROOT, "web", "src", "data", "a2ReadingTasks.js");
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

const extractBalanced = (source, startIndex, openChar, closeChar) => {
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let i = startIndex; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === openChar) depth += 1;
    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) return source.slice(startIndex, i + 1);
    }
  }
  return "";
};

const evaluateArrayLiteral = (literal, label) => {
  try {
    return vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });
  } catch (error) {
    fail(label, `could not parse question array: ${error.message}`);
    return null;
  }
};

const extractConstArray = (source, identifier, label) => {
  const marker = new RegExp(`(?:const|let)\\s+${identifier.replace(/[$]/g, "\\$&")}\\s*=\\s*`);
  const match = marker.exec(source);
  if (!match) {
    fail(label, `cannot find array constant ${identifier}`);
    return null;
  }
  const start = source.indexOf("[", match.index + match[0].length);
  if (start < 0) {
    fail(label, `${identifier} is not an array literal`);
    return null;
  }
  const literal = extractBalanced(source, start, "[", "]");
  if (!literal) {
    fail(label, `could not read ${identifier} array`);
    return null;
  }
  return evaluateArrayLiteral(literal, label);
};

const extractQuestionsProp = (source, propName, label) => {
  const marker = `${propName}={`;
  const start = source.indexOf(marker);
  if (start < 0) return null;
  const expressionStart = start + marker.length;
  const end = source.indexOf("}", expressionStart);
  if (end < 0) {
    fail(label, `cannot parse ${propName} prop`);
    return null;
  }
  const expression = source.slice(expressionStart, end).trim();
  if (expression.startsWith("[")) {
    const literal = extractBalanced(source, expressionStart, "[", "]");
    return literal ? evaluateArrayLiteral(literal, label) : null;
  }
  if (/^[A-Za-z_$][\w$]*$/.test(expression)) {
    return extractConstArray(source, expression, label);
  }
  fail(label, `unsupported ${propName} expression: ${expression}`);
  return null;
};

const manifest = JSON.parse(read(MANIFEST_PATH));
const manifestById = new Map(
  Object.values(manifest)
    .filter((entry) => entry?.assignment_id)
    .map((entry) => [String(entry.assignment_id).toUpperCase(), entry]),
);

const { A2_GOETHE_WRITING_TASKS } = await import(pathToFileURL(WRITING_PATH).href);
const { A2_READING_TASKS } = await import(pathToFileURL(READING_PATH).href);

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
  dayFiles.set(day, { fileName, fullPath, source, chapter: chapterMatch[1] });
}

const expectedDays = Array.from({ length: 28 }, (_, index) => index + 1);
for (const day of expectedDays) {
  if (!dayFiles.has(day)) fail(`Day ${day}`, "missing live A2 standard workbook wrapper");
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
if (/fallbackText|fallbackQuestions|lesenText, lesenQuestions/.test(sharedSource)) {
  fail("Shared workbook", "Teil 3 must not accept legacy inline Lesen fallbacks");
}
if (!sharedSource.includes("hoerenSelfCheck ? \"Teil 4 · Hören · Goethe-Praxis (Selbstkontrolle)\"")) {
  fail("Shared workbook", "self-check Hören must render a distinct Goethe self-check heading");
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
    fail("Day 14 legacy guard", `legacy 12-question Lesen copy "${forbidden}" remains in live source: ${foundIn.map((file) => path.relative(ROOT, file)).join(", ")}`);
  }
}

for (const day of expectedDays) {
  const label = `A2 Day ${day}`;
  const wrapper = dayFiles.get(day);
  const writing = A2_GOETHE_WRITING_TASKS[day];
  const reading = A2_READING_TASKS[day];

  if (!writing) {
    fail(label, "missing canonical Schreiben task");
    continue;
  }
  if (!reading) {
    fail(label, "missing canonical Lesen task");
    continue;
  }

  const assignmentId = String(writing.assignmentKey || "").toUpperCase();
  const expectedAssignmentId = `A2-${reading.chapter}`.toUpperCase();

  if (writing.points?.length !== 3) {
    fail(label, `Schreiben must have exactly 3 Goethe-style content points; found ${writing.points?.length ?? 0}`);
  }
  if (assignmentId !== expectedAssignmentId) {
    fail(label, `Schreiben assignmentKey ${assignmentId} does not match Lesen chapter ${reading.chapter}`);
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
    if (!answer) return;
    const letter = choiceLetter(answer);
    const body = normalize(stripChoicePrefix(answer));
    const sameOption = question.options?.find((option) => {
      const optionLetter = choiceLetter(option);
      const optionBody = normalize(stripChoicePrefix(option));
      return (!letter || letter === optionLetter) && body === optionBody;
    });
    if (!sameOption) {
      fail(label, `Lesen Answer${index + 1} does not match the canonical same-letter option: ${answer}`);
    }
  });

  if (!wrapper) continue;
  const source = wrapper.source;
  if (/\blesenText\s*=|\blesenQuestions\s*=/.test(source)) {
    fail(label, "contains obsolete inline Lesen props; a2ReadingTasks.js must be the only A2 Lesen source");
  }
  if (/\b(?:const|let)\s+(?:lesenText|readingText|cultureFreeTimeReadingText|lesenQuestions|readingQuestions)\b/.test(source)) {
    fail(label, "contains obsolete inline Lesen data declarations");
  }

  const showHoeren = !/showHoeren=\{false\}/.test(source);
  const listeningAnswers = sortedAnswers(manifestEntry.answers?.teil4);

  if (!showHoeren) {
    if (listeningAnswers.length !== 0) {
      fail(label, `workbook hides Hören but manifest Teil 4 still has ${listeningAnswers.length} answer(s)`);
    }
  } else {
    const audioMatch = source.match(/hoerenAudioUrl="([^"]+)"/);
    if (!audioMatch?.[1]) {
      fail(label, "Teil 4 Hören is visible but hoerenAudioUrl is missing");
    }

    const listeningQuestions = extractQuestionsProp(source, "hoerenQuestions", label);
    const declaresSelfCheck = /\bhoerenSelfCheck\b/.test(source);
    const explicitSelfCheck = declaresSelfCheck
      && /hoerenQuestions=\{\[\]\}/.test(source)
      && listeningAnswers.length === 0;

    if (declaresSelfCheck && !explicitSelfCheck) {
      fail(label, "hoerenSelfCheck requires an empty question list and no submitted Teil 4 answers");
    }

    if (explicitSelfCheck) {
      note(`${expectedAssignmentId}: Teil 4 is explicitly labeled external self-check practice, not a submitted Hören assignment`);
    } else if (!Array.isArray(listeningQuestions) || listeningQuestions.length === 0) {
      fail(label, "Teil 4 Hören is visible but has neither graded questions nor an explicit self-check contract");
    } else {
      if (listeningAnswers.length !== listeningQuestions.length) {
        fail(
          label,
          `Hören has ${listeningQuestions.length} question(s) but manifest Teil 4 has ${listeningAnswers.length} answer(s)`,
        );
      }
      listeningQuestions.forEach((question, index) => {
        const answer = listeningAnswers[index];
        if (!answer) return;
        const letter = choiceLetter(answer);
        const body = normalize(stripChoicePrefix(answer));
        const sameOption = question.options?.find((option) => {
          const optionLetter = choiceLetter(option);
          const optionBody = normalize(stripChoicePrefix(option));
          return (!letter || letter === optionLetter) && body === optionBody;
        });
        if (!sameOption) {
          fail(label, `Hören Answer${index + 1} does not match the displayed same-letter option: ${answer}`);
        }
      });
    }
  }

  if (/openGrammarAfterRadio|radioCompleted|get\("radio"\)/.test(source)) {
    fail(label, "contains day-specific Radio-return tab behavior; A2 days must use the normal shared flow");
  }

  note(`${expectedAssignmentId}: Schreiben 3 points · Lesen 5 questions · Hören ${showHoeren ? "checked" : "not assigned"}`);
}

console.log(`A2 assignment consistency audit checked ${dayFiles.size}/28 live workbook wrappers.`);
for (const message of notes) console.log("- " + message);

if (failures.length) {
  console.error("\nA2 assignment consistency audit FAILED:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log("\nPASS A2 Days 1–28 are structurally consistent.");
