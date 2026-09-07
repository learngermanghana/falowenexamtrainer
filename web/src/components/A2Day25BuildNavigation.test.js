import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 25 build-time workbook navigation", () => {
  test("prestart and prebuild patch the shared navigation after legacy portal routing is resolved", () => {
    const packageJson = JSON.parse(read("../../package.json"));
    const patchSource = read("../../../scripts/patchA2Day25BuildNavigation.mjs");

    expect(packageJson.scripts["sync:a2-day25-build-navigation"]).toBe(
      "node ../scripts/patchA2Day25BuildNavigation.mjs",
    );

    for (const hook of ["prestart", "prebuild", "pretest", "pretest:ci"]) {
      const script = packageJson.scripts[hook];
      expect(script).toContain("sync:a2-legacy-portal-safety");
      expect(script).toContain("sync:a2-day25-build-navigation");
      expect(script.indexOf("sync:a2-day25-build-navigation")).toBeGreaterThan(
        script.indexOf("sync:a2-legacy-portal-safety"),
      );
    }

    expect(patchSource).toContain('web/src/components/A2B1WorkbookGuidance.js');
    expect(patchSource).toContain("A2_DAY25_WORKBOOK_TABS");
    expect(patchSource).toContain("A2_DAY25_NAVIGATION_TARGETS");
  });

  test("the generated shared navigation exposes Teil 4 as the second reading tab", () => {
    const guidance = read("A2B1WorkbookGuidance.js");

    expect(guidance).toContain('const A2_DAY25_WORKBOOK_TABS = [');
    expect(guidance).toContain('{ key: "lesen2", label: "Teil 4", description: "Lesen" }');
    expect(guidance).toContain("const navigationTargets = workbookDay === 25");
    expect(guidance).toContain("? A2_DAY25_NAVIGATION_TARGETS");
    expect(guidance).toContain(
      'tabs={workbookDay === 25 ? A2_DAY25_WORKBOOK_TABS : STANDARD_WORKBOOK_TABS}',
    );
  });
});
