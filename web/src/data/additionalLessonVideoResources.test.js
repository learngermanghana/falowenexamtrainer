import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";
import { normalizeLesson } from "./lessonModel";
import { applyA1LessonVideoResourceOverrides } from "./a1LessonVideoResourceOverrides";

describe("additional A1 AI lesson videos", () => {
  test("Day 16 uses the Food and Negation + Food and Daily Life video", () => {
    expect(getAdditionalLessonVideoResources("A1", 16)).toEqual([
      expect.objectContaining({
        chapter: "9",
        title: "A1 Day 16 · Food and Negation + Food and Daily Life · AI video",
        url: "https://youtu.be/AbgxP6beek4?si=PJax7B2CUyC8PiDq",
      }),
    ]);
  });

  test("Day 18 uses the Chapter 12.1 Two-way Prepositions video", () => {
    expect(getAdditionalLessonVideoResources("a1", 18)).toEqual([
      expect.objectContaining({
        chapter: "12.1",
        title: "A1 Day 18 · Two-way Prepositions + Directions and Movement · AI video",
        url: "https://youtu.be/khdsxaMZN-Y",
      }),
    ]);
  });

  test("the additional AI video is exposed by the shared lesson model", () => {
    const lesson = normalizeLesson({
      level: "A1",
      day: 18,
      topic: "Two-way Prepositions + Directions and Movement",
    });

    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        chapter: "12.1",
        url: "https://youtu.be/khdsxaMZN-Y",
      }),
    );
  });

  test("Day 17 remains unchanged until a new link is supplied", () => {
    expect(getAdditionalLessonVideoResources("A1", 17)).toEqual([]);
  });
});


describe("A1 AI lesson video overrides", () => {
  const dictionary = applyA1LessonVideoResourceOverrides({});

  test.each([
    [22, "A1 Day 22 · Health · AI video", "https://youtu.be/U2pns6E1_yE"],
    [23, "A1 Day 23 · Dative and Accusative Verbs · AI video", "https://youtu.be/V4RxPYSPwhg"],
    [24, "A1 Day 24 · Conjunctions · AI video", "https://youtu.be/gprBXwwAT-o"],
  ])("Day %i uses the requested AI video override", (day, title, url) => {
    expect(dictionary.A1[day].videoResources).toEqual([
      expect.objectContaining({ title, url }),
    ]);
  });
});
