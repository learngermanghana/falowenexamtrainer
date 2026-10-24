import fs from "fs";
import path from "path";
import { getA1CourseBookCard } from "./a1CourseBookCards";
import { getConfiguredInAppWorkbookResourceRoute } from "./inAppWorkbookRoutes";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A1 Day 23 final mock handoff", () => {
  it("retires Chapter 14.2 from the A1 Course Book", () => {
    expect(getA1CourseBookCard({ displayDay: 23, chapter: "14.2" })).toBeNull();
  });

  it("makes the A1 Final Mock the Day 23 Course Book destination", () => {
    const card = getA1CourseBookCard({ displayDay: 23, chapter: "5.10" });

    expect(card).toMatchObject({
      title: "A1 Final Mock Exam",
      assessmentType: "self-practice",
      submissionRequired: false,
      progressionEligible: false,
    });
    expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day: 23, chapter: "5.10" })).toBe(
      "/campus/course/a1-final-mock-exam",
    );
  });

  it("redirects old Chapter 14.2 URLs to Exams Room Schreiben", () => {
    const app = read("../App.js");
    expect(app).toContain('path="/campus/course/a1-day-23-writing-workshop-14-2"');
    expect(app).toContain('<Navigate to="/exams/writing" replace />');
  });
});
