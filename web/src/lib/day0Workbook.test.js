import { detectLevelKey, getDay0WorkbookLinkForLevel } from "./day0Workbook";

describe("detectLevelKey", () => {
  it("detects level from className", () => {
    expect(detectLevelKey({ className: "Goethe B2 Evening" })).toBe("B2");
  });

  it("detects level from level/course fields", () => {
    expect(detectLevelKey({ level: "a1" })).toBe("A1");
    expect(detectLevelKey({ course: "intensive c1 prep" })).toBe("C1");
  });

  it("returns empty string when no CEFR token exists", () => {
    expect(detectLevelKey({ className: "Weekend Beginners" })).toBe("");
  });
});

describe("getDay0WorkbookLinkForLevel", () => {
  it("returns configured day 0 workbook link for supported levels", () => {
    expect(getDay0WorkbookLinkForLevel("A1")).toContain("a1-day-0");
    expect(getDay0WorkbookLinkForLevel("B2")).toContain("b2-day-0");
  });

  it("returns null for missing level", () => {
    expect(getDay0WorkbookLinkForLevel("")).toBeNull();
  });
});
