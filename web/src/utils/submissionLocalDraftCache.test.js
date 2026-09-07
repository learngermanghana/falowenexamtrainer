import {
  buildSubmissionLocalDraftKey,
  clearSubmissionLocalDraft,
  pickFreshestSubmissionDraft,
  readSubmissionLocalDraft,
  writeSubmissionLocalDraft,
} from "./submissionLocalDraftCache";

const createMemoryStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
};

describe("submission local draft cache", () => {
  test("isolates drafts by student, level, assignment and mode", () => {
    const first = buildSubmissionLocalDraftKey({
      studentScopeKey: "student-1",
      level: "A2",
      assignmentKey: "A2-5.14",
      mode: "submission",
    });
    const resubmission = buildSubmissionLocalDraftKey({
      studentScopeKey: "student-1",
      level: "A2",
      assignmentKey: "A2-5.14",
      mode: "resubmission",
    });
    expect(first).not.toBe(resubmission);
    expect(first).toContain("student-1");
    expect(first).toContain("a2-5.14");
  });

  test("writes, reads and clears a local shadow draft", () => {
    const storage = createMemoryStorage();
    const key = "draft-key";
    const saved = writeSubmissionLocalDraft({
      storage,
      key,
      now: Date.parse("2026-09-07T19:00:00Z"),
      payload: { submissionText: "TEIL 2\nHallo", structuredSections: { teil2: "Hallo" } },
    });

    expect(saved.savedAt).toBe("2026-09-07T19:00:00.000Z");
    expect(readSubmissionLocalDraft({ storage, key })).toEqual(saved);
    expect(clearSubmissionLocalDraft({ storage, key })).toBe(true);
    expect(readSubmissionLocalDraft({ storage, key })).toBeNull();
  });

  test("restores local work only when it is at least as fresh as the cloud draft", () => {
    const localDraft = { submissionText: "new local", savedAt: "2026-09-07T19:05:00Z" };
    const olderCloud = { submissionText: "old cloud", updatedAt: "2026-09-07T19:04:00Z" };
    const newerCloud = { submissionText: "new cloud", updatedAt: "2026-09-07T19:06:00Z" };

    expect(pickFreshestSubmissionDraft({ localDraft, cloudDraft: olderCloud }).source).toBe("local");
    expect(pickFreshestSubmissionDraft({ localDraft, cloudDraft: newerCloud }).source).toBe("cloud");
  });
});
