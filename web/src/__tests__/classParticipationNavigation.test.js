import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const courseCompletionPath = path.join(projectRoot, "src/components/CourseCompletionConclusion.js");
const accountSettingsPath = path.join(projectRoot, "src/components/AccountSettings.js");
const participationCardPath = path.join(projectRoot, "src/components/ClassParticipationCard.js");
const participationServicePath = path.join(projectRoot, "src/services/classParticipationService.js");

describe("Class Participation navigation", () => {
  test("Course completion links to the participation details", () => {
    const source = fs.readFileSync(courseCompletionPath, "utf8");

    expect(source).toContain('href="/campus/account?tab=participation"');
    expect(source).toContain("Open Participation");
  });

  test("Account exposes participation as a Router-synchronized deep view without consuming a tab slot", () => {
    const source = fs.readFileSync(accountSettingsPath, "utf8");

    expect(source).toMatch(/import\s*\{[^}]*\buseLocation\b[^}]*\buseNavigate\b[^}]*\}\s*from\s*"react-router-dom"/);
    expect(source).toContain("const location = useLocation();");
    expect(source).toContain("const navigate = useNavigate();");
    expect(source).toContain('new URLSearchParams(location.search).get("tab")');
    expect(source).toContain('activeTab === "participation"');
    expect(source).toContain('get("tab") || "billing"');
    expect(source).toContain('{ key: "studentData", label: t("accountSettings.tabs.studentData") }');
    expect(source).toContain('{ key: "billing", label: t("accountSettings.tabs.billing") }');
    expect(source).toContain('onClick={() => selectAccountTab(tab.key)}');
    expect(source).toContain('<ClassParticipationCard />');
    expect(source).toContain('onClick={() => selectAccountTab("studentData")}');
    expect(source).not.toContain('t("accountOverview.learningRecords")');
    expect(source).not.toContain('selectAccountTab("participation")');
    expect(source).toContain("Back to Student Data");
    expect(source).toContain('params.set("tab", tabKey)');
    expect(source).toContain("navigate(nextUrl, { replace: true })");
    expect(source).not.toContain("window.history.replaceState");
    expect(source).not.toContain("setActiveTab(tabKey)");
    expect(source).not.toContain('{ key: "participation", label:');
    const studentDataStart = source.indexOf('{activeTab === "studentData"');
    const participationStart = source.indexOf('{activeTab === "participation"');
    const studentDataSource = source.slice(studentDataStart, participationStart);
    expect(studentDataSource).not.toContain("<span>Contract start</span>");
    expect(studentDataSource).not.toContain("<span>Contract end</span>");
    expect(source).not.toContain('{activeTab === "studentData" ? <ClassParticipationCard /> : null}');
  });

  test("the detailed participation view supports canonical and legacy recap links", () => {
    const source = fs.readFileSync(participationCardPath, "utf8");

    expect(source).toContain("This week");
    expect(source).toContain("Overall participation");
    expect(source).toContain("Class history");
    expect(source).toContain("Accuracy");
    expect(source).toContain("QuestionHistory");
    expect(source).toContain('params.get("classSessionId")');
    expect(source).toContain('params.get("sessionId")');
    expect(source).toContain("record.classSessionId === requestedClassSessionId");
    expect(source).toContain("record.sessionId === requestedSessionId");
    expect(source).toContain("<strong>Lesson:</strong>");
    expect(source).toContain("<strong>Recorded:</strong>");
    expect(source).toContain("It does not change your course grade or official attendance.");
  });

  test("participation metrics use canonical deduplicated records", () => {
    const source = fs.readFileSync(participationServicePath, "utf8");

    expect(source).toContain("classSessionId: clean(record.classSessionId)");
    expect(source).toContain("revision: revisionNumber(record.revision)");
    expect(source).toContain("markedDate: clean(record.markedDate)");
    expect(source).toContain("export const deduplicateParticipationRecords");
    expect(source).toContain("candidate.revision > current.revision");
    expect(source).toContain("timestampValue(candidate.updatedAt)");
    expect(source).toContain("candidate.sessionDate");
    expect(source).toContain("const canonicalRecords = deduplicateParticipationRecords(records)");
  });
});
