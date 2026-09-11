const A2_DAY1_CHAPTER = "1.1";
const A2_DAY1_VIDEO = "https://youtu.be/DfJ04x4JGOo";
const A2_DAY1_GRAMMAR_ROUTE = "/campus/course/a2-starter-conjunctions-day-1";
const A2_DAY1_WORKBOOK_ROUTE = "/campus/course/a2-day-2-small-talk-workbook";

const isA2Day1 = (entry = {}) =>
  String(entry?.level || "").trim().toUpperCase() === "A2" &&
  Number(entry?.day ?? entry?.assignmentDay) === 1 &&
  String(entry?.chapter || "").trim() === A2_DAY1_CHAPTER;

export const alignA2CurriculumEntries = (entries = []) =>
  (Array.isArray(entries) ? entries : []).map((entry) => {
    if (!isA2Day1(entry)) return entry;

    return {
      ...entry,
      title: "Small Talk 1.1 (Exercise)",
      video: A2_DAY1_VIDEO,
      grammarPage: A2_DAY1_GRAMMAR_ROUTE,
      workbookRoute: A2_DAY1_WORKBOOK_ROUTE,
      assignmentId: "A2-1.1",
      assignment_id: "A2-1.1",
      submissionRequired: true,
      progressionEligible: true,
    };
  });

export {
  A2_DAY1_CHAPTER,
  A2_DAY1_VIDEO,
  A2_DAY1_GRAMMAR_ROUTE,
  A2_DAY1_WORKBOOK_ROUTE,
};
