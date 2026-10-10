import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.join(__dirname, name), "utf8");

test("home guidance directs learners toward real course and exam destinations", () => {
  const source = read("GeneralHome.js");
  expect(source).toContain("Continue your current lesson, submit finished workbook answers, or open your results.");
  expect(source).toContain("Choose an available mock or practise one exam skill");
  expect(source).toContain("Continue in Campus");
});

test("results copy distinguishes an empty record from an actual loading failure", () => {
  const source = read("StudentResultsPage.js");
  expect(source).toContain("No marked results yet. Once your work is graded");
  expect(source).toContain("Could not load results.");
  expect(source).toContain("your scores and feedback will appear here");
});
