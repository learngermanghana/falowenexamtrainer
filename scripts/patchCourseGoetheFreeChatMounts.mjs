import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const embeddedPath = path.join(root, "web/src/components/selfLearning/EmbeddedPracticePanels.js");
let source = fs.readFileSync(embeddedPath, "utf8");

const speakingImport = 'import SpeakingPage from "../SpeakingPage";';
const stableImport = 'import GoetheFreeChatPage from "../GoetheFreeChatPage";';

if (source.includes(speakingImport)) {
  source = source.replace(speakingImport, stableImport);
}

const legacyMount = '<SpeakingPage mode="course" />';
const lockedMount = '<SpeakingPage mode="course" lockedLevel={getCourseLessonRouteMeta().level} />';
const stableMount = '<GoetheFreeChatPage lockedLevel={getCourseLessonRouteMeta().level} />';

if (source.includes(legacyMount)) source = source.replace(legacyMount, stableMount);
if (source.includes(lockedMount)) source = source.replace(lockedMount, stableMount);

if (!source.includes(stableImport)) {
  throw new Error("Stable Goethe Free Chat import was not installed in EmbeddedPracticePanels.js");
}
if (!source.includes(stableMount)) {
  throw new Error("Stable Goethe Free Chat mount was not installed in EmbeddedPracticePanels.js");
}
if (source.includes('<SpeakingPage mode="course"')) {
  throw new Error("Audio-enabled SpeakingPage is still mounted in EmbeddedPracticePanels.js");
}

fs.writeFileSync(embeddedPath, source, "utf8");
console.log("Course B2/C1 speaking mounts now use the stable text-first Goethe Free Chat.");
