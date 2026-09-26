import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(
  root,
  "web/src/components/A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js",
);
const listeningPath = path.join(root, "web/src/data/a2ListeningTasks.js");
const source = fs.readFileSync(targetPath, "utf8");
const { A2_LISTENING_MODES, A2_LISTENING_TASKS } = await import(pathToFileURL(listeningPath).href);

const requiredMarkers = [
  'import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";',
  'day={23}',
  'chapter="9.23"',
  'title="Wie kommst du zur Schule / zur Arbeit?"',
];

for (const marker of requiredMarkers) {
  if (!source.includes(marker)) {
    throw new Error(`A2 Day 23 restored workbook marker missing: ${marker}`);
  }
}

if (/key:\s*"teil[1-4]"/i.test(source)) {
  throw new Error("A2 Day 23 reverted to mismatched legacy teil1-teil4 tab keys.");
}
if (source.includes("Go to Submission Area")) {
  throw new Error("A2 Day 23 reverted to the legacy external submission flow.");
}
for (const marker of [
  "lesenText=",
  "lesenQuestions=",
  "const lesenText",
  "const lesenQuestions",
  "hoerenTask=",
  "hoerenAudioUrl=",
  "hoerenQuestions=",
  "hoerenSelfCheck",
  "showHoeren=",
]) {
  if (source.includes(marker)) {
    throw new Error(`A2 Day 23 reintroduced obsolete inline workbook source: ${marker}`);
  }
}

const listening = A2_LISTENING_TASKS[23];
if (listening?.mode !== A2_LISTENING_MODES.SELF_CHECK) {
  throw new Error("A2 Day 23 canonical Hören must remain Goethe self-check practice.");
}
if (!String(listening.audioUrl || "").includes("6DA1dYfqEZo")) {
  throw new Error("A2 Day 23 canonical Hören video changed unexpectedly.");
}

console.log("A2 Day 23 uses canonical Lesen and canonical Hören self-check in the shared workbook shell.");
