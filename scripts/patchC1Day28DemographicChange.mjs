import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");

const NEW_TITLE = "Demografischer Wandel und Generationengerechtigkeit";
const NEW_TOPIC = "Demografischer Wandel, Generationengerechtigkeit, Rentensystem, Pflege und Fachkräftemangel";

const textTargets = [
  "shared/curriculumCanonical.json",
  "web/src/data/lessonCatalog.js",
  "functions/data/lessonCatalog.js",
  "web/src/data/courseSchedule.js",
  "functions/data/courseSchedule.js",
  "web/src/components/SelfLearningLessonRegistry.js",
  "web/public/classes/brochure.js",
];

for (const relativePath of textTargets) {
  const filePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(filePath)) continue;

  const before = fs.readFileSync(filePath, "utf8");
  const after = before
    .replaceAll("Review und Transfer", NEW_TITLE)
    .replaceAll(
      "C1-Themen wiederholen und auf neue Aufgaben übertragen",
      NEW_TOPIC,
    );

  if (after !== before) fs.writeFileSync(filePath, after);
}

const collocationPath = path.join(
  repoRoot,
  "web/src/components/C1TopicCollocationPractice.jsx",
);

if (fs.existsSync(collocationPath)) {
  const before = fs.readFileSync(collocationPath, "utf8");
  const oldBlock = `  28: { topic: "Review und Transfer", items: [
    ["sich beziehen auf + Akk", "to refer to", "Ein gutes Argument bezieht sich direkt auf die Aufgabenstellung."],
    ["abhängen von + Dat", "to depend on", "Die Qualität einer C1-Antwort hängt von Struktur und sprachlicher Präzision ab."],
    ["beitragen zu + Dat", "to contribute to", "Passende Kollokationen tragen zu einem natürlichen Ausdruck bei."],
    ["sich auswirken auf + Akk", "to affect", "Grammatische Fehler können sich auf die Verständlichkeit auswirken."],
  ]},`;
  const newBlock = `  28: { topic: "${NEW_TITLE}", items: [
    ["führen zu + Dat", "to lead to", "Eine alternde Bevölkerung kann zu einem höheren Pflegebedarf führen."],
    ["abhängen von + Dat", "to depend on", "Die langfristige Finanzierung des Rentensystems hängt von mehreren demografischen und wirtschaftlichen Faktoren ab."],
    ["beitragen zu + Dat", "to contribute to", "Gezielte Fachkräftezuwanderung kann zur Entlastung des Arbeitsmarktes beitragen."],
    ["sich auswirken auf + Akk", "to affect", "Der demografische Wandel wirkt sich auf Renten, Pflege, Arbeitsmarkt und öffentliche Haushalte aus."],
  ]},`;

  const after = before.includes(oldBlock)
    ? before.replace(oldBlock, newBlock)
    : before.replace('28: { topic: "Review und Transfer"', `28: { topic: "${NEW_TITLE}"`);

  if (after !== before) fs.writeFileSync(collocationPath, after);
}

console.log(`C1 Day 28 topic set to: ${NEW_TITLE}`);
