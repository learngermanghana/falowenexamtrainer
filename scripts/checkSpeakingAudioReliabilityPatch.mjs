import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checks = [
  ["web/src/components/SpeakingPage.js", [
    'from "../lib/speakingAudio"',
    "createSpeakingMediaRecorder(stream)",
    "buildRecordedAudioBlob(audioChunksRef.current, recorder)",
    "recorder.start(1000)",
    "playAudioElement(currentAudio)",
    "recordingMaxSeconds",
  ]],
  ["web/src/components/selfLearning/EmbeddedSpeechPracticePanel.js", [
    'from "../../lib/speakingAudio"',
    "Send recording to AI",
    "<audio controls",
    "recorder.start(1000)",
  ]],
  ["web/src/components/speechTrainer/InlineSpeechTrainer.js", [
    'from "../../lib/speakingAudio"',
    "createSpeakingMediaRecorder(stream)",
    "buildRecordedAudioBlob(chunks, recorder)",
    "recorder.start(1000)",
  ]],
  ["web/src/services/coachService.js", [
    'from "../lib/speakingAudio"',
    "filenameForAudioBlob(audioBlob)",
    "if (error?.response) throw error",
    "timeout: 120000",
  ]],
  ["web/src/services/speechTrainerService.js", [
    'from "../lib/speakingAudio"',
    "filenameForAudioBlob(audioBlob, \"speech-trainer\")",
    "if (error?.response) throw error",
    "timeout: 120000",
  ]],
  ["functions/functionz/app.js", [
    'require("./speakingAudioReliability")',
    "transcribeAudioFile({ file, getOpenAIClient })",
    ".slice(0, 8000)",
    "SPEAKING_QUOTA_REACHED",
    "TRANSCRIPTION_FAILED",
  ]],
  ["functions/functionz/speakingAudioReliability.js", [
    "gpt-4o-mini-transcribe",
    "AUDIO_FORMAT_UNSUPPORTED",
    "NO_SPEECH_DETECTED",
    "TRANSCRIPTION_TIMEOUT",
  ]],
];

const failures = [];
for (const [relativePath, markers] of checks) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  for (const marker of markers) {
    const ok = source.includes(marker);
    console.log(`${ok ? "PASS" : "FAIL"} ${relativePath}: ${marker}`);
    if (!ok) failures.push(`${relativePath}: ${marker}`);
  }
}

if (failures.length) {
  throw new Error(`Speaking audio reliability contract failed:\n- ${failures.join("\n- ")}`);
}

console.log("Speaking audio reliability source contract passed.");
