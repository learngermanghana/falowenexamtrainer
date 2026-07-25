import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "AssignmentSubmissionPage.js"), "utf8");

describe("assignment submission cooldown scope", () => {
  it("only applies the cooldown to the currently selected assignment", () => {
    const cooldownStart = source.indexOf("const latestSubmissionActionAt = useMemo");
    const cooldownEnd = source.indexOf("const nextAllowedSubmissionAt = useMemo", cooldownStart);
    const cooldownBlock = source.slice(cooldownStart, cooldownEnd);

    expect(cooldownStart).toBeGreaterThanOrEqual(0);
    expect(cooldownEnd).toBeGreaterThan(cooldownStart);
    expect(cooldownBlock).toContain("if (!isSameSelectedAssignment(item)) return acc;");
    expect(cooldownBlock).toContain("[isSameSelectedAssignment, recentSubmissions]");
  });
});
