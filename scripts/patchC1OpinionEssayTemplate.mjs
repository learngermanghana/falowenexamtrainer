import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, "web/src/components/GuidedWritingWorkspace.js");
let source = fs.readFileSync(filePath, "utf8");

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

if (source.includes(newTemplate)) {
  console.log("The universal C1 opinion template is already applied.");
} else {
  if (!source.includes(oldTemplate)) {
    throw new Error("The existing C1 opinion template was not found.");
  }
  source = source.replace(oldTemplate, newTemplate);
  fs.writeFileSync(filePath, source, "utf8");
  console.log("Applied the universal C1 opinion template.");
}

const requiredMarkers = [
  "sowohl den Alltag vieler Menschen als auch gesellschaftliche Entwicklungen betrifft",
  "Darüber hinaus darf nicht außer Acht gelassen werden",
  "Dieser Einwand ist insofern nachvollziehbar, als",
  "Dadurch könnten unterschiedliche Interessen berücksichtigt und mögliche Nachteile begrenzt werden",
  "weder ausschließlich positiv noch grundsätzlich negativ bewertet werden sollte",
  "sowohl praktikabel als auch langfristig sinnvoll ist",
];

const updated = fs.readFileSync(filePath, "utf8");
for (const marker of requiredMarkers) {
  if (!updated.includes(marker)) {
    throw new Error(`C1 opinion template marker missing: ${marker}`);
  }
}

console.log("C1 opinion template validation passed.");
