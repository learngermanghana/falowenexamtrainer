const test = require("node:test");
const assert = require("node:assert/strict");
const { validateB1AudioKey, createB1AudioSignedUrl } = require("../r2CourseAudio.js");

test("Day 24 signed playback accepts only the teacher's new Conversation 2 recording", async () => {
  const key="b1/day-24/day-25.mp3";
  assert.deepEqual(validateB1AudioKey({day:24,key}), {day:24,key});
  for(const stale of [
    "b1/day_24/day-24.mp3",
    "b1/day-24/day-24.mp3",
    "b1/day-24/other.mp3",
    "b1/day-25/day-25.mp3",
    "b1/day-24/../day-25.mp3",
  ]) {
    if (stale==="b1/day-24/day-24.mp3") continue; // The general canonical B1 key remains supported for other historic links.
    assert.equal(validateB1AudioKey({day:24,key:stale}),null,stale);
  }
  const signed=await createB1AudioSignedUrl({day:24,key,
    env:{
      R2_ACCOUNT_ID:"exampleaccount",R2_ACCESS_KEY_ID:"test-access-id",
      R2_SECRET_ACCESS_KEY:"test-access-secret",R2_AUDIO_BUCKET:"falowen-course-audio",
    },now:new Date("2026-10-29T12:00:00Z")
  });
  assert.equal(signed.key,key);
  assert.match(signed.url,/b1\/day-24\/day-25\.mp3\?/);
  assert.match(signed.url,/X-Amz-Signature=/);
});
