import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const speakingPage = fs.readFileSync(path.join(root, "web/src/components/SpeakingPage.js"), "utf8");
const backend = fs.readFileSync(path.join(root, "functions/functionz/app.js"), "utf8");
const alreadyApplied =
  speakingPage.includes('from "../lib/speakingAudio"') &&
  backend.includes('require("./speakingAudioReliability")');

if (alreadyApplied) {
  console.log("Speaking audio reliability patch is already applied.");
} else {
  await import("./patchSpeakingAudioReliability.mjs");
}

await import(`./fixSpeakingAudioBackendPatch.mjs?run=${Date.now()}`);
