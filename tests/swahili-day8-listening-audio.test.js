const { createSwahiliDayEightAudioHandler } = require("../server/courseMusic.cjs");

const env = {
  FIREBASE_API_KEY: "test-key",
  R2_ACCOUNT_ID: "0".repeat(32),
  R2_ACCESS_KEY_ID: "test-access-key",
  R2_SECRET_ACCESS_KEY: "test-secret-key",
  R2_AUDIO_BUCKET: "falowen-course-audio",
};
const identityLookup = jest.fn(async () => ({
  ok: true,
  json: async () => ({ users: [{ localId: "student-uid", disabled: false }] }),
}));
function res() {
  return {
    statusCode: 200, body: null,
    setHeader() { return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
}
function request(url = "/course-media/swahili/a1/day-8/audio-url", authorization = "Bearer test-token") {
  return { method: "GET", url, headers: { authorization, origin: "https://www.falowen.app" } };
}

test("Day 8 signs exactly the new private swahili/A1/day-08/day-08.mp3 recording", async () => {
  const handler = createSwahiliDayEightAudioHandler({ env, fetchImpl: identityLookup });
  const response = res();
  await handler(request(), response);
  expect(response.statusCode).toBe(200);
  expect(response.body.url).toContain("/swahili/A1/day-08/day-08.mp3?");
  expect(response.body.url).toContain("X-Amz-Signature=");
});

test("Day 8 private audio denies unsigned-in learners", async () => {
  const handler = createSwahiliDayEightAudioHandler({ env, fetchImpl: identityLookup });
  const response = res();
  await handler(request(undefined, ""), response);
  expect(response.statusCode).toBe(401);
  expect(response.body.url).toBeUndefined();
});

test("Day 8 does not allow client-selected private R2 object keys", async () => {
  const handler = createSwahiliDayEightAudioHandler({ env, fetchImpl: identityLookup });
  const response = res();
  await handler(request("/course-media/swahili/a1/day-8/audio-url?key=swahili/A1/day-05/day-05.mp3"), response);
  expect(response.statusCode).toBe(400);
  expect(response.body.url).toBeUndefined();
});
