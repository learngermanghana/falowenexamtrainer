import fs from "fs";
import path from "path";

const source = fs.readFileSync(
  path.resolve(__dirname, "A2Day24EinenUrlaubPlanenWorkbookPage.js"),
  "utf8",
);

describe("A2 Day 24 retry preserves the current workbook tab", () => {
  test("restores the active tab from URL or session storage", () => {
    expect(source).toContain('const ACTIVE_TAB_STORAGE_KEY = "falowen:a2-day24:active-tab"');
    expect(source).toContain('params.get("workbookTab")');
    expect(source).toContain("window.sessionStorage?.getItem(ACTIVE_TAB_STORAGE_KEY)");
    expect(source).toContain("useState(getInitialActiveTab)");
  });

  test("persists tab changes without dropping existing query parameters", () => {
    expect(source).toContain("window.sessionStorage?.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab)");
    expect(source).toContain('params.set("workbookTab", activeTab)');
    expect(source).toContain("window.history?.replaceState?.");
  });
});
