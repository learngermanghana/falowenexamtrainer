import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  buildRecordedAudioBlob,
  extensionForAudioMimeType,
  filenameForAudioBlob,
  maxSpeakingRecordingSeconds,
  resolveSupportedAudioMimeType,
  userFacingAudioError,
} from "../web/src/lib/speakingAudio.js";

const require = createRequire(import.meta.url);
const backend = require("../functions/functionz/speakingAudioReliability.js");

test("chooses a browser-supported recording MIME type", () => {
  class FakeRecorder {}
  FakeRecorder.isTypeSupported = (value) => value === "audio/mp4";
  assert.equal(resolveSupportedAudioMimeType(FakeRecorder), "audio/mp4");
});

test("preserves the recorder MIME type instead of forcing webm", () => {
  const chunk = new Blob([Buffer.from("audio")], { type: "audio/mp4" });
  const blob = buildRecordedAudioBlob([chunk], { mimeType: "audio/mp4" });
  assert.equal(blob.type, "audio/mp4");
  assert.equal(filenameForAudioBlob(blob), "recording.m4a");
});

test("uses task-aware maximum durations", () => {
  assert.equal(maxSpeakingRecordingSeconds({ level: "A2", context: "exam" }), 180);
  assert.equal(maxSpeakingRecordingSeconds({ level: "B2", context: "workbook" }), 240);
  assert.equal(maxSpeakingRecordingSeconds({ level: "C1", context: "workbook" }), 300);
});

test("maps structured transcription failures to useful student messages", () => {
  assert.match(userFacingAudioError({ code: "NO_SPEECH_DETECTED" }), /clear speech|hear clear speech/i);
  assert.match(userFacingAudioError({ response: { data: { code: "TRANSCRIPTION_TIMEOUT" } } }), /took too long/i);
});

test("backend accepts common browser and WebView formats", () => {
  assert.equal(backend.extensionForMimeType("audio/mp4;codecs=mp4a.40.2"), "m4a");
  assert.equal(backend.extensionForMimeType("audio/webm;codecs=opus"), "webm");
  const valid = backend.validateAudioFile({
    buffer: Buffer.from("recorded-audio"),
    size: 14,
    mimetype: "audio/mp4",
    originalname: "answer.m4a",
  });
  assert.equal(valid.mimeType, "audio/mp4");

  const webViewCapture = backend.validateAudioFile({
    buffer: Buffer.from("webview-audio"),
    size: 13,
    mimetype: "video/webm;codecs=opus",
    originalname: "answer.webm",
  });
  assert.equal(webViewCapture.mimeType, "video/webm");
});

test("backend rejects empty and unsupported audio with stable codes", () => {
  assert.throws(
    () => backend.validateAudioFile({ buffer: Buffer.alloc(0), size: 0, mimetype: "audio/webm" }),
    (error) => error.code === "AUDIO_EMPTY",
  );
  assert.throws(
    () => backend.validateAudioFile({ buffer: Buffer.from("x"), size: 1, mimetype: "text/plain" }),
    (error) => error.code === "AUDIO_FORMAT_UNSUPPORTED",
  );
});

test("audio extensions remain compatible with accepted transcription formats", () => {
  assert.equal(extensionForAudioMimeType("audio/ogg;codecs=opus"), "ogg");
  assert.equal(extensionForAudioMimeType("audio/mpeg"), "mp3");
});
