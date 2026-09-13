import fs from "fs";
import path from "path";

const readComponent = (name) =>
  fs.readFileSync(path.resolve(__dirname, `../components/${name}`), "utf8");

const day0Sources = {
  A1: readComponent("A1Day0OrientationKnowledgeTestWorkbookPage.js"),
  A2: readComponent("A2Day0OrientationKnowledgeTestWorkbookPage.js"),
  B1: readComponent("B1Day0OrientationKnowledgeTestWorkbookPage.js"),
  B2: readComponent("B2Day0SelfLearningOrientationWorkbookPage.js"),
  C1: readComponent("C1Day0ProgressionWorkbookPage.js"),
};

const courseTab = readComponent("CourseTab.js");

describe("A1-C1 Day 0 and Course Book navigation consistency", () => {
  it("keeps a level-specific Day 0 entry point for every German level from A1 to C1", () => {
    expect(day0Sources.A1).toContain("A1 Day 0: How to use Falowen");
    expect(day0Sources.A2).toContain("A2 Day 0: How to use Falowen");
    expect(day0Sources.B1).toContain("B1 Day 0: How to use Falowen");
    expect(day0Sources.B2).toContain('level: "B2"');
    expect(day0Sources.B2).toContain("B2 self-learning");
    expect(day0Sources.C1).toContain("C1 Day 0");
  });

  it("does not reintroduce the retired separate student submission route in Day 0 guidance", () => {
    Object.entries(day0Sources).forEach(([level, source]) => {
      expect({ level, source }).toEqual(expect.objectContaining({ level }));
      expect(source).not.toMatch(/["']\/campus\/submit/);
      expect(source).not.toContain("https://www.falowen.app/campus/submit");
    });
    expect(courseTab).not.toMatch(/["']\/campus\/submit/);
  });

  it("keeps the current Course Book filters available across levels", () => {
    ["All lessons", "Next lesson", "Assignments", "Self-learning"].forEach((label) => {
      expect(courseTab).toContain(label);
    });
    expect(courseTab).toContain("Continue learning");
  });

  it("groups B1, B2 and C1 into clear learning phases", () => {
    [
      "B1.1 – Independent Everyday Communication",
      "B1.2 – Connected Communication and Exam Readiness",
      "B2.1 – Independent Communication and Analysis",
      "B2.2 – Argumentation, Precision and Readiness",
      "C1.1 – Advanced Expression and Analysis",
      "C1.2 – Precision, Structure and Exam Readiness",
    ].forEach((label) => expect(courseTab).toContain(label));

    expect(courseTab).toContain("COURSE_BOOK_PRESENTATION_SECTIONS");
    expect(courseTab).toContain("getCourseBookPresentationSection(entry, normalizedSelectedCourseLevel)");
    expect(courseTab).toContain("data-course-section-intro={section.key}");
  });

  it("shows compact purpose-based weekly outcomes instead of repeating lesson content", () => {
    expect(courseTab).toContain("COURSE_BOOK_WEEK_GOAL_LIMIT = 3");
    expect(courseTab).toContain("COURSE_BOOK_WEEK_PURPOSES");
    expect(courseTab).toContain("getCourseBookWeekNumber");
    expect(courseTab).toContain("getCourseBookWeekPurposeItems");
    expect(courseTab).toContain('className="course-book-week-goal"');
    expect(courseTab).toContain("data-course-week-goal");
    expect(courseTab).toContain("Week {weekNumber} outcome");
    expect(courseTab).toContain("By the end of this week, you should be able to:");
    expect(courseTab).toContain('weekOutcomeItems.join(" • ")');
    expect(courseTab).not.toContain("getCourseBookWeekOutcomeItems");
    expect(courseTab).not.toContain("cleanCourseBookWeekOutcome");
  });

  it("keeps explicit capability outcomes for every German level from A1 to C1", () => {
    [
      "greet people, introduce yourself and exchange basic personal information",
      "show that you can work independently with the core skills needed to move toward B1",
      "present a balanced viewpoint and respond to another perspective",
      "analyse a social or everyday issue from more than one perspective",
      "synthesise ideas, evaluate competing positions and address counterarguments",
    ].forEach((outcome) => expect(courseTab).toContain(outcome));
  });
});
