import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspacePath = path.join(root, "web/src/components/GuidedWritingWorkspace.js");
let source = fs.readFileSync(workspacePath, "utf8");

const oldTemplate = `export const C1_OPINION_ESSAY_TEMPLATE = \`In der heutigen Zeit wird häufig über [Thema] diskutiert. Meiner Meinung nach ist dieses Thema von großer Bedeutung, da es sowohl [Bereich 1] als auch [Bereich 2] betrifft. Im Folgenden werde ich zunächst die Vorteile erläutern, anschließend auf mögliche Einwände eingehen und schließlich eine ausgewogene Lösung vorstellen.

Einerseits bietet [Thema] zahlreiche Vorteile. Ein wesentlicher Vorteil besteht darin, dass [Vorteil und Erklärung].

Andererseits sollte berücksichtigt werden, dass [Nachteil oder Problem].

Natürlich gibt es auch andere Meinungen. Einige Menschen sind der Ansicht, dass [Gegenargument].

Dennoch bin ich der Auffassung, dass [eigene Position mit Begründung].

Zusammenfassend lässt sich sagen, dass [Thema] sowohl Chancen als auch Herausforderungen mit sich bringt. Meines Erachtens kommt es darauf an, die Vorteile sinnvoll zu nutzen und gleichzeitig mögliche negative Folgen zu begrenzen. Daher wäre es empfehlenswert, [konkrete Maßnahme oder ausgewogene Lösung]. Auf diese Weise könnte langfristig ein angemessener Ausgleich zwischen [Aspekt 1] und [Aspekt 2] geschaffen werden.\`;`;

const newTemplate = `export const C1_OPINION_ESSAY_TEMPLATE = \`In der heutigen Zeit wird häufig über [Thema] diskutiert. Dieses Thema ist von großer gesellschaftlicher Bedeutung, da es sowohl [Bereich 1] als auch [Bereich 2] betrifft. Im Folgenden werde ich zunächst erläutern, nach welchen Kriterien [Entscheidung oder Maßnahme] beurteilt werden sollte. Anschließend werde ich anhand eines konkreten Beispiels argumentieren, mögliche Einwände darstellen und schließlich eine Alternative erläutern.

Bei der Beurteilung von [Thema] sollten mehrere Kriterien berücksichtigt werden. Von besonderer Bedeutung ist zunächst [Kriterium 1], da [Begründung]. Darüber hinaus spielt [Kriterium 2] eine entscheidende Rolle, weil [Begründung].

Ein anschauliches Beispiel hierfür ist [Beispiel]. In diesem Fall zeigt sich, dass [Erklärung des Beispiels]. Dadurch wird deutlich, dass [Schlussfolgerung].

Dennoch gibt es auch Gründe, die gegen [Maßnahme oder Entscheidung] sprechen könnten. Ein wesentlicher Einwand besteht darin, dass [Gegenargument 1]. Außerdem darf nicht außer Acht gelassen werden, dass [Gegenargument 2].

Eine mögliche Alternative bestünde darin, [Alternative]. Im Gegensatz zu [ursprünglicher Maßnahme] hätte diese Lösung den Vorteil, dass [Vorteil der Alternative]. Voraussetzung dafür wäre allerdings, dass [Bedingung].

Zusammenfassend lässt sich festhalten, dass [Thema] differenziert betrachtet werden muss. Meines Erachtens ist [eigene Position] sinnvoll, sofern [Bedingung]. Statt ausschließlich auf [eine Lösung] zu setzen, sollte ein ausgewogener Ansatz verfolgt werden, der [Aspekt 1] und [Aspekt 2] miteinander verbindet.\`;`;

if (!source.includes(newTemplate)) {
  if (!source.includes(oldTemplate)) {
    throw new Error("Could not find the current C1 opinion essay template.");
  }
  source = source.replace(oldTemplate, newTemplate);
  fs.writeFileSync(workspacePath, source, "utf8");
}

const updated = fs.readFileSync(workspacePath, "utf8");
const requiredMarkers = [
  "nach welchen Kriterien [Entscheidung oder Maßnahme] beurteilt werden sollte",
  "anhand eines konkreten Beispiels argumentieren",
  "Bei der Beurteilung von [Thema] sollten mehrere Kriterien berücksichtigt werden",
  "Ein anschauliches Beispiel hierfür ist [Beispiel]",
  "Gründe, die gegen [Maßnahme oder Entscheidung] sprechen könnten",
  "Eine mögliche Alternative bestünde darin, [Alternative]",
  "differenziert betrachtet werden muss",
];

for (const marker of requiredMarkers) {
  if (!updated.includes(marker)) throw new Error(`C1 Goethe essay template marker missing: ${marker}`);
}

console.log("Applied the Goethe-aligned four-point C1 essay template.");
