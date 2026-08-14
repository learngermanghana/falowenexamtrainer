import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/data/selfLearningLessons/buildSelfLearningLesson.js");
let source = fs.readFileSync(targetPath, "utf8");

const current = `const buildC1OpinionWriting = (title, topicContext) => ({
  taskType: "C1 opinion essay / Stellungnahme",
  topic: \`Schreibaufgabe: Verfassen Sie eine C1-Stellungnahme zum Thema „\${title}“ mit 220–280 Wörtern.\`,
  structure: [
    \`Erklären Sie, welche Bedeutung „\${title}“ im Zusammenhang mit \${topicContext} hat.\`,
    \`Argumentieren Sie anhand eines konkreten Beispiels für oder im Zusammenhang mit „\${title}“.\`,
    \`Nennen Sie Gründe oder Einwände, die gegen „\${title}“ beziehungsweise gegen eine einseitige Betrachtung sprechen könnten.\`,
    \`Erläutern Sie eine Alternative oder einen ausgewogenen Lösungsweg im Umgang mit „\${title}“.\`,
  ],
  usefulLines: [`;

const replacement = `const buildC1OpinionQuestion = (title = "") => {
  const normalized = String(title || "").trim().toLowerCase();
  if (normalized === "nachhaltiger konsum") {
    return "Inwieweit sollten Verbraucherinnen und Verbraucher stärker Verantwortung für nachhaltigen Konsum übernehmen, und wo liegen die Grenzen dieser Verantwortung?";
  }
  return \`Welche Chancen, Grenzen und Verantwortlichkeiten sind mit „\${title}“ verbunden, und welcher Umgang damit ist sinnvoll?\`;
};

const buildC1OpinionWriting = (title, topicContext) => {
  const leitfrage = buildC1OpinionQuestion(title);
  return {
  taskType: "C1 opinion essay / Stellungnahme",
  topic: \`Schreibaufgabe: Verfassen Sie eine C1-Stellungnahme zum Thema „\${title}“ mit 220–280 Wörtern. Leitfrage: \${leitfrage}\`,
  structure: [
    \`Ordnen Sie die Leitfrage ein: Erklären Sie, welche Bedeutung „\${title}“ im Zusammenhang mit \${topicContext} hat und welche Verantwortung daraus entstehen kann.\`,
    \`Begründen Sie Ihre Position zur Leitfrage anhand eines konkreten Beispiels im Zusammenhang mit „\${title}“.\`,
    \`Prüfen Sie Ihre Position kritisch: Nennen Sie Gründe, Grenzen oder Einwände, die gegen eine zu starke Verantwortungszuschreibung beziehungsweise gegen eine einseitige Betrachtung sprechen.\`,
    \`Formulieren Sie aus Ihrer Abwägung einen ausgewogenen Lösungsweg und beantworten Sie die Leitfrage abschließend differenziert.\`,
  ],
  usefulLines: [`;

if (!source.includes("const buildC1OpinionQuestion =")) {
  if (!source.includes(current)) throw new Error("Could not find standardized C1 opinion-writing builder anchor.");
  source = source.replace(current, replacement);
  const closeAnchor = `  ],\n});\n\nconst buildB2OpinionWriting`;
  const closeReplacement = `  ],\n  };\n};\n\nconst buildB2OpinionWriting`;
  const start = source.indexOf("const buildC1OpinionQuestion =");
  const closeIndex = source.indexOf(closeAnchor, start);
  if (closeIndex < 0) throw new Error("Could not close explicit C1 opinion-writing builder.");
  source = source.slice(0, closeIndex) + source.slice(closeIndex).replace(closeAnchor, closeReplacement);
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Added explicit Leitfrage and connected bullets to C1 opinion-writing tasks.");
