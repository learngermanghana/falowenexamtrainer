import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("Goethe Exam File hub", () => {
  const page = read("MyExamFilePage.js");
  const guide = fs.readFileSync(
    path.resolve(__dirname, "../data/goetheExamFileGuide.js"),
    "utf8",
  );
  const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
  const schedule = fs.readFileSync(
    path.resolve(__dirname, "../data/goetheExamSchedule.js"),
    "utf8",
  );

  test("shows Goethe account, registration, exam sample and concise structure guidance", () => {
    expect(page).toContain("Create / sign in to Goethe account");
    expect(page).toContain("Open the official registration page");
    expect(page).toContain("EXAM SAMPLE");
    expect(page).toContain("Open exam sample");
    expect(page).toContain("How the {examGuide.level} exam is structured");
    expect(page).toContain('data-exam-file-registration-guide="true"');
  });

  test("covers every level from A1 through C2", () => {
    expect(guide).toContain('["A1", "A2", "B1", "B2", "C1", "C2"]');
    expect(guide).toContain('sampleUrl: courseGuide.practiceUrl');
    expect(guide).toContain('sampleUrl: "https://www.goethe.de/en/spr/prf/ueb/pb2.html"');
    expect(guide).toContain('sampleUrl: "https://www.goethe.de/en/spr/prf/ueb/pc1.html"');
    expect(guide).toContain('sampleUrl: "https://www.goethe.de/en/spr/prf/ueb/pc2.html"');
    expect(schedule).toContain('level: "C2"');
  });

  test("keeps Exam File available to self-learning levels", () => {
    expect(app).toContain("examFile: isEnrolled || isStaff");
    expect(app).not.toContain("examFile: (isEnrolled || isStaff) && !isSelfLearningTrack");
  });
});
