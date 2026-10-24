const test = require("node:test");
const assert = require("node:assert/strict");
const { validateA2AudioKey, createA2AudioSignedUrl } = require("../r2CourseAudio.js");

test("signed A2 Day 18 Bank listening accepts only canonical uploaded MP3", async () => {
  const key = "a2/day-18/bank-telefonat.mp3";
  assert.deepEqual(validateA2AudioKey({ day: 18, key }), { day: 18, key });
  const forbidden = [
    "a2/day-18/another-file.mp3",
    "a2/day-18/bank-telefonat.wav",
    "a2/day-18/../bank-telefonat.mp3",
    "a2/day-18/other/bank-telefonat.mp3",
    "b1/day-18/bank-telefonat.mp3",
  ];
  for (const other of forbidden) {
    assert.equal(validateA2AudioKey({ day: 18, key: other }), null, other);
  }
  assert.equal(validateA2AudioKey({ day: 17, key }), null);
  const signed = await createA2AudioSignedUrl({
    day: 18, key,
    env: {
      R2_ACCOUNT_ID: "test-account", R2_ACCESS_KEY_ID: "test-access-id",
      R2_SECRET_ACCESS_KEY: "test-access-secret",
      R2_AUDIO_BUCKET: "falowen-course-audio",
    },
    now: new Date("2026-10-23T14:00:00Z"),
  });
  assert.equal(signed.level, "A2");
  assert.equal(signed.key, key);
  assert.match(signed.url, /a2\/day-18\/bank-telefonat\.mp3\?/);
  assert.match(signed.url, /X-Amz-Signature=/);
});
