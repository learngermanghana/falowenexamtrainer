import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 25 build-time workbook navigation", () => {
  test("the existing fallback safety patch owns the Day 25 navigation contract", () => {
    const packageJson = JSON.parse(read("../../package.json"));
    const fallbackPatch = read("../../../scripts/patchA2FallbackWorkbookSafety.mjs");

    for (const hook of ["prestart", "prebuild", "pretest", "pretest:ci"]) {
      expect(packageJson.scripts[hook]).toContain("sync:a2-fallback-workbook-safety");
    }

    expect(fallbackPatch).toContain('const A2_DAY25_WORKBOOK_TABS = [');
    expect(fallbackPatch).toContain("const A2_DAY25_NAVIGATION_TARGETS = [");
    expect(fallbackPatch).toContain('{ key: "lesen2", label: "Teil 4", description: "Lesen" }');
    expect(fallbackPatch).toContain("const navigationTargets = workbookDay === 25");
    expect(fallbackPatch).toContain(
      'tabs={workbookDay === 25 ? A2_DAY25_WORKBOOK_TABS : STANDARD_WORKBOOK_TABS}',
    );
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
