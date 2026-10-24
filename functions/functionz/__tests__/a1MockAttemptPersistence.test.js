const fs = require("fs");
const path = require("path");

describe("A1 mock attempt persistence safety", () => {
  const appSource = fs.readFileSync(path.resolve(__dirname, "../app.js"), "utf8");

  test("makes completed attempts monotonic inside a Firestore transaction", () => {
    const start = appSource.indexOf('app.post("/a1-mock/attempt/save"');
    const end = appSource.indexOf('app.post("/speaking/analyze"', start);
    const routeSource = appSource.slice(start, end);

    expect(routeSource).toContain("db.runTransaction");
    expect(routeSource).toContain('existing.status === "completed"');
    expect(routeSource).toContain("alreadyCompleted: true");
    expect(routeSource).toContain("completedUserPatch.activeAttemptId = null");
    expect(routeSource).not.toContain("await attemptRef.set(patch");
  });

  test("does not let a stale in-progress save steal a newer active attempt pointer", () => {
    const start = appSource.indexOf('app.post("/a1-mock/attempt/save"');
    const end = appSource.indexOf('app.post("/speaking/analyze"', start);
    const routeSource = appSource.slice(start, end);

    expect(routeSource).toContain("!userData.activeAttemptId");
    expect(routeSource).toContain("String(userData.activeAttemptId) === attemptId");
    expect(routeSource).toContain("progressUserPatch.activeAttemptId = attemptId");
  });

  test("rejects stale section and same-section progress saves for both final mocks", () => {
    expect(appSource).toContain("FINAL_MOCK_SECTION_RANK");
    expect(appSource).toContain("shouldIgnoreStaleFinalMockProgress");
    expect(appSource).toContain("incomingRank < existingRank");
    expect(appSource).toContain("incomingSavedAt < existingSavedAt");
    expect(appSource).toContain("staleIgnored: true");

    const a1Start = appSource.indexOf('app.post("/a1-mock/attempt/save"');
    const a2Start = appSource.indexOf('app.post("/a2-mock/attempt/save"');
    const a2End = appSource.indexOf('app.post("/speaking/analyze"', a2Start);
    expect(appSource.slice(a1Start, a2Start)).toContain("shouldIgnoreStaleFinalMockProgress");
    expect(appSource.slice(a2Start, a2End)).toContain("shouldIgnoreStaleFinalMockProgress");
  });

  test("syncs every completed attempt to Admin results and the student notification path", () => {
    const start = appSource.indexOf('app.post("/a1-mock/attempt/save"');
    const end = appSource.indexOf('app.post("/speaking/analyze"', start);
    const routeSource = appSource.slice(start, end);

    expect(appSource).toContain('require("./a1MockCompletionSync")');
    expect(routeSource).toContain('status === "completed"');
    expect(routeSource).toContain("syncA1MockCompletion");
    expect(routeSource).toContain("completionSync");
    expect(routeSource).toContain("scoreDocId");
    expect(routeSource).toContain("notificationId");
  });
});
