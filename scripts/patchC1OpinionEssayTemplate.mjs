import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, "web/src/components/GuidedWritingWorkspace.js");
let source = fs.readFileSync(filePath, "utf8");
let changed = false;

const legacyTemplateV1 = `export const C1_OPINION_ESSAY_TEMPLATE = \`C1 OPINION ESSAY · Use this for Meinungsbeitrag, Stellungnahme or argument writing

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

const legacyTemplateV2 = `export const C1_OPINION_ESSAY_TEMPLATE = \`C1 OPINION ESSAY · Use this for Meinungsbeitrag, Stellungnahme or argument writing

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

const approvedTemplate = `export const C1_OPINION_ESSAY_TEMPLATE = \`[Fragestellung / Titel]

In der heutigen Zeit wird häufig über [Thema] diskutiert. Meiner Meinung nach ist dieses Thema von großer Bedeutung, da es sowohl [Akteur oder Gruppe 1] als auch [Akteur oder Gruppe 2] betrifft. [Thema] kann nicht nur [positive Funktion], sondern auch [weitere Wirkung]. Im Folgenden werde ich zunächst die Vorteile erläutern, anschließend auf mögliche Einwände eingehen und schließlich eine ausgewogene Lösung vorstellen.

Einerseits bietet [Thema] zahlreiche Vorteile. Ein wesentlicher Vorteil besteht darin, dass [vollständiger Vorteil für Akteur oder Gruppe 1] und [vollständiger Vorteil für Akteur oder Gruppe 2]. Ein gutes Beispiel hierfür ist [konkretes Beispiel]. Wer beispielsweise [Situation oder Handlung] und anschließend [relevante Information, Angebot oder Reaktion] erhält, [mögliche Wirkung oder Entscheidung].

Andererseits sollte berücksichtigt werden, dass [Risiko oder Problem], insbesondere wenn [Bedingung oder Situation]. Deshalb sind [Schutzprinzip 1] und [Schutzprinzip 2] von entscheidender Bedeutung.

Natürlich gibt es auch andere Meinungen. Einige Menschen sind der Ansicht, dass [Gegenargument]. Ein Beispiel hierfür ist [konkretes Beispiel für den Einwand]. Besonders [betroffene Personen oder Institutionen] verfügen häufig über [Stärke oder Voraussetzung], jedoch nicht über ausreichende [Ressource 1] oder [Ressource 2], um [Anforderung oder Folge] zu erfüllen.

Dennoch bin ich der Auffassung, dass [Akteur 1], [Akteur 2] sowie [Akteur 3] gleichermaßen eine wichtige Verantwortung tragen. [Akteur 1] sollte [Maßnahme 1], die sowohl [Interesse oder Schutz 1] als auch [Interesse oder Schutz 2] berücksichtigt. [Akteur 2] sollte [Maßnahme 2] und vor [relevanter Handlung] [Schutzmaßnahme oder Einwilligung] einholen. Gleichzeitig sollten [Akteur 3] [eigene Verantwortung oder Maßnahme 3].

Zusammenfassend lässt sich sagen, dass [Thema] sowohl Chancen als auch Risiken mit sich bringt. Aus diesem Grund sollte [Thema] weder [extreme Position 1] noch [extreme Position 2] werden. Stattdessen ist ein ausgewogenes System erforderlich, das [Aspekt 1], [Aspekt 2], [Aspekt 3] und [Aspekt 4] miteinander verbindet.\`;`;

if (!source.includes(approvedTemplate)) {
  const replaceableTemplate = [legacyTemplateV2, legacyTemplateV1].find((template) =>
    source.includes(template),
  );
  if (!replaceableTemplate) {
    throw new Error("A supported C1 opinion template was not found.");
  }
  source = source.replace(replaceableTemplate, approvedTemplate);
  changed = true;
}

const getTemplateBody = (declaration) => {
  const start = declaration.indexOf("`");
  const end = declaration.lastIndexOf("`;");
  if (start < 0 || end <= start) throw new Error("Could not read a legacy template body.");
  return declaration.slice(start + 1, end);
};

const legacyTemplateBodies = [legacyTemplateV1, legacyTemplateV2].map(getTemplateBody);
const migrationBlock = `
export const LEGACY_C1_OPINION_ESSAY_TEMPLATES = ${JSON.stringify(legacyTemplateBodies, null, 2)};

const normalizeTemplateDraft = (value = "") =>
  String(value || "").replace(/\\r\\n/g, "\\n").trim();

export const migrateC1OpinionTemplateDraft = ({
  text = "",
  level = "",
  opinionMode = false,
  template = C1_OPINION_ESSAY_TEMPLATE,
} = {}) => {
  const draft = String(text || "");
  const isC1 = String(level || "").trim().toUpperCase() === "C1";
  if (!opinionMode || !isC1) return draft;

  const normalizedDraft = normalizeTemplateDraft(draft);
  const isUntouchedLegacyTemplate = LEGACY_C1_OPINION_ESSAY_TEMPLATES.some(
    (legacyTemplate) => normalizedDraft === normalizeTemplateDraft(legacyTemplate),
  );

  return isUntouchedLegacyTemplate
    ? template || C1_OPINION_ESSAY_TEMPLATE
    : draft;
};
`;

const migrationAnchor = "\nconst PLANNING_NOTES_PLACEHOLDER =";
const migrationStartMarkers = [
  "\nexport const LEGACY_C1_OPINION_ESSAY_TEMPLATES =",
  "\nexport const LEGACY_C1_OPINION_ESSAY_TEMPLATE =",
];
const migrationStart = migrationStartMarkers
  .map((marker) => source.indexOf(marker))
  .filter((index) => index >= 0)
  .sort((a, b) => a - b)[0];

if (Number.isInteger(migrationStart)) {
  const migrationEnd = source.indexOf(migrationAnchor, migrationStart);
  if (migrationEnd < 0) throw new Error("The existing C1 template migration block is incomplete.");
  const existingMigrationBlock = source.slice(migrationStart, migrationEnd);
  if (existingMigrationBlock !== migrationBlock) {
    source = source.slice(0, migrationStart) + migrationBlock + source.slice(migrationEnd);
    changed = true;
  }
} else {
  if (!source.includes(migrationAnchor)) {
    throw new Error("The C1 opinion template migration anchor was not found.");
  }
  source = source.replace(migrationAnchor, `${migrationBlock}${migrationAnchor}`);
  changed = true;
}

const oldFinalEssayBlock = `  const finalEssay = singleBoxMode
    ? (state.finalEssay || autoText || templateText)
    : state.combinedDraftMode === "auto" ? autoText : state.finalEssay;`;

const migratedFinalEssayBlock = `  const storedFinalEssay = migrateC1OpinionTemplateDraft({
    text: state.finalEssay,
    level: config.level,
    opinionMode,
    template: templateText,
  });
  const finalEssay = singleBoxMode
    ? (storedFinalEssay || autoText || templateText)
    : state.combinedDraftMode === "auto" ? autoText : state.finalEssay;`;

if (!source.includes(migratedFinalEssayBlock)) {
  if (!source.includes(oldFinalEssayBlock)) {
    throw new Error("The guided-writing final essay block was not found.");
  }
  source = source.replace(oldFinalEssayBlock, migratedFinalEssayBlock);
  changed = true;
}

if (changed) {
  fs.writeFileSync(filePath, source, "utf8");
  console.log("Applied the approved topic-neutral C1 opinion essay template.");
} else {
  console.log("The approved C1 opinion essay template is already applied.");
}

const requiredMarkers = [
  "[Fragestellung / Titel]",
  "[Thema] kann nicht nur [positive Funktion], sondern auch [weitere Wirkung]",
  "Ein gutes Beispiel hierfür ist [konkretes Beispiel]",
  "Deshalb sind [Schutzprinzip 1] und [Schutzprinzip 2] von entscheidender Bedeutung",
  "gleichermaßen eine wichtige Verantwortung tragen",
  "sowohl Chancen als auch Risiken mit sich bringt",
  "weder [extreme Position 1] noch [extreme Position 2]",
  "LEGACY_C1_OPINION_ESSAY_TEMPLATES.some",
  "const storedFinalEssay = migrateC1OpinionTemplateDraft",
];

const updated = fs.readFileSync(filePath, "utf8");
for (const marker of requiredMarkers) {
  if (!updated.includes(marker)) {
    throw new Error(`C1 opinion template marker missing: ${marker}`);
  }
}

console.log("C1 opinion template validation passed.");
