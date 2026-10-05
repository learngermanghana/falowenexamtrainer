import fs from "fs";
import path from "path";

const readSource = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf8");

describe("speaking analyze timeout scope", () => {
  const serviceSource = readSource("services/coachService.js");
  const a1MockSource = readSource("components/A1GoetheSpeakingMockPreview.jsx");
  const a2MockSource = readSource("components/A2FinalMockSpeaking.jsx");

  test("shared analyzeAudio has no deadline unless a caller opts in", () => {
    expect(serviceSource).toContain("timeoutMs = null");
    expect(serviceSource).toContain("const hasTimeout");
    expect(serviceSource).toContain("if (!hasTimeout)");
    expect(serviceSource).toContain("return runAnalysis()");
    expect(serviceSource).toContain("...requestTimeoutConfig");
  });

  test("timed final mocks explicitly keep the 30-second analysis bound", () => {
    expect(serviceSource).toContain("TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS = 30_000");
    expect(a1MockSource).toContain("timeoutMs: TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS");
    expect(a2MockSource).toContain("timeoutMs: TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS");
  });

  test.each([
    ["general Speaking", "components/SpeakingPage.js"],
    ["Goethe Free Chat", "components/GoetheFreeChatPage.js"],
    ["self-learning speaking", "components/selfLearning/EmbeddedSpeechPracticePanel.js"],
  ])("%s does not opt into the timed-mock deadline", (_label, relativePath) => {
    const source = readSource(relativePath);
    expect(source).not.toContain("timeoutMs:");
    expect(source).not.toContain("TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS");
  });
});
