import { getA1RadioResource } from "./a1RadioResources";
import { getA1TeacherVideoResources } from "./a1TeacherVideoResources";
import {
  B2_C1_LESSON_VIDEO_OVERRIDES,
  applyB2C1LessonVideoOverrides,
} from "./b2C1LessonMediaOverrides";
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

  test("adds the requested A1 Day 24 conjunctions clip as teacher video 2", () => {
    expect(getA1TeacherVideoResources(24)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          chapter: "5.10",
          videoNumber: 2,
          url: "https://youtu.be/XpcC3uvBcwo",
        }),
      ]),
    );
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

  test("maps the requested B1 Day 5 and Day 21 clips to Teil 2 Schreiben", () => {
    expect(getWritingVideoResource("B1", 5)).toEqual(
      expect.objectContaining({
        key: "b1-day5-besichtigungstermin-writing-video",
        url: "https://youtu.be/n1whPCP2KzA",
      }),
    );
    expect(getWritingVideoResource("B1", 21)).toEqual(
      expect.objectContaining({
        key: "b1-day21-lebensformen-heute-writing-video",
        url: "https://youtu.be/1JYyJfnumig",
      }),
    );
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

  test("adds the approved B2 Day 8 Chapter 2.3 AI video to the lesson dictionary", () => {
    const dictionary = { B2: {}, C1: {} };
    applyB2C1LessonVideoOverrides(dictionary);

    expect(dictionary.B2[8].videoResources).toContainEqual(
      expect.objectContaining({
        key: "b2-day8-reisen-mobilitaet-ai-video",
        chapter: "2.3",
        url: "https://youtu.be/RjRBspPCmCY",
      }),
    );
  });

  test("maps the requested B2 Day 9 and Day 12 AI videos to the correct chapters", () => {
    const dictionary = { B2: {}, C1: {} };
    applyB2C1LessonVideoOverrides(dictionary);

    expect(dictionary.B2[9].videoResources[0]).toEqual(
      expect.objectContaining({
        key: "b2-day9-wohnen-nachbarschaft-ai-video",
        chapter: "2.4",
        url: "https://youtu.be/-JeT2wS94uk",
      }),
    );
    expect(dictionary.B2[12].videoResources[0]).toEqual(
      expect.objectContaining({
        key: "b2-day12-kultur-freizeit-ai-video",
        chapter: "3.2",
        url: "https://youtu.be/foXp2VHEf1I",
      }),
    );
  });
});
