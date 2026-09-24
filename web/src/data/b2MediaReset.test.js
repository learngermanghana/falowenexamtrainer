import fs from "fs";
import path from "path";
import { LESSON_RADIO_DICTIONARY } from "./lessonRadioDictionary";
import {
  B2_C1_LESSON_RADIO_OVERRIDES,
  B2_C1_LESSON_VIDEO_OVERRIDES,
} from "./b2C1LessonMediaOverrides";
import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";
import b2Day1 from "./selfLearningLessons/b2/day1PersoenlicheIdentitaet";
import b2Day2 from "./selfLearningLessons/b2/day2AlltagUndZeitmanagement";
import b2Day4 from "./selfLearningLessons/b2/day4BildungUndLernen";
import b2Day5 from "./selfLearningLessons/b2/day5GesundheitUndWohlbefinden";
import b2Day6 from "./selfLearningLessons/b2/day6MigrationUndIntegration";
import { CURRICULUM_BY_LEVEL } from "./lessonCatalog";

describe("B2 media reset after topic changes", () => {
  test("keeps Falowen Radio metadata but clears every B2 episode YouTube ID", () => {
    Object.values(LESSON_RADIO_DICTIONARY.B2 || {}).forEach((resource) => {
      expect(resource.key).toContain("b2-day");
      expect(resource.youtubeId).toBe("");
    });

    Object.values(B2_C1_LESSON_RADIO_OVERRIDES.B2 || {}).forEach((resource) => {
      expect(resource.key).toContain("b2-day");
      expect(resource.youtubeId).toBe("");
    });
  });

  test("keeps B2 lesson-video metadata but clears every old override URL", () => {
    Object.values(B2_C1_LESSON_VIDEO_OVERRIDES.B2 || {}).forEach((dayConfig) => {
      dayConfig.videoResources.forEach((resource) => {
        expect(resource.key).toContain("b2-day");
        expect(resource.url).toBe("");
      });
    });

    expect(getAdditionalLessonVideoResources("B2", 3)).toEqual([
      expect.objectContaining({
        key: "b2-day3-kontrast-konzession-ai-grammar-video",
        url: "",
      }),
    ]);
  });

  test("clears direct B2 self-learning lesson video URLs but keeps their lesson objects", () => {
    [b2Day1, b2Day2, b2Day4, b2Day5, b2Day6].forEach((lesson) => {
      expect(lesson.level).toBe("B2");
      expect(lesson.videoResource).toBeTruthy();
      expect(lesson.videoResource.url).toBe("");
    });
  });

  test("clears B2 canonical lesson video fallbacks for course days", () => {
    const entries = CURRICULUM_BY_LEVEL.B2 || [];
    entries
      .filter((entry) => Number(entry.day) >= 1)
      .forEach((entry) => {
        expect(String(entry.video || "")).toBe("");
        expect(String(entry.teacherVideo || "")).toBe("");
      });
  });

  test("keeps the B2 Day 0 onboarding video untouched", () => {
    const day0 = getAdditionalLessonVideoResources("B2", 0);
    expect(day0[0]).toEqual(
      expect.objectContaining({
        key: "b2-day0-self-learning-onboarding-video",
        url: "https://youtu.be/AH2dPdqjfTo",
      }),
    );
  });

  test("source files no longer contain the retired B2 radio or grammar URLs", () => {
    const sources = [
      "lessonRadioDictionary.js",
      "b2C1LessonMediaOverrides.js",
      "selfLearningLessons/b2/day1PersoenlicheIdentitaet.js",
      "selfLearningLessons/b2/day2AlltagUndZeitmanagement.js",
      "selfLearningLessons/b2/day4BildungUndLernen.js",
      "selfLearningLessons/b2/day5GesundheitUndWohlbefinden.js",
      "selfLearningLessons/b2/day6MigrationUndIntegration.js",
    ].map((relative) => fs.readFileSync(path.resolve(__dirname, relative), "utf8"));

    const retiredIds = [
      "0lTNin1NTgc", "OdfuQzJ_etM", "wYwEi4myS2A", "0rBDjwRe9UY", "2-SRhPEQdNU",
      "xSrh7VYNgrM", "LjxT4I6BmFw", "hxB5dwtbo6Q", "kVvR1zgJE-s", "AWEHnJd1o3M",
      "juDa8R56Mtc", "9LLc7AAqrOc", "BdO8p8C-aSs",
      "HhUUkc8zgEc", "ZfCAaLGV2c4", "coQ8W5vynsI", "DiUEWUBJBio", "LORxwfzaAyU",
      "RjRBspPCmCY", "-JeT2wS94uk", "vRgpiPZ5AAw", "TC85wRlhtCc", "foXp2VHEf1I",
      "MGtC8QQrdSs", "Hqowo8xhrpw", "5fdtLPqHe7A", "ioHsbvDoLag", "i167ok5kIFg",
    ];

    retiredIds.forEach((id) => {
      sources.forEach((source) => expect(source).not.toContain(id));
    });
  });
});
