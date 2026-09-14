import fs from "fs";
import path from "path";

const source = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("Course Book navigation safety", () => {
  test("keys canonical live-class state to the current student class identity", () => {
    const indicator = source("./CourseBookNextClassIndicator.js");

    expect(indicator).toContain("const cacheIdentityKey = useMemo");
    expect(indicator).toContain("identity: cacheIdentityKey");
    expect(indicator).toContain("canonicalResolution.identity === cacheIdentityKey");
    expect(indicator).toContain("setCanonicalResolution({ identity, summary: cached || null })");
    expect(indicator).toContain("setCanonicalResolution({ identity: cacheIdentityKey, summary: null })");
    expect(indicator).not.toContain("const [canonicalSummary, setCanonicalSummary]");
  });

  test("restores Course Book labels and adds an explicit Back to Campus action", () => {
    const compactNavigationRunner = source("../../../scripts/runCompactStudentNavigationPatch.mjs");

    expect(compactNavigationRunner).toContain('label: "Course Book"');
    expect(compactNavigationRunner).toContain('className="course-book-back-to-campus"');
    expect(compactNavigationRunner).toContain("← Back to Campus");
    expect(compactNavigationRunner).toContain('onClick={() => navigate("/")}');
  });
});
