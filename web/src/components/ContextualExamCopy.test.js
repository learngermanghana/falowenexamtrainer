import fs from "fs";
import path from "path";
import { getMockExamsForLevel } from "../data/mockExamCatalog";

const overview = fs.readFileSync(path.join(__dirname, "ExamsOverviewPage.js"), "utf8");
const library = fs.readFileSync(path.join(__dirname, "MockExamLibraryPage.js"), "utf8");
const guidance = fs.readFileSync(path.join(__dirname, "FullMockGuidance.jsx"), "utf8");

test("exam room introduction reflects current mock availability", () => {
  expect(overview).toContain('hasFullMock ? "Choose an available full mock');
  expect(overview).toContain("A complete mock is not yet available at this level");
});

test("mock library presents catalog descriptions and distinguishes incomplete practice", () => {
  expect(library).toContain("{mock.description}");
  expect(library).toContain('mocks.some((mock) => mock.mode === "full" && mock.status === "ready")');
  expect(library).toContain("Section practice does not generate a complete mock score.");
  expect(library).not.toContain('"{mock.description}"');
  expect(getMockExamsForLevel("B1", { includeCourse: true }).some((mock) => mock.status === "ready")).toBe(true);
  expect(getMockExamsForLevel("C1", { includeCourse: true }).some((mock) => mock.mode === "full" && mock.status === "ready")).toBe(false);
});

test("full mock guidance describes the actual active module", () => {
  expect(guidance).toContain("progress.current");
  expect(guidance).toContain("Current module:");
  expect(guidance).toContain("Complete the remaining modules to receive your combined result.");
});
