const test = require("node:test");
const assert = require("node:assert/strict");
const {
  validateB1AudioKey, validateCourseAudioKey, createB1AudioSignedUrl
} = require("../r2CourseAudio.js");

test("B1 Day 25 signed playback accepts only the uploaded verified recording", async () => {
  const key = "b1/day-25/online-shopping-verbraucherservice.mp3";
  assert.deepEqual(validateB1AudioKey({ day: 25, key }), { day: 25, key });
  assert.equal(validateB1AudioKey({ day: 24, key }), null);
  for (const other of [
    "b1/day-25/another-file.mp3",
    "b1/day-25/online-shopping-verbraucherservice.wav",
    "b1/day-25/../online-shopping-verbraucherservice.mp3",
    "b1/day-25/other/online-shopping-verbraucherservice.mp3",
  ]) assert.equal(validateB1AudioKey({ day: 25, key: other }), null, other);
  assert.equal(validateCourseAudioKey({ level: "B2", day: 25, key }), null);
  const signed = await createB1AudioSignedUrl({
    day: 25, key,
    env: {
      R2_ACCOUNT_ID: "exampleaccount", R2_ACCESS_KEY_ID: "test-access-id",
      R2_SECRET_ACCESS_KEY: "test-access-secret", R2_AUDIO_BUCKET: "falowen-course-audio",
    },
    now: new Date("2026-10-23T12:00:00Z"),
  });
  assert.equal(signed.level, "B1");
  assert.equal(signed.key, key);
  assert.match(signed.url, /b1\/day-25\/online-shopping-verbraucherservice\.mp3\?/);
  assert.match(signed.url, /X-Amz-Signature=/);
});
