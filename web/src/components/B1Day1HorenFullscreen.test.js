import fs from "fs";
import path from "path";

describe("B1 Day 1 Hören video", () => {
  test("keeps fullscreen playback available in the declarative workbook migration", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "B1Day1TraumweltWorkbookPage.js"),
      "utf8",
    );

    expect(source).toContain('src="https://www.youtube.com/embed/dZDgNxPWox8?rel=0"');
    expect(source).toContain("allowFullScreen");
    expect(source).toContain("picture-in-picture");
    expect(source).toContain("web-share");
  });
});
