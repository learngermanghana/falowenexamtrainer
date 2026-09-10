import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const homeMetricsPath = path.join(projectRoot, "src/components/HomeMetrics.js");
const accountSettingsPath = path.join(projectRoot, "src/components/AccountSettings.js");
const participationCardPath = path.join(projectRoot, "src/components/ClassParticipationCard.js");

describe("Class Participation navigation", () => {
  test("Home keeps participation compact and links to the dedicated view", () => {
    const source = fs.readFileSync(homeMetricsPath, "utf8");

    expect(source).toContain('label="Class participation"');
    expect(source).toContain("participationSummary.responses");
    expect(source).toContain("participationSummary.needsReview");
    expect(source).toContain('/campus/account?tab=participation');
    expect(source).toContain("View participation →");
    expect(source).not.toContain("participationSummary.correct} correct");
  });

  test("Account exposes participation as a deep view without consuming a tab slot", () => {
    const source = fs.readFileSync(accountSettingsPath, "utf8");

    expect(source).toContain('activeTab === "participation"');
    expect(source).toContain("View class participation");
    expect(source).toContain("Back to Student Data");
    expect(source).toContain('params.set("tab", tabKey)');
    expect(source).not.toContain('{ key: "participation", label:');
    expect(source).not.toContain('{activeTab === "studentData" ? <ClassParticipationCard /> : null}');
  });

  test("the detailed participation view contains weekly, overall and question-level data", () => {
    const source = fs.readFileSync(participationCardPath, "utf8");

    expect(source).toContain("This week");
    expect(source).toContain("Overall participation");
    expect(source).toContain("Class history");
    expect(source).toContain("Accuracy");
    expect(source).toContain("QuestionHistory");
    expect(source).toContain("It does not change your course grade or official attendance.");
  });
});
