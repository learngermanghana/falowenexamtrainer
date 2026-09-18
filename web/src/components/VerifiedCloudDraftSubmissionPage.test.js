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

  test("supports the compact A1 review form without rendering the legacy locked submission page", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "VerifiedCloudDraftSubmissionPage.js"),
      "utf8",
    );

    expect(source).toContain("compact = false");
    expect(source).toContain("✓ Already submitted — this assignment has already been sent to your tutor.");
    expect(source).toContain('compact ? "Your answers *" : "Your text *"');
    expect(source).toContain('compact ? "1fr" : "repeat(auto-fit, minmax(180px, 1fr))"');
    expect(source).toContain("if (!confirmed && !compact)");
  });

  test("A1 canonical submissions opt into compact review mode", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "A1CanonicalSubmissionPanel.jsx"),
      "utf8",
    );

    expect(source).toContain("<VerifiedCloudDraftSubmissionPage");
    expect(source).toContain("compact");
    expect(source).toContain("Review your answers below. You can edit them before submitting.");
    expect(source).toContain(">Progress</strong>");
    expect(source).not.toContain("Review stage — not submitted yet");
  });
});
