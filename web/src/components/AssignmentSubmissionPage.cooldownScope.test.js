import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "AssignmentSubmissionPage.js"), "utf8");

describe("assignment submission cooldown scope", () => {
  it("only applies the cooldown to the currently selected assignment", () => {
    const cooldownStart = source.indexOf("const latestSubmissionActionAt = useMemo");
    const cooldownEnd = source.indexOf("const nextAllowedSubmissionAt = useMemo", cooldownStart);
    const cooldownBlock = source.slice(cooldownStart, cooldownEnd);
    const selectedAssignmentGuard = cooldownBlock.indexOf("if (!isSameSelectedAssignment(item)) return acc;");
    const timestampRead = cooldownBlock.indexOf("const itemDate = toDateValue");

    expect(cooldownStart).toBeGreaterThanOrEqual(0);
    expect(cooldownEnd).toBeGreaterThan(cooldownStart);
    expect(selectedAssignmentGuard).toBeGreaterThanOrEqual(0);
    expect(timestampRead).toBeGreaterThan(selectedAssignmentGuard);
    expect(cooldownBlock).toContain("[isSameSelectedAssignment, recentSubmissions]");
  });
});
