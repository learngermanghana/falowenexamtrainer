import fs from "fs";
import path from "path";

test("the optional Kurz lernen block no longer renders for A2 or B1", () => {
  const source = fs.readFileSync(path.join(__dirname, "A2MiniLearningBlock.jsx"), "utf8");
  expect(source).toContain("return null;");
  expect(source).not.toContain("data-a2-focused-learning-block");
  expect(source).not.toContain("<section");
});
