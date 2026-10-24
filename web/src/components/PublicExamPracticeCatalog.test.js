import fs from "fs";
import path from "path";
import { getMockExamsForLevel } from "../data/mockExamCatalog";

const source = fs.readFileSync(path.join(__dirname, "PublicExamPracticePage.jsx"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "PublicExamPracticePage.css"), "utf8");

test("public Goethe marketing is driven by published mock catalog rather than stale A1/A2-only cards", () => {
  expect(source).toContain("getMockExamsForLevel(examLevel, { includeCourse: true })");
  expect(source).toContain('["A1", "A2", "B1", "B2", "C1", "C2"]');
  expect(source).not.toContain("Goethe B1 public exam practice is coming soon");
  expect(source).toContain('mock.status === "ready"');
  expect(source).toContain('mock.status === "preview"');
});

test("advertises full mocks only where the current library has ready full exams", () => {
  for (const level of ["A1", "A2", "B1", "B2"]) {
    expect(getMockExamsForLevel(level, { includeCourse: true }).some((mock) => mock.mode === "full" && mock.status === "ready")).toBe(true);
  }
  for (const level of ["C1", "C2"]) {
    expect(getMockExamsForLevel(level, { includeCourse: true }).some((mock) => mock.mode === "full" && mock.status === "ready")).toBe(false);
  }
});

test("public free practice and student-only exam routes are clearly separated", () => {
  expect(source).toContain('A1: "/exam-practice/a1"');
  expect(source).toContain('A2: "/exam-practice/a2"');
  expect(source).toContain('href="/login/"');
  expect(source).toContain("Full mock exams require student access");
});

test("responsive Goethe cards preserve a single-column phone layout", () => {
  expect(css).toContain("@media(max-width:540px)");
  expect(css).toContain(".public-goethe-level-grid{grid-template-columns:1fr}");
});
