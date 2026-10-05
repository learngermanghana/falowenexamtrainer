import fs from "fs";
import path from "path";
import { A1_ASSIGNMENT_ORDER, getA1Assignment } from "../data/a1AssignmentRegistry";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import { getA1CanonicalLesson } from "../data/a1CanonicalLessonCatalog";
import { getConfiguredInAppWorkbookResourceRoute } from "../data/inAppWorkbookRoutes";

describe("A1 Final Mock Exam Day 23", () => {
  const componentSource = fs.readFileSync(
    path.resolve(__dirname, "./A1FinalMockExamPage.jsx"),
    "utf8",
  );
  const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

  test("uses the four agreed section timers and 100-point result model", () => {
    expect(componentSource).toContain("lesen: 25 * 60");
    expect(componentSource).toContain("hoeren: 20 * 60");
    expect(componentSource).toContain("schreiben: 20 * 60");
    expect(componentSource).toContain("sprechen: 15 * 60");
    expect(componentSource).toContain("maxScore: 100");
    expect(componentSource).toContain("overallScore >= 60");
  });

  test("normalizes each skill to 25 points and keeps final answer review until the result stage", () => {
    expect(componentSource).toContain("* 25");
    expect(componentSource).toContain('stage: "result"');
    expect(componentSource).toContain("Lesen review");
    expect(componentSource).toContain("Hören review");
    expect(componentSource).toContain("Schreiben feedback");
    expect(componentSource).toContain("Sprechen feedback");
  });

  test("keeps the first readiness attempt separate from later practice attempts", () => {
    expect(componentSource).toContain("First readiness attempt");
    expect(componentSource).toContain("Practice Attempt");
    expect(componentSource).toContain("Practice the full mock again");
    expect(componentSource).toContain("saveA1MockAttempt");
  });

  test("finalizes completed mocks immediately so Admin and student announcements can sync", () => {
    expect(componentSource).toContain("completionSaveRef");
    expect(componentSource).toContain('section: "result"');
    expect(componentSource).toContain('status: "completed"');
    expect(componentSource).toContain("Could not finalize A1 mock result sync");
  });

  test("renders the mixed Goethe-style Schreiben form inside the full mock", () => {
    expect(componentSource).toContain("A1_GOETHE_WRITING_MOCK.teil1.formRows.map");
    expect(componentSource).toContain('field.kind === "choice"');
    expect(componentSource).toContain("a1-schreiben-form-choice-list");
    expect(componentSource).not.toContain("A1_GOETHE_WRITING_MOCK.teil1.prefilled.map");
    expect(componentSource).not.toContain("A1_GOETHE_WRITING_MOCK.teil1.fields.map");
  });

  test("keeps certificate ownership at the existing 19 tutor-marked A1 assignments", () => {
    expect(A1_ASSIGNMENT_ORDER).toHaveLength(19);
    expect(getA1Assignment("A1-5.10")).toBeNull();
  });

  test("makes Day 23 an exam-only self-practice card without lesson videos", () => {
    expect(getA1CanonicalLesson("5.10")).toMatchObject({
      day: 24,
      title: "A1 Final Mock Exam",
      destination: "/campus/course/a1-final-mock-exam",
      kind: "practice",
    });
    expect(
      getConfiguredInAppWorkbookResourceRoute({
        level: "A1",
        day: 24,
        chapter: "5.10",
      }),
    ).toBe("/campus/course/a1-final-mock-exam");
    expect(getA1TeacherVideoResources(24)).toHaveLength(0);
  });

  test("keeps the old Day 23 URL as a compatibility alias to the final mock", () => {
    expect(appSource).toContain('path="/campus/course/a1-final-mock-exam"');
    expect(appSource).toContain('path="/campus/course/conjunctions-5-10"');
    expect(
      appSource.match(/path="\/campus\/course\/conjunctions-5-10"[\s\S]{0,120}<A1FinalMockExamPage \/>/),
    ).toBeTruthy();
  });

  test("uses English for app controls while keeping German exam content", () => {
    expect(componentSource).toContain("Current section");
    expect(componentSource).toContain("Time left");
    expect(componentSource).toContain("Start A1 Mock");
    expect(componentSource).toContain("Submit Lesen → Hören");
    expect(componentSource).toContain("Submit Hören → Schreiben");
    expect(componentSource).toContain("Submit Schreiben → Sprechen");
    expect(componentSource).toContain("Start audio");
    expect(componentSource).not.toContain("Aktueller Teil");
    expect(componentSource).not.toContain("Restzeit");
    expect(componentSource).not.toContain("A1 Mock starten");
  });

  test("routes further practice to the Exams Room and keeps the mock non-certificate-bearing", () => {
    expect(componentSource).toContain('href="/exams/overview"');
    expect(componentSource).toContain('href="/exams/speaking"');
    expect(componentSource).toContain("does not add a new certificate assignment");
  });
});
