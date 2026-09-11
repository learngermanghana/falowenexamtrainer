import fs from "fs";
import path from "path";
import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

const cleanedLateWorkbooks = [
  [22, "A2Day22DieWochePlanungWorkbookPage.js", "8.22"],
  [23, "A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js", "9.23"],
  [24, "A2Day24EinenUrlaubPlanenWorkbookPage.js", "9.24"],
  [25, "A2Day25TagesablaufWorkbookPage.js", "9.25"],
  [26, "A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js", "10.26"],
  [27, "A2Day27DigitaleKommunikationWorkbookPage.js", "10.27"],
  [28, "A2Day28UeberDieZukunftSprechenWorkbookPage.js", "10.28"],
];

describe("A2 Days 22-28 native workbook ownership", () => {
  test("late A2 submission rules keep Day 25 as canonical listening", () => {
    [22, 23, 24, 26, 27, 28].forEach((day) => {
      const profile = getA2B1WorkbookSectionProfile("A2", day);
      expect(profile.part4).toBe("listening");
      expect(profile.part4Submission).toBe("self-check");
    });

    const day25 = getA2B1WorkbookSectionProfile("A2", 25);
    expect(day25.listening).toBe(true);
    expect(day25.part4).toBe("listening");
    expect(day25.part4Submission).toBe("submit");
  });

  test("generated fallback guidance stands down for Days 22-28", () => {
    const guidance = read("A2B1WorkbookGuidance.js");
    expect(guidance).toContain("const usesNativeLateWorkbook =");
    expect(guidance).toContain("[22, 23, 24, 25, 26, 27, 28].includes(Number(workbookDay))");
    expect(guidance).toContain("usesNativeLateWorkbook || !showFallbackTabs");
  });

  test.each(cleanedLateWorkbooks)(
    "Day %i owns the shared React workbook shell on chapter %s",
    (day, fileName, chapter) => {
      const source = read(fileName);
      expect(source).toContain("A2StandardTabbedWorkbookPage");
      expect(source).toContain(`day={${day}}`);
      expect(source).toContain(`chapter=\"${chapter}\"`);
      expect(source).not.toContain("Go to Submission Area");
    },
  );

  test("global workbook enhancements no longer mount a duplicate late-A2 submission panel", () => {
    const inlineEnhancements = read("WorkbookInlineEnhancements.jsx");
    expect(inlineEnhancements).not.toContain("A2LateWorkbookSubmissionPanel");
  });

  test("legacy observers stand down for cleaned Day 20-28 workbooks", () => {
    const legacyWrapper = read("A2LegacyStandardWorkbookNavigation.js");
    expect(legacyWrapper).toContain("export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([]);");
    expect(legacyWrapper).toContain("usesCleanStandardWorkbook");
    expect(legacyWrapper).toContain("(?:20|21|22|23|24|25|26|27|28)");
    expect(legacyWrapper).toContain("!usesCleanStandardWorkbook &&");
  });

  test("normal prestart/prebuild/test flows apply late native ownership after fallback safety", () => {
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
