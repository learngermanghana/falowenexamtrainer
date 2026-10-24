import fs from "fs";
import path from "path";
import { B1_DAY21_HAS_TEIL4 } from "./B1Day21LebensformenHeuteWorkbookPage";

const source = fs.readFileSync(
  path.resolve(__dirname, "B1Day21LebensformenHeuteWorkbookPage.js"),
  "utf8",
);
const sharedShell = fs.readFileSync(
  path.resolve(__dirname, "B1StandardWorkbookPage.js"),
  "utf8",
);

describe("B1 Day 21 workbook parts", () => {
  test("uses the canonical unavailable-listening contract without DOM patching", () => {
    expect(B1_DAY21_HAS_TEIL4).toBe(false);
    expect(source).toContain("This workbook contains Teil 1, Teil 2 and Teil 3 only. There is no Teil 4 for this lesson.");
    expect(source).not.toContain("MutationObserver");
    expect(source).not.toContain("useLayoutEffect");
    expect(source).not.toContain("document.querySelector");
    expect(source).not.toContain('[role="tab"][aria-label="Teil 4"]');
    expect(source).not.toContain("display: none !important");
    expect(sharedShell).toContain('listening.status === "unavailable"');
  });

  test("renders the Day 21 writing video through the shared React shell", () => {
    expect(source).toContain('getWritingVideoResource("B1", 21)');
    expect(source).toContain("writingVideo: day21WritingVideo");
    expect(sharedShell).toContain('data-writing-video-support="true"');
    expect(sharedShell).toContain("<WritingVideoCard resource={config.writingVideo} />");
  });

  test("submission instructions request only Teil 2 and Teil 3", () => {
    expect(source).toContain('submitListening: false');
    expect(source).toContain('submitTitle: "Submit Teil 2 and Teil 3."');
    expect(source).toContain('submitNote: "Teil 1 is group practice. There is no Teil 4 in this workbook."');
    expect(source).not.toContain("submitListeningDescription:");
  });
});
