import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const lessonBuilderPath = path.join(repoRoot, "web", "src", "data", "selfLearningLessons", "buildSelfLearningLesson.js");
const guidedPagePath = path.join(repoRoot, "web", "src", "components", "C1Day18To20GuidedLessonPage.js");

const replaceSection = (source, startMarker, endMarker, replacement, label) => {
  if (source.includes(replacement)) return source;
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Could not patch ${label}`);
  }
  return `${source.slice(0, start)}${replacement}\n\n${source.slice(end)}`;
};

const replaceBlock = (source, pattern, replacement, label) => {
  if (source.includes(replacement)) return source;
  const next = source.replace(pattern, replacement);
  if (next === source) throw new Error(`Could not patch ${label}`);
  return next;
};

let builder = fs.readFileSync(lessonBuilderPath, "utf8");
const standardBuilder = `const buildC1OpinionWriting = (title, topicContext) => ({
  taskType: "C1 opinion essay / Stellungnahme",
  topic: \`Schreibaufgabe: Verfassen Sie eine C1-Stellungnahme zum Thema „\${title}“ mit 220–280 Wörtern.\`,
  structure: [
    \`Erklären Sie, welche Bedeutung „\${title}“ im Zusammenhang mit \${topicContext} hat.\`,
    \`Argumentieren Sie anhand eines konkreten Beispiels für oder im Zusammenhang mit „\${title}“.\`,
    \`Nennen Sie Gründe oder Einwände, die gegen „\${title}“ beziehungsweise gegen eine einseitige Betrachtung sprechen könnten.\`,
    \`Erläutern Sie eine Alternative oder einen ausgewogenen Lösungsweg im Umgang mit „\${title}“.\`,
  ],
  usefulLines: [
    \`Das Thema „\${title}“ lässt sich aus verschiedenen Perspektiven betrachten.\`,
    "Von besonderer Bedeutung ist dabei, dass ...",
    "Ein anschauliches Beispiel hierfür ist ...",
    "Dagegen spricht jedoch, dass ...",
    "Eine mögliche Alternative bestünde darin, ...",
    "Zusammenfassend lässt sich festhalten, dass ...",
  ],
});`;

builder = replaceSection(
  builder,
  "const buildC1OpinionWriting =",
  "const buildB2OpinionWriting =",
  standardBuilder,
  "shared C1 Goethe writing structure",
);
fs.writeFileSync(lessonBuilderPath, builder);

let guided = fs.readFileSync(guidedPagePath, "utf8");
const standardDay18 = `const day18Writing = {
  question: "Verfassen Sie eine C1-Stellungnahme zum Thema gesellschaftlicher Zusammenhalt mit 220–280 Wörtern.",
  points: [
    "Erklären Sie, welche Bedeutung gesellschaftlicher Zusammenhalt für eine demokratische Gesellschaft hat.",
    "Argumentieren Sie anhand eines konkreten Beispiels für eine Maßnahme, die gesellschaftlichen Zusammenhalt stärken kann.",
    "Nennen Sie Gründe oder Einwände, die gegen stärkere staatliche Maßnahmen sprechen könnten.",
    "Erläutern Sie eine Alternative oder einen ausgewogenen Lösungsweg zur Förderung des gesellschaftlichen Zusammenhalts.",
  ],
};`;

guided = replaceBlock(
  guided,
  /const day18Writing = \{[\s\S]*?\n\};/,
  standardDay18,
  "C1 Day 18 Goethe writing bullets",
);
fs.writeFileSync(guidedPagePath, guided);

await import("./patchC1WritingExplicitQuestion.mjs");

console.log("Applied Goethe-style four-point writing structure to C1 opinion tasks and Day 18.");
