const {
  isPublisherOwner, validatePublication, signedStudioUrl,
  publishHoerenLesson, toStudentLesson, scoreHoerenLesson,
} = require("../courseHoerenPublishing");

const TEST_ENV = {
  R2_ACCOUNT_ID: "1234567890abcdef",
  R2_ACCESS_KEY_ID: "test-access",
  R2_SECRET_ACCESS_KEY: "test-secret",
  R2_AUDIO_BUCKET: "falowen-course-audio",
  HOEREN_STUDIO_OWNER_UID: "owner",
};
const SCRIPT = "A: Guten Tag! Ich fahre morgen nach Berlin.\nB: Die Fahrkarten bekommen Sie bei mir.\nA: Ich fahre mit meiner Schwester.";
const questions = [
  { question: "Sie fährt mit ihrer Schwester.", answer: "Richtig", evidence: "mit meiner Schwester" },
  { question: "Sie fährt nach Hamburg.", answer: "Falsch", evidence: "nach Berlin" },
  { question: "Die Fahrkarten bekommt sie bei einem Mitarbeiter.", answer: "Richtig", evidence: "bei mir" },
  { question: "Sie fährt nach Berlin heute.", answer: "Falsch", evidence: "morgen nach Berlin" },
  { question: "Sie möchte eine Fahrkarte kaufen.", answer: "Richtig", evidence: "Fahrkarten bekommen Sie" },
];
const mp3 = Buffer.concat([Buffer.from("ID3"), Buffer.alloc(2048)]);
const meta = { assignmentKey: "A1-12.1", level: "A1", day: 18, title: "Eine Fahrkarte am Bahnhof kaufen",
  script: SCRIPT, kind: "richtig-falsch", questions, teacherApproved: true };

test("only approved owner can publish to a valid lesson", () => {
  expect(isPublisherOwner("owner", TEST_ENV)).toBe(true);
  expect(isPublisherOwner("student", TEST_ENV)).toBe(false);
  expect(validatePublication(meta, mp3).questions).toHaveLength(5);
  expect(() => validatePublication({ ...meta, teacherApproved: false }, mp3)).toThrow(/approve/);
  expect(() => validatePublication({ ...meta, assignmentKey: "B1-12.1" }, mp3)).toThrow(/match/);
  expect(() => validatePublication({ ...meta, questions: questions.slice(0, 4) }, mp3)).toThrow(/five/);
  expect(() => validatePublication(meta, Buffer.from("invalid file"))).toThrow(/valid MP3/);
});

test("R2 signer never accepts an arbitrary object path or method", () => {
  const key = "a1/studio/a1-12.1/123e4567-e89b-12d3-a456-426614174000.mp3";
  const url = signedStudioUrl({ method: "PUT", key, env: TEST_ENV, now: new Date("2026-10-18T12:00:00Z") });
  expect(url).toContain("X-Amz-Signature=");
  expect(url).toContain("/a1/studio/a1-12.1/");
  expect(() => signedStudioUrl({ method: "DELETE", key, env: TEST_ENV })).toThrow();
  expect(() => signedStudioUrl({ key: "a1/day-18/day-18.mp3", env: TEST_ENV })).toThrow();
});

test("publication uploads one MP3 and writes a revision and active Firestore record", async () => {
  const records = [];
  const db = { collection: () => ({ doc: assignment => ({
    collection: () => ({ doc: revision => ({ create: async obj => records.push(["revision", revision, obj]) }) }),
    set: async obj => records.push(["active", assignment, obj]),
  }) }) };
  const sent = [];
  const fetchImpl = async (url, opts) => {
    sent.push({ url, opts });
    return { ok: true, status: 200 };
  };
  const result = await publishHoerenLesson({ db, metadata: meta, audio: mp3, uid: "owner", env: TEST_ENV, fetchImpl });
  expect(result.assignmentKey).toBe("A1-12.1");
  expect(sent).toHaveLength(1);
  expect(sent[0].opts.method).toBe("PUT");
  expect(sent[0].opts.body.equals(mp3)).toBe(true);
  expect(records.map(([kind]) => kind)).toEqual(["revision", "active"]);
  const publicData = toStudentLesson(records[1][2], "https://example.test/temporary.mp3");
  expect(publicData.questions).toHaveLength(5);
  expect(JSON.stringify(publicData)).not.toContain("correctIndex");
  expect(JSON.stringify(publicData)).not.toContain("Richtig");
  expect(JSON.stringify(publicData)).not.toContain("evidence");
  expect(scoreHoerenLesson(records[1][2], questions.map(q => q.answer))).toEqual({ correct: 5, total: 5, score: 100 });
  expect(scoreHoerenLesson(records[1][2], ["Richtig", "Richtig", "Richtig", "Falsch", "Richtig"]).score).toBe(80);
});

test("upload failure cannot publish or write lesson records", async () => {
  let writes = 0;
  const db = { collection: () => { writes += 1; throw new Error("Unexpected write"); } };
  await expect(publishHoerenLesson({ db, metadata: meta, audio: mp3, uid: "owner", env: TEST_ENV,
    fetchImpl: async () => ({ ok: false, status: 403 }),
  })).rejects.toThrow(/R2 upload failed/);
  expect(writes).toBe(0);
  await expect(publishHoerenLesson({ db, metadata: meta, audio: mp3, uid: "student", env: TEST_ENV,
    fetchImpl: async () => ({ ok: true, status: 200 }),
  })).rejects.toThrow(/Owner/);
});
