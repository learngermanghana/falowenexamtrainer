const { resolvePracticeTask, mockTaskPrompt, mockTaskVersion } = require("../assessmentTaskContext");
const tasks = require("../../data/assessmentTasks.json");
const versions = require("../../../web/src/data/assessmentTaskVersions.json");

test("Mock 2 writing IDs and exact question contexts are registered separately from Mock 1", () => {
  for (const part of ["teil1", "teil2"]) {
    const task = tasks.writing[`a2-mock-02-schreiben-${part}`];
    expect(task.level).toBe("A2");
    expect(task.whatToInclude).toHaveLength(3);
    expect(resolvePracticeTask("writing", task.id, "A2", {
      situation: task.situation, whatToInclude: task.whatToInclude,
    })).toEqual(task);
  }
});

test("Mock 2 speaking evaluates its actual tasks with a separate version", () => {
  expect(mockTaskPrompt("A2", "speaking", undefined, "a2-mock-02")).toContain("Überraschungsparty");
  expect(mockTaskPrompt("A2", "speaking", undefined, "a2-mock-02")).toContain("Deutschkurs");
  expect(mockTaskPrompt("A2", "speaking", undefined, "a2-mock-01")).not.toContain("Überraschungsparty");
  expect(mockTaskVersion("A2", "speaking", "a2-mock-02")).toBe(versions.A2_MOCK_2.speaking);
  expect(mockTaskVersion("A2", "speaking", "a2-mock-01")).toBe(versions.A2.speaking);
  expect(versions.A2_MOCK_2.speaking).not.toBe(versions.A2.speaking);
});

test("Mock 2 scores cannot be persisted into a Mock 1 attempt", () => {
  const { readFileSync } = require("node:fs");
  const { join } = require("node:path");
  const app = readFileSync(join(__dirname, "../app.js"), "utf8");
  const routeStart = app.indexOf('app.post("/speaking/a2-mock-score"');
  const routeEnd = app.indexOf('app.post("/speaking/b1-mock-score"', routeStart);
  const route = app.slice(routeStart, routeEnd);
  const { isA2SpeakingAttemptBindingSafe } = require("../a2MockSpeakingAttemptIdentity");
  expect(isA2SpeakingAttemptBindingSafe({ mockId: "a2-mock-02", attemptId: "server-attempt" })).toBe(true);
  expect(isA2SpeakingAttemptBindingSafe({ mockId: "a2-mock-02", attemptId: "" })).toBe(false);
  expect(route).toContain("if (!isA2SpeakingAttemptBindingSafe({ mockId, attemptId }))");
  expect(route.indexOf("if (!isA2SpeakingAttemptBindingSafe({ mockId, attemptId }))")).toBeLessThan(route.indexOf("await persistVerifiedA2MockSection("));
});

test("Mock 2 registry excludes configuration metadata from writing tasks", () => {
  expect(tasks.writing["a2-mock-02-schreiben-durationMinutes"]).toBeUndefined();
  expect(Object.keys(tasks.writing).filter(id => id.startsWith("a2-mock-02-schreiben-"))).toEqual([
    "a2-mock-02-schreiben-teil1",
    "a2-mock-02-schreiben-teil2",
  ]);
});
