import fs from "fs";
import path from "path";

describe("Exams Room navigation cleanup", () => {
  test("keeps Listening and removes the redundant Resources destination", () => {
    const app = fs.readFileSync(path.join(process.cwd(), "src", "App.js"), "utf8");
    const english = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "src", "i18n", "locales", "en", "translation.json"), "utf8")
    );

    expect(english.appNav.examTabs.horen).toBe("Listening");
    expect(app).not.toContain('{ key: "resources"');
    expect(app).not.toContain('<ExamResources />');
    expect(app).not.toContain('import ExamResources');
    expect(app).toContain('if (section === "resources") return "file";');
  });

  test("the old Resources component is removed and overview points to Exam File", () => {
    expect(fs.existsSync(path.join(process.cwd(), "src", "components", "ExamResources.js"))).toBe(false);

    const overview = fs.readFileSync(
      path.join(process.cwd(), "src", "components", "ExamsOverviewPage.js"),
      "utf8"
    );
    expect(overview).toContain('onClick={() => navigate("/exams/file")}');
    expect(overview).toContain("Or practise one skill");
    expect(overview).not.toContain("review your exam resources");
  });
});
