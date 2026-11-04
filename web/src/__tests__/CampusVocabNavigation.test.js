import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, "../" + relativePath), "utf8");

describe("Campus vocabulary replaces Exam File without removing exam access", () => {
  const app = read("App.js");
  const vocab = read("components/VocabExamPage.js");

  it("shows a Campus Vocabulary tab backed by the existing sheet and practice modes", () => {
    expect(app).toContain('{ key: "vocab", label: t("appNav.sections.vocab"), section: "vocab" }');
    expect(app).toContain("vocab: true,");
    expect(app).toContain('resolvedSection === "vocab" && allowedSections.vocab ? <VocabExamPage context="campus" />');
    expect(vocab).toContain("fetchVocabularyFromSheet()");
    expect(vocab).toContain('context === "campus" ? "Falowen Campus" : "Exam Room"');
    expect(app).not.toContain('<Route path="/campus/vocab" element={<Navigate to="/campus/music"');
  });

  it("keeps Exam File and Date in the Exams Room and redirects old Campus links there", () => {
    expect(app).toContain('<Route path="/campus/examFile" element={<Navigate to="/exams/file" replace />} />');
    expect(app).toContain('{ key: "file", label: t("appNav.examTabs.file") }');
    expect(app).toContain('examSection === "file" ? <MyExamFilePage />');
    expect(app).not.toContain('resolvedSection === "examFile" && allowedSections.examFile');
  });
});
