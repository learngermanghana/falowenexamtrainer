"use strict";

/**
 * Canonical Cloudflare R2 key for *new* Falowen mock Hören recordings.
 *
 * Display text: "Hören" (with ö).
 * APIs and object keys: "hoeren" (ASCII lowercase).
 * Do NOT rewrite, lowercase, or move existing Cloudflare objects: R2 object keys
 * are case sensitive and several live mock/sample files use legacy folders.
 *
 * All new mock audio is MP3 at <level>/mock-hoeren/mock-XX/teil-X.mp3.
 * Legacy keys are still validated separately by r2CourseAudio.js.
 */
const MOCK_HOEREN_PART_COUNTS = Object.freeze({ A1: 3, A2: 4, B1: 4, B2: 4 });

function buildMockHoerenObjectKey({ level, mockId, part } = {}) {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const normalizedMock = String(mockId || "").trim().toLowerCase();
  const normalizedPart = String(part || "").trim().toLowerCase();
  const maxParts = MOCK_HOEREN_PART_COUNTS[normalizedLevel];
  if (!maxParts || !/^mock-\d{2}$/.test(normalizedMock) ||
      !/^teil-[1-4]$/.test(normalizedPart) ||
      Number(normalizedPart.slice(-1)) > maxParts) {
    throw new Error("Invalid Hören mock level, mock ID or listening part.");
  }
  return `${normalizedLevel.toLowerCase()}/mock-hoeren/${normalizedMock}/${normalizedPart}.mp3`;
}

function isCanonicalMockHoerenObjectKey({ level, mockId, part, key } = {}) {
  try {
    return String(key || "") === buildMockHoerenObjectKey({ level, mockId, part });
  } catch {
    return false;
  }
}

module.exports = { MOCK_HOEREN_PART_COUNTS, buildMockHoerenObjectKey, isCanonicalMockHoerenObjectKey };
