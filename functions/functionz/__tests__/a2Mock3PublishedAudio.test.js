"use strict";
const crypto = require("node:crypto");
const {
  APPROVED_A2_MOCK_3_AUDIO, verifyTeacherApprovedA2Mock3Audio,
} = require("../a2Mock3PublishedAudio");

const signedUrl = "https://falowen-course-audio.account.r2.cloudflarestorage.com/a2/mock-hoeren/mock-03/teil-3.mp3";
const params = {
  level: "A2", mockId: "mock-03", part: "teil-3",
  key: APPROVED_A2_MOCK_3_AUDIO["teil-3"].key, signedUrl,
};

describe("A2 Mock 3 teacher-approved R2 release", () => {
  test("rejects all other mock numbers and unapproved parts without fetching", async () => {
    const fetchImpl = jest.fn(() => { throw Error("Should never fetch"); });
    for (const override of [
      { mockId: "mock-02" }, { level: "A1" }, { part: "teil-5" },
      { key: "a2/mock-hoeren/mock-03/teil-4.mp3" }, { key: "mock-hoeren/mock-03/teil-3.mp3" },
      { signedUrl: "https://attacker.example/key.mp3" },
    ]) {
      expect(await verifyTeacherApprovedA2Mock3Audio({ ...params, ...override, fetchImpl })).toBe(false);
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("does not authorize object with wrong bytes, even with successful HTTP", async () => {
    const bytes = Buffer.alloc(APPROVED_A2_MOCK_3_AUDIO["teil-3"].bytes, 1);
    const fetchImpl = async () => ({
      ok: true,
      headers: { get: () => String(bytes.length) },
      arrayBuffer: async () => bytes,
    });
    expect(await verifyTeacherApprovedA2Mock3Audio({ ...params, fetchImpl })).toBe(false);
  });

  test("fails closed on missing object, incorrect Content-Length, or network failure", async () => {
    const bytes = Buffer.from("not an mp3");
    expect(await verifyTeacherApprovedA2Mock3Audio({
      ...params, fetchImpl: async () => ({ ok: false, status: 404 }),
    })).toBe(false);
    expect(await verifyTeacherApprovedA2Mock3Audio({
      ...params, fetchImpl: async () => ({
        ok: true, headers: { get: () => "123" }, arrayBuffer: async () => bytes,
      }),
    })).toBe(false);
    expect(await verifyTeacherApprovedA2Mock3Audio({
      ...params, fetchImpl: () => { throw Error("network failed"); },
    })).toBe(false);
  });

  test("all four approved recordings have exact canonical R2 object paths and safe verification requirements", () => {
    for (const [part, entry] of Object.entries(APPROVED_A2_MOCK_3_AUDIO)) {
      expect(part).toMatch(/^teil-[1234]$/);
      expect(entry.key).toBe(`a2/mock-hoeren/mock-03/${part}.mp3`);
      if (["teil-3", "teil-4"].includes(part)) {
        expect(entry.sha256).toMatch(/^[0-9a-f]{64}$/);
        expect(entry.bytes).toBeGreaterThan(1_000_000);
        expect(crypto.createHash("sha256").update(Buffer.from("not the approved MP3")).digest("hex")).not.toBe(entry.sha256);
      } else {
        expect(entry.minBytes).toBeGreaterThanOrEqual(100_000);
        expect(entry.maxBytes).toBeLessThanOrEqual(5_000_000);
      }
    }
  });
});

test.each(["teil-1", "teil-2"])("%s validates an uploaded bounded MP3 header before granting playback", async part => {
  const length = 110_000;
  const bytes = Buffer.alloc(length);
  Buffer.from("ID3").copy(bytes, 0);
  const fetchImpl = jest.fn(async () => ({
    ok: true,
    headers: { get: name => name.toLowerCase() === "content-length" ? String(length) : "audio/mpeg" },
    arrayBuffer: async () => bytes,
  }));
  const approved = APPROVED_A2_MOCK_3_AUDIO[part];
  const allowed = await verifyTeacherApprovedA2Mock3Audio({
    level: "A2", mockId: "mock-03", part, key: approved.key,
    signedUrl: `https://falowen-course-audio.account.r2.cloudflarestorage.com/a2/mock-hoeren/mock-03/${part}.mp3`,
    fetchImpl,
  });
  expect(allowed).toBe(true);
  expect(fetchImpl).toHaveBeenCalledTimes(1);
});

test("Teil 1 rejects an R2 object that is not MP3 despite correct object key and size", async () => {
 const bytes = Buffer.alloc(123_456, 22);
 const result = await verifyTeacherApprovedA2Mock3Audio({
   level:"A2", mockId:"mock-03", part:"teil-1",
   key:APPROVED_A2_MOCK_3_AUDIO["teil-1"].key,
   signedUrl: "https://falowen-course-audio.account.r2.cloudflarestorage.com/a2/mock-hoeren/mock-03/teil-1.mp3",
   now: () => Date.now() + 20 * 60 * 1000, // bypass positive-case 15-min attestation cache
   fetchImpl: async () => ({
     ok: true, headers:{ get:()=>String(bytes.length) }, arrayBuffer:async()=>bytes,
   }),
 });
 expect(result).toBe(false);
});
