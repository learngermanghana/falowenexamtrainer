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
    "falowen.customSpeaking.audioReplies.v2",
    "audioRequested: Boolean(withAudio),",
    "latestCoachMessageNeedingAudio",
    "message.audioRequested === true",
    "requestSpeechForCustomCoachMessage(",
    "message.audioUrl || message.browserSpeech",
    "playBrowserSpeechForMessage(messageId, message.text)",
    "stopBrowserSpeech()",
    "message.audioErrorMessage",
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
  ["web/src/components/selfLearning/EmbeddedPracticePanels.js", [
    'import GoetheFreeChatPage from "../GoetheFreeChatPage";',
    '<GoetheFreeChatPage lockedLevel={getCourseLessonRouteMeta().level} />',
    "getCourseLessonRouteMeta",
  ]],
  ["web/src/components/GoetheFreeChatPage.js", [
    "requestCustomSpeakingChatReply",
    "analyzeAudio",
    "CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS.map",
    'data-goethe-free-chat="text-first"',
    "Record voice",
  ]],
  ["web/src/components/selfLearning/EmbeddedSpeechPracticePanel.js", [
    'from "../../lib/speakingAudio"',
    "Send recording to AI",
    "<audio controls",
    "recorder.start(1000)",
  ]],
  ["web/src/hooks/useCustomCoachSpeech.js", [
    'from "../services/presentationCoachService"',
    "requestCoachSpeech({ text, level: selectedLevel, idToken, signal: controller.signal })",
    "window.SpeechSynthesisUtterance",
    "window.speechSynthesis.speak(utterance)",
    "browserSpeech: true",
    "useBrowserSpeechFallback(messageId, text, error)",
    "audioErrorMessage",
    "audioRetryable",
  ]],
  ["web/src/services/presentationCoachService.js", [
    'from "../lib/speakingSessionDuration"',
    "normalizeSpeakingChatDurationMinutes(sessionContext?.durationMinutes)",
    "full ${durationMinutes}-minute session",
    "sessionContext,",
    "MAX_COACH_SPEECH_CHARACTERS",
    "normalizeCoachSpeechText",
    "invalid_audio_response",
    'response.headers?.get?.("content-type")',
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
    "Use this reliable structure for every learner message",
    "'Bessere Version:'",
    "max_tokens: 520",
  ]],
  ["functions/functionz/speakingAudioReliability.js", [
    "gpt-4o-transcribe",
    '"video/webm"',
    "AUDIO_FORMAT_UNSUPPORTED",
    "NO_SPEECH_DETECTED",
    "TRANSCRIPTION_TIMEOUT",
    "TRANSCRIPTION_FAILED",
    "waitForReadStreamOpen",
    "audioStream?.destroy()",
  ]],
];

const forbidden = [
  ["web/src/components/selfLearning/TeacherLectureSupportingMaterials.js", "<iframe"],
  ["web/src/components/SpeakingPage.js", 'falowen.customSpeaking.audioReplies";'],
  ["web/src/components/selfLearning/EmbeddedPracticePanels.js", '<SpeakingPage mode="course" />'],
  ["web/src/components/selfLearning/EmbeddedPracticePanels.js", '<SpeakingPage mode="course" lockedLevel={getCourseLessonRouteMeta().level} />'],
  ["web/src/components/GoetheFreeChatPage.js", "requestCoachSpeech"],
  ["web/src/components/GoetheFreeChatPage.js", "useCustomCoachSpeech"],
  ["web/src/components/GoetheFreeChatPage.js", "Audio replies:"],
  ["web/src/components/GoetheFreeChatPage.js", "Play German reply"],
  ["functions/functionz/app.js", "Keep concise: maximum 6 short lines"],
  ["functions/functionz/app.js", "Keep replies short and phone-friendly"],
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
