import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspacePath = path.join(root, "web/src/components/GuidedWritingWorkspace.js");
const lessonPagePath = path.join(root, "web/src/components/C1Day18To20GuidedLessonPage.js");

const legacyAdvantagesTemplate = `In der heutigen Zeit wird häufig über [Thema] diskutiert. Meiner Meinung nach ist dieses Thema von großer Bedeutung, da es sowohl [Bereich 1] als auch [Bereich 2] betrifft. Im Folgenden werde ich zunächst die Vorteile erläutern, anschließend auf mögliche Einwände eingehen und schließlich eine ausgewogene Lösung vorstellen.

Einerseits bietet [Thema] zahlreiche Vorteile. Ein wesentlicher Vorteil besteht darin, dass [Vorteil und Erklärung].

Andererseits sollte berücksichtigt werden, dass [Nachteil oder Problem].

Natürlich gibt es auch andere Meinungen. Einige Menschen sind der Ansicht, dass [Gegenargument].

Dennoch bin ich der Auffassung, dass [eigene Position mit Begründung].

Zusammenfassend lässt sich sagen, dass [Thema] sowohl Chancen als auch Herausforderungen mit sich bringt. Meines Erachtens kommt es darauf an, die Vorteile sinnvoll zu nutzen und gleichzeitig mögliche negative Folgen zu begrenzen. Daher wäre es empfehlenswert, [konkrete Maßnahme oder ausgewogene Lösung]. Auf diese Weise könnte langfristig ein angemessener Ausgleich zwischen [Aspekt 1] und [Aspekt 2] geschaffen werden.`;

const previousGoetheTemplate = `In der heutigen Zeit wird häufig über [Thema] diskutiert. Dieses Thema ist von großer gesellschaftlicher Bedeutung, da es sowohl [Bereich 1] als auch [Bereich 2] betrifft. Im Folgenden werde ich zunächst erläutern, nach welchen Kriterien [Entscheidung oder Maßnahme] beurteilt werden sollte. Anschließend werde ich anhand eines konkreten Beispiels argumentieren, mögliche Einwände darstellen und schließlich eine Alternative erläutern.

Bei der Beurteilung von [Thema] sollten mehrere Kriterien berücksichtigt werden. Von besonderer Bedeutung ist zunächst [Kriterium 1], da [Begründung]. Darüber hinaus spielt [Kriterium 2] eine entscheidende Rolle, weil [Begründung].

Ein anschauliches Beispiel hierfür ist [Beispiel]. In diesem Fall zeigt sich, dass [Erklärung des Beispiels]. Dadurch wird deutlich, dass [Schlussfolgerung].

Dennoch gibt es auch Gründe, die gegen [Maßnahme oder Entscheidung] sprechen könnten. Ein wesentlicher Einwand besteht darin, dass [Gegenargument 1]. Außerdem darf nicht außer Acht gelassen werden, dass [Gegenargument 2].

Eine mögliche Alternative bestünde darin, [Alternative]. Im Gegensatz zu [ursprünglicher Maßnahme] hätte diese Lösung den Vorteil, dass [Vorteil der Alternative]. Voraussetzung dafür wäre allerdings, dass [Bedingung].

Zusammenfassend lässt sich festhalten, dass [Thema] differenziert betrachtet werden muss. Meines Erachtens ist [eigene Position] sinnvoll, sofern [Bedingung]. Statt ausschließlich auf [eine Lösung] zu setzen, sollte ein ausgewogener Ansatz verfolgt werden, der [Aspekt 1] und [Aspekt 2] miteinander verbindet.`;

const newTemplateBody = `In der heutigen Zeit wird häufig über [Thema] diskutiert. Dieses Thema ist von großer gesellschaftlicher Bedeutung, da es sowohl [Bereich 1] als auch [Bereich 2] betrifft. Im Folgenden werde ich zunächst erläutern, nach welchen Kriterien [Entscheidung oder Maßnahme] beurteilt werden sollte. Anschließend werde ich anhand eines konkreten Beispiels argumentieren, mögliche Einwände darstellen und schließlich eine Alternative erläutern.

Bei der Beurteilung von [Thema] sollten mehrere Kriterien berücksichtigt werden. Von besonderer Bedeutung ist zunächst ...

Ein anschauliches Beispiel hierfür ist ... Daran zeigt sich, dass ...

Andererseits sollte berücksichtigt werden, dass ...

Eine mögliche Alternative bestünde darin, ... Ich bin der Auffassung, dass diese Lösung sinnvoller wäre, weil ...

Zusammenfassend lässt sich festhalten, dass [Thema] differenziert betrachtet werden muss. Meines Erachtens sollte eine ausgewogene und sinnvolle Lösung gefunden werden, da sowohl individuelle Bedürfnisse als auch gesellschaftliche Interessen berücksichtigt werden müssen.`;

let workspace = fs.readFileSync(workspacePath, "utf8");
const declaration = (body) => `export const C1_OPINION_ESSAY_TEMPLATE = \`${body}\`;`;
const newDeclaration = declaration(newTemplateBody);

for (const oldBody of [legacyAdvantagesTemplate, previousGoetheTemplate]) {
  const oldDeclaration = declaration(oldBody);
  if (workspace.includes(oldDeclaration)) workspace = workspace.replace(oldDeclaration, newDeclaration);
}
if (!workspace.includes(newDeclaration)) {
  throw new Error("The lighter Goethe-aligned C1 essay template is missing.");
}

const legacyAnchor = "export const LEGACY_C1_OPINION_ESSAY_TEMPLATES = [";
for (const body of [legacyAdvantagesTemplate, previousGoetheTemplate]) {
  const serialized = JSON.stringify(body);
  if (!workspace.includes(serialized)) {
    if (!workspace.includes(legacyAnchor)) throw new Error("The C1 legacy template list was not found.");
    workspace = workspace.replace(legacyAnchor, `${legacyAnchor}\n  ${serialized},`);
  }
}

fs.writeFileSync(workspacePath, workspace, "utf8");

let lessonPage = fs.readFileSync(lessonPagePath, "utf8");
const duplicatedQuestion = '<Section title="Speaking builder"><NoteBox tone="amber"><strong>Sprechfrage:</strong> {speakingQuestion}</NoteBox><C1SpeakGrammarGuide';
const singleQuestion = '<Section title="Speaking builder"><C1SpeakGrammarGuide';
if (lessonPage.includes(duplicatedQuestion)) lessonPage = lessonPage.replace(duplicatedQuestion, singleQuestion);

const duplicateCount = (lessonPage.match(/<strong>Sprechfrage:<\/strong> \{speakingQuestion\}/g) || []).length;
if (lessonPage.includes("C1SpeakGrammarGuide") && duplicateCount > 0) {
  throw new Error("The Day 19 speaking question is still duplicated outside the C1 speaking guide.");
}

fs.writeFileSync(lessonPagePath, lessonPage, "utf8");
console.log("C1 now migrates untouched drafts to the lighter Goethe template and keeps one speaking question.");
