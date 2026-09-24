import fs from "fs";
import path from "path";
import { LESSON_RADIO_DICTIONARY } from "./lessonRadioDictionary";
import {
  B2_C1_LESSON_RADIO_OVERRIDES,
  B2_C1_LESSON_VIDEO_OVERRIDES,
} from "./b2C1LessonMediaOverrides";
import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";
import { getWritingVideoResource } from "./writingVideoResources";
import b2Day1 from "./selfLearningLessons/b2/day1PersoenlicheIdentitaet";
import b2Day2 from "./selfLearningLessons/b2/day2AlltagUndZeitmanagement";
import b2Day4 from "./selfLearningLessons/b2/day4BildungUndLernen";
import b2Day5 from "./selfLearningLessons/b2/day5GesundheitUndWohlbefinden";
import b2Day6 from "./selfLearningLessons/b2/day6MigrationUndIntegration";

describe("B2 media reset after the topic redesign", () => {
  test("removes all retired B2 Falowen Radio mappings", () => {
    expect(LESSON_RADIO_DICTIONARY.B2).toEqual({});
    expect(B2_C1_LESSON_RADIO_OVERRIDES.B2).toEqual({});
  });

  test("removes all retired B2 lesson and grammar-video mappings", () => {
    expect(B2_C1_LESSON_VIDEO_OVERRIDES.B2).toEqual({});
    expect(getAdditionalLessonVideoResources("B2", 3)).toEqual([]);
  });

  test("removes direct old-topic lesson videos from B2 Days 1-7", () => {
    [b2Day1, b2Day2, b2Day4, b2Day5, b2Day6].forEach((lesson) => {
      expect(lesson.level).toBe("B2");
      expect(lesson.videoResource).toBeUndefined();
    });
  });

  test("removes retired B2 writing-video mappings", () => {
    [1, 2, 3, 4, 5, 6, 7, 12].forEach((day) => {
      expect(getWritingVideoResource("B2", day)).toBeNull();
    });
  });

  test("keeps only the B2 Day 0 onboarding video", () => {
    const day0 = getAdditionalLessonVideoResources("B2", 0);
    expect(day0[0]).toEqual(
      expect.objectContaining({
        key: "b2-day0-self-learning-onboarding-video",
        url: "https://youtu.be/AH2dPdqjfTo",
      }),
    );
  });

  test("active B2 media source files no longer contain retired topic-video identifiers", () => {
    const sources = [
      "lessonRadioDictionary.js",
      "b2C1LessonMediaOverrides.js",
      "additionalLessonVideoResources.js",
      "writingVideoResources.js",
      "selfLearningLessons/b2/day1PersoenlicheIdentitaet.js",
      "selfLearningLessons/b2/day2AlltagUndZeitmanagement.js",
      "selfLearningLessons/b2/day4BildungUndLernen.js",
      "selfLearningLessons/b2/day5GesundheitUndWohlbefinden.js",
      "selfLearningLessons/b2/day6MigrationUndIntegration.js",
    ].map((relative) => fs.readFileSync(path.resolve(__dirname, relative), "utf8"));

    const retiredFragments = [
      "b2-day1-persoenliche-identitaet-falowen-radio",
      "b2-day11-gesellschaft-integration-falowen-radio",
      "b2-day3-kontrast-konzession-ai-grammar-video",
      "b2-day1-persoenliche-identitaet-writing-video",
      "b2-day4-bildung-lernen-writing-video",
    ];

    retiredFragments.forEach((fragment) => {
      sources.forEach((source) => expect(source).not.toContain(fragment));
    });
  });
});
