import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.join(__dirname, "ExamsOverviewPage.js"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "ExamsOverviewPage.css"), "utf8");

test("full mock is the primary choice and individual sections remain accessible", () => {
  expect(source).toContain('"Start Full Mock"');
  expect(source).toContain('navigate("/exams/mocks")');
  expect(source).toContain("Take Lesen, Hören, Schreiben and Sprechen together");
  expect(source).toContain("Practise individual exam sections");
  expect(source).toContain("EXAM_SKILLS.map((skill)");
  expect(source).toContain("navigate(skill.path)");
  expect(source).toContain("A complete \" + currentLevel + \" mock is not yet published");
});

test("primary mock and individual sections have clear responsive and keyboard-accessible styling", () => {
  expect(css).toContain(".exam-room-mock-copy .exam-room-mock-action");
  expect(css).toContain(".exam-room-skills-heading");
  expect(css).toContain(".exam-room-mock-entry:focus-visible");
  expect(css).toContain("@media (max-width: 480px)");
});
