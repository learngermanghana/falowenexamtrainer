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

const speakingPagePath = path.join(root, "web/src/components/SpeakingPage.js");
let speakingPage = fs.readFileSync(speakingPagePath, "utf8");

const legacyAudioRepliesKey =
  'const AUDIO_REPLIES_STORAGE_KEY = "falowen.customSpeaking.audioReplies";';
const versionedAudioRepliesKey =
  'const AUDIO_REPLIES_STORAGE_KEY = "falowen.customSpeaking.audioReplies.v2";';

if (speakingPage.includes(legacyAudioRepliesKey)) {
  speakingPage = speakingPage.replace(legacyAudioRepliesKey, versionedAudioRepliesKey);
}

const audioIntentMarker = "audioRequested: Boolean(withAudio),";
const audioIntentAnchor = `        audioUrl: null,
        audioLoading: Boolean(withAudio && audioRepliesEnabled && isCoachTtsEligible()),`;
const audioIntentReplacement = `        audioUrl: null,
        audioRequested: Boolean(withAudio),
        audioLoading: Boolean(withAudio && audioRepliesEnabled && isCoachTtsEligible()),`;

if (!speakingPage.includes(audioIntentMarker)) {
  if (!speakingPage.includes(audioIntentAnchor)) {
    throw new Error("Could not find the custom coach message audio-intent insertion point.");
  }
  speakingPage = speakingPage.replace(audioIntentAnchor, audioIntentReplacement);
}

const autoplayPreferenceEffect = `  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(AUTOPLAY_REPLIES_STORAGE_KEY, String(autoPlayRepliesEnabled));
  }, [autoPlayRepliesEnabled]);`;

const latestReplyAudioMarker = "latestCoachMessageNeedingAudio";
const unsafeBackfillPredicate = `          String(message.id || "").startsWith("custom-coach-") &&
           Boolean(String(message.text || "").trim()) &&`;
const scopedBackfillPredicate = `          String(message.id || "").startsWith("custom-coach-") &&
           message.audioRequested === true &&
           Boolean(String(message.text || "").trim()) &&`;

if (speakingPage.includes(unsafeBackfillPredicate)) {
  speakingPage = speakingPage.replace(unsafeBackfillPredicate, scopedBackfillPredicate);
}

const latestReplyAudioEffect = `

  useEffect(() => {
    if (!audioRepliesEnabled || activeSpeakingTab !== "custom" || !isCoachTtsEligible()) return;

    const latestCoachMessageNeedingAudio = [...customChatMessages]
      .reverse()
      .find(
        (message) =>
          message.role === "coach" &&
          message.type === "text" &&
          String(message.id || "").startsWith("custom-coach-") &&
          message.audioRequested === true &&
          Boolean(String(message.text || "").trim()) &&
          !message.audioUrl &&
          !message.audioLoading &&
          !message.audioError,
      );

    if (!latestCoachMessageNeedingAudio) return;
    requestSpeechForCustomCoachMessage(
      latestCoachMessageNeedingAudio.id,
      latestCoachMessageNeedingAudio.text,
    );
  }, [
    activeSpeakingTab,
    audioRepliesEnabled,
    customChatMessages,
    isCoachTtsEligible,
    requestSpeechForCustomCoachMessage,
  ]);`;

if (!speakingPage.includes(latestReplyAudioMarker)) {
  if (!speakingPage.includes(autoplayPreferenceEffect)) {
    throw new Error("Could not find the speaking audio preference effect insertion point.");
  }
  speakingPage = speakingPage.replace(
    autoplayPreferenceEffect,
    `${autoplayPreferenceEffect}${latestReplyAudioEffect}`,
  );
}

if (!speakingPage.includes(versionedAudioRepliesKey)) {
  throw new Error("Speaking audio replies still use the stale preference key.");
}
if (!speakingPage.includes(audioIntentMarker)) {
  throw new Error("Custom coach messages do not preserve whether audio was requested.");
}
if (!speakingPage.includes(latestReplyAudioMarker)) {
  throw new Error("Speaking audio replies do not backfill the latest coach response.");
}
if (!speakingPage.includes("message.audioRequested === true")) {
  throw new Error("Speaking audio backfill is not restricted to intended coach replies.");
}

fs.writeFileSync(speakingPagePath, speakingPage, "utf8");

const embeddedPanelsPath = path.join(
  root,
  "web/src/components/selfLearning/EmbeddedPracticePanels.js",
);
let embeddedPanels = fs.readFileSync(embeddedPanelsPath, "utf8");
const unlockedCourseCoach = '<SpeakingPage mode="course" />';
const routeLockedCourseCoach =
  '<SpeakingPage mode="course" lockedLevel={getCourseLessonRouteMeta().level} />';
const stableCourseCoach =
  '<GoetheFreeChatPage lockedLevel={getCourseLessonRouteMeta().level} />';

if (embeddedPanels.includes(stableCourseCoach)) {
  console.log("Stable course Goethe Free Chat mount is already active; leaving it untouched.");
} else {
  if (embeddedPanels.includes(unlockedCourseCoach)) {
    embeddedPanels = embeddedPanels.replace(unlockedCourseCoach, routeLockedCourseCoach);
  }
  if (!embeddedPanels.includes(routeLockedCourseCoach)) {
    throw new Error("Embedded course speaking coach does not inherit the lesson level.");
  }
  fs.writeFileSync(embeddedPanelsPath, embeddedPanels, "utf8");
}

console.log("Reset stale speaking audio preferences, scoped backfill to intended coach replies, and preserved the course speaking mount contract.");
