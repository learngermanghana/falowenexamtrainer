const fs = require("fs");
const path = require("path");
const read = file => fs.readFileSync(path.resolve(__dirname, "../../../", file), "utf8");

test.each([
  ["A2 final", "web/src/components/A2FinalMockExamPage.jsx", '"A2"'],
  ["A2 Mock 2", "web/src/components/A2Mock2ExamHub.jsx", '"A2"'],
  ["B1 final", "web/src/components/B1FinalMockExamPage.jsx", '"B1"'],
  ["B2 final", "web/src/components/B2FinalMockExamPage.jsx", '"B2"'],
  ["C1 Lesen sample", "web/src/components/C1FinalMockExamPage.jsx", '"C1"'],
])("%s includes shared exam integrity signals and learner warnings", (_, filename, level) => {
  const s = read(filename);
  expect(s).toContain('from "../hooks/useMockExamIntegrity"');
  expect(s).toContain("useMockExamIntegrity(");
  expect(s).toMatch(new RegExp("level\\s*:\\s*" + level));
  expect(s).toContain("MockExamIntegrityNotice");
  expect(s).toContain("onCopyCapture={integrity.onCopyCapture}");
  expect(s).toContain("onPasteCapture={integrity.onPasteCapture}");
  expect(s).toContain("integrity.requestFullscreen()");
});

test("A1 full mocks use the authenticated direct-attempt audit", () => {
  const s = read("web/src/components/A1FinalMockExamPage.jsx");
  expect(s).toContain('reportA1MockIntegrityEvent');
  expect(s).toContain("onPasteCapture");
});

test("shared monitor never treats activity events as verified completion", () => {
  const source = read("functions/functionz/mockAttemptMonitor.js");
  expect(source).toContain('status: "activity_only"');
  expect(source).toContain("integrityOnly: true");
  expect(source).toContain('collection("mockIntegrityMonitor")');
});

test("the shared endpoint validates the level, attempt ownership, and logged event categories", () => {
  const source = read("functions/functionz/app.js");
  expect(source.match(/app\.post\("\/mock\/attempt\/integrity-event"/g)).toHaveLength(1);
  expect(source).toContain("MOCK_INTEGRITY_ALLOWED_IDS[level]?.has(mockId)");
  expect(source).toContain("A1_MOCK_INTEGRITY_KINDS.has(type)");
  expect(source).toContain("No active mock attempt matches this report.");
});
