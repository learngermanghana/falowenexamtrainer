import fs from "fs";
import path from "path";
import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 25 build-time workbook navigation", () => {
  test("Day 25 now owns the shared native workbook shell", () => {
    const source = read("A2Day25TagesablaufWorkbookPage.js");

    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={25}");
    expect(source).toContain('chapter="9.25"');
    expect(source).toContain("m7nP2qE9gNg");
    expect(source).not.toContain("There is no Hören assignment in this workbook");
  });

  test("Day 25 exposes Teil 4 as Hören and submits it canonically", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 25);

    expect(profile.listening).toBe(true);
    expect(profile.part4).toBe("listening");
    expect(profile.part4Submission).toBe("submit");
  });

  test("late native ownership disables fallback navigation during normal build and test flows", () => {
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
