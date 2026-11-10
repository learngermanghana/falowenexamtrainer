"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  APPROVED_A2_MOCK_05_AUDIO,
  verifyA2Mock05Audio,
} = require("../a2Mock05PublishedAudio");
const answerKeys = require("../a2Mock05HoerenKeys");

test("A2 Mock 05 has four exact approved protected audio identities and 20 private listening answers", () => {
  assert.deepEqual(Object.keys(APPROVED_A2_MOCK_05_AUDIO), ["teil-1", "teil-2", "teil-3", "teil-4"]);
  assert.deepEqual(Object.keys(answerKeys), Array.from({ length: 20 }, (_, n) => String(n + 1)));
  for (let n = 1; n <= 4; n++) {
    const entry = APPROVED_A2_MOCK_05_AUDIO[`teil-${n}`];
    assert.equal(entry.key, `a2/mock-hoeren/mock-05/teil-${n}.mp3`);
    assert.match(entry.sha256, /^[0-9a-f]{64}$/);
    assert.ok(entry.bytes > 100_000 && entry.bytes < 4_000_000);
  }
});

test("A2 Mock 05 Hören rejects wrong identity, wrong bytes and an inaccessible object", async () => {
  const expected = APPROVED_A2_MOCK_05_AUDIO["teil-1"];
  const request = {
    level: "A2",
    mockId: "mock-05",
    part: "teil-1",
    key: expected.key,
    signedUrl: "https://bucket.r2.cloudflarestorage.com/approved-object",
  };
  const differentAudio = async () => ({
    ok: true,
    headers: { get: () => String(expected.bytes) },
    arrayBuffer: async () => Buffer.alloc(expected.bytes),
  });
  assert.equal(await verifyA2Mock05Audio({ ...request, mockId: "mock-08" }), false);
  assert.equal(await verifyA2Mock05Audio({ ...request, key: expected.key + "-other" }), false);
  assert.equal(await verifyA2Mock05Audio({ ...request, fetchImpl: differentAudio }), false);
  assert.equal(await verifyA2Mock05Audio({ ...request, fetchImpl: async () => ({ ok: false }) }), false);
  assert.equal(await verifyA2Mock05Audio({ ...request, signedUrl: "http://untrusted.invalid/mp3" }), false);
});
