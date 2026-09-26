#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const MANIFEST_PATH = path.join(ROOT, "functions", "data", "answerKeyManifest.json");
const READING_TASKS_PATH = path.join(ROOT, "web", "src", "data", "a2ReadingTasks.js");

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

const stripChoicePrefix = (value = "") =>
  String(value)
    .replace(/^\s*\d+\.\s*/, "")
    .replace(/^\s*[a-z]\s*[).:-]\s*/i, "")
    .trim();

const choiceLetter = (value = "") => {
  const match = String(value)
    .replace(/^\s*\d+\.\s*/, "")
    .match(/^\s*([a-z])\s*[).:-]\s*/i);
  return match ? match[1].toUpperCase() : "";
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

const { A2_READING_TASKS } = await import(pathToFileURL(READING_TASKS_PATH).href);
const failures = [];
const checks = [];

const fail = (assignmentId, message) => failures.push(assignmentId + ": " + message);

const days = Object.keys(A2_READING_TASKS).map(Number).sort((a, b) => a - b);
if (days.length !== 28 || days.some((day, index) => day !== index + 1)) {
  console.error("A2 reading source must contain exactly Days 1–28.");
  process.exit(1);
}

for (const day of days) {
  const task = A2_READING_TASKS[day];
  const assignmentId = ("A2-" + task.chapter).toUpperCase();
  const questions = task.questions;

  if (!task.title || !task.text || !task.format || !task.strategy) {
    fail(assignmentId, "reading task is missing title, text, format or strategy");
    continue;
  }
  if (!Array.isArray(questions) || questions.length !== 5) {
    fail(assignmentId, "Lesen must contain exactly 5 questions; found " + (questions?.length || 0));
    continue;
  }

  const entry = manifestByAssignmentId.get(assignmentId);
  if (!entry) {
    fail(assignmentId, "missing from functions/data/answerKeyManifest.json");
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
      "canonical Lesen has " + questions.length + " questions but manifest teil3 has " + expectedAnswers.length + " answers",
    );
  }

  questions.forEach((question, index) => {
    if (!question?.stem || !Array.isArray(question.options) || question.options.length < 3) {
      fail(assignmentId, "question " + (index + 1) + " is missing a stem or usable options");
      return;
    }

    const answer = readingAnswers["Answer" + (index + 1)];
    if (!answer) {
      fail(assignmentId, "manifest is missing Answer" + (index + 1));
      return;
    }

    const letter = choiceLetter(answer);
    const body = normalize(stripChoicePrefix(answer));
    const matchingOption = question.options.find((option) => {
      const optionLetter = choiceLetter(option);
      const optionBody = normalize(stripChoicePrefix(option));
      if (letter && optionLetter !== letter) return false;
      return optionBody === body;
    });

    if (!matchingOption) {
      fail(
        assignmentId,
        'manifest Answer' + (index + 1) + ' ("' + answer + '") does not exactly match the same-letter current option',
      );
    }
  });

  checks.push({ assignmentId, day, questions: questions.length });
}

console.log("A2 Lesen sync audit checked " + checks.length + " canonical day(s).");

if (failures.length) {
  console.error("\nA2 Lesen answer sync failed:");
  for (const failure of failures) console.error("- " + failure);
  console.error("\nRequired invariant: canonical A2 Lesen task ↔ answerKeyManifest.json ↔ master Google answers sheet.");
  process.exit(1);
}

console.log("PASS canonical A2 Lesen tasks and GitHub answer manifest are synchronized.");
