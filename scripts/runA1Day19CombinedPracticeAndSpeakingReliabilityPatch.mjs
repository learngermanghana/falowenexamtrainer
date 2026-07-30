import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const patchPath = path.join(scriptsDir, "patchA1Day19CombinedPracticeAndSpeakingReliability.mjs");
let source = fs.readFileSync(patchPath, "utf8");

// The patch writes a React template literal into SpeakingPage. Escape that
// expression before importing the patch so Node does not evaluate it here.
const escaped = source.replaceAll("${transcript}", "\\${transcript}");
if (escaped !== source) fs.writeFileSync(patchPath, escaped);

await import(`${pathToFileURL(patchPath).href}?run=${Date.now()}`);
