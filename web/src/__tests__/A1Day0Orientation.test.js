import fs from "fs";
import path from "path";

const source = fs.readFileSync(
  path.resolve(__dirname, "../components/A1Day0OrientationKnowledgeTestWorkbookPage.js"),
  "utf8"
);

describe("A1 Day 0 student orientation", () => {
  it("uses an A1-specific orientation instead of the generic Day 0 page", () => {
    expect(source).not.toContain('CurrentDay0OrientationPage');
    expect(source).toContain('data-a1-day0-orientation="true"');
    expect(source).toContain("A1 Day 0: How to use Falowen");
  });

  it("explains the current Course Book structure and filters", () => {
    expect(source).toContain("Orientation — Day 0");
    expect(source).toContain("A1.1 – Foundations — Days 1–12");
    expect(source).toContain("A1.2 – Application and Readiness — Days 13–24");
    expect(source).toContain('title="All lessons"');
    expect(source).toContain('title="Next lesson"');
    expect(source).toContain('title="Assignments"');
    expect(source).toContain('title="Self-learning"');
    expect(source).toContain("Continue learning");
  });

  it("teaches the current lesson flow and in-workbook submission", () => {
    expect(source).toContain("Falowen Radio → Continue → lesson instruction");
    expect(source).toContain("Submit only when required");
    expect(source).toContain("Required submissions are handled");
    expect(source).not.toContain("/campus/submit");
  });

  it("explains the main Campus areas and keeps exam practice separate", () => {
    [
      "Course Book",
      "Exam File",
      "Attendance",
      "Class Members",
      "Vocab Practice",
      "Results",
      "Account",
      "Exams Room",
    ].forEach((label) => expect(source).toContain(label));

    expect(source).toContain("It supports your preparation but does not replace the Course Book");
  });

  it("keeps the current pass mark and knowledge check", () => {
    expect(source).toContain("Assignment pass mark: 60%");
    expect(source).toContain("A1 Day 0 platform check");
    expect(source).toContain("75% or higher");
  });
});
