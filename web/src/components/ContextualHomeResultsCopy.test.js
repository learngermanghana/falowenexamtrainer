import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.join(__dirname, name), "utf8");

test("home guidance directs learners toward real course and exam destinations", () => {
  const source = read("GeneralHome.js");
  expect(source).toContain("Open Course Book to see your current lesson and next step");
  expect(source).toContain("Choose an available mock or practise one exam skill");
  expect(source).toContain("Open Campus");
  expect(source).toContain("Connect ChatGPT as a study partner");
  expect(source).toContain("https://chatgpt.com/plugins/plugin_asdk_app_6ae7660094648191b3f39f11008ade2a");
});

test("results copy distinguishes an empty record from an actual loading failure", () => {
  const source = read("StudentResultsPage.js");
  expect(source).toContain("No marked results yet. Once your work is graded");
  expect(source).toContain("Could not load results.");
  expect(source).toContain("your scores and feedback will appear here");
});

test("result insights use recorded scores without treating missing marks as zero", () => {
  const source = read("StudentResultsPage.js");
  expect(source).toContain('row.score !== null && row.score !== undefined');
  expect(source).toContain('String(r.score).trim() !== ""');
  expect(source).toContain("below the");
  expect(source).toContain("Open the result history below");
  expect(source).toContain("Your marked-work overview");
  expect(source).toContain("scoreInsight.guidance");
});
