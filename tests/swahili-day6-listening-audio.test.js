const { createSwahiliDayOneAudioHandler, createSwahiliDayTwoAudioHandler, createSwahiliDayThreeAudioHandler, createSwahiliDayFiveAudioHandler, createSwahiliDaySixAudioHandler, createSwahiliDaySevenAudioHandler, createSwahiliDayTenAudioHandler, createSwahiliDayElevenAudioHandler, createSwahiliDayTwelveAudioHandler, createMusicHandler } = require("../server/courseMusic.cjs");

const env = {
  FIREBASE_API_KEY: "test-key",
  R2_ACCOUNT_ID: "0".repeat(32),
  R2_ACCESS_KEY_ID: "test-access-key",
  R2_SECRET_ACCESS_KEY: "test-secret-key",
  R2_AUDIO_BUCKET: "falowen-course-audio",
};
const validAccountLookup = jest.fn(async () => ({
  ok: true, json: async () => ({ users: [{ localId: "student-uid", disabled: false }] }),
}));
function response() {
  return {
    statusCode: 200, body: undefined,
    setHeader() { return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
}
function request(url, authorization = "Bearer test-token") {
  return { method: "GET", url, headers: { authorization, origin: "https://www.falowen.app" } };
}
const listeningRoute = "/course-media/swahili/a1/day-6/audio-url";

test("Day 6 listening requires a signed-in Firebase account", async () => {
  const handler = createSwahiliDaySixAudioHandler({ env, fetchImpl: validAccountLookup });
  const res = response();
  await handler(request(listeningRoute, ""), res);
  expect(res.statusCode).toBe(401);
  expect(res.body.url).toBeUndefined();
});

test("Day 6 listening signs only the approved private R2 object", async () => {
  const handler = createSwahiliDaySixAudioHandler({ env, fetchImpl: validAccountLookup });
  const res = response();
  await handler(request(listeningRoute), res);
  expect(res.statusCode).toBe(200);
  expect(res.body.url).toContain("/swahili/A1/day-06/day-06.mp3?");
  expect(res.body.url).toContain("X-Amz-Signature=");
});

test("Day 6 listening rejects arbitrary object-key requests", async () => {
  const handler = createSwahiliDaySixAudioHandler({ env, fetchImpl: validAccountLookup });
  const res = response();
  await handler(request(listeningRoute + "?key=private/another-track.mp3"), res);
  expect(res.statusCode).toBe(400);
  expect(res.body.url).toBeUndefined();
});

test("Staff-only music endpoint is still staff-only", async () => {
  const handler = createMusicHandler({ env, fetchImpl: validAccountLookup, prepare: async () => ({url: "https://example.com/audio"}) });
  const res = response();
  await handler(request("/course-media/music/audio-url?track=anything"), res);
  expect(res.statusCode).toBe(403);
});

test("Day 5 signs only its own private recording for a signed-in learner", async () => {
  const handler = createSwahiliDayFiveAudioHandler({ env, fetchImpl: validAccountLookup });
  const route = "/course-media/swahili/a1/day-5/audio-url";
  const valid = response();
  await handler(request(route), valid);
  expect(valid.statusCode).toBe(200);
  expect(valid.body.url).toContain("/swahili/A1/day-05/day-05.mp3?");
  const anonymous = response();
  await handler(request(route, ""), anonymous);
  expect(anonymous.statusCode).toBe(401);
  const override = response();
  await handler(request(route + "?key=swahili/A1/day-06/day-06.mp3"), override);
  expect(override.statusCode).toBe(400);
  expect(override.body.url).toBeUndefined();
});

test("Day 1 signs its own private recording and rejects anonymous access", async () => {
  const handler = createSwahiliDayOneAudioHandler({ env, fetchImpl: validAccountLookup });
  const route = "/course-media/swahili/a1/day-1/audio-url";
  const valid = response();
  await handler(request(route), valid);
  expect(valid.statusCode).toBe(200);
  expect(valid.body.url).toContain("/swahili/A1/day-01/day-01.mp3?");
  const anonymous = response();
  await handler(request(route, ""), anonymous);
  expect(anonymous.statusCode).toBe(401);
  const override = response();
  await handler(request(route + "?key=swahili/A1/day-05/day-05.mp3"), override);
  expect(override.statusCode).toBe(400);
});

test.each([
  [2, "02", createSwahiliDayTwoAudioHandler],
  [3, "03", createSwahiliDayThreeAudioHandler],
  [7, "07", createSwahiliDaySevenAudioHandler],
  [10, "10", createSwahiliDayTenAudioHandler],
  [11, "11", createSwahiliDayElevenAudioHandler],
  [12, "12", createSwahiliDayTwelveAudioHandler],
])("Day %i only signs its private recording for a signed-in account", async (day, folderDay, createHandler) => {
  const handler = createHandler({ env, fetchImpl: validAccountLookup });
  const route = `/course-media/swahili/a1/day-${day}/audio-url`;
  const valid = response();
  await handler(request(route), valid);
  expect(valid.statusCode).toBe(200);
  expect(valid.body.url).toContain(`/swahili/A1/day-${folderDay}/day-${folderDay}.mp3?`);
  const anonymous = response();
  await handler(request(route, ""), anonymous);
  expect(anonymous.statusCode).toBe(401);
  const override = response();
  await handler(request(route + "?key=swahili/A1/day-05/day-05.mp3"), override);
  expect(override.statusCode).toBe(400);
});
