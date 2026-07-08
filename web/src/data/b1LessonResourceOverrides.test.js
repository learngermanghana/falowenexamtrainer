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

  test("B1 Day 3 replaces legacy Drive resources with in-app pages", () => {
    const lesson = {
      day: 3,
      chapter: "1.3",
      assignment: true,
      lesen_hören: {
        chapter: "1.3",
        assignment: true,
        grammarbook_link: "https://drive.google.com/legacy-grammar",
        workbook_link: "https://drive.google.com/legacy-workbook",
      },
    };

    applyB1LessonResourceOverride(lesson);
    const normalized = normalizeLesson(lesson, "B1");

    expect(normalized.resources.grammarBook.url).toBe(
      "/campus/course/lesson/B1/3?view=grammar"
    );
    expect(normalized.resources.workbook.url).toBe(
      "/campus/course/lesson/B1/3?view=workbook"
    );
    expect(normalized.resources.grammarBook.url).not.toContain("drive.google.com");
    expect(normalized.resources.workbook.url).not.toContain("drive.google.com");
  });

  test("B1 Day 6 uses the corrected title and replaces both Drive lesson links", () => {
    const lesson = {
      day: 6,
      chapter: "2.6",
      topic: "Leben in der Stadt oder auf dem Land? 2.6",
      grammar_topic: "Relativsätze",
      lesen_hören: {
        chapter: "2.6",
        grammarbook_link: "https://drive.google.com/legacy-grammar",
        workbook_link: "https://drive.google.com/legacy-workbook",
      },
    };

    applyB1LessonResourceOverride(lesson);
    const normalized = normalizeLesson(lesson, "B1");

    expect(lesson.topic).toBe("Leben in der Stadt oder auf dem Land?");
    expect(lesson.grammar_topic).toContain("Komparativ");
    expect(normalized.resources.grammarBook.url).toBe(
      "/campus/course/lesson/B1/6?view=grammar"
    );
    expect(normalized.resources.workbook.url).toBe(
      "/campus/course/lesson/B1/6?view=workbook"
    );
    expect(normalized.resources.grammarBook.url).not.toContain("drive.google.com");
    expect(normalized.resources.workbook.url).not.toContain("drive.google.com");
  });

  test("B1 Days 20 to 28 open the in-app standard workbook route without skipping radio", () => {
    for (let day = 20; day <= 28; day += 1) {
      const lesson = {
        day,
        chapter: day === 20 ? "6.20" : `${day}`,
        lesen_hören: {
          workbook_link: "https://drive.google.com/legacy-workbook",
        },
      };

      applyB1LessonResourceOverride(lesson, day);
      const normalized = normalizeLesson(lesson, "B1");
      const expectedWorkbook = `/campus/course/lesson/B1/${day}?view=workbook`;

      expect(getB1LessonResourceOverride(day).workbook).toBe(expectedWorkbook);
      expect(normalized.resources.workbook.url).toBe(expectedWorkbook);
      expect(normalized.resources.workbook.url).not.toContain("radio=done");
      expect(normalized.resources.workbook.url).not.toContain("drive.google.com");
    }
  });

  test("B1 Days 1 to 3 use the requested AI grammar videos", () => {
    const dictionary = { B1: {} };
    applyB1LessonVideoOverrides(dictionary);

    expect(dictionary.B1[1].videoResources).toEqual([
      expect.objectContaining({
        chapter: "1.1",
        url: "https://youtu.be/_mmAtSzWbNo",
      }),
    ]);
    expect(dictionary.B1[2].videoResources).toEqual([
      expect.objectContaining({
        chapter: "1.2",
        url: "https://youtu.be/Skl0FjF5JBg",
      }),
    ]);
    expect(dictionary.B1[3].videoResources).toEqual([
      expect.objectContaining({
        chapter: "1.3",
        url: "https://youtu.be/n6eCMJRWTy8",
      }),
    ]);
    expect(getB1LessonResourceOverride(1).aiVideo).toBe(
      "https://youtu.be/_mmAtSzWbNo"
    );
    expect(getB1LessonResourceOverride(2).aiVideo).toBe(
      "https://youtu.be/Skl0FjF5JBg"
    );
    expect(getB1LessonResourceOverride(3).aiVideo).toBe(
      "https://youtu.be/n6eCMJRWTy8"
    );
  });

  test("B1 Day 19 uses the requested interview AI video", () => {
    expect(getB1LessonResourceOverride(19).aiVideo).toBe(
      "https://youtu.be/ha-uyeX2aVw?si=21xSaYQZVyH2ha2q"
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
