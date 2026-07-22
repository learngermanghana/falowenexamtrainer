import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checks = [
  ["web/src/components/SpeakingPage.js", [
    'from "../lib/speakingAudio"',
    'from "../lib/speakingSessionDuration"',
    'from "../lib/speakingExamLock"',
    "createSpeakingMediaRecorder(stream)",
    "buildRecordedAudioBlob(audioChunksRef.current, recorder)",
    "recorder.start(1000)",
    "playAudioElement(currentAudio)",
    "recordingMaxSeconds",
    "CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS.map",
    "Choose your chat time",
    "durationMinutes: customSessionDurationMinutes",
    "speakingChatSessionSeconds(customSessionDurationMinutes)",
    "lockedLevel: lockedLevelProp",
    "lockedTeil: lockedTeilProp",
    "getVisibleSpeakingTabs({ isCourseMode, examOnly })",
    "if (saved?.selectedTeil && !normalizedLockedTeil)",
    "Teil {normalizedLockedTeil}",
    'falowen.customSpeaking.audioReplies.v2',
    "audioRequested: Boolean(withAudio),",
    "latestCoachMessageNeedingAudio",
    "message.audioRequested === true",
    "requestSpeechForCustomCoachMessage(",
  ]],
  ["web/src/components/SpeakingExamIntroPage.js", [
    'import A1Teil3SpeakingPracticePanel from "./A1Teil3SpeakingPracticePanel"',
    "<A1Teil3SpeakingPracticePanel />",
  ]],
  ["web/src/components/A1Teil3SpeakingPracticePanel.js", [
    'lockedLevel="A1"',
    'lockedTeil="3"',
    "examOnly",
    'contextLabel="Goethe A1 · Sprechen Teil 3"',
  ]],
  ["web/src/lib/speakingExamLock.js", [
    "normalizeLockedSpeakingLevel",
    "normalizeLockedSpeakingTeil",
    "getVisibleSpeakingTabs",
    "resolveInitialSpeakingFilters",
  ]],
  ["web/src/components/SelfLearningLessonRegistry.js", [
    "TeacherLectureSupportingMaterials",
    "removeTeacherLectureFromCanonicalLesson",
    "removeTeacherLectureFromLesson",
    "<SelfLearningLessonFrame",
  ]],
  ["web/src/components/selfLearning/TeacherLectureSupportingMaterials.js", [
    'data-teacher-lecture-support="links-only"',
    "Open teacher lecture",
    "The AI lesson stays embedded above",
    "removeTeacherLectureFromCanonicalLesson",
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
    "`Maximum ${formatTime(maxRecordingSeconds)}; recording stops automatically.`",
  ]],
  ["web/src/services/coachService.js", [
    'from "../lib/speakingAudio"',
    "filenameForAudioBlob(audioBlob)",
    "if (error?.response) throw error",
    "timeout: 120000",
  ]],
  ["web/src/services/speechTrainerService.js", [
    'from "../lib/speakingAudio"',
    'filenameForAudioBlob(audioBlob, "speech-trainer")',
    "if (error?.response) throw error",
    "timeout: 120000",
  ]],
  ["web/src/services/presentationCoachService.js", [
    'from "../lib/speakingSessionDuration"',
    "normalizeSpeakingChatDurationMinutes(sessionContext?.durationMinutes)",
    "full ${durationMinutes}-minute session",
    "sessionContext,",
  ]],
  ["web/src/lib/speakingSessionDuration.js", [
    "[10, 20, 30]",
    "normalizeSpeakingChatDurationMinutes",
    "speakingChatSessionSeconds",
  ]],
  ["functions/functionz/app.js", [
    'require("./speakingAudioReliability")',
    "transcribeAudioFile({ file, getOpenAIClient })",
    ".slice(0, 8000)",
    "SPEAKING_QUOTA_REACHED",
    "NO_SPEECH_DETECTED|TRANSCRIPTION_",
  ]],
  ["functions/functionz/speakingAudioReliability.js", [
    "gpt-4o-transcribe",
    '"video/webm"',
    "AUDIO_FORMAT_UNSUPPORTED",
    "NO_SPEECH_DETECTED",
    "TRANSCRIPTION_TIMEOUT",
    "TRANSCRIPTION_FAILED",
  ]],
];

const forbidden = [
  ["web/src/components/selfLearning/TeacherLectureSupportingMaterials.js", "<iframe"],
  ["web/src/components/SpeakingPage.js", 'falowen.customSpeaking.audioReplies";'],
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

for (const [relativePath, marker] of forbidden) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  const ok = !source.includes(marker);
  console.log(`${ok ? "PASS" : "FAIL"} ${relativePath}: excludes ${marker}`);
  if (!ok) failures.push(`${relativePath}: must exclude ${marker}`);
}

if (failures.length) {
  throw new Error(`Speaking and self-learning video contract failed:\n- ${failures.join("\n- ")}`);
}

console.log("Speaking and self-learning video source contract passed.");
