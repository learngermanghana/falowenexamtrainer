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
  if (normalized === "demografischer wandel und generationengerechtigkeit") {
    return "Wie kann der demografische Wandel so gestaltet werden, dass Renten- und Pflegesystem langfristig finanzierbar bleiben, ohne jüngere oder ältere Generationen einseitig zu belasten?";
  }
  return \`Welche Chancen, Grenzen und Verantwortlichkeiten sind mit „\${title}“ verbunden, und welcher Umgang damit ist sinnvoll?\`;
};

const buildC1OpinionStructure = (title, topicContext) => {
  const normalized = String(title || "").trim().toLowerCase();
  if (normalized === "demografischer wandel und generationengerechtigkeit") {
    return [
      "Beschreiben Sie zunächst zwei zentrale Folgen des demografischen Wandels, zum Beispiel für das Rentensystem, die Pflege oder den Fachkräftemangel.",
      "Nehmen Sie zu einer konkreten Maßnahme Stellung, zum Beispiel zu einem höheren Renteneintrittsalter, Fachkräftezuwanderung oder stärkerer Familienförderung, und begründen Sie Ihre Position mit einem Beispiel.",
      "Gehen Sie auf einen Einwand oder eine Grenze Ihrer gewählten Maßnahme ein, zum Beispiel auf körperlich belastende Berufe, Integrationsprobleme oder zusätzliche staatliche Kosten.",
      "Schlagen Sie abschließend einen ausgewogenen Lösungsweg vor und erklären Sie, wie dadurch die Interessen jüngerer und älterer Generationen fair berücksichtigt werden können.",
    ];
  }
  return [
    \`Ordnen Sie die Leitfrage ein: Erklären Sie, welche Bedeutung „\${title}“ im Zusammenhang mit \${topicContext} hat und welche Verantwortung daraus entstehen kann.\`,
    \`Begründen Sie Ihre Position zur Leitfrage anhand eines konkreten Beispiels im Zusammenhang mit „\${title}“.\`,
    \`Prüfen Sie Ihre Position kritisch: Nennen Sie Gründe, Grenzen oder Einwände, die gegen eine zu starke Verantwortungszuschreibung beziehungsweise gegen eine einseitige Betrachtung sprechen.\`,
    \`Formulieren Sie aus Ihrer Abwägung einen ausgewogenen Lösungsweg und beantworten Sie die Leitfrage abschließend differenziert.\`,
  ];
};

const buildC1OpinionWriting = (title, topicContext) => {
  const leitfrage = buildC1OpinionQuestion(title);
  return {
  taskType: "C1 opinion essay / Stellungnahme",
  topic: \`Schreibaufgabe: Verfassen Sie eine C1-Stellungnahme zum Thema „\${title}“ mit 220–280 Wörtern. Leitfrage: \${leitfrage}\`,
  structure: buildC1OpinionStructure(title, topicContext),
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
} else {
  const demographicQuestionBefore = '  return `Welche Chancen, Grenzen und Verantwortlichkeiten sind mit „${title}“ verbunden, und welcher Umgang damit ist sinnvoll?`;';
  if (!source.includes('normalized === "demografischer wandel und generationengerechtigkeit"')) {
    source = source.replace(
      demographicQuestionBefore,
      '  if (normalized === "demografischer wandel und generationengerechtigkeit") {\n    return "Wie kann der demografische Wandel so gestaltet werden, dass Renten- und Pflegesystem langfristig finanzierbar bleiben, ohne jüngere oder ältere Generationen einseitig zu belasten?";\n  }\n' + demographicQuestionBefore
    );
  }
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Added explicit Leitfrage and connected bullets to C1 opinion-writing tasks.");
