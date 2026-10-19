import { getA1RadioResource } from "./a1RadioResources";
import { getA1TeacherVideoResources } from "./a1TeacherVideoResources";
import {
  B2_C1_LESSON_RADIO_OVERRIDES,
  B2_C1_LESSON_VIDEO_OVERRIDES,
  applyB2C1LessonVideoOverrides,
} from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";
import c1Day10IntegrationUndGesellschaft from "./selfLearningLessons/c1/day10IntegrationUndGesellschaft";
import { getWritingVideoResource } from "./writingVideoResources";

describe("requested lesson media mappings", () => {
  test("maps A1 Day 22 Kapitel 14.1 to the approved Falowen Radio video", () => {
    expect(getA1RadioResource(22)).toEqual(
      expect.objectContaining({
        key: "a1-day22-health-body-parts-falowen-radio",
        youtubeId: "23uCwszjahg",
      }),
    );
  });

  test("maps A1 Day 3 Kapitel 1.2 to its requested Falowen Radio video without replacing Kapitel 1.1", () => {
    expect(getA1RadioResource(3, "1.2")).toEqual(
      expect.objectContaining({
        key: "a1-day3-chapter-1-2-falowen-radio",
        chapter: "1.2",
        youtubeId: "XrSTHS60LI4",
      }),
    );
    expect(getA1RadioResource(3, "1.1")).toEqual(
      expect.objectContaining({
        key: "a1-day3-chapter-1-1-falowen-radio",
        youtubeId: "y9LhKQkjsqM",
      }),
    );
  });

  test("does not invent a Day 24 teacher lecture when none is configured", () => {
    expect(getA1TeacherVideoResources(24)).toEqual([]);
  });

  test("replaces A1 Day 18 Chapter 12.1 with the requested teacher lecture", () => {
    const day18TeacherVideos = getA1TeacherVideoResources(18);

    expect(day18TeacherVideos).toEqual([
      expect.objectContaining({
        key: "a1-day18-chapter-12-1-teacher-video",
        chapter: "12.1",
        topic: "Two-Case Prepositions",
        url: "https://youtu.be/WzmgAmmmTJs",
      }),
    ]);
    expect(JSON.stringify(day18TeacherVideos)).not.toContain("-vTEvx9a8Ts");
  });

  test("keeps B1 Day 2 as a Schreiben support video", () => {
    const resource = getWritingVideoResource("B1", 2);
    expect(resource).toEqual(
      expect.objectContaining({
        key: "b1-day2-freunde-fuers-leben-writing-video",
        url: "https://youtu.be/94IXPx5dTNY",
      }),
    );
    expect(resource.key).toContain("writing-video");
    expect(resource.key).not.toContain("radio");
    expect(resource.key).not.toContain("ai-video");
  });

  test("maps the requested B1 Day 5, Day 6 and Day 21 clips to Schreiben", () => {
    expect(getWritingVideoResource("B1", 5)).toEqual(
      expect.objectContaining({
        key: "b1-day5-besichtigungstermin-writing-video",
        url: "https://youtu.be/n1whPCP2KzA",
      }),
    );
    expect(getWritingVideoResource("B1", 6)).toEqual(
      expect.objectContaining({
        key: "b1-day6-stadt-oder-land-writing-video",
        url: "https://youtu.be/bklCB9MdTcA?si=qGzQjqY9xuypNTJD",
      }),
    );
    expect(getWritingVideoResource("B1", 21)).toEqual(
      expect.objectContaining({
        key: "b1-day21-lebensformen-heute-writing-video",
        url: "https://youtu.be/1JYyJfnumig",
      }),
    );
  });

  test("does not render an unconfigured B2 Day 5 Schreiben video", () => {
    expect(getWritingVideoResource("B2", 5)).toBeNull();
  });

  test("uses the approved C1 Day 10 Chapter 2.5 AI video in both lesson sources", () => {
    expect(c1Day10IntegrationUndGesellschaft.videoResource).toEqual(
      expect.objectContaining({ url: "https://youtu.be/S_c9eIH-rzY" }),
    );
    expect(B2_C1_LESSON_VIDEO_OVERRIDES.C1[10].videoResources[0]).toEqual(
      expect.objectContaining({
        chapter: "2.5",
        url: "https://youtu.be/S_c9eIH-rzY",
      }),
    );
  });

  test("keeps B2 Radio empty without inventing a YouTube source", () => {
    expect(Object.keys(B2_C1_LESSON_RADIO_OVERRIDES.B2)).toHaveLength(0);
    const b2Day11 = normalizeB2C1Lesson(
      { level: "B2", day: 11, chapter: "3.1", title: "Gesellschaft und Integration" },
      "B2",
    );
    expect(b2Day11.resources.falowenRadio).toBeNull();
  });

  test("keeps B2 lesson-video slots but clears old grammar video URLs", () => {
    Object.values(B2_C1_LESSON_VIDEO_OVERRIDES.B2).forEach((dayConfig) => {
      dayConfig.videoResources.forEach((resource) => {
        expect(resource.key).toContain("b2-day");
        expect(resource.url).toBe("");
      });
    });

    const dictionary = { B2: {}, C1: {} };
    applyB2C1LessonVideoOverrides(dictionary);
    Object.values(dictionary.B2).forEach((dayConfig) => {
      dayConfig.videoResources.forEach((resource) => expect(resource.url).toBe(""));
    });

    const b2Day10 = normalizeB2C1Lesson(
      { level: "B2", day: 10, chapter: "2.5", title: "Konsum und Geld" },
      "B2",
    );
    expect(b2Day10.resources.aiVideo).toBeNull();
  });

  test("does not change the approved C1 Day 14 AI video", () => {
    expect(B2_C1_LESSON_VIDEO_OVERRIDES.C1[14].videoResources[0]).toEqual(
      expect.objectContaining({
        key: "c1-day14-innovation-zukunft-ai-video",
        chapter: "3.4",
        url: "https://youtu.be/GEQNr4JedlM",
      }),
    );

    const c1Day14 = normalizeB2C1Lesson(
      { level: "C1", day: 14, chapter: "3.4", title: "Innovation und Zukunft" },
      "C1",
    );
    expect(c1Day14.resources.aiVideo).toEqual(
      expect.objectContaining({ url: "https://youtu.be/GEQNr4JedlM" }),
    );
  });
});
