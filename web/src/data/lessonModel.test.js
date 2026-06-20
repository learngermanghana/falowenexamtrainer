import {
  LEVEL_CAPABILITIES,
  normalizeA1Lesson,
  normalizeA2B1Lesson,
  normalizeB2C1Lesson,
  scopeLessonVideosToSelectedChapters,
} from "./lessonModel";

const chapterVideos = [
  { key: "alphabet-ai", chapter: "0.2", title: "Kapitel 0.2 Alphabet AI video", url: "alphabet" },
  { key: "pronouns-ai", chapter: "1.1", title: "Kapitel 1.1 Pronouns AI video", url: "pronouns" },
  { key: "teacher-shared", chapter: null, title: "Teacher explanation", url: "teacher" },
];

describe("canonical lesson model", () => {
  test("preserves A1 teacher video behavior and legacy links", () => {
    const lesson = normalizeA1Lesson({ day: 7, youtube_link: "teacher", grammarbook_link: "grammar", workbook_link: "workbook", assignmentId: "keep-me" });
    expect(lesson.resources.teacherVideo.url).toBe("teacher");
    expect(lesson.resources.grammarBook.url).toBe("grammar");
    expect(lesson.resources.workbook.url).toBe("workbook");
    expect(lesson.submission.assignmentId).toBe("keep-me");
  });
  test("keeps A2/B1 workbook capabilities", () => expect(normalizeA2B1Lesson({ day: 9 }, "B1").lessonType).toBe("fourPartWorkbook"));
  test.each(["B2", "C1"])("keeps %s self-learning compatibility", (level) => {
    const lesson = normalizeB2C1Lesson({ day: 1, assignment: true }, level);
    expect(lesson.lessonType).toBe("selfLearning");
    expect(lesson.submission.enabled).toBe(false);
    expect(lesson.capabilities.selfAssessment).toBe(true);
  });
  test("does not enable radio for A1", () => expect(LEVEL_CAPABILITIES.A1.radio).toBe(false));
  test("returns stable canonical resources and removes duplicate video URLs", () => {
    const lesson = normalizeA1Lesson({
      day: 99,
      teacher_video: "teacher",
      videos: [{ url: "teacher", title: "Teacher explanation" }],
    });
    expect(lesson.resources).toEqual(expect.objectContaining({
      falowenRadio: null,
      teacherVideo: expect.objectContaining({ url: "teacher" }),
      aiVideo: null,
      videos: [expect.objectContaining({ url: "teacher" })],
      grammarBook: null,
      workbook: null,
      resourceGroups: [expect.objectContaining({ grammarBook: null, workbook: null })],
    }));
  });
  test("keeps nested resources grouped and B1 internal resource routes canonical", () => {
    const nested = normalizeA1Lesson({
      day: 99,
      schreiben_sprechen: [{ chapter: "2", workbook_link: "workbook-2" }],
      lesen_hören: [{ chapter: "1", grammar_link: "grammar-1" }],
    });
    expect(nested.resources.resourceGroups).toEqual([
      expect.objectContaining({ chapter: "2", workbook: { url: "workbook-2" } }),
      expect.objectContaining({ chapter: "1", grammarBook: { url: "grammar-1" } }),
    ]);

    const b1 = normalizeA2B1Lesson({ day: 1 }, "B1");
    expect(b1.resources.grammarBook.url).toContain("?view=grammar");
    expect(b1.resources.workbook.url).toContain("?view=workbook");
  });
  test("uses an explicit AI video instead of a generic A2 fallback", () => {
    const lesson = normalizeA2B1Lesson({ day: 8, video: "generic", ai_video: "explicit-ai" }, "A2");
    expect(lesson.resources.videos.map(({ url }) => url)).toEqual(["explicit-ai"]);
    expect(lesson.resources.aiVideo.url).toBe("explicit-ai");
  });
  test("promotes a generic A2 video to the canonical AI fallback", () => {
    const lesson = normalizeA2B1Lesson({ day: 23, video: "generic" }, "A2");
    expect(lesson.resources.aiVideo).toEqual(expect.objectContaining({ url: "generic" }));
  });
  test("shows only the Alphabet AI video on the Kapitel 0.2 page", () => {
    expect(scopeLessonVideosToSelectedChapters(chapterVideos, [{ chapter: "0.2" }])).toEqual([
      chapterVideos[0],
      chapterVideos[2],
    ]);
  });
  test("shows only the Pronouns AI video on the Kapitel 1.1 page", () => {
    expect(scopeLessonVideosToSelectedChapters(chapterVideos, [{ chapter: "1.1" }])).toEqual([
      chapterVideos[1],
      chapterVideos[2],
    ]);
  });
  test("keeps every video for a full multi-chapter day", () => {
    expect(
      scopeLessonVideosToSelectedChapters(chapterVideos, [
        { chapter: "0.2" },
        { chapter: "1.1" },
      ])
    ).toEqual(chapterVideos);
  });
  test("uses only the configured Alphabet video for A1 Day 2 Kapitel 0.2", () => {
    const lesson = normalizeA1Lesson({
      day: 2,
      chapter: "0.2",
      lesen_hören: { chapter: "0.2" },
    });
    const titles = lesson.resources.videos.map((video) => video.title);

    expect(titles).toContain("Kapitel 0.2 · Alphabet · AI video");
    expect(titles).not.toContain("Kapitel 1.1 · Pronouns & Verb Conjugation · AI video");
  });
  test("uses only the configured Pronouns video for A1 Day 2 Kapitel 1.1", () => {
    const lesson = normalizeA1Lesson({
      day: 2,
      chapter: "1.1",
      lesen_hören: { chapter: "1.1" },
    });
    const titles = lesson.resources.videos.map((video) => video.title);

    expect(titles).toContain("Kapitel 1.1 · Pronouns & Verb Conjugation · AI video");
    expect(titles).not.toContain("Kapitel 0.2 · Alphabet · AI video");
  });
});
