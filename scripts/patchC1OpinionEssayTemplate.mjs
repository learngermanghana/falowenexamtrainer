import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, "web/src/components/GuidedWritingWorkspace.js");
let source = fs.readFileSync(filePath, "utf8");
let changed = false;

const oldTemplate = `export const C1_OPINION_ESSAY_TEMPLATE = \`C1 OPINION ESSAY · Use this for Meinungsbeitrag, Stellungnahme or argument writing

INTRODUCTION
In der heutigen Zeit wird häufig über [Thema] diskutiert.

Meiner Meinung nach ist dieses Thema von großer Bedeutung, da es sowohl [Aspekt 1] als auch [Aspekt 2] betrifft.

Im Folgenden werde ich zunächst die Vorteile erläutern, anschließend auf mögliche Einwände eingehen und schließlich eine ausgewogene Lösung vorstellen.

ADVANTAGES
Einerseits bietet [Thema] zahlreiche Vorteile. Ein wesentlicher Vorteil besteht darin, dass [Vorteil / Begründung]. Darüber hinaus sollte berücksichtigt werden, dass [weiterer Vorteil oder Beispiel].

DISADVANTAGES
Andererseits sollte berücksichtigt werden, dass [Nachteil / Problem]. Dies kann beispielsweise dazu führen, dass [Folge oder konkretes Beispiel].

COUNTERARGUMENT
Natürlich gibt es auch andere Meinungen. Einige Menschen vertreten die Auffassung, dass [Gegenargument].

OWN POSITION
Dennoch bin ich der Auffassung, dass [eigene Position stärken und begründen].

PROPOSED SOLUTION
Eine mögliche Lösung beziehungsweise Alternative bestünde darin, [Vorschlag oder Maßnahme]. Auf diese Weise könnten sowohl [Interesse 1] als auch [Interesse 2] angemessen berücksichtigt werden.

CONCLUSION
Zusammenfassend lässt sich sagen, dass [kurzes Fazit und eigene Position].

OPTIONAL UNIVERSAL CLOSING SENTENCES
1. Letztlich kommt es darauf an, eine ausgewogene Lösung zu finden, die sowohl die Bedürfnisse des Einzelnen als auch die Interessen der Gesellschaft berücksichtigt.

2. Nur durch einen verantwortungsvollen und differenzierten Umgang mit diesem Thema können langfristig positive Ergebnisse erzielt werden.\`;`;

const newTemplate = `export const C1_OPINION_ESSAY_TEMPLATE = \`C1 OPINION ESSAY · Use this for Meinungsbeitrag, Stellungnahme or argument writing

INTRODUCTION
In der heutigen Zeit wird häufig über [Thema] diskutiert. Meiner Meinung nach ist dieses Thema von großer Bedeutung, da es sowohl den Alltag vieler Menschen als auch gesellschaftliche Entwicklungen betrifft.

Im Folgenden werde ich zunächst die Vorteile erläutern, anschließend auf mögliche Einwände eingehen und schließlich eine ausgewogene Lösung vorstellen.

ADVANTAGES
Einerseits bietet [Thema] zahlreiche Vorteile. Ein wesentlicher Vorteil besteht darin, dass [Vorteil / Begründung]. Darüber hinaus darf nicht außer Acht gelassen werden, dass [weiterer Vorteil oder konkretes Beispiel].

DISADVANTAGES
Andererseits sollte berücksichtigt werden, dass [Nachteil / Problem]. Dies kann insbesondere dann problematisch sein, wenn [Bedingung, Folge oder konkretes Beispiel].

COUNTERARGUMENT
Natürlich gibt es auch andere Meinungen. Einige Menschen vertreten die Auffassung, dass [Gegenargument]. Dieser Einwand ist insofern nachvollziehbar, als [kurze Einräumung].

OWN POSITION
Dennoch bin ich der Auffassung, dass [eigene Position], weil [Begründung]. Entscheidend ist dabei, dass [Bedingung oder Abwägung].

PROPOSED SOLUTION
Eine ausgewogene Lösung bestünde darin, [Vorschlag oder Maßnahme]. Dadurch könnten unterschiedliche Interessen berücksichtigt und mögliche Nachteile begrenzt werden.

CONCLUSION
Zusammenfassend lässt sich sagen, dass [Thema] weder ausschließlich positiv noch grundsätzlich negativ bewertet werden sollte. Vielmehr kommt es darauf an, die verschiedenen Perspektiven sorgfältig abzuwägen und eine Lösung zu finden, die sowohl praktikabel als auch langfristig sinnvoll ist.\`;`;

if (!source.includes(newTemplate)) {
  if (!source.includes(oldTemplate)) {
    throw new Error("The existing C1 opinion template was not found.");
  }
  source = source.replace(oldTemplate, newTemplate);
  changed = true;
}

const migrationBlock = [
  "",
  "export const LEGACY_C1_OPINION_ESSAY_TEMPLATE = `C1 OPINION ESSAY · Use this for Meinungsbeitrag, Stellungnahme or argument writing",
  "",
  "INTRODUCTION",
  "In der heutigen Zeit wird häufig über [Thema] diskutiert.",
  "",
  "Meiner Meinung nach ist dieses Thema von großer Bedeutung, da es sowohl [Aspekt 1] als auch [Aspekt 2] betrifft.",
  "",
  "Im Folgenden werde ich zunächst die Vorteile erläutern, anschließend auf mögliche Einwände eingehen und schließlich eine ausgewogene Lösung vorstellen.",
  "",
  "ADVANTAGES",
  "Einerseits bietet [Thema] zahlreiche Vorteile. Ein wesentlicher Vorteil besteht darin, dass [Vorteil / Begründung]. Darüber hinaus sollte berücksichtigt werden, dass [weiterer Vorteil oder Beispiel].",
  "",
  "DISADVANTAGES",
  "Andererseits sollte berücksichtigt werden, dass [Nachteil / Problem]. Dies kann beispielsweise dazu führen, dass [Folge oder konkretes Beispiel].",
  "",
  "COUNTERARGUMENT",
  "Natürlich gibt es auch andere Meinungen. Einige Menschen vertreten die Auffassung, dass [Gegenargument].",
  "",
  "OWN POSITION",
  "Dennoch bin ich der Auffassung, dass [eigene Position stärken und begründen].",
  "",
  "PROPOSED SOLUTION",
  "Eine mögliche Lösung beziehungsweise Alternative bestünde darin, [Vorschlag oder Maßnahme]. Auf diese Weise könnten sowohl [Interesse 1] als auch [Interesse 2] angemessen berücksichtigt werden.",
  "",
  "CONCLUSION",
  "Zusammenfassend lässt sich sagen, dass [kurzes Fazit und eigene Position].",
  "",
  "OPTIONAL UNIVERSAL CLOSING SENTENCES",
  "1. Letztlich kommt es darauf an, eine ausgewogene Lösung zu finden, die sowohl die Bedürfnisse des Einzelnen als auch die Interessen der Gesellschaft berücksichtigt.",
  "",
  "2. Nur durch einen verantwortungsvollen und differenzierten Umgang mit diesem Thema können langfristig positive Ergebnisse erzielt werden.`;",
  "",
  "const normalizeTemplateDraft = (value = \"\") =>",
  "  String(value || \"\").replace(/\\r\\n/g, \"\\n\").trim();",
  "",
  "export const migrateC1OpinionTemplateDraft = ({",
  "  text = \"\",",
  "  level = \"\",",
  "  opinionMode = false,",
  "  template = C1_OPINION_ESSAY_TEMPLATE,",
  "} = {}) => {",
  "  const draft = String(text || \"\");",
  "  const isC1 = String(level || \"\").trim().toUpperCase() === \"C1\";",
  "  if (!opinionMode || !isC1) return draft;",
  "",
  "  return normalizeTemplateDraft(draft) === normalizeTemplateDraft(LEGACY_C1_OPINION_ESSAY_TEMPLATE)",
  "    ? template || C1_OPINION_ESSAY_TEMPLATE",
  "    : draft;",
  "};",
  "",
].join("\n");

const migrationAnchor = "\nconst PLANNING_NOTES_PLACEHOLDER =";
if (!source.includes("export const migrateC1OpinionTemplateDraft")) {
  if (!source.includes(migrationAnchor)) {
    throw new Error("The C1 opinion template migration anchor was not found.");
  }
  source = source.replace(migrationAnchor, `${migrationBlock}${migrationAnchor}`);
  changed = true;
}

const oldFinalEssayBlock = `  const finalEssay = singleBoxMode
    ? (state.finalEssay || autoText || templateText)
    : state.combinedDraftMode === "auto" ? autoText : state.finalEssay;`;

const newFinalEssayBlock = `  const storedFinalEssay = migrateC1OpinionTemplateDraft({
    text: state.finalEssay,
    level: config.level,
    opinionMode,
    template: templateText,
  });
  const finalEssay = singleBoxMode
    ? (storedFinalEssay || autoText || templateText)
    : state.combinedDraftMode === "auto" ? autoText : state.finalEssay;`;

if (!source.includes(newFinalEssayBlock)) {
  if (!source.includes(oldFinalEssayBlock)) {
    throw new Error("The guided-writing final essay block was not found.");
  }
  source = source.replace(oldFinalEssayBlock, newFinalEssayBlock);
  changed = true;
}

if (changed) {
  fs.writeFileSync(filePath, source, "utf8");
  console.log("Applied the universal C1 opinion template and saved-draft migration.");
} else {
  console.log("The universal C1 opinion template and saved-draft migration are already applied.");
}

const requiredMarkers = [
  "sowohl den Alltag vieler Menschen als auch gesellschaftliche Entwicklungen betrifft",
  "Darüber hinaus darf nicht außer Acht gelassen werden",
  "Dieser Einwand ist insofern nachvollziehbar, als",
  "Dadurch könnten unterschiedliche Interessen berücksichtigt und mögliche Nachteile begrenzt werden",
  "weder ausschließlich positiv noch grundsätzlich negativ bewertet werden sollte",
  "sowohl praktikabel als auch langfristig sinnvoll ist",
  "export const migrateC1OpinionTemplateDraft",
  "const storedFinalEssay = migrateC1OpinionTemplateDraft",
];

const updated = fs.readFileSync(filePath, "utf8");
for (const marker of requiredMarkers) {
  if (!updated.includes(marker)) {
    throw new Error(`C1 opinion template marker missing: ${marker}`);
  }
}

console.log("C1 opinion template validation passed.");
