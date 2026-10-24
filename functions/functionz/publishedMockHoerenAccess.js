"use strict";

const { isCanonicalMockHoerenObjectKey } = require("./mockHoerenObjectKeys");

// These are the *exact* MP3 keys referenced by the existing, already
// accessible A1/A2 Mock 1 lesson manifests. Never wildcard their directories.
// All other canonical mock keys must be explicitly released server-side.
const EXISTING_RELEASED_CANONICAL_KEYS = new Set([
  "a1/mock-hoeren/mock-01/teil-1.mp3",
  "a1/mock-hoeren/mock-01/teil-2.mp3",
  "a1/mock-hoeren/mock-01/teil-3.mp3",
  "a2/mock-hoeren/mock-01/teil-1.mp3",
  "a2/mock-hoeren/mock-01/teil-2.mp3",
  "a2/mock-hoeren/mock-01/teil-3.mp3",
  "a2/mock-hoeren/mock-01/teil-4.mp3",
]);

/**
 * Authorization is evaluated AFTER normal signed-in / student-level checks
 * and BEFORE issuing an R2 signed URL. A syntactically valid canonical path
 * does NOT imply the mock has been released.
 *
 * Future publish workflow: backend-trusted code writes
 *   publishedMockHoerenAudio/{level-lowercase}-{mockId}
 *   { status: "published", level: "B1", mockId: "mock-02",
 *     parts: { "teil-1": "b1/mock-hoeren/mock-02/teil-1.mp3" } }
 * ONLY after teacher approval and release. Client-provided key/status is
 * never an authorization source, and Firestore reads fail closed.
 */
async function isReleasedMockHoerenAudio({ db, level, mockId, part, key } = {}) {
  const normalized = {
    level: String(level || "").trim().toUpperCase(),
    mockId: String(mockId || "").trim().toLowerCase(),
    part: String(part || "").trim().toLowerCase(),
    key: String(key || ""),
  };

  // Existing noncanonical recordings keep their original validation and
  // protected playback behavior. Those R2 object keys are NOT rewritten.
  if (!isCanonicalMockHoerenObjectKey(normalized)) return true;

  if (EXISTING_RELEASED_CANONICAL_KEYS.has(normalized.key) &&
      normalized.mockId === "mock-01" &&
      (normalized.level === "A1" || normalized.level === "A2")) return true;

  if (!db || typeof db.collection !== "function") return false;
  const documentId = `${normalized.level.toLowerCase()}-${normalized.mockId}`;
  const snapshot = await db.collection("publishedMockHoerenAudio").doc(documentId).get();
  if (!snapshot.exists) return false;
  const manifest = snapshot.data() || {};
  return manifest.status === "published" &&
    manifest.level === normalized.level &&
    manifest.mockId === normalized.mockId &&
    manifest.parts && typeof manifest.parts === "object" &&
    Object.prototype.hasOwnProperty.call(manifest.parts, normalized.part) &&
    manifest.parts[normalized.part] === normalized.key;
}

module.exports = { EXISTING_RELEASED_CANONICAL_KEYS, isReleasedMockHoerenAudio };
