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
  "web/src/components/C1Day27To28GuidedLessonPage.js",
  "web/src/components/C1Day27To28GrammarNotes.js",
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

const guidedLessonPath = path.join(
  repoRoot,
  "web/src/components/C1Day27To28GuidedLessonPage.js",
);

if (fs.existsSync(guidedLessonPath)) {
  const before = fs.readFileSync(guidedLessonPath, "utf8");
  let after = before;
  after = after.replace(
    '28: { title: "Demografischer Wandel und Generationengerechtigkeit: C1 sicher abschließen", intro: "Dieses Schlusskapitel wiederholt zentrale C1-Strukturen und trainiert Selbstkorrektur. Lernende übertragen Grammatik auf neue Themen und verbessern den roten Faden ihrer Antworten.", points: ["Wiederhole Verknüpfungen, Wortstellung, Passiv und Nominalstil.", "Korrigiere deine Antwort systematisch nach Struktur, Präzision und Logik.", "Eine starke C1-Antwort bleibt komplex, aber klar und kontrolliert."], vocabulary: ["der rote Faden", "Selbstkorrektur", "folgend", "dennoch", "präzise formulieren"] },',
    '28: { title: "Demografischer Wandel und Generationengerechtigkeit", intro: "Dieses C1-Kapitel untersucht die Folgen einer alternden Gesellschaft für Renten, Pflege, Arbeitsmarkt und öffentliche Finanzen. Ziel ist eine differenzierte Abwägung zwischen wirtschaftlicher Tragfähigkeit und fairer Verteilung zwischen den Generationen.", points: ["Erkläre Ursachen und Folgen des demografischen Wandels mit präzisen Ursache-Folge-Strukturen.", "Bewerte Maßnahmen wie Fachkräftezuwanderung, Familienförderung und ein höheres Renteneintrittsalter differenziert.", "Eine starke C1-Antwort berücksichtigt sowohl die Belastung jüngerer Generationen als auch die Lebens- und Arbeitsrealität älterer Menschen."], vocabulary: ["der demografische Wandel", "die Generationengerechtigkeit", "der Fachkräftemangel", "das Rentensystem", "der Pflegebedarf", "die Lebenserwartung"] },',
  );
  if (after !== before) fs.writeFileSync(guidedLessonPath, after);
}

const grammarPath = path.join(
  repoRoot,
  "web/src/components/C1Day27To28GrammarNotes.js",
);

if (fs.existsSync(grammarPath)) {
  const before = fs.readFileSync(grammarPath, "utf8");
  let after = before;
  after = after
    .replaceAll(
      "Review: Verknüpfungen, Wortstellung und Selbstkorrektur auf C1",
      "Ursache, Folge und Abwägung beim demografischen Wandel",
    )
    .replaceAll(
      "C1-Themen übertragen, Fehler erkennen und Antworten verbessern",
      "Demografische Entwicklungen präzise erklären und Generationengerechtigkeit differenziert bewerten",
    )
    .replaceAll(
      "Am Ende des Kurses geht es darum, Strukturen flexibel zu übertragen. Du solltest Argumente klar verbinden, Wortstellung kontrollieren und deine Antwort selbstständig verbessern können.",
      "Beim Thema demografischer Wandel musst du langfristige Ursachen und Folgen miteinander verknüpfen und politische Maßnahmen abwägen. Auf C1-Niveau helfen dir Nominalstil, Ursache-Folge-Strukturen und konzessive Formulierungen dabei, Renten, Pflege, Fachkräftemangel und Generationengerechtigkeit sachlich zu beurteilen.",
    );
  if (after !== before) fs.writeFileSync(grammarPath, after);
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
