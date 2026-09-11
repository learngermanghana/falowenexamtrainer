import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEW_TOPIC = "Countries, Languages & Travel";
const NEW_GOAL = "Talk about countries, languages, cities and travel using wo, woher and wohin; use nach/in for destinations; recognize sein and haben in the Präteritum; and review irregular verbs plus man vs Mann.";
const NEW_GRAMMAR_TOPIC = "wo, woher, wohin; nach vs in; sein/haben in Präteritum; irregular verbs; man vs Mann";

const replaceOnce = (relativePath, before, after, label) => {
  const targetPath = path.join(root, relativePath);
  let source = fs.readFileSync(targetPath, "utf8");

  if (source.includes(after)) return;
  if (!source.includes(before)) {
    throw new Error(`Could not align A1 Day 8 ${label}: source anchor was not found in ${relativePath}.`);
  }

  source = source.replace(before, after);
  fs.writeFileSync(targetPath, source, "utf8");
};

const oldScheduleEntry = `    {\n      day: 8,\n      topic: "Countries and Languages",\n      chapter: "4",\n      goal: "Learn about schon mal, noch nie, irregular verbs, and man vs Mann",\n      instruction: "Watch the video, review grammar, and complete your workbook.",\n      grammar_topic: "schon mal, noch nie; irregular verbs; man vs Mann",`;
const newScheduleEntry = `    {\n      day: 8,\n      topic: "${NEW_TOPIC}",\n      chapter: "4",\n      goal: "${NEW_GOAL}",\n      instruction: "Watch the video, review grammar, and complete your workbook.",\n      grammar_topic: "${NEW_GRAMMAR_TOPIC}",`;

[
  "web/src/data/courseSchedule.js",
  "functions/data/courseSchedule.js",
].forEach((relativePath) => {
  replaceOnce(relativePath, oldScheduleEntry, newScheduleEntry, "course schedule metadata");
});

const oldCatalogTitle = `    "id": "A1-4",\n    "level": "A1",\n    "sequence": 11,\n    "day": 8,\n    "chapter": "4",\n    "title": "Countries and Languages",`;
const newCatalogTitle = `    "id": "A1-4",\n    "level": "A1",\n    "sequence": 11,\n    "day": 8,\n    "chapter": "4",\n    "title": "${NEW_TOPIC}",`;

replaceOnce(
  "shared/curriculumCanonical.json",
  oldCatalogTitle,
  newCatalogTitle,
  "canonical curriculum title",
);

[
  "web/src/data/lessonCatalog.js",
  "functions/data/lessonCatalog.js",
].forEach((relativePath) => {
  replaceOnce(relativePath, oldCatalogTitle, newCatalogTitle, "generated lesson catalog title");
});

replaceOnce(
  "web/src/data/a1AssignmentRegistry.js",
  `["A1-4", 8, "4", "Countries and Languages", "/campus/course/a1-day-8-countries-and-languages-workbook", "A1Day8CountriesAndLanguagesWorkbookPage",`,
  `["A1-4", 8, "4", "${NEW_TOPIC}", "/campus/course/a1-day-8-countries-and-languages-workbook", "A1Day8CountriesAndLanguagesWorkbookPage",`,
  "assignment registry title",
);

replaceOnce(
  "web/src/components/FormingBasicStatementsPage.js",
  `        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Practice Book – Day 8</h1>\n        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>\n          Topic: countries, cities, direction words, and simple past forms with{" "}\n          <strong>sein</strong> and <strong>haben</strong>.\n        </p>`,
  `        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Grammar – Day 8: ${NEW_TOPIC}</h1>\n        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>\n          Countries, cities and travel: <strong>wo</strong>, <strong>woher</strong>, <strong>wohin</strong>;\n          <strong> nach</strong> vs <strong>in</strong>; Präteritum of <strong>sein</strong> and <strong>haben</strong>;\n          irregular verbs; and <strong>man</strong> vs <strong>Mann</strong>.\n        </p>`,
  "grammar page heading",
);

replaceOnce(
  "web/src/components/FormingBasicStatementsPage.js",
  `          <strong>Important:</strong> Today we focus on <strong>Präteritum</strong>.`,
  `          <strong>Important:</strong> Today we connect country and travel language with location and direction questions, plus a first look at <strong>Präteritum</strong>.`,
  "grammar overview focus",
);

replaceOnce(
  "web/src/components/A1Day8CountriesAndLanguagesWorkbookPage.js",
  `      title="A1 · Day 8 Workbook · Countries and Languages"`,
  `      title="A1 · Day 8 Workbook · ${NEW_TOPIC}"`,
  "workbook heading",
);

const verificationTargets = [
  ["web/src/data/courseSchedule.js", `topic: "${NEW_TOPIC}"`],
  ["web/src/data/courseSchedule.js", `grammar_topic: "${NEW_GRAMMAR_TOPIC}"`],
  ["functions/data/courseSchedule.js", `topic: "${NEW_TOPIC}"`],
  ["functions/data/courseSchedule.js", `grammar_topic: "${NEW_GRAMMAR_TOPIC}"`],
  ["shared/curriculumCanonical.json", `"title": "${NEW_TOPIC}"`],
  ["web/src/data/lessonCatalog.js", `"title": "${NEW_TOPIC}"`],
  ["functions/data/lessonCatalog.js", `"title": "${NEW_TOPIC}"`],
  ["web/src/data/a1AssignmentRegistry.js", `"A1-4", 8, "4", "${NEW_TOPIC}"`],
  ["web/src/components/FormingBasicStatementsPage.js", `A1 Grammar – Day 8: ${NEW_TOPIC}`],
  ["web/src/components/A1Day8CountriesAndLanguagesWorkbookPage.js", `A1 · Day 8 Workbook · ${NEW_TOPIC}`],
];

verificationTargets.forEach(([relativePath, marker]) => {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  if (!source.includes(marker)) {
    throw new Error(`A1 Day 8 topic alignment marker missing from ${relativePath}: ${marker}`);
  }
});

[
  "web/src/data/courseSchedule.js",
  "functions/data/courseSchedule.js",
].forEach((relativePath) => {
  const scheduleSource = fs.readFileSync(path.join(root, relativePath), "utf8");
  if (scheduleSource.includes('goal: "Learn about schon mal, noch nie, irregular verbs, and man vs Mann"')) {
    throw new Error(`A1 Day 8 still contains the stale schon mal / noch nie goal in ${relativePath}.`);
  }
});

console.log(`A1 Day 8 topic aligned to: ${NEW_TOPIC}. Web and Functions projections are synchronized; existing lesson/workbook URLs are preserved.`);
