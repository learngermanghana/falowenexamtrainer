import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const speakingPagePath = path.join(root, "web/src/components/SpeakingPage.js");
const speakingPage = fs.readFileSync(speakingPagePath, "utf8");
const backend = fs.readFileSync(path.join(root, "functions/functionz/app.js"), "utf8");
const alreadyApplied =
  speakingPage.includes('from "../lib/speakingAudio"') &&
  backend.includes('require("./speakingAudioReliability")');

if (alreadyApplied) {
  console.log("Speaking audio reliability patch is already applied.");
} else {
  await import("./patchSpeakingAudioReliability.mjs");
}

await import(`./fixSpeakingAudioFrontendPatch.mjs?run=${Date.now()}`);
await import(`./fixSpeakingAudioBackendPatch.mjs?run=${Date.now()}`);

const refreshedSpeakingPage = fs.readFileSync(speakingPagePath, "utf8");
const durationPatchAlreadyApplied =
  refreshedSpeakingPage.includes('from "../lib/speakingSessionDuration"') &&
  refreshedSpeakingPage.includes("CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS") &&
  refreshedSpeakingPage.includes("customSessionDurationMinutes");

if (durationPatchAlreadyApplied) {
  console.log("Selectable speaking session durations are already applied.");
} else {
  await import(`./patchCustomSpeakingSessionDuration.mjs?run=${Date.now()}`);
}

await import(`./patchLockedA1Teil3Speaking.mjs?run=${Date.now()}`);
