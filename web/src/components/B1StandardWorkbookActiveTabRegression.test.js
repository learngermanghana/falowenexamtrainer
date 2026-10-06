import fs from "fs";
import path from "path";

const source = fs.readFileSync(
  path.resolve(__dirname, "B1StandardWorkbookPage.js"),
  "utf8",
);

describe("B1StandardWorkbookPage active-tab runtime safety", () => {
  test("does not shadow the active-tab state inside the timed-assignment render callback", () => {
    expect(source).toContain('const [activeTab, setActiveTab] = useState("grammar")');
    expect(source).toContain(
      'const resolvedActiveTab = isTabLocked(activeTab) ? "grammar" : activeTab;',
    );

    expect(source).not.toContain(
      'const displayedActiveTab = isTabLocked(displayedActiveTab) ? "grammar" : displayedActiveTab;',
    );
  });

  test("uses the resolved tab throughout the shared B1 workbook renderer", () => {
    expect(source).toContain("activeTab={resolvedActiveTab}");
    expect(source).toContain('resolvedActiveTab === "grammar"');
    expect(source).toContain('resolvedActiveTab === "sprechen"');
    expect(source).toContain('resolvedActiveTab === "schreiben"');
    expect(source).toContain('resolvedActiveTab === "lesen"');
    expect(source).toContain('resolvedActiveTab === "hoeren"');
    expect(source).toContain('resolvedActiveTab === "references"');
    expect(source).toContain('resolvedActiveTab === "submit"');
    expect(source).toContain("activeTab: resolvedActiveTab");
    expect(source).toContain("displayedActiveTab: resolvedActiveTab");
  });
});
