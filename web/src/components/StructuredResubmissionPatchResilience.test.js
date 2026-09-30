import fs from "fs";

test("structured resubmission presentation copy no longer blocks builds", () => {
  const source = fs.readFileSync("../scripts/patchStructuredResubmission.mjs", "utf8");
  expect(source).toMatch(/replacePresentationOnce/);
  expect(source).toMatch(/Skipping optional/);
  expect(source).toMatch(/Corrected work/);
  expect(source).toMatch(/Corrected text/);
});
