const fs = require("fs");
const path = require("path");

describe("B2 final mock scoring routes", () => {
  const tasks = require("../../data/assessmentTasks.json").mocks.B2;
  const appSource = fs.readFileSync(path.resolve(__dirname, "../app.js"), "utf8");

  test("publishes B2 writing scoring with the approved two tasks", () => {
    expect(appSource).toContain('app.post("/writing/b2-mock-score"');
    expect(appSource).toContain("b2MockWritingScorePrompt");
    expect(JSON.stringify(tasks.writing)).toContain("Homeoffice");
    expect(appSource).toContain('mockTaskPrompt("B2", "writing")');
    expect(JSON.stringify(tasks.writing)).toContain("Frau Dr. Weber");
    expect(appSource).toContain("teil1: { maxScore: 15");
    expect(appSource).toContain("teil2: { maxScore: 10");
  });

  test("publishes B2 speaking scoring for presentation and discussion", () => {
    expect(appSource).toContain('app.post("/speaking/b2-mock-score"');
    expect(appSource).toContain("b2MockSpeakingScorePrompt");
    expect(appSource).toContain("Teil 1 presentation: 13 points");
    expect(appSource).toContain("Teil 2 discussion: 12 points");
    expect(tasks.speaking.teil2.topic).toContain("kostenlos");
    expect(appSource).toContain('mockTaskPrompt("B2", "speaking", selectedTopicId)');
    expect(appSource).toContain("Do NOT penalize the learner simply because there is no second speaker");
  });
});
