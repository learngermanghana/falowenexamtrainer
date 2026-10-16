import fs from "fs";
import path from "path";

const read = (file) => fs.readFileSync(path.resolve(__dirname, file), "utf8");

describe("Exams Room Schreiben redesign", () => {
  const app = read("../App.js");
  const examRoom = read("ExamRoom.js");
  const workspace = read("ExamWritingWorkspace.jsx");
  const styles = read("ExamWritingWorkspace.css");

  test("both Exams Room routes use the same new writing workspace", () => {
    expect(app).toContain('<ExamWritingWorkspace />');
    expect(examRoom).toContain('<ExamWritingWorkspace />');
    expect(app).not.toContain('<WritingPage mode="exam"');
    expect(workspace).toContain('data-testid="exam-writing-workspace"');
  });

  test("features separate Teil tabs, persistent topic drafts and mobile task selection", () => {
    expect(workspace).toContain('className="few-parts"');
    expect(workspace).toContain("part.tasks.map(");
    expect(workspace).toContain("window.localStorage.setItem(key, JSON.stringify(records))");
    expect(workspace).toContain("onChange={(event) => changeDraft(event.target.value)}");
    expect(workspace).toContain("few-mobile-list-toggle");
    expect(styles).toContain("@media (max-width: 760px)");
  });

  test("keeps AI assessment and tutor submission on the existing services", () => {
    expect(workspace).toContain("markLetterWithAI({");
    expect(workspace).toContain("saveExamLetterForTutorReview({");
    expect(workspace).toContain("saveWritingAttempt({");
    expect(workspace).toContain('source: "exam-room-simple-writing"');
    expect(workspace).toContain("WritingFeedbackCard");
  });

  test("has distinct form and transformation fields and never exposes keys before checking", () => {
    expect(workspace).toContain('part.format === "form"');
    expect(workspace).toContain('part.format === "transformation"');
    expect(workspace).toContain('className="few-answer-key"');
    expect(workspace).toContain('feedback.type === "form"');
  });

  test("does not change existing full mocks or course writing", () => {
    expect(read("WritingPage.js")).toContain("const WritingPage = ({");
    expect(read("A1FinalMockExamPage.jsx")).toContain("Schreiben");
  });
});
