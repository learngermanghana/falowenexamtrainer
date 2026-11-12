import fs from "fs";
import path from "path";

const read = name => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("Falowen homepage discovery and lesson guidance", () => {
  test("removes the redundant first-lesson checklist only from the logged-in homepage", () => {
    const home = read("./GeneralHome.js");
    expect(home).not.toContain('import FirstLessonGuide from "./FirstLessonGuide"');
    expect(home).not.toContain("<FirstLessonGuide");
    expect(home).not.toContain("How to complete your first lesson");
    // Keep onboarding, daily course access, and class/calendar entry points.
    expect(home).toContain("<OnboardingChecklist");
    expect(home).toContain("<QuickMainAccess");
    expect(home).toContain("<ClassCalendarCard");
  });

  test("makes Music and Books discoverable with descriptive navigation", () => {
    const home = read("./GeneralHome.js");
    expect(home).toContain('aria-label="More learning resources"');
    expect(home).toContain("More ways to learn German with Falowen");
    expect(home).toContain('aria-label="Explore Falowen Music"');
    expect(home).toContain('aria-label="Browse Falowen Books"');
    expect(home).toContain('navigate("/campus/music")');
    expect(home).toContain('navigate("/campus/books")');
    expect(home).toContain("Listen, repeat and build vocabulary");
    expect(home).toContain("course books and writing guides");
    expect(home.indexOf("<QuickMainAccess")).toBeLessThan(home.indexOf('className="falowen-home-discover"'));
    expect(home.indexOf('className="falowen-home-discover"')).toBeLessThan(home.indexOf("<HomeMetrics"));
  });

  test("keeps the discovery section responsive and keyboard accessible", () => {
    const home = read("./GeneralHome.js");
    const css = read("./GeneralHome.css");
    expect(home).toContain('import "./GeneralHome.css"');
    expect(css).toMatch(/@media \(max-width: 620px\)/);
    expect(css).toContain("grid-template-columns: 1fr");
    expect(css).toContain(".falowen-home-discover__link:focus-visible");
  });
});
