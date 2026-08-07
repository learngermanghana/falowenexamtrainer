import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const targetPath = path.join(repoRoot, "web", "src", "components", "B1Day1TraumweltWorkbookPageLegacy.js");

let source = fs.readFileSync(targetPath, "utf8");

const sharedImport = 'import B1WritingWorkspace from "./B1WritingWorkspace";';
const importAnchor = 'import CourseInlinePracticePanel from "./CourseInlinePracticePanel";';

source = source
  .replace('import WritingPage from "./WritingPage";\n', "")
  .replace('import B1InlineWritingAnalyser from "./B1InlineWritingAnalyser";\n', "");

if (!source.includes(sharedImport)) {
  if (!source.includes(importAnchor)) throw new Error("Could not locate B1 Day 1 import anchor.");
  source = source.replace(importAnchor, `${importAnchor}\n${sharedImport}`);
}

source = source.replace('  const [writingDraft, setWritingDraft] = useState("");\n', "");

const writingBlockPattern = /          \{writingView === "schreiben" && \([\s\S]*?\n          \)\}\n\n          \{writingView === "cheatSheet"/;

const sharedBlock = `          {writingView === "schreiben" && (\n            <B1WritingWorkspace\n              writingContext={{\n                level: "B1",\n                courseLevel: "B1",\n                day: 1,\n                lessonId: "B1-day-1",\n                workbookId: "B1-day-1",\n                writingTaskId: "B1-day-1-teil-2-writing",\n                taskTitle: "Ist persönlicher Kontakt im Traumberuf wichtiger als flexible Arbeit im Homeoffice?",\n                taskPoints: [\n                  "Reagieren Sie auf Tanjas Meinung.",\n                  "Nennen Sie Vorteile oder Nachteile von Homeoffice.",\n                  "Begründen Sie Ihre eigene Meinung.",\n                ],\n                draftPlaceholder: "Liebe Forum-Mitglieder,\\n\\nich bin der Meinung, dass ...",\n              }}\n            />\n          )}\n\n          {writingView === "cheatSheet"`;

if (!source.includes("data-a2-b1-writing-workspace")) {
  if (!writingBlockPattern.test(source)) {
    throw new Error("Could not locate the B1 Day 1 Schreiben block to standardize.");
  }
  source = source.replace(writingBlockPattern, sharedBlock);
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("B1 Day 1 uses the shared A2/B1 planning, Schreiben and Analyse my text workspace.");
