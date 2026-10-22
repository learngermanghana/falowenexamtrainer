import { normalizeA2B1SectionView } from "./lessonSectionDeepLinks";

const B1_WORKBOOK_VIEWS = new Set([
  "workbook", "radio", "sprechen", "schreiben", "lesen", "hoeren",
  "references", "submit",
]);

/**
 * B1 Grammar is a section of the regular workbook, not a second page.
 * Keep the speaking-only Day 23 mock separate; it has no standard workbook tabs.
 */
export const resolveB1LessonSectionRoute = ({
  day,
  view = "",
  chapter = "",
  workbookChapter = "",
  hasWorkbook = false,
  hasGrammar = false,
} = {}) => {
  const normalizedView = normalizeA2B1SectionView(view);
  const speakingMock = Number(day) === 23;
  if (normalizedView === "grammar") {
    if (hasWorkbook && !speakingMock) return "workbook";
    return hasGrammar ? "grammar" : "legacy";
  }
  if (hasWorkbook && (
    B1_WORKBOOK_VIEWS.has(normalizedView) ||
    (Boolean(workbookChapter) && chapter === workbookChapter)
  )) return "workbook";
  return "legacy";
};
