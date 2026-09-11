export const A2_EARLY_COURSE_ALIGNMENT = Object.freeze({
  1: Object.freeze({
    chapter: "1.1",
    title: "Small Talk 1.1 (Exercise)",
    video: "https://youtu.be/DfJ04x4JGOo",
    grammarPage: "/campus/course/a2-starter-conjunctions-day-1",
    workbookRoute: "/campus/course/a2-day-2-small-talk-workbook",
    assignmentId: "A2-1.1",
  }),
  2: Object.freeze({
    chapter: "1.2",
    video: "https://youtu.be/3_X7pyFA5A4",
    grammarPage: "/campus/course/personen-beschreiben-1-2-grammar-notes",
    workbookRoute: "/campus/course/a2-day-2-personen-beschreiben-workbook",
    assignmentId: "A2-1.2",
  }),
  3: Object.freeze({
    chapter: "1.3",
    video: "https://youtu.be/wV45Md6nSgY",
    grammarPage: "/campus/course/dinge-und-personen-vergleichen-1-3-grammar-notes",
    workbookRoute: "/campus/course/a2-day-3-dinge-und-personen-vergleichen-workbook",
    assignmentId: "A2-1.3",
  }),
  4: Object.freeze({
    chapter: "2.4",
    video: "https://youtu.be/U14gkjld0ys",
    grammarPage: "/campus/course/wo-moechten-wir-uns-treffen-2-4-grammar-notes",
    workbookRoute: "/campus/course/a2-day-4-wo-moechten-wir-uns-treffen-workbook",
    assignmentId: "A2-2.4",
  }),
  5: Object.freeze({
    chapter: "2.5",
    video: "https://youtu.be/8605_yumfoM",
    grammarPage: "/campus/course/was-machst-du-in-deiner-freizeit-2-5-grammar-notes",
    workbookRoute: "/campus/course/a2-day-5-freizeit-workbook",
    assignmentId: "A2-2.5",
  }),
  6: Object.freeze({
    chapter: "3.6",
    video: "https://youtu.be/eP4NeBmmZF8",
    grammarPage: "/campus/course/moebel-und-raeume-3-6-grammar-notes",
    workbookRoute: "/campus/course/a2-day-6-moebel-und-raeume-workbook",
    assignmentId: "A2-3.6",
  }),
  7: Object.freeze({
    chapter: "3.7",
    video: "https://youtu.be/ScU6w8VQgNg",
    grammarPage: "/campus/course/relativsaetze-die-der-das-wohnung-suchen-3-7-notes",
    workbookRoute: "/campus/course/a2-day-7-eine-wohnung-suchen-workbook",
    assignmentId: "A2-3.7",
  }),
  8: Object.freeze({
    chapter: "3.8",
    video: "https://youtu.be/hxkk6dZSjNM",
    grammarPage: "/campus/course/imperativ-rezepte-und-essen-3-8-grammar-notes",
    workbookRoute: "/campus/course/a2-day-8-rezepte-und-essen-workbook",
    assignmentId: "A2-3.8",
  }),
  9: Object.freeze({
    chapter: "4.9",
    video: "https://youtu.be/NxoQH-BY9Js",
    grammarPage: "/campus/course/perfekt-urlaub-4-9-grammar-notes",
    workbookRoute: "/campus/course/a2-day-9-urlaub-workbook",
    assignmentId: "A2-4.9",
  }),
  10: Object.freeze({
    chapter: "4.10",
    video: "https://youtu.be/yOfTCQDn_JM",
    grammarPage: "/campus/course/praeteritum-tourismus-und-traditionelle-feste-4-10-grammar-notes",
    workbookRoute: "/campus/course/a2-day-10-tourismus-und-traditionelle-feste-workbook",
    assignmentId: "A2-4.10",
  }),
  11: Object.freeze({
    chapter: "4.11",
    video: "https://youtu.be/RkvfRiPCZI4",
    grammarPage: "/campus/course/unterwegs-verkehrsmittel-vergleichen-4-11-grammar-notes",
    workbookRoute: "/campus/course/a2-day-11-unterwegs-verkehrsmittel-vergleichen-workbook",
    assignmentId: "A2-4.11",
  }),
  12: Object.freeze({
    chapter: "5.12",
    video: "https://youtu.be/w81bsmssGXQ",
    grammarPage: "/campus/course/mein-traumberuf-5-12-grammar-notes",
    workbookRoute: "/campus/course/a2-day-12-mein-traumberuf-workbook",
    assignmentId: "A2-5.12",
  }),
});

const getA2EarlyCourseAlignment = (entry = {}) => {
  if (String(entry?.level || "").trim().toUpperCase() !== "A2") return null;

  const day = Number(entry?.day ?? entry?.assignmentDay);
  const alignment = A2_EARLY_COURSE_ALIGNMENT[day];
  if (!alignment) return null;
  if (String(entry?.chapter || "").trim() !== alignment.chapter) return null;

  return alignment;
};

export const alignA2CurriculumEntries = (entries = []) =>
  (Array.isArray(entries) ? entries : []).map((entry) => {
    const alignment = getA2EarlyCourseAlignment(entry);
    if (!alignment) return entry;

    return {
      ...entry,
      ...(alignment.title ? { title: alignment.title } : {}),
      video: alignment.video,
      grammarPage: alignment.grammarPage,
      workbookRoute: alignment.workbookRoute,
      assignmentId: alignment.assignmentId,
      assignment_id: alignment.assignmentId,
      submissionRequired: true,
      progressionEligible: true,
    };
  });

export const A2_DAY1_CHAPTER = A2_EARLY_COURSE_ALIGNMENT[1].chapter;
export const A2_DAY1_VIDEO = A2_EARLY_COURSE_ALIGNMENT[1].video;
export const A2_DAY1_GRAMMAR_ROUTE = A2_EARLY_COURSE_ALIGNMENT[1].grammarPage;
export const A2_DAY1_WORKBOOK_ROUTE = A2_EARLY_COURSE_ALIGNMENT[1].workbookRoute;
