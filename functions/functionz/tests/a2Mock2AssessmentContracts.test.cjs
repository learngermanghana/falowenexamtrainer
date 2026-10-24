"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { resolvePracticeTask, mockTaskPrompt, mockTaskVersion } = require("../assessmentTaskContext");
const tasks = require("../../data/assessmentTasks.json");
const versions = require("../../../web/src/data/assessmentTaskVersions.json");

test("Mock 2 writing IDs resolve to exactly the two canonical tasks", () => {
  for (const part of ["teil1", "teil2"]) {
    const task = tasks.writing[`a2-mock-02-schreiben-${part}`];
    assert.equal(task?.level, "A2");
    assert.equal(task.whatToInclude.length, 3);
    assert.deepEqual(resolvePracticeTask("writing", task.id, "A2", {
      situation: task.situation, whatToInclude: task.whatToInclude,
    }), task);
  }
  assert.equal(tasks.writing["a2-mock-02-schreiben-durationMinutes"], undefined);
});

test("Mock 2 speaking has its own authoritative questions and version", () => {
  const mock2Prompt = mockTaskPrompt("A2", "speaking", undefined, "a2-mock-02");
  assert.ok(mock2Prompt.includes("Überraschungsparty"));
  assert.ok(mock2Prompt.includes("Deutschkurs"));
  assert.ok(!mockTaskPrompt("A2", "speaking", undefined, "a2-mock-01").includes("Überraschungsparty"));
  assert.equal(mockTaskVersion("A2", "speaking", "a2-mock-02"), versions.A2_MOCK_2.speaking);
  assert.equal(mockTaskVersion("A2", "speaking", "a2-mock-01"), versions.A2.speaking);
  assert.notEqual(versions.A2_MOCK_2.speaking, versions.A2.speaking);
});
