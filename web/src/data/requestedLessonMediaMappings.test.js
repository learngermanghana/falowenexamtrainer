import { getA1RadioResource } from "./a1RadioResources";
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
});
