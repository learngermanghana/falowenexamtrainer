import { applyA1Day16LessonResourceFixes, __TESTING__ } from "./a1Day16LessonResourceFixes";

describe("A1 Day 16 lesson resource fixes", () => {
  it("removes the combined Chapter 9/10 tutor video and keeps the chapter-specific lecture", () => {
    const dictionary = {
      A1: {
        16: {
          videoResources: [
            {
              key: "a1-day16-9-teacher-video",
              chapter: "9",
              title: "Kapitel 9 · Negation · Teacher lecture",
              url: "https://youtu.be/yYIjI6P-qmw",
            },
            {
              key: "teacher-video-lecture",
              chapter: "9_10",
              title: "Teacher video lecture",
              url: __TESTING__.COMBINED_DAY16_TEACHER_VIDEO_URL,
            },
          ],
        },
      },
    };

    applyA1Day16LessonResourceFixes(dictionary);

    expect(dictionary.A1[16].videoResources).toHaveLength(1);
    expect(dictionary.A1[16].videoResources[0].url).toBe(
      "https://youtu.be/yYIjI6P-qmw",
    );
  });
});
