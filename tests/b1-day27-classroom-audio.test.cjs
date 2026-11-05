const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createClassroomAudioHandler, signTrack } = require("../server/courseMusic.cjs");

const env = {
  R2_ACCOUNT_ID: "a".repeat(32),
  R2_ACCESS_KEY_ID: "test-key",
  R2_SECRET_ACCESS_KEY: "test-secret",
  R2_AUDIO_BUCKET: "falowen-course-audio",
  REACT_APP_FIREBASE_API_KEY: "test-public-key",
};
const staff = { localId: "teacher", customAttributes: '{"role":"teacher"}' };
const response = () => ({
  headers: {},
  setHeader(key, value) { this.headers[key] = value; },
  status(code) { this.code = code; return this; },
  json(body) { this.body = body; return this; },
  end() { return this; },
});
const key = "b1/day-27/umweltfreundlich-im-alltag.mp3";

test("Day 27 teacher Hören signs only the exact private R2 object for authorized staff", async () => {
  const cases = [
    [null, "B1", 27, key, 401],
    [{ localId: "student", email: "student@example.com" }, "B1", 27, key, 403],
    [staff, "B1", 27, key, 200],
    [{ ...staff, disabled: true }, "B1", 27, key, 401],
    [staff, "A2", 27, key, 400],
    [staff, "B1", 26, key, 400],
    [staff, "B1", 27, "b1/day-27/day-27.mp3", 400],
    [staff, "B1", 27, "b1/day-27/other.mp3", 400],
    [staff, "B1", 27, "b1/day-27/../secret.mp3", 400],
    [staff, "B1", 27, "b1/day-27/umweltfreundlich-im-alltag.wav", 400],
  ];
  for (const [account, level, day, requested, expected] of cases) {
    const handler = createClassroomAudioHandler({
      env,
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ users: account ? [account] : [] }),
      }),
    });
    const res = response();
    await handler({
      method: "GET",
      headers: account ? { authorization: "Bearer teacher-token", origin: "https://admin.falowen.app" } : {},
      url: "/course-media/classroom/audio-url?" + new URLSearchParams({ level, day: String(day), key: requested }),
    }, res);
    assert.equal(res.code, expected, level + " " + day + " " + requested);
    assert.equal(Boolean(res.body.url), expected === 200);
    if (expected === 200) {
      const signed = new URL(res.body.url);
      assert.equal(signed.pathname, "/" + key);
      assert.match(signed.searchParams.get("X-Amz-Signature"), /^[a-f0-9]{64}$/);
      assert.equal(res.headers["Cache-Control"], "private, no-store");
      assert.equal(res.headers["Access-Control-Allow-Origin"], "https://admin.falowen.app");
    }
  }
  assert.throws(() => signTrack("b1-day27-environmental-habits", env), /Unknown/);
});

test("Day 28 teacher Hören uses the teacher-confirmed Day 27-named MP3 without expanding R2 access", async () => {
  const cases = [
    [null, "B1", 28, key, 401],
    [{ localId: "student", email: "student@example.com" }, "B1", 28, key, 403],
    [staff, "B1", 28, key, 200],
    [{ ...staff, disabled: true }, "B1", 28, key, 401],
    [staff, "A2", 28, key, 400],
    [staff, "B1", 29, key, 400],
    [staff, "B1", 28, "b1/day-28/umweltfreundlich-im-alltag.mp3", 400],
    [staff, "B1", 28, "b1/day-27/another.mp3", 400],
    [staff, "B1", 28, "b1/day-27/../private.mp3", 400],
    [staff, "B1", 28, "b1/day-27/umweltfreundlich-im-alltag.wav", 400],
  ];
  for (const [account, level, day, requested, expected] of cases) {
    const handler = createClassroomAudioHandler({
      env,
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ users: account ? [account] : [] }),
      }),
    });
    const res = response();
    await handler({
      method: "GET",
      headers: account ? { authorization: "Bearer teacher-token", origin: "https://admin.falowen.app" } : {},
      url: "/course-media/classroom/audio-url?" + new URLSearchParams({ level, day: String(day), key: requested }),
    }, res);
    assert.equal(res.code, expected, level + " " + day + " " + requested);
    assert.equal(Boolean(res.body.url), expected === 200);
    if (expected === 200) {
      const signed = new URL(res.body.url);
      assert.equal(signed.pathname, "/" + key);
      assert.match(signed.searchParams.get("X-Amz-Signature"), /^[a-f0-9]{64}$/);
      assert.equal(res.headers["Cache-Control"], "private, no-store");
      assert.equal(res.headers["Access-Control-Allow-Origin"], "https://admin.falowen.app");
    }
  }
  assert.throws(() => signTrack("b1-day28-climate-habits", env), /Unknown/);
});
