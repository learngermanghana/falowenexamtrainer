import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("Course Book priority layout", () => {
  it("compacts the live-class and next-lesson cards", () => {
    const source = read("CourseBookNextClassIndicator.js");

    expect(source).toContain("compactCourseBookPriorityArea");
    expect(source).toContain('data-falowen-priority-compacted');
    expect(source).toContain('padding: "10px 12px"');
    expect(source).toContain('action.textContent = "Continue"');
    expect(source).toContain('afterThis.style.display = "none"');
  });

  it("places the next lesson directly after the live class and moves YouTube below the lesson content", () => {
    const source = read("CourseBookNextClassIndicator.js");

    expect(source).toContain('standaloneMount.insertAdjacentElement("afterend", nextCard)');
    expect(source).toContain('hero.insertAdjacentElement("afterend", nextCard)');
    expect(source).toContain('data-falowen-youtube-moved');
    expect(source).toContain('courseRoot.insertBefore(youtubeWrapper, handoffHost || null)');
  });
});
