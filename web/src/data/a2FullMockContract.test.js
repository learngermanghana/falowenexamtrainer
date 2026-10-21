import { assertA2FullMockReady, missingA2FullMockCapabilities } from "./a2FullMockContract";
import { MOCK_EXAM_CATALOG } from "./mockExamCatalog";

test("A2 Mock 1 remains the verified full mock foundation", () => {
  expect(missingA2FullMockCapabilities("a2-final-01")).toEqual([]);
  expect(() => assertA2FullMockReady(MOCK_EXAM_CATALOG["a2-final-01"])).not.toThrow();
});

test("unintegrated A2 Mock 2 cannot silently ship as a ready full exam", () => {
  const mock2 = MOCK_EXAM_CATALOG["a2-mock-02"];
  expect(mock2.mode).toBe("section-preview");
  expect(mock2.status).toBe("preview");
  expect(missingA2FullMockCapabilities("a2-mock-02")).toContain("completedResultSync");
  expect(() => assertA2FullMockReady({ ...mock2, mode: "full", status: "ready" }))
    .toThrow(/serverAttempt.*verifiedWriting.*verifiedSpeaking.*completedResultSync/);
});

test("new A2 mocks cannot claim ready without registered and verified lifecycle", () => {
  expect(() => assertA2FullMockReady({
    id: "a2-mock-03", level: "A2", mode: "full", status: "ready",
  })).toThrow(/cannot be published/);
});
