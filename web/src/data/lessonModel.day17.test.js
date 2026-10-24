import { normalizeLesson } from "./lessonModel";

test("A2 Day 17 replaces the old A1 modal-verbs link with the pharmacy grammar notes route", () => {
  const lesson = normalizeLesson(
    {
      day: 17,
      chapter: "6.17",
      topic: "In die Apotheke gehen 6.17 (Exercise)",
      assignment: true,
      lesen_hören: {
        grammarbook_link: "/campus/course/modal-verbs-day-14-3-6",
        workbook_link: "/campus/course/a2-day-17-in-die-apotheke-gehen-workbook",
      },
    },
    "A2",
  );

  expect(lesson.resources.grammarBook.url).toBe(
    "/campus/course/a2-day-17-in-die-apotheke-grammar-notes.html",
  );
  expect(lesson.resources.workbook.url).toBe(
    "/campus/course/a2-day-17-in-die-apotheke-gehen-workbook",
  );
});
