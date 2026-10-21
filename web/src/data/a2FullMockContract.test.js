import { assertA2FullMockReady, missingA2FullMockCapabilities } from "./a2FullMockContract";
import { MOCK_EXAM_CATALOG } from "./mockExamCatalog";

test("A2 Mock 1 remains the verified full mock foundation", () => {
  expect(missingA2FullMockCapabilities("a2-final-01")).toEqual([]);
  expect(() => assertA2FullMockReady(MOCK_EXAM_CATALOG["a2-final-01"])).not.toThrow();
});

test("Mock 2 passes the same verified lifecycle contract as Mock 1", () => {
  const mock2 = MOCK_EXAM_CATALOG["a2-mock-02"];
  expect(mock2.mode).toBe("full");
  expect(mock2.status).toBe("ready");
  expect(missingA2FullMockCapabilities("a2-mock-02")).toEqual([]);
  expect(() => assertA2FullMockReady(mock2)).not.toThrow();
});

test("Mock 2 stored questions match the server-owned answer keys", () => {
  const { A2_MOCK_2_LESEN_QUESTIONS } = require("./a2Mock2Lesen");
  const { A2_MOCK_2_HOEREN_QUESTIONS } = require("./a2Mock2Hoeren");
  const { MOCK_2_READING_ANSWER_KEY, MOCK_2_LISTENING_ANSWER_KEY } =
    require("../../../functions/functionz/a2MockCompletionSync");
  expect(A2_MOCK_2_LESEN_QUESTIONS).toHaveLength(20);
  expect(A2_MOCK_2_HOEREN_QUESTIONS).toHaveLength(20);
  expect(A2_MOCK_2_LESEN_QUESTIONS.every(q => MOCK_2_READING_ANSWER_KEY[q.number] === q.answer)).toBe(true);
  expect(A2_MOCK_2_HOEREN_QUESTIONS.every(q => MOCK_2_LISTENING_ANSWER_KEY[q.number] === q.answer)).toBe(true);
});

test("Mock 2 invokes the same verified attempt and completion services as Mock 1", () => {
  const fs = require("fs");
  const path = require("path");
  const hub = fs.readFileSync(path.resolve(__dirname, "../components/A2Mock2ExamHub.jsx"), "utf8");
  const submit = fs.readFileSync(path.resolve(__dirname, "../services/a2Mock2Finalization.js"), "utf8");
  expect(hub).toContain('startA2MockAttempt({ idToken, mockId:"a2-mock-02" })');
  expect(hub).toContain("finalizeA2Mock2(");
  expect(submit).toContain('status: "completed"');
  expect(submit).toContain("scoreA2MockWriting(");
  expect(submit).toContain("examinerSessionIds:");
});

test("new A2 mocks cannot claim ready without registered and verified lifecycle", () => {
  expect(() => assertA2FullMockReady({
    id: "a2-mock-03", level: "A2", mode: "full", status: "ready",
  })).toThrow(/cannot be published/);
});
