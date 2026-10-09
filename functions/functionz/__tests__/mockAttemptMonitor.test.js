const { normalizeMockAttempt, normalizeBrowserProgress, listMockAttempts } = require("../mockAttemptMonitor");

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
