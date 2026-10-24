import fs from "fs";
import path from "path";

const readSource = (file) => fs.readFileSync(path.resolve(__dirname, "..", file), "utf8");

describe("Exams Room level selector across all sections", () => {
  const app = readSource("App.js");
  const context = readSource("context/ExamContext.js");
  const overview = readSource("components/ExamsOverviewPage.js");
  const schreiben = readSource("components/WritingPage.js");

  it("shows one unlocked lower-level selector in the shared Exams Room shell", () => {
    expect(app).toContain('role="group" aria-label="Choose exam practice level"');
    expect(app).toContain("accessibleLevels.map((option)");
    expect(app).toContain('aria-pressed={level === option}');
    expect(app).toContain('if (sampleId) navigate(`/exams/${examSection}`)');
    expect(app).toContain("Your Course Book level stays unchanged");
    expect(app).not.toContain("disabled={Boolean(profileExamLevel)}");
    expect(app).not.toContain("setLevel(profileExamLevel)");
  });

  it("switches mock, skills and overview together without modifying enrollment", () => {
    expect(overview).toContain("const { level } = useExam()");
    expect(app).toContain("<MockExamLibraryPage />");
    expect(app).toContain("<SpeakingPage />");
    expect(app).toContain("<HorenPage practiceLevel={practiceLevel} sampleId={sampleId} />");
    expect(app).toContain("<LesenPage practiceLevel={practiceLevel} sampleId={sampleId} />");
    expect(context).toContain("getExamPracticeLevels(profileExamLevel)");
    expect(context).toContain("savePreferredLevel(nextLevel, user?.uid)");
    expect(context).not.toContain("saveStudentProfile({ level:");
    expect(schreiben).toContain("level: examPracticeLevel");
    expect(schreiben).toContain("const level = isCourseMode && enrolledLevel ? enrolledLevel : examPracticeLevel");
    expect(schreiben).not.toContain("setLevel(profileLevel)");
    expect(schreiben).toContain("(isExamMode ? accessibleLevels : ALLOWED_LEVELS).map");

  });
});
