import fs from "fs";
import path from "path";

describe("VerifiedCloudDraftSubmissionPage", () => {
  test("keeps the submission flow focused by excluding certificate readiness controls", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "VerifiedCloudDraftSubmissionPage.js"),
      "utf8",
    );

    expect(source).not.toContain("Certificate readiness");
    expect(source).not.toContain("Keep this visible before every submission");
    expect(source).not.toContain("ExamReadinessBadge");
  });
});
