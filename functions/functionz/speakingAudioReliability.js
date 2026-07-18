const fs = require("fs");
const os = require("os");
const path = require("path");
const fsPromises = require("fs/promises");

const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const ALLOWED_AUDIO_TYPES = [
  "audio/webm",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "audio/mpeg",
  "video/webm",
  "video/mp4",
  "application/octet-stream",
];

function normalizeMimeType(value = "") {
  return String(value || "").split(";")[0].trim().toLowerCase();
}

function extensionForMimeType(value = "") {
  const mimeType = normalizeMimeType(value);
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) return "m4a";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) return "mp3";
  return "webm";
}

function codedError(code, message, status = 422, cause = null) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = status;
  if (cause) error.cause = cause;
  return error;
}

function validateAudioFile(file) {
  const size = Number(file?.size || file?.buffer?.length || 0);
  if (!file?.buffer || !size) {
    throw codedError("AUDIO_EMPTY", "No audio was captured. Please record again.", 400);
  }
  if (size > MAX_AUDIO_BYTES) {
    throw codedError("AUDIO_TOO_LARGE", "Audio file is too large. Record a shorter answer.", 413);
  }

  const mimeType = normalizeMimeType(file.mimetype || "application/octet-stream");
  if (mimeType && !ALLOWED_AUDIO_TYPES.includes(mimeType)) {
    throw codedError("AUDIO_FORMAT_UNSUPPORTED", `Unsupported audio format: ${mimeType}`, 415);
  }
  return { size, mimeType };
}

async function writeTempAudioFile(file) {
  const { mimeType } = validateAudioFile(file);
  const originalExtension = path.extname(String(file?.originalname || "")).replace(/[^a-z0-9.]/gi, "");
  const extension = originalExtension || `.${extensionForMimeType(mimeType)}`;
  const tempPath = path.join(os.tmpdir(), `falowen-speaking-${Date.now()}-${Math.random().toString(36).slice(2, 9)}${extension}`);
  await fsPromises.writeFile(tempPath, file.buffer);
  return tempPath;
}

async function transcribeAudioFile({ file, getOpenAIClient, model = process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-4o-transcribe" }) {
  const tempPath = await writeTempAudioFile(file);
  const client = getOpenAIClient();

  try {
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model,
      language: "de",
    });
    const text = String(transcription?.text || "").trim();
    if (!text) {
      throw codedError("NO_SPEECH_DETECTED", "No clear speech was detected in the recording.", 422);
    }
    return { text, model };
  } catch (error) {
    if (error?.code && String(error.code).startsWith("AUDIO_")) throw error;
    if (error?.code === "NO_SPEECH_DETECTED") throw error;
    const timedOut = error?.code === "ETIMEDOUT" || error?.name === "AbortError" || /timed?\s*out/i.test(String(error?.message || ""));
    throw codedError(
      timedOut ? "TRANSCRIPTION_TIMEOUT" : "TRANSCRIPTION_FAILED",
      timedOut ? "Audio transcription timed out." : "Audio transcription failed.",
      timedOut ? 504 : 422,
      error,
    );
  } finally {
    await fsPromises.unlink(tempPath).catch(() => undefined);
  }
}

function audioHttpError(error, fallback = "Failed to process speaking audio") {
  const code = String(error?.code || "TRANSCRIPTION_FAILED");
  const status = Number(error?.statusCode || (code === "AUDIO_TOO_LARGE" ? 413 : 422));
  return {
    status,
    body: {
      error: String(error?.message || fallback),
      code,
    },
  };
}

function extensionForRemoteAudio(contentType = "") {
  return extensionForMimeType(contentType);
}

module.exports = {
  MAX_AUDIO_BYTES,
  audioHttpError,
  extensionForMimeType,
  extensionForRemoteAudio,
  normalizeMimeType,
  transcribeAudioFile,
  validateAudioFile,
};
