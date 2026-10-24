import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");

const replaceOnce = (text, before, after, label) => {
  if (text.includes(after)) return text;
  if (!text.includes(before)) throw new Error(`C1 content refresh anchor missing: ${label}`);
  return text.replace(before, after);
};

const contentRefreshPath = path.join(repoRoot, "web/src/data/c1ContentRefresh.js");
let contentRefresh = fs.readFileSync(contentRefreshPath, "utf8");
contentRefresh = replaceOnce(
  contentRefresh,
  `    objectives: [\n      profile.points[0],\n      profile.points[1],\n      profile.points[2],\n      profile.points[3],\n    ].map((item) => item.replace(/^Erläutern Sie|^Zeigen Sie|^Analysieren Sie|^Bewerten Sie|^Gehen Sie|^Entwickeln Sie|^Schlagen Sie|^Formulieren Sie/, "Ich kann")),`,
  `    objectives: [\n      \`Ich kann die zentrale Fragestellung zu „\${lesson.title}“ differenziert erklären.\`,\n      "Ich kann ein Argument mit Begründung und einem konkreten Beispiel entwickeln.",\n      "Ich kann einen ernst zu nehmenden Einwand aufnehmen und sprachlich präzise einschränken.",\n      "Ich kann einen ausgewogenen Lösungsansatz formulieren und nachvollziehbar begründen.",\n    ],`,
  "natural C1 objectives",
);
fs.writeFileSync(contentRefreshPath, contentRefresh);

const registryPath = path.join(repoRoot, "web/src/components/SelfLearningLessonRegistry.js");
let registry = fs.readFileSync(registryPath, "utf8");
registry = replaceOnce(
  registry,
  'import { alignC2SelfLearningLesson } from "../data/c2LessonContentAlignment";',
  'import { alignC2SelfLearningLesson } from "../data/c2LessonContentAlignment";\nimport { alignC1LessonContent } from "../data/c1ContentRefresh";',
  "C1 alignment import",
);

const c1ArrayPattern = /  C1: \[(c1Day0Orientation[^\n]+)\],\n  C2:/;
if (!registry.includes(".map((lesson) => alignC1LessonContent(lesson))")) {
  if (!c1ArrayPattern.test(registry)) throw new Error("C1 content refresh anchor missing: C1 lesson array");
  registry = registry.replace(c1ArrayPattern, '  C1: [$1].map((lesson) => alignC1LessonContent(lesson)),\n  C2:');
}
fs.writeFileSync(registryPath, registry);

const speakGuidePath = path.join(repoRoot, "web/src/components/C1SpeakGrammarGuide.js");
let speakGuide = fs.readFileSync(speakGuidePath, "utf8");
speakGuide = replaceOnce(
  speakGuide,
  `  const rawBranches = Array.isArray(branchesOverride)\n    ? branchesOverride\n    : (Array.isArray(speakingBuilder.branches) ? speakingBuilder.branches : []);`,
  `  const refreshedBranches = lesson?.c1ContentRefresh?.speakingBranches;\n  const rawBranches = Array.isArray(refreshedBranches) && refreshedBranches.length\n    ? refreshedBranches\n    : Array.isArray(branchesOverride)\n      ? branchesOverride\n      : (Array.isArray(speakingBuilder.branches) ? speakingBuilder.branches : []);`,
  "prefer refreshed C1 speaking content",
);
fs.writeFileSync(speakGuidePath, speakGuide);

const day21To25Path = path.join(repoRoot, "web/src/components/C1Day21To25SelfTutoringPage.js");
let day21To25 = fs.readFileSync(day21To25Path, "utf8");
day21To25 = replaceOnce(
  day21To25,
  "  const effectiveLesson = day === 25 ? { ...lesson, ...day25Overrides } : lesson;",
  "  const effectiveLesson = lesson;",
  "let refreshed Day 25 writing content flow through",
);
fs.writeFileSync(day21To25Path, day21To25);

const forbidden = [
  "C2StandardExamPanels",
  "C2StandardGrammarPanel",
  "C2StandardSpeakPanel",
  "C2StandardWritePanel",
];
for (const relativePath of [
  "web/src/components/C1Day1To6GuidedLessonPage.js",
  "web/src/components/C1Day8To10GuidedLessonPage.js",
  "web/src/components/C1Day12To14GuidedLessonPage.js",
  "web/src/components/C1Day15To17GuidedLessonPage.js",
  "web/src/components/C1Day18To20GuidedLessonPage.js",
  "web/src/components/C1Day21To25SelfTutoringPage.js",
  "web/src/components/C1Day24To26GuidedLessonPage.js",
  "web/src/components/C1Day27To28GuidedLessonPage.js",
]) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) continue;
  const source = fs.readFileSync(fullPath, "utf8");
  for (const token of forbidden) {
    if (source.includes(token)) throw new Error(`C1 structure guard failed: ${token} found in ${relativePath}`);
  }
}

const refreshedSource = fs.readFileSync(contentRefreshPath, "utf8");
for (let day = 1; day <= 28; day += 1) {
  if (!refreshedSource.includes(`  ${day}: {`)) throw new Error(`C1 content refresh missing Day ${day}`);
}

console.log("C1 Days 1-28 content refreshed while existing C1 Learn/Speak/Write structure stays intact.");
