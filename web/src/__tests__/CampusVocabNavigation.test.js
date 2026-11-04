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

  it("keeps Music in the mobile bottom bar and Vocab under More", () => {
    const patch = read("../../scripts/patchCompactStudentNavigation.mjs");
    expect(patch).toContain('{ key: "music", label: "Music", icon: "✦", route: "/campus/music", permission: "music" }');
    expect(patch).toContain('["vocab", "books", "classMembers", "home"].includes(item.key)');
    expect(patch).not.toContain('    ["music", "books", "classMembers", "home"].includes(item.key)');
  });

  it("keeps documentation consistent with restored Campus vocabulary", () => {
    const help = read("../public/falowen-help.md");
    const guide = read("components/PublicStudentGuidePage.js");
    const nav = JSON.parse(read("../public/falowen-navigation.json"));
    const llms = read("../public/llms.txt");
    expect(nav.navigation.find(item => item.id === "vocabulary").route).toBe("/campus/vocab");
    expect(nav.navigation.find(item => item.id === "exam-file").route).toBe("/exams/file");
    expect(help).toContain("More → Vocab");
    expect(help).not.toContain("Existing `/campus/vocab` bookmarks redirect there");
    expect(guide).toContain('href="/campus/vocab"');
    expect(llms).toContain("Vocabulary practice (Campus; mobile More → Vocab)");
  });

  it("keeps Exam File and Date in the Exams Room and redirects old Campus links there", () => {
    expect(app).toContain('<Route path="/campus/examFile" element={<Navigate to="/exams/file" replace />} />');
    expect(app).toContain('{ key: "file", label: t("appNav.examTabs.file") }');
    expect(app).toContain('examSection === "file" ? <MyExamFilePage />');
    expect(app).not.toContain('resolvedSection === "examFile" && allowedSections.examFile');
  });
});
