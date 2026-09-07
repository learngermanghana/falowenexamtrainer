import fs from "fs";
import path from "path";
import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Days 23-28 native workbook ownership", () => {
  test("late A2 submission rules live in the section profile", () => {
    [23, 24, 26, 27, 28].forEach((day) => {
      const profile = getA2B1WorkbookSectionProfile("A2", day);
      expect(profile.part4).toBe("listening");
      expect(profile.part4Submission).toBe("self-check");
    });

    const day25 = getA2B1WorkbookSectionProfile("A2", 25);
    expect(day25.listening).toBe(false);
    expect(day25.part4).toBe("reading");
    expect(day25.part4Submission).toBe("submit");
  });

  test("generated guidance does not run fallback navigation for Days 23-28", () => {
    const guidance = read("A2B1WorkbookGuidance.js");

    expect(guidance).toContain("const usesNativeLateWorkbook =");
    expect(guidance).toContain("[23, 24, 25, 26, 27, 28].includes(Number(workbookDay))");
    expect(guidance).toContain("usesNativeLateWorkbook || !showFallbackTabs");
    expect(guidance).toContain("data-a2-late-native-submission");
    expect(guidance).toContain("<ContextualAssignmentSubmissionPage submissionContext={submissionContext} />");
  });

  test("legacy observers retain Day 22 but stand down for Days 23-28", () => {
    const legacyWrapper = read("A2LegacyStandardWorkbookNavigation.js");

    expect(legacyWrapper).toContain("A2_DAY22_PATH,");
    expect(legacyWrapper).toContain("const usesNativeLateWorkbook =");
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
