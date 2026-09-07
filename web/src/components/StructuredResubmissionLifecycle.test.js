import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("structured one-box resubmission lifecycle", () => {
  test("AssignmentSubmissionPage preloads previous Teile and sends structured resubmission metadata", () => {
    const page = read("AssignmentSubmissionPage.js");

    expect(page).toContain("resolveStructuredResubmissionSeed");
    expect(page).toContain("compareStructuredSubmissionSections");
    expect(page).toContain("const previousResubmissionSeed = useMemo(");
    expect(page).toContain("const structuredResubmissionEnabled = Boolean(");
    expect(page).toContain("setResubmissionText(resubmissionEditorSeed.text)");
    expect(page).toContain("Your answers are unchanged. Correct at least one Teil before resubmitting.");
    expect(page).toContain("previousStructuredSections: previousResubmissionSeed.sections || null");
    expect(page).toContain("changedSubmissionParts: structuredDiffForSubmit?.changedParts || []");
    expect(page).toContain('data-structured-resubmission-template="true"');
    expect(page).toContain("Falowen checks changes Teil by Teil");
  });

  test("resubmission callable persists structured metadata instead of dropping it", () => {
    const server = read("../../../functions/resubmission.js");

    expect(server).toContain("const sanitizeStructuredSections = (value = null) =>");
    expect(server).toContain("const compareStructuredSections = (previousSections = {}, currentSections = {}, sectionOrder = []) =>");
    expect(server).toContain("Your answers are unchanged. Correct at least one Teil before resubmitting.");
    expect(server).toContain("structuredSections: validated.structured.structuredSections");
    expect(server).toContain("submissionSectionOrder: validated.structured.submissionSectionOrder");
    expect(server).toContain("previousStructuredSections: validated.structured.previousStructuredSections");
    expect(server).toContain("changedSubmissionParts: validated.structured.changedSubmissionParts");
  });
});
