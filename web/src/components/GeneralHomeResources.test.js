import fs from "fs";
import path from "path";
const read = name => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("Falowen signed-in homepage", () => {
  test("keeps onboarding and Course Book access without the first-lesson checklist", () => {
    const home = read("./GeneralHome.js");
    expect(home).not.toContain("FirstLessonGuide");
    expect(home).toContain("<OnboardingChecklist");
    expect(home).toContain("<QuickMainAccess");
    expect(home).toContain("<ClassCalendarCard"); // First-time onboarding only.
  });

  test("ends the student dashboard at Home Metrics then footer", () => {
    const home = read("./GeneralHome.js");
    const dashboard = home.slice(home.lastIndexOf("  return ("));
    const access = dashboard.indexOf("<QuickMainAccess");
    const highlights = dashboard.indexOf("<HomepageHighlights");
    const metrics = dashboard.indexOf("<HomeMetrics");
    const footer = dashboard.indexOf("<LegalFooter");
    expect(access).toBeGreaterThan(0);
    expect(highlights).toBeGreaterThan(access);
    expect(metrics).toBeGreaterThan(highlights);
    expect(footer).toBeGreaterThan(metrics);
    expect(dashboard).not.toContain("homepageCompact");
    expect(dashboard).not.toContain("<HomepageBooksCarousel");
    expect(dashboard).not.toContain("falowen-home-discover");
  });

  test("highlights reuse assigned class identity and student level", () => {
    const home = read("./GeneralHome.js");
    expect(home).toContain("className={preferredClass}");
    expect(home).toContain("classId={preferredClassId}");
    expect(home).toContain("level={assignedClassLevel || levelKey}");
  });

  test("responsive manual carousel has visible focus and uses existing routes", () => {
    const css = read("./HomepageHighlights.css");
    expect(css).toContain("@media (max-width: 640px)");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr)");
    expect(css).toContain("button:focus-visible");
    const carousel = read("./HomepageHighlights.jsx");
    expect(carousel).toContain('aria-label="Choose Falowen highlight"');
    expect(carousel).toContain('aria-label="Previous highlight"');
    expect(carousel).toContain('aria-label="Next highlight"');
    expect(carousel).toContain('onClick={() => goTo("/campus/music")}');
    expect(carousel).toContain('onClick={() => goTo("/books")}');
  });
});
