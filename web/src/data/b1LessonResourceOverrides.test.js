import {
  applyB1LessonResourceOverride,
  applyB1LessonVideoOverrides,
  getB1LessonResourceOverride,
} from "./b1LessonResourceOverrides";
import { normalizeLesson } from "./lessonModel";

describe("B1 canonical lesson resources", () => {
  test("B1 Day 1 exposes the in-app grammar notes and workbook", () => {
    const lesson = {
      day: 1,
      chapter: "1.1",
      lesen_hören: {
        chapter: "1.1",
        grammarbook_link: "https://drive.google.com/legacy-grammar",
        workbook_link: "https://drive.google.com/legacy-workbook",
      },
    };

    applyB1LessonResourceOverride(lesson);
    const normalized = normalizeLesson(lesson, "B1");

    expect(normalized.resources.grammarBook.url).toBe(
      "/campus/course/lesson/B1/1?view=grammar"
    );
    expect(normalized.resources.workbook.url).toBe(
      "/campus/course/lesson/B1/1?view=workbook"
    );
  });

  test("B1 Day 1 uses the requested AI grammar video", () => {
    const dictionary = { B1: {} };
    applyB1LessonVideoOverrides(dictionary);

    expect(dictionary.B1[1].videoResources).toEqual([
      expect.objectContaining({
        chapter: "1.1",
        url: "https://youtu.be/_mmAtSzWbNo",
      }),
    ]);
    expect(getB1LessonResourceOverride(1).aiVideo).toBe(
      "https://youtu.be/_mmAtSzWbNo"
    );
  });
});

describe("A1 Day 5 self-practice", () => {
  test("removes stale grammar notes but keeps the workbook", () => {
    const normalized = normalizeLesson(
      {
        day: 5,
        chapter: "1.3",
        assignment: false,
        schreiben_sprechen: {
          chapter: "1.3",
          grammarbook_link: "/campus/course/incorrect-grammar-notes",
          workbook_link: "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook",
          assignment: false,
        },
      },
      "A1"
    );

    expect(normalized.resources.grammarBook).toBeNull();
    expect(normalized.resources.resourceGroups[0].grammarBook).toBeNull();
    expect(normalized.resources.workbook.url).toBe(
      "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook"
    );
    expect(normalized.submission.enabled).toBe(false);
  });
});
