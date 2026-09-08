import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("structured one-box submission lifecycle", () => {
  test("AssignmentSubmissionPage is patched to use the canonical structured template contract", () => {
    const page = read("AssignmentSubmissionPage.js");

    expect(page).toContain('from "../utils/structuredSubmissionTemplate"');
    expect(page).toContain("const selectedSubmissionProfile = useMemo(");
    expect(page).toContain("parseStructuredSubmissionText(form.submissionText, selectedSubmissionProfile)");
    expect(page).toContain("structuredSections: parsedStructuredSubmission.sections");
    expect(page).toContain("submissionSectionOrder: parsedStructuredSubmission.sectionOrder");
    expect(page).toContain("requiredSubmissionParts: selectedSubmissionProfile.parts.map");
    expect(page).toContain("Please answer every required section before submitting");
    expect(page).toContain('data-structured-submission-template="true"');
    expect(page).toContain("One answer box, already organised for this assignment");
    expect(page).toContain("String(draft?.submissionText || \"\").trim() ||");
    expect(page).toContain("buildStructuredSubmissionTemplate(selectedSubmissionProfile) ||");
  });
});
