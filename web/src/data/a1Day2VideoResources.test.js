import { applyA1LessonVideoResourceOverrides } from "./a1LessonVideoResourceOverrides";
import {
  getLessonVideoResources,
  LESSON_VIDEO_DICTIONARY,
  shouldShowTeacherLectureVideo,
} from "./lessonVideoDictionary";

describe("A1 Day 2 lesson video resources", () => {
  beforeAll(() => {
    applyA1LessonVideoResourceOverrides(LESSON_VIDEO_DICTIONARY);
  });

  test("A1 lessons allow teacher lecture videos", () => {
    expect(shouldShowTeacherLectureVideo("A1")).toBe(true);
    expect(shouldShowTeacherLectureVideo("A2")).toBe(true);
  });

  test("chapter 0.2 shows both teacher and AI videos", () => {
    const videos = getLessonVideoResources("A1", 2, {
      day: 2,
      chapter: "0.2",
      lesen_hören: {
        chapter: "0.2",
      },
    }).filter((video) => video.chapter === "0.2");

    expect(videos.map((video) => video.url)).toEqual([
      "https://youtu.be/uhFgKp4WVEc",
      "https://youtu.be/pCQVdJGsvtk",
    ]);
    expect(videos[0].key).toMatch(/teacher/i);
  });

  test("chapter 1.1 shows both teacher and AI videos", () => {
    const videos = getLessonVideoResources("A1", 2, {
      day: 2,
      chapter: "1.1",
      lesen_hören: {
        chapter: "1.1",
      },
    }).filter((video) => video.chapter === "1.1");

    expect(videos.map((video) => video.url)).toEqual([
      "https://youtu.be/AjsnO1hxDs4",
      "https://youtu.be/kqagu9qsOcc",
    ]);
    expect(videos[0].key).toMatch(/teacher/i);
  });
});
