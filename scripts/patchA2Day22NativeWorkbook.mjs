import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A2Day22DieWochePlanungWorkbookPage.js");
const listeningPath = path.join(root, "web/src/data/a2ListeningTasks.js");
const source = fs.readFileSync(targetPath, "utf8");
const { A2_LISTENING_MODES, A2_LISTENING_TASKS } = await import(pathToFileURL(listeningPath).href);

const requiredMarkers = [
  'import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";',
  'day={22}',
  'chapter="8.22"',
  'title="Die Woche planen"',
];

for (const marker of requiredMarkers) {
  if (!source.includes(marker)) {
    throw new Error(`A2 Day 22 cleaned workbook marker missing: ${marker}`);
  }
}

const retiredMarkers = [
  "Go to Submission Area",
  "function TabButton(",
  "Gülcan schreibt Sonja, dass",
  "Willkommensführung",
  "lesenText=",
  "lesenQuestions=",
  "const lesenText",
  "const lesenQuestions",
  "hoerenTask=",
  "hoerenAudioUrl=",
  "hoerenQuestions=",
  "hoerenSelfCheck",
  "showHoeren=",
];

for (const marker of retiredMarkers) {
  if (source.includes(marker)) {
    throw new Error(`A2 Day 22 retired inline source returned: ${marker}`);
  }
}

const listening = A2_LISTENING_TASKS[22];
if (listening?.mode !== A2_LISTENING_MODES.NONE) {
  throw new Error("A2 Day 22 must not expose a Teil 4 Hören section.");
}
if (String(listening.audioUrl || "") !== "" || (listening.questions || []).length !== 0) {
  throw new Error("A2 Day 22 no-Hören source must keep audio and questions empty.");
}

console.log("A2 Day 22 uses the shared shell with canonical Hamburg Lesen and no Teil 4 Hören.");
