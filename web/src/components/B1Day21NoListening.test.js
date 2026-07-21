import fs from "fs";
import path from "path";
import { B1_DAY21_HAS_TEIL4 } from "./B1Day21LebensformenHeuteWorkbookPage";

const source = fs.readFileSync(
  path.resolve(__dirname, "B1Day21LebensformenHeuteWorkbookPage.js"),
  "utf8",
);

describe("B1 Day 21 workbook parts", () => {
  test("states that there is no Teil 4 and hides the Hören tab", () => {
    expect(B1_DAY21_HAS_TEIL4).toBe(false);
    expect(source).toContain("This workbook contains Teil 1, Teil 2 and Teil 3 only. There is no Teil 4 for this lesson.");
    expect(source).toContain("There is no Teil 4 · Hören for this lesson.");
    expect(source).toContain('[role="tab"][aria-label="Teil 4"]');
    expect(source).toContain("display: none !important");
  });

  test("submission instructions request only Teil 2 and Teil 3", () => {
    expect(source).toContain('submitListening: false');
    expect(source).toContain('submitTitle: "Submit Teil 2 and Teil 3."');
    expect(source).toContain('submitNote: "Teil 1 is group practice. There is no Teil 4 in this workbook."');
    expect(source).not.toContain('submitListeningDescription:');
  });
});
