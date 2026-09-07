import fs from "fs";
import path from "path";
import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Days 22-28 native workbook ownership", () => {
  test("late A2 submission rules live in the section profile", () => {
    [22, 23, 24, 26, 27, 28].forEach((day) => {
      const profile = getA2B1WorkbookSectionProfile("A2", day);
      expect(profile.part4).toBe("listening");
      expect(profile.part4Submission).toBe("self-check");
    });

    const day25 = getA2B1WorkbookSectionProfile("A2", 25);
    expect(day25.listening).toBe(false);
    expect(day25.part4).toBe("reading");
    expect(day25.part4Submission).toBe("submit");
  });

  test("generated guidance does not run fallback navigation for Days 22-28", () => {
    const guidance = read("A2B1WorkbookGuidance.js");

    expect(guidance).toContain("const usesNativeLateWorkbook =");
    expect(guidance).toContain("[22, 23, 24, 25, 26, 27, 28].includes(Number(workbookDay))");
    expect(guidance).toContain("usesNativeLateWorkbook || !showFallbackTabs");
  });

  test("Day 22 owns shared React navigation and route-locked submission", () => {
    const day22 = read("A2Day22DieWochePlanungWorkbookPage.js");

    expect(day22).toContain('data-a2-day22-native-workbook="true"');
    expect(day22).toContain("A2_B1_WORKBOOK_TABS_WITH_GRAMMAR");
    expect(day22).toContain("<WorkbookTabNav");
    expect(day22).toContain('ariaLabel="A2 Day 22 workbook sections"');
    expect(day22).toContain("<ContextualAssignmentSubmissionPage");
    expect(day22).toContain('assignmentKey: "A2-8.22"');
    expect(day22).toContain("Teil 4 · Hören · Goethe Self-Check");
    expect(day22).toContain("Aufgabe 1 · Gülcan schreibt Sonja, dass ...");
    expect(day22).not.toContain("function TabButton(");
    expect(day22).not.toContain("Go to Submission Area");
    expect(day22).not.toContain("<h2 style={{ margin: 0 }}>Final Submission</h2>");
  });

  test("global workbook enhancements keep the Days 24-26 native submission panel", () => {
    const inlineEnhancements = read("WorkbookInlineEnhancements.jsx");

    expect(inlineEnhancements).toContain(
      'import A2LateWorkbookSubmissionPanel from "./A2LateWorkbookSubmissionPanel";',
    );
    expect(inlineEnhancements).toContain(
      "<A2LateWorkbookSubmissionPanel pathname={activePathname} />",
    );
  });

  test("legacy observers stand down for every Day 22-28 workbook", () => {
    const legacyWrapper = read("A2LegacyStandardWorkbookNavigation.js");

    expect(legacyWrapper).toContain(
      "export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([\n  A2_DAY20_PATH,\n]);",
    );
    expect(legacyWrapper).toContain("const usesNativeLateWorkbook =");
    expect(legacyWrapper).toContain("(?:22|23|24|25|26|27|28)");
    expect(legacyWrapper).toContain("!usesNativeLateWorkbook &&");
    expect(legacyWrapper).not.toContain("...A2_DAYS_22_TO_26_PATHS");
  });

  test("normal prestart/prebuild/test flows apply native ownership after fallback safety", () => {
    const packageJson = JSON.parse(read("../../package.json"));

    for (const hook of ["prestart", "prebuild", "pretest", "pretest:ci"]) {
      const command = packageJson.scripts[hook];
      expect(command).toContain("sync:a2-fallback-workbook-safety");
      expect(command).toContain("sync:a2-late-native-ownership");
      expect(command.indexOf("sync:a2-late-native-ownership")).toBeGreaterThan(
        command.indexOf("sync:a2-fallback-workbook-safety"),
      );
    }
  });
});