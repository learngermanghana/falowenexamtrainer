import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.join(__dirname, name), "utf8");

describe("Figma-inspired signed-in learner homepage", () => {
  const home = read("GeneralHome.js");
  const styles = read("GeneralHome.css");
  const readiness = read("ExamReadinessBadge.js");

  test("has accessible welcome, exam journey and two learning cards", () => {
    expect(home).toContain('className="falowen-home-hero__welcome"');
    expect(home).toContain('variant="homepage"');
    expect(home).toContain("Your learning spaces");
    expect(home).toContain("Open Course Book");
    expect(home).toContain("Open Exams Room");
    expect(home).toContain("onJoinZoom={joinZoom}");
  });

  test("uses existing authenticated readiness rather than a sample percentage", () => {
    expect(readiness).toContain('if (variant === "homepage")');
    expect(readiness).toContain("state.loaded && !state.loading && !state.error");
    expect(readiness).toContain("hasReadiness ? readiness.scoreLabel");
    expect(readiness).toContain("hasReadiness ? readiness.score : undefined");
    expect(readiness).toContain("onClick={handleOpenExamFile}");
  });

  test("preserves Kiswahili without showing German exam preparation", () => {
    expect(home).toContain('isSwahili ? " falowen-home-hero--single"');
    expect(home).toContain('{!isSwahili && (');
    expect(home).toContain('isSwahili ? " falowen-home-spaces__grid--single"');
  });

  test("responds to mobile widths and keyboard focus", () => {
    expect(styles).toContain("@media (max-width: 900px)");
    expect(styles).toContain("@media (max-width: 680px)");
    expect(styles).toContain(".falowen-home-dashboard button:focus-visible");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
