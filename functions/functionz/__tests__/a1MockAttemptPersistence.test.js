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
});
