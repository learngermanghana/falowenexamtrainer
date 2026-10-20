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
