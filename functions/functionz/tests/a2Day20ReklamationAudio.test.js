const test = require("node:test");
const assert = require("node:assert/strict");
const { validateA2AudioKey, createA2AudioSignedUrl } = require("../r2CourseAudio.js");

test("only the verified A2 Day 20 Reklamation MP3 can be signed", async () => {
  const key="a2/day-20/reklamation-falsches-hemd.mp3";
  assert.deepEqual(validateA2AudioKey({day:20,key}),{day:20,key});
  for (const invalid of [
    "a2/day-20/other-file.mp3",
    "a2/day-20/reklamation-falsches-hemd.wav",
    "a2/day-20/subfolder/reklamation-falsches-hemd.mp3",
    "a2/day-20/../reklamation-falsches-hemd.mp3",
    "b1/day-20/reklamation-falsches-hemd.mp3",
  ]) assert.equal(validateA2AudioKey({day:20,key:invalid}),null,invalid);
  assert.equal(validateA2AudioKey({day:18,key}),null);
  const signed=await createA2AudioSignedUrl({
    day:20,key,
    env:{
      R2_ACCOUNT_ID:"test-account",
      R2_ACCESS_KEY_ID:"test-access-id",
      R2_SECRET_ACCESS_KEY:"test-access-secret",
      R2_AUDIO_BUCKET:"falowen-course-audio",
    },
    now:new Date("2026-10-23T14:00:00Z"),
  });
  assert.equal(signed.level,"A2");
  assert.equal(signed.key,key);
  assert.ok(signed.url.includes("a2/day-20/reklamation-falsches-hemd.mp3?"));
  assert.match(signed.url,/X-Amz-Signature=/);
});
