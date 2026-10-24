import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const page = fs.readFileSync(path.join(root, "src/components/A1Day13RevisionNumbersTimePricesWorkbookPage.js"), "utf8");
const patch = fs.readFileSync(path.join(root, "../scripts/patchA1Day13RevisionClarity.mjs"), "utf8");
const prebuildPatch = fs.readFileSync(path.join(root, "../scripts/patchA1TutorNavigationSelfPracticeSafety.mjs"), "utf8");

describe("A1 Day 13 revision clarity", () => {
  test("number and time practice expose checkable model answers", () => {
    expect(page).toContain("Check answer");
    expect(page).toContain("Model answer");
    expect(page).toContain('"Es ist zehn nach zehn.", "Es ist 10 Uhr 10."');
    expect(page).toContain('"Es ist Viertel nach zwei.", "Es ist 2 Uhr 15."');
  });

  test("sentence practice is concise and requires seven varied sentences", () => {
    expect(page).toContain("Write seven simple sentences about days and activities.");
    expect(page).toContain("so you do not repeat");
    expect(page).toContain("Ich ... Ich ... Ich ...");
    expect(page).toContain("Am Montag gehe ich zur Schule.");
    expect(page).toContain("Write your 7 sentences here");
    expect(page).not.toContain("Step 3: Use the correct verb form for ich");
  });

  test("prebuild chain applies the Day 13 clarity patch", () => {
    expect(patch).toContain("A1 Day 13 revision practice is shorter");
    expect(prebuildPatch).toContain('patchA1Day13RevisionClarity.mjs');
  });
});
