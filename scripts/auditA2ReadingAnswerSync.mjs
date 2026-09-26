#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const COMPONENTS_DIR = path.join(ROOT, "web", "src", "components");
const MANIFEST_PATH = path.join(ROOT, "functions", "data", "answerKeyManifest.json");
const liveSheets = process.argv.includes("--live-sheets");

const read = (file) => fs.readFileSync(file, "utf8");

const normalize = (value = "") =>
  String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[“”„\"'’`]/g, "")
    .replace(/[.,;:!?()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripSheetRowPrefix = (value = "") =>
  String(value).replace(/^\s*\d+\.\s*/, "").trim();

const stripChoicePrefix = (value = "") =>
  stripSheetRowPrefix(value)
    .replace(/^\s*[a-z]\s*[).:-]\s*/i, "")
    .replace(/^\s*anzeige\s*:\s*/i, "")
    .trim();

const choiceLetter = (value = "") => {
  const direct = stripSheetRowPrefix(value).match(/^\s*([a-z])\s*[).:-]\s*/i);
  if (direct) return direct[1].toUpperCase();
  const advert = stripSheetRowPrefix(value).match(/^\s*anzeige\s*:\s*([a-zx])\b/i);
  return advert ? advert[1].toUpperCase() : "";
};

const extractSpreadsheetId = (url = "") => {
  const match = String(url).match(/\/spreadsheets\/d\/([^/]+)/i);
  return match ? match[1] : "";
};

const findBalanced = (source, openIndex, openChar = "[", closeChar = "]") => {
  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1] || "";

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === quote) quote = "";
      continue;
    }
    if (ch === "/" && next === "/") {
      lineComment = true;
      i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      blockComment = true;
      i += 1;
      continue;
    }
    if (ch === '\"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === openChar) depth += 1;
    if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
};

const extractConstInitializers = (source) => {
  const entries = [];
  const re = /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*/g;
  let match;

  while ((match = re.exec(source))) {
    const name = match[1];
    const start = re.lastIndex;
    const first = source[start];

    if (!["[", "{", '\"', "'", "`"].includes(first)) continue;

    let end = -1;
    if (first === "[") end = findBalanced(source, start, "[", "]");
    else if (first === "{") end = findBalanced(source, start, "{", "}");
    else {
      let escaped = false;
      for (let i = start + 1; i < source.length; i += 1) {
        const ch = source[i];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === first) {
          end = i;
          break;
        }
      }
    }

    if (end < 0) continue;
    entries.push({ name, expression: source.slice(start, end + 1) });
    re.lastIndex = end + 1;
  }
  return entries;
};

const evaluateConstants = (source) => {
  const values = {};
  const sandbox = Object.create(null);

  for (const { name, expression } of extractConstInitializers(source)) {
    try {
      const value = vm.runInNewContext("(" + expression + ")", sandbox, { timeout: 100 });
      sandbox[name] = value;
      values[name] = value;
    } catch {
      // Ignore constants that depend on JSX/functions/runtime values.
    }
  }
  return values;
};

const extractJsxPropExpression = (source, propName) => {
  const propMatch = new RegExp("\\b" + propName + "\\s*=\\s*\\{", "g").exec(source);
  if (!propMatch) return null;

  const openBraceIndex = propMatch.index + propMatch[0].lastIndexOf("{");
  const closeBraceIndex = findBalanced(source, openBraceIndex, "{", "}");
  if (closeBraceIndex < 0) return { error: "unclosed JSX expression" };

  return {
    expression: source.slice(openBraceIndex + 1, closeBraceIndex).trim(),
  };
};

const resolveQuestionArray = (source, values, propName) => {
  const prop = extractJsxPropExpression(source, propName);
  if (!prop) return { present: false, questions: null };
  if (prop.error) return { present: true, questions: null, error: prop.error };

  const expression = prop.expression;
  if (/^[A-Za-z_$][\\w$]*$/.test(expression)) {
    const questions = values[expression];
    return Array.isArray(questions)
      ? { present: true, questions }
      : { present: true, questions: null, error: "could not evaluate " + expression };
  }

  if (expression.startsWith("[")) {
    try {
      const questions = vm.runInNewContext("(" + expression + ")", Object.create(null), { timeout: 100 });
      return Array.isArray(questions)
        ? { present: true, questions }
        : { present: true, questions: null, error: "inline expression is not an array" };
    } catch (error) {
      return { present: true, questions: null, error: "could not evaluate inline array: " + error.message };
    }
  }

  return {
    present: true,
    questions: null,
    error: "unsupported lesenQuestions expression: " + expression.slice(0, 80),
  };
};

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (ch === '\"' && next === '\"') {
        cell += '\"';
        i += 1;
      } else if (ch === '\"') {
        quoted = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '\"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }

  row.push(cell.replace(/\r$/, ""));
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
};

const flattenAnswerObject = (answers = {}) =>
  Object.entries(answers)
    .sort(([a], [b]) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, "")))
    .map(([, value]) => String(value));

const manifest = JSON.parse(read(MANIFEST_PATH));
const manifestByAssignmentId = new Map(
  Object.values(manifest)
    .filter((entry) => entry?.assignment_id)
    .map((entry) => [String(entry.assignment_id).trim().toUpperCase(), entry]),
);

const workbookFiles = fs
  .readdirSync(COMPONENTS_DIR)
  .filter((name) => /^A2Day\d+.*WorkbookPage\.js$/.test(name) && !/Legacy/.test(name));

const failures = [];
const warnings = [];
const checks = [];

const fail = (assignmentId, message) => failures.push(assignmentId + ": " + message);
const warn = (assignmentId, message) => warnings.push(assignmentId + ": " + message);

for (const fileName of workbookFiles) {
  const fullPath = path.join(COMPONENTS_DIR, fileName);
  const source = read(fullPath);
  const chapterMatch = source.match(/\bchapter\s*=\s*[\"']([^\"']+)[\"']/);
  if (!chapterMatch) continue;

  const assignmentId = ("A2-" + chapterMatch[1]).toUpperCase();
  const values = evaluateConstants(source);
  const resolvedQuestions = resolveQuestionArray(source, values, "lesenQuestions");

  if (!resolvedQuestions.present) continue;
  if (!Array.isArray(resolvedQuestions.questions) || !resolvedQuestions.questions.length) {
    fail(
      assignmentId,
      "could not parse lesenQuestions in " + fileName +
        (resolvedQuestions.error ? ": " + resolvedQuestions.error : ""),
    );
    continue;
  }

  const questions = resolvedQuestions.questions;
  const entry = manifestByAssignmentId.get(assignmentId);

  if (!entry) {
    fail(assignmentId, "missing from " + path.relative(ROOT, MANIFEST_PATH) + " (source: " + fileName + ")");
    continue;
  }

  const readingAnswers = entry.answers?.teil3;
  if (!readingAnswers || typeof readingAnswers !== "object" || Array.isArray(readingAnswers)) {
    fail(assignmentId, "manifest is missing answers.teil3 for Lesen");
    continue;
  }

  const expectedAnswers = flattenAnswerObject(readingAnswers);
  if (expectedAnswers.length !== questions.length) {
    fail(
      assignmentId,
      "Lesen has " + questions.length + " questions but manifest teil3 has " + expectedAnswers.length + " answers",
    );
  }

  expectedAnswers.forEach((answer, index) => {
    const expectedKey = "Answer" + (index + 1);
    if (!(expectedKey in readingAnswers)) {
      fail(assignmentId, "manifest is missing " + expectedKey);
      return;
    }

    const question = questions[index];
    if (!question || !Array.isArray(question.options) || !question.options.length) {
      warn(assignmentId, "question " + (index + 1) + " options could not be evaluated from " + fileName);
      return;
    }

    const letter = choiceLetter(answer);
    const answerBody = normalize(stripChoicePrefix(answer));
    let matchingOption = null;

    if (letter) {
      matchingOption = question.options.find((option) => {
        const optionLetter = choiceLetter(option);
        const optionBody = normalize(stripChoicePrefix(option));
        if (optionLetter !== letter) return false;
        if (!answerBody) return true;
        return optionBody === answerBody ||
          optionBody.includes(answerBody) ||
          answerBody.includes(optionBody);
      });
    } else if (answerBody) {
      matchingOption = question.options.find((option) => {
        const optionBody = normalize(stripChoicePrefix(option));
        return optionBody === answerBody ||
          optionBody.includes(answerBody) ||
          answerBody.includes(optionBody);
      });
    }

    if (!matchingOption) {
      fail(
        assignmentId,
        'manifest ' + expectedKey + ' (\"' + answer + '\") does not match any option for Lesen question ' + (index + 1),
      );
    }
  });

  const sheetId = extractSpreadsheetId(entry.sheet_url || "");
  const answerSheetId = extractSpreadsheetId(entry.answer_url || "");
  if (!sheetId) fail(assignmentId, "manifest has no valid sheet_url");
  if (!answerSheetId) fail(assignmentId, "manifest has no valid answer_url");
  if (sheetId && answerSheetId && sheetId !== answerSheetId) {
    fail(assignmentId, "sheet_url and answer_url point to different Google Sheets");
  }

  checks.push({
    assignmentId,
    fileName,
    questionCount: questions.length,
    expectedAnswers,
    sheetId,
    answerUrl: entry.answer_url,
  });
}

if (!checks.length) {
  console.error("No A2 Lesen workbooks were detected.");
  process.exit(1);
}

if (liveSheets) {
  for (const check of checks) {
    if (!check.sheetId || !check.answerUrl) continue;

    const csvUrl =
      "https://docs.google.com/spreadsheets/d/" +
      check.sheetId +
      "/gviz/tq?tqx=out:csv&sheet=Key";

    let response;
    try {
      response = await fetch(csvUrl, { redirect: "follow" });
    } catch (error) {
      fail(check.assignmentId, "Google Sheet fetch failed: " + error.message);
      continue;
    }

    if (!response.ok) {
      fail(check.assignmentId, "Google Sheet Key tab returned HTTP " + response.status);
      continue;
    }

    const text = await response.text();
    const rows = parseCsv(text);
    const headerIndex = rows.findIndex(
      (row) => normalize(row[0]) === "no" && normalize(row[1]) === "answer",
    );

    if (headerIndex < 0) {
      fail(check.assignmentId, "Google Sheet Key tab is missing the No. / Answer header");
      continue;
    }

    const liveAnswers = rows
      .slice(headerIndex + 1)
      .filter((row) => String(row[1] || "").trim())
      .map((row) => stripSheetRowPrefix(row[1]))
      .slice(0, check.expectedAnswers.length);

    if (liveAnswers.length !== check.expectedAnswers.length) {
      fail(
        check.assignmentId,
        "Google Sheet has only " + liveAnswers.length + " Lesen answers; expected " + check.expectedAnswers.length,
      );
      continue;
    }

    check.expectedAnswers.forEach((expected, index) => {
      const live = liveAnswers[index];
      if (normalize(live) !== normalize(expected)) {
        fail(
          check.assignmentId,
          'Google Sheet answer ' + (index + 1) + ' is \"' + live + '\" but manifest says \"' + expected + '\"',
        );
      }
    });
  }
}

console.log("A2 Lesen sync audit checked " + checks.length + " workbook(s).");
for (const warning of warnings) console.warn("WARN " + warning);

if (failures.length) {
  console.error("\nA2 Lesen answer sync failed:");
  for (const failure of failures) console.error("- " + failure);
  console.error("\nRequired invariant: Falowen Lesen page ↔ answerKeyManifest.json ↔ Google Sheet Key tab.");
  process.exit(1);
}

console.log(
  liveSheets
    ? "PASS Falowen Lesen pages, GitHub answer manifest, and publicly reachable Google Sheets are synchronized."
    : "PASS Falowen Lesen pages and GitHub answer manifest are synchronized (live Sheets check skipped).",
);
