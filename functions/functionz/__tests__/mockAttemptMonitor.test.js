const { normalizeMockAttempt, normalizeBrowserProgress, listMockAttempts, isAuthorizedMockMonitor } = require("../mockAttemptMonitor");

test("mock monitor redacts student answers and preserves section timing", () => {
  const row = normalizeMockAttempt({
    id: "a", ref: { path: "a2MockExamUsers/uid123/attempts/a" },
    data: () => ({
      uid: "uid123", email: "student@example.org", mockId: "a2-mock-01",
      status: "in_progress", section: "hoeren", attemptNumber: 2,
      sectionScores: { lesen: 17, hoeren: null },
      startedAt: "2026-10-09T11:00:00Z", updatedAt: "2026-10-09T11:15:00Z",
      state: { stage: "hoeren", sectionDeadlineMs: 1791546000000,
        lesenAnswers: { hidden: "secret" }, schreibenText: "private text" },
    }),
  });
  expect(row.level).toBe("A2");
  expect(row.section).toBe("hoeren");
  expect(row.completedSections).toEqual(["lesen"]);
  expect(row.progressCount).toBe(1);
  expect(row.sectionDeadlineMs).toBe(1791546000000);
  expect(JSON.stringify(row)).not.toMatch(/private text|secret/);
});

test("unrelated nested attempts are excluded and completed scores are verified", () => {
  expect(normalizeMockAttempt({
    id: "x", ref: { path: "writingProgress/uid/attempts/x" }, data: () => ({}),
  })).toBeNull();
  const completed = normalizeMockAttempt({
    id: "b", ref: { path: "b1MockExamUsers/uid/attempts/b" },
    data: () => ({ status: "completed", sectionScores: { lesen: 0, hoeren: 10 },
      overall: { score: 99 }, verifiedOverall: { score: 80 } }),
  });
  expect(completed.overallScore).toBe(80);
  expect(completed.progressCount).toBe(2);
});

test("staff projection includes all four server-verified section scores for audit", () => {
  const row = normalizeMockAttempt({
    id: "verified", ref: { path: "a1MockExamUsers/uid/attempts/verified" },
    data: () => ({
      status: "completed",
      sectionScores: { lesen: 0, hoeren: 0, schreiben: 0, sprechen: 0 },
      verifiedSectionScores: { lesen: 22.5, hoeren: 18, schreiben: 20, sprechen: 19.5 },
      verifiedOverall: { score: 80 },
      completionSync: { ok: true, scoreDocId: "private-result-doc-id" },
      state: { lesenAnswers: { private: "secret answer" } },
    }),
  });
  expect(row.sectionScores).toEqual({ lesen: 22.5, hoeren: 18, schreiben: 20, sprechen: 19.5 });
  expect(row.scoreVerification).toBe("verified");
  expect(row.sectionTotal).toBe(80);
  expect(row.scoreMatchesOverall).toBe(true);
  expect(row.overallScore).toBe(80);
  expect(row.completionSyncStatus).toBe("saved");
  expect(JSON.stringify(row)).not.toMatch(/secret answer|private-result-doc-id/);
});

test("missing scores stay absent, true zero stays zero, and mismatches are flagged", () => {
  const incomplete = normalizeMockAttempt({
    id: "incomplete", ref: { path: "a2MockExamUsers/uid/attempts/incomplete" },
    data: () => ({
      status: "in_progress",
      sectionScores: { lesen: 25, hoeren: 18, schreiben: 20, sprechen: 23 },
      verifiedSections: { schreiben: { verified: true, score: 0 }, sprechen: { verified: false, score: 25 } },
      overall: { score: 99 },
    }),
  });
  expect(incomplete.sectionScores).toEqual({ schreiben: 0 });
  expect(incomplete.scoreVerification).toBe("in_progress");
  expect(incomplete.sectionTotal).toBeNull();
  expect(incomplete.overallScore).toBeNull();
  const conflict = normalizeMockAttempt({
    id: "conflict", ref: { path: "b1MockExamUsers/uid/attempts/conflict" },
    data: () => ({
      status: "completed",
      verifiedSectionScores: { lesen: 20, hoeren: 20, schreiben: 20, sprechen: 20 },
      verifiedOverall: { score: 75 },
      completionSync: { ok: false, error: "do not leak internal error" },
    }),
  });
  expect(conflict.sectionTotal).toBe(80);
  expect(conflict.scoreMatchesOverall).toBe(false);
  expect(conflict.completionSyncStatus).toBe("failed");
  expect(JSON.stringify(conflict)).not.toContain("do not leak internal error");
  const missing = normalizeMockAttempt({
    id: "missing", ref: { path: "b1MockExamUsers/uid/attempts/missing" },
    data: () => ({
      status: "completed", verifiedOverall: { score: 40 },
      verifiedSectionScores: { lesen: 0, hoeren: null, schreiben: undefined },
    }),
  });
  expect(missing.sectionScores).toEqual({ lesen: 0 });
  expect(missing.scoreVerification).toBe("incomplete");
  expect(missing.sectionTotal).toBeNull();
});

test("listMockAttempts loads recent monitored rows", async () => {
  const doc = { id: "a", ref: { path: "a1MockExamUsers/uid/attempts/a" },
    data: () => ({ status: "in_progress" }) };
  const fakeDb = { collectionGroup: () => ({
    orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [doc], size: 1 }) }) }),
  }) };
  const result = await listMockAttempts(fakeDb);
  expect(result.attempts).toHaveLength(1);
  expect(result.partial).toBe(false);
});

test("A2 Mock 2 browser progress cannot expose answers or pretend to be a verified score", () => {
  const row = normalizeBrowserProgress({ data: () => ({
    uid: "student", mockId: "a2-mock-02", section: "schreiben",
    completedSections: ["lesen", "hoeren"], status: "in_progress",
    rawAnswers: { x: "private" },
  }) });
  expect(row.level).toBe("A2");
  expect(row.progressCount).toBe(2);
  expect(row.overallScore).toBeNull();
  expect(row.sectionScores).toEqual({});
  expect(row.scoreVerification).toBe("browser_reported");
  expect(row.progressSource).toBe("browser_reported");
  expect(JSON.stringify(row)).not.toContain("private");
});


test("mock monitoring only allows privileged identity claims or owner", () => {
  expect(isAuthorizedMockMonitor({ uid: "staff", email: "staff@falowen.app" })).toBe(false);
  expect(isAuthorizedMockMonitor({ uid: "admin", email: "moxflex@gmail.com" })).toBe(true);
  expect(isAuthorizedMockMonitor({ uid: "tutor", role: "tutor" })).toBe(true);
  expect(isAuthorizedMockMonitor({ uid: "admin-claim", admin: true })).toBe(true);
  expect(isAuthorizedMockMonitor({ uid: "learner", role: "student", email: "learner@example.com" })).toBe(false);
  expect(isAuthorizedMockMonitor({ email: "staff@falowen.app" })).toBe(false);
  expect(isAuthorizedMockMonitor(null)).toBe(false);
});

test("mock monitor resolves registered student names by UID and email for existing attempts", async () => {
  const docs = [
    { id: "one", ref: { path: "a1MockExamUsers/uid-1/attempts/one" },
      data: () => ({ uid: "uid-1", email: "one@example.org", status: "in_progress" }) },
    { id: "two", ref: { path: "a2MockExamUsers/uid-2/attempts/two" },
      data: () => ({ uid: "uid-2", email: "two@example.org", status: "completed" }) },
  ];
  const directory = [
    { id: "STU-01", data: () => ({ uid: "uid-1", email: "one@example.org",
      name: "Ama Mensah", answers: { secret: "not for the monitor" } }) },
    { id: "STU-02", data: () => ({ email: "two@example.org",
      fullName: "Kojo Asare", notes: "confidential" }) },
  ];
  const db = {
    collectionGroup: () => ({ orderBy: () => ({ limit: () => ({
      get: async () => ({ docs, size: docs.length }),
    }) }) }),
    collection: path => {
      if (path === "mockProgressMonitor") return { limit: () => ({
        get: async () => ({ docs: [], size: 0 }),
      }) };
      if (path !== "students") throw new Error("Unexpected collection");
      return { where: (field, op, values) => ({
        get: async () => ({ docs: directory.filter(entry => values.includes(entry.data()[field])) }),
      }) };
    },
  };
  const result = await listMockAttempts(db);
  expect(result.attempts.map(row => row.studentName)).toEqual(["Ama Mensah", "Kojo Asare"]);
  expect(result.attempts[0].studentEmail).toBe("one@example.org");
  expect(result.attempts[1].studentEmail).toBe("two@example.org");
  expect(JSON.stringify(result)).not.toMatch(/confidential|not for the monitor/);
});

test("mock monitor resolves legacy profiles keyed by UID and preserves email fallback", async () => {
  const docs = [
    { id: "a", ref: { path: "b1MockExamUsers/legacy-uid/attempts/a" },
      data: () => ({ email: "legacy@example.org" }) },
    { id: "b", ref: { path: "a1MockExamUsers/missing-uid/attempts/b" },
      data: () => ({ email: "missing@example.org" }) },
  ];
  const db = {
    collectionGroup: () => ({ orderBy: () => ({ limit: () => ({
      get: async () => ({ docs, size: docs.length }),
    }) }) }),
    collection: path => {
      if (path === "mockProgressMonitor") return { limit: () => ({
        get: async () => ({ docs: [], size: 0 }),
      }) };
      return { where: () => ({ get: async () => ({ docs: [] }) }),
        doc: uid => ({ id: uid }) };
    },
    getAll: async (...refs) => refs.map(ref => ({
      id: ref.id, exists: ref.id === "legacy-uid",
      data: () => ({ name: "Nana Boateng" }),
    })),
  };
  const result = await listMockAttempts(db);
  expect(result.attempts.map(row => row.studentName)).toEqual(["Nana Boateng", ""]);
  expect(result.attempts[1].studentEmail).toBe("missing@example.org");
});
