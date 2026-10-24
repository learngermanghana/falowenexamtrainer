"use strict";
const crypto = require("node:crypto");

// Mock 3 has four student-confirmed R2 objects in the canonical bucket.
// Parts 3/4 have byte-for-byte teacher file checksums. Parts 1/2 were
// uploaded earlier and have reviewed question-key JSON, but no trusted
// local MP3s to hash; require a real MP3 under an explicit bounded key.
// This is private listening practice authorization, NOT full mock release.
const APPROVED_A2_MOCK_3_AUDIO = Object.freeze({
  "teil-1": Object.freeze({
    key: "a2/mock-hoeren/mock-03/teil-1.mp3",
    minBytes: 100_000, maxBytes: 5_000_000,
  }),
  "teil-2": Object.freeze({
    key: "a2/mock-hoeren/mock-03/teil-2.mp3",
    minBytes: 100_000, maxBytes: 5_000_000,
  }),
  "teil-3": Object.freeze({
    key: "a2/mock-hoeren/mock-03/teil-3.mp3",
    sha256: "ae4afecadc051433c4c195230c5c46c241c6e81aa8df79bbbd8c46b986c783e7",
    bytes: 1279584,
  }),
  "teil-4": Object.freeze({
    key: "a2/mock-hoeren/mock-03/teil-4.mp3",
    sha256: "d6ece1b3e214ef1d7571807b65d09bc395eb3f8f71c8ebaabe572a8247144fe4",
    bytes: 2809728,
  }),
});
const verifiedUntil = new Map();
const VERIFIED_TTL_MS = 15 * 60 * 1000;

async function verifyTeacherApprovedA2Mock3Audio({
  level, mockId, part, key, signedUrl, fetchImpl = fetch, now = Date.now,
} = {}) {
  if (String(level).toUpperCase() !== "A2" || mockId !== "mock-03") return false;
  const expected = APPROVED_A2_MOCK_3_AUDIO[part];
  if (!expected || key !== expected.key || typeof signedUrl !== "string" ||
      !/^https:\/\/[a-z0-9.-]+\.r2\.cloudflarestorage\.com\//i.test(signedUrl)) return false;
  if (verifiedUntil.get(expected.key) > now()) return true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetchImpl(signedUrl, {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
      signal: controller.signal,
    });
    if (!response?.ok) return false;
    const indicatedLength = Number(response.headers?.get?.("content-length"));
    // Never download a claimed oversized object: limits Cloud Run/R2 costs.
    if (!Number.isFinite(indicatedLength) || indicatedLength <= 0 || indicatedLength > 5_000_000) return false;
    if (expected.bytes && indicatedLength !== expected.bytes) return false;
    if (expected.minBytes && (indicatedLength < expected.minBytes || indicatedLength > expected.maxBytes)) return false;
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length !== indicatedLength) return false;
    if (expected.sha256) {
      if (bytes.length !== expected.bytes) return false;
      const actual = crypto.createHash("sha256").update(bytes).digest();
      const target = Buffer.from(expected.sha256, "hex");
      if (actual.length !== target.length || !crypto.timingSafeEqual(actual, target)) return false;
    } else {
      // Parts 1/2: teacher-confirmed file presence plus bounded MP3 header.
      // An MP3 header alone cannot prove the recording matches the questions.
      const id3 = bytes.subarray(0,3).toString("ascii") === "ID3";
      const frame = bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
      if (!id3 && !frame) return false;
    }
    verifiedUntil.set(expected.key, now() + VERIFIED_TTL_MS);
    return true;
  } catch {
    // Never expose the R2 signed URL or object response to client error text.
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { APPROVED_A2_MOCK_3_AUDIO, verifyTeacherApprovedA2Mock3Audio };
