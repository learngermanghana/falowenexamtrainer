const { normalizeMockAttempt, normalizeBrowserProgress, listMockAttempts, isAuthorizedMockMonitor, normalizeSharedMockIntegrity, joinSharedMockIntegrity } = require("../mockAttemptMonitor");

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

test("A1 monitor exposes bounded browser integrity events without reading answers", () => {
  const row = normalizeMockAttempt({
    id: "exam-a", ref: { path: "a1MockExamUsers/uid-a/attempts/exam-a" },
    data: () => ({
      status: "in_progress", section: "schreiben",
      state: { stage: "schreiben", schreibenText: "confidential writing",
        integrity: { counts: { tab_hidden: 2, paste_attempt: 1, unknown: 100 },
          events: [
            { type: "tab_hidden", section: "lesen", at: "2026-10-09T19:30:00Z" },
            { type: "paste_attempt", section: "schreiben", at: "2026-10-09T19:31:00Z", pastedText: "secret answer" },
            { type: "unknown", section: "schreiben", at: "2026-10-09T19:32:00Z" },
          ] },
      },
    }),
  });
  expect(row.integrity.source).toBe("browser_reported");
  expect(row.integrity.total).toBe(3);
  expect(row.integrity.events).toHaveLength(2);
  expect(row.integrity.counts.unknown).toBeUndefined();
  expect(JSON.stringify(row)).not.toMatch(/confidential writing|secret answer/);
});
test("A1 integrity is absent for legacy attempts rather than inventing violations", () => {
  const row = normalizeMockAttempt({
    id: "legacy", ref: { path: "a1MockExamUsers/uid/attempts/legacy" },
    data: () => ({ status: "in_progress", state: { stage: "lesen" } }),
  });
  expect(row.integrity).toBeNull();
});

test("A2/B1 generic incidents join the correct saved attempt; B2/C1 are activity-only", () => {
  const from = (level, uid, mockId, attemptId = "") =>
    normalizeSharedMockIntegrity({ data: () => ({
      level, uid, mockId, attemptId, section: "schreiben",
      email: "student@example.org", updatedAt: "2026-10-09T18:00:00Z",
      counts: { paste_attempt: 2, tab_hidden: 1 },
      events: [{ type: "paste_attempt", section: "schreiben", at: "2026-10-09T18:00:00Z",
        rawClipboardText: "should never be included" }],
    }) });
  const existing = [{ id: "A2:u1:attempt-1", uid: "u1", level: "A2",
    mockId: "a2-mock-01", studentEmail: "student@example.org",
    section: "schreiben", status: "in_progress" }];
  const joined = joinSharedMockIntegrity(existing, [
    from("A2", "u1", "a2-mock-01", "attempt-1"),
    from("B2", "u2", "b2-final-mock"),
    from("C1", "u3", "c1-lesen-sample-01"),
  ]);
  expect(joined).toHaveLength(3);
  expect(joined[0].integrity.total).toBe(3);
  expect(joined[0].status).toBe("in_progress");
  expect(joined[1].status).toBe("activity_only");
  expect(joined[1].integrityOnly).toBe(true);
  expect(joined[2].status).toBe("activity_only");
  expect(JSON.stringify(joined)).not.toContain("should never be included");
});
test("malformed and non-supported mock audit records are excluded", () => {
  expect(normalizeSharedMockIntegrity({ data: () => ({
    level: "A1", uid: "1", mockId: "a1-mock-01", counts: {} }) })).toBeNull();
  expect(normalizeSharedMockIntegrity({ data: () => ({
    level: "B2", mockId: "b2-final-mock" }) })).toBeNull();
});
