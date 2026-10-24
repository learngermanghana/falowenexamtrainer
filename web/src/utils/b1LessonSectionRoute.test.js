import { resolveB1LessonSectionRoute } from "./b1LessonSectionRoute";
import { replaceLessonView } from "./lessonSectionDeepLinks";
import fs from "fs";
import path from "path";

const lesson = (day, view, extra = {}) => resolveB1LessonSectionRoute({
  day, view, hasWorkbook: true, hasGrammar: true, ...extra,
});

describe("B1 grammar / workbook navigation deep links", () => {
  test.each([1, 2, 6, 11, 18, 22, 24, 28])(
    "Day %i keeps Grammar and Teil 1–4 in the same workbook",
    (day) => {
      for (const view of ["grammar", "workbook", "sprechen", "schreiben", "lesen", "hoeren", "references", "submit"]) {
        expect(lesson(day, view)).toBe("workbook");
      }
    },
  );

  test("preserves a standalone grammar fallback for the Day 23 speaking mock", () => {
    expect(lesson(23, "grammar")).toBe("grammar");
    expect(lesson(23, "workbook")).toBe("workbook");
  });

  test("keeps standalone grammar if no workbook exists, and the existing legacy route otherwise", () => {
    expect(lesson(1, "grammar", { hasWorkbook: false })).toBe("grammar");
    expect(lesson(1, "grammar", { hasWorkbook: false, hasGrammar: false })).toBe("legacy");
    expect(lesson(1, "unknown")).toBe("legacy");
  });

  test("preserves chapter-only workbook links and canonical A2/B1 aliases", () => {
    expect(lesson(18, "", { chapter: "6.18", workbookChapter: "6.18" })).toBe("workbook");
    expect(lesson(18, "", { chapter: "7.18", workbookChapter: "6.18" })).toBe("legacy");
    expect(lesson(1, "hören")).toBe("workbook");
    expect(lesson(1, "reading")).toBe("workbook");
  });

  test("navigation keeps the identity and radio completion parameters when selecting Grammar", () => {
    const search = "?view=sprechen&assignmentKey=B1-1.1&assignmentId=B1-1.1&level=B1&radio=done";
    const grammarSearch = replaceLessonView(search, "grammar");
    expect(new URLSearchParams(grammarSearch).get("view")).toBe("grammar");
    expect(new URLSearchParams(grammarSearch).get("radio")).toBe("done");
    expect(new URLSearchParams(grammarSearch).get("assignmentKey")).toBe("B1-1.1");
    expect(new URLSearchParams(grammarSearch).get("assignmentId")).toBe("B1-1.1");
    expect(new URLSearchParams(grammarSearch).get("level")).toBe("B1");
    expect(lesson(1, new URLSearchParams(grammarSearch).get("view"))).toBe("workbook");
    expect(lesson(1, new URLSearchParams(replaceLessonView(grammarSearch, "sprechen")).get("view"))).toBe("workbook");
  });

  test("the router uses the shared B1 workbook and its existing GrammarNotesTab/navigation", () => {
    const router = fs.readFileSync(path.resolve(__dirname, "../components/CourseLessonPage.js"), "utf8");
    const workbook = fs.readFileSync(path.resolve(__dirname, "../components/B1StandardWorkbookPage.js"), "utf8");
    expect(router).toContain("resolveB1LessonSectionRoute({");
    expect(router).toContain('if (sectionRoute === "workbook")');
    expect(workbook).toContain("<WorkbookTabNav");
    expect(workbook).toContain('resolvedActiveTab === "grammar"');
    expect(workbook).toContain('<A2B1GrammarNotesTab level="B1" day={config.day} />');
  });
});
