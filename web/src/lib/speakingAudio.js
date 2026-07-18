export const SPEAKING_AUDIO_MIN_SECONDS = 3;
export const SPEAKING_AUDIO_MAX_BYTES = 24 * 1024 * 1024;

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/ogg",
];

export function resolveSupportedAudioMimeType(MediaRecorderCtor = globalThis.MediaRecorder) {
  if (!MediaRecorderCtor) return "";
  if (typeof MediaRecorderCtor.isTypeSupported !== "function") return "";

  for (const mimeType of MIME_CANDIDATES) {
    try {
      if (MediaRecorderCtor.isTypeSupported(mimeType)) return mimeType;
    } catch {
      // Some older WebViews throw for an unknown MIME type. Try the next one.
    }
  }
  return "";
}

export function createSpeakingMediaRecorder(stream, MediaRecorderCtor = globalThis.MediaRecorder) {
  if (!MediaRecorderCtor) {
    const error = new Error("Voice recording is not supported on this browser.");
    error.code = "MEDIA_RECORDER_UNAVAILABLE";
    throw error;
  }

  const mimeType = resolveSupportedAudioMimeType(MediaRecorderCtor);
  const options = {
    audioBitsPerSecond: 48_000,
    ...(mimeType ? { mimeType } : {}),
  };

  try {
    return new MediaRecorderCtor(stream, options);
  } catch (firstError) {
    // A browser may report support but reject one option at construction time.
    try {
      return new MediaRecorderCtor(stream, mimeType ? { mimeType } : undefined);
    } catch {
      try {
        return new MediaRecorderCtor(stream);
      } catch {
        throw firstError;
      }
    }
  }
}

export function recorderMimeType(recorder, chunks = []) {
  const direct = String(recorder?.mimeType || "").trim();
  if (direct) return direct;
  const chunkType = chunks.find((chunk) => String(chunk?.type || "").trim())?.type;
  return String(chunkType || "audio/webm").trim();
}

export function buildRecordedAudioBlob(chunks = [], recorder) {
  const usableChunks = chunks.filter((chunk) => Number(chunk?.size || 0) > 0);
  if (!usableChunks.length) {
    const error = new Error("No audio was captured. Check the microphone and record again.");
    error.code = "AUDIO_EMPTY";
    throw error;
  }

  const blob = new Blob(usableChunks, { type: recorderMimeType(recorder, usableChunks) });
  if (!blob.size) {
    const error = new Error("No audio was captured. Check the microphone and record again.");
    error.code = "AUDIO_EMPTY";
    throw error;
  }
  if (blob.size > SPEAKING_AUDIO_MAX_BYTES) {
    const error = new Error("This recording is too large. Record a shorter answer and try again.");
    error.code = "AUDIO_TOO_LARGE";
    throw error;
  }
  return blob;
}

export function extensionForAudioMimeType(mimeType = "") {
  const normalized = String(mimeType).toLowerCase();
  if (normalized.includes("mp4") || normalized.includes("m4a")) return "m4a";
  if (normalized.includes("ogg")) return "ogg";
  if (normalized.includes("wav")) return "wav";
  if (normalized.includes("mpeg") || normalized.includes("mp3")) return "mp3";
  return "webm";
}

export function filenameForAudioBlob(blob, prefix = "recording") {
  return `${prefix}.${extensionForAudioMimeType(blob?.type)}`;
}

export function formatAudioBytes(bytes = 0) {
  const value = Number(bytes || 0);
  if (!Number.isFinite(value) || value <= 0) return "0 KB";
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function maxSpeakingRecordingSeconds({ level = "", context = "exam" } = {}) {
  const normalizedLevel = String(level || "").toUpperCase();
  if (context === "workbook") return normalizedLevel === "C1" ? 300 : 240;
  if (context === "presentation") return normalizedLevel === "C1" || normalizedLevel === "B2" ? 240 : 180;
  if (normalizedLevel === "C1" || normalizedLevel === "B2") return 240;
  if (normalizedLevel === "B1" || normalizedLevel === "A2") return 180;
  return 120;
}

export function userFacingAudioError(error, fallback = "Could not process this recording. Please try again.") {
  const backendCode = String(error?.response?.data?.code || error?.code || "").trim();
  const backendMessage = String(error?.response?.data?.error || error?.response?.data?.message || error?.message || "").trim();
  const messages = {
    AUDIO_EMPTY: "No speech was captured. Check your microphone and record again.",
    NO_SPEECH_DETECTED: "Falowen could not hear clear speech. Move closer to the microphone and record again.",
    AUDIO_TOO_LONG: "The recording is too long. Record a shorter answer and try again.",
    AUDIO_TOO_LARGE: "The recording is too large. Record a shorter answer and try again.",
    AUDIO_FORMAT_UNSUPPORTED: "This device created an unsupported recording format. Please update the browser or record again.",
    TRANSCRIPTION_TIMEOUT: "Transcription took too long. Your recording is still available; try sending it again.",
    TRANSCRIPTION_FAILED: "Falowen could not transcribe this recording. Your recording is still available; try again or record a new answer.",
    UPLOAD_FAILED: "The recording could not upload. Check your connection and try sending it again.",
    MEDIA_RECORDER_UNAVAILABLE: "Voice recording is not supported on this browser. Use a current Chrome, Edge, Firefox or Safari version.",
  };
  return messages[backendCode] || backendMessage || fallback;
}

export async function playAudioElement(audioElement) {
  if (!audioElement) {
    const error = new Error("The recording is not ready for playback.");
    error.code = "AUDIO_PLAYBACK_UNAVAILABLE";
    throw error;
  }
  try {
    await audioElement.play();
  } catch (error) {
    const wrapped = new Error(
      error?.name === "NotSupportedError"
        ? "This recording format cannot be played on this device. Please record again."
        : "Playback could not start. Tap play again or record a new answer.",
    );
    wrapped.code = "AUDIO_PLAYBACK_FAILED";
    wrapped.cause = error;
    throw wrapped;
  }
}

export function revokeObjectUrl(url) {
  if (!url || typeof URL?.revokeObjectURL !== "function") return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    // Object URL may already have been released.
  }
}
