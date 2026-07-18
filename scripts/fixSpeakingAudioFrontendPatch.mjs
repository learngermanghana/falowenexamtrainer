import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const trainerPath = path.join(root, "web/src/components/speechTrainer/InlineSpeechTrainer.js");
let source = fs.readFileSync(trainerPath, "utf8");

const literalPlaceholder = '"Maximum ${formatTime(maxRecordingSeconds)}; recording stops automatically."';
const evaluatedTemplate = '`Maximum ${formatTime(maxRecordingSeconds)}; recording stops automatically.`';

if (source.includes(literalPlaceholder)) {
  source = source.replace(literalPlaceholder, evaluatedTemplate);
}

if (
  source.includes('from "../../lib/speakingAudio"') &&
  !source.includes("formatTime(maxRecordingSeconds)")
) {
  throw new Error("Patched Presentation Trainer is missing its recording-limit message.");
}

fs.writeFileSync(trainerPath, source, "utf8");
console.log("Normalized speaking recorder time-limit UI.");
