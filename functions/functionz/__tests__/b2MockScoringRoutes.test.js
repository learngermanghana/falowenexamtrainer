const fs = require("fs");
const path = require("path");

describe("B2 final mock scoring routes", () => {
  const appSource = fs.readFileSync(path.resolve(__dirname, "../app.js"), "utf8");

  test("publishes B2 writing scoring with the approved two tasks", () => {
    expect(appSource).toContain('app.post("/writing/b2-mock-score"');
    expect(appSource).toContain("b2MockWritingScorePrompt");
    expect(appSource).toContain("Homeoffice – Arbeiten von zu Hause aus");
    expect(appSource).toContain("Frau Dr. Weber");
    expect(appSource).toContain("teil1: { maxScore: 15");
    expect(appSource).toContain("teil2: { maxScore: 10");
  });

  test("publishes B2 speaking scoring for presentation and discussion", () => {
    expect(appSource).toContain('app.post("/speaking/b2-mock-score"');
    expect(appSource).toContain("b2MockSpeakingScorePrompt");
    expect(appSource).toContain("Teil 1 presentation: 13 points");
    expect(appSource).toContain("Teil 2 discussion: 12 points");
    expect(appSource).toContain("public transport should be completely free");
    expect(appSource).toContain("Do NOT penalize the learner simply because there is no second speaker");
  });
});
