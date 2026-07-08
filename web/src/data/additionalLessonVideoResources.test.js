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

  test("Day 19 uses the Chapter 5.9 Goethe speaking practice AI video", () => {
    expect(getAdditionalLessonVideoResources("A1", 19)).toEqual([
      expect.objectContaining({
        chapter: "5.9",
        title: "A1 Day 19 · Goethe Speaking Practice · AI video",
        url: "https://youtu.be/gprnEZtMUPM",
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

describe("additional B1 AI lesson videos", () => {
  test("Day 6 uses the city-versus-country AI video", () => {
    expect(getAdditionalLessonVideoResources("B1", 6)).toEqual([
      expect.objectContaining({
        chapter: "2.6",
        title: "B1 Day 6 · Leben in der Stadt oder auf dem Land? · AI video",
        url: "https://youtu.be/5tGvAPq6hGk?si=uI_ODAT_A6_mZjG2",
      }),
    ]);
  });

  test("B1 Day 6 exposes the AI video through the shared lesson model", () => {
    const lesson = normalizeLesson({
      level: "B1",
      day: 6,
      chapter: "2.6",
      topic: "Leben in der Stadt oder auf dem Land?",
    });

    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        chapter: "2.6",
        url: "https://youtu.be/5tGvAPq6hGk?si=uI_ODAT_A6_mZjG2",
      }),
    );
  });
});

describe("Day 0 orientation videos", () => {
  test("B1 Day 0 uses the requested orientation video", () => {
    expect(getAdditionalLessonVideoResources("B1", 0)).toEqual([
      expect.objectContaining({
        chapter: "Tutorial",
        title: "B1 Day 0 · Orientation video",
        url: ["https://youtu.be/QMWj", "_N6ncwI"].join(""),
      }),
    ]);
  });

  test("B2 Day 0 uses the requested onboarding video", () => {
    expect(getAdditionalLessonVideoResources("B2", 0)).toEqual([
      expect.objectContaining({
        chapter: "Tutorial",
        title: "B2 Day 0 · Self-learning onboarding video",
        url: "https://youtu.be/AH2dPdqjfTo",
      }),
    ]);
  });

  test("B2 Day 0 exposes the video through the shared lesson model", () => {
    const lesson = normalizeLesson({
      level: "B2",
      day: 0,
      chapter: "Tutorial",
      topic: "B2 Day 0",
    });

    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        chapter: "Tutorial",
        url: "https://youtu.be/AH2dPdqjfTo",
      }),
    );
  });
});

describe("additional B2 AI grammar videos", () => {
  test("Day 3 uses the Kontrast und Konzession grammar video", () => {
    expect(getAdditionalLessonVideoResources("B2", 3)).toEqual([
      expect.objectContaining({
        chapter: "1.3",
        title: "B2 Day 3 · Kontrast und Konzession · AI grammar video",
        url: "https://youtu.be/cmKLSjWi4S0",
      }),
    ]);
  });

  test("the B2 Day 3 grammar video is exposed by the shared lesson model", () => {
    const lesson = normalizeLesson({
      level: "B2",
      day: 3,
      chapter: "1.3",
      title: "Öffentliches vs. Privates Leben",
    });

    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        chapter: "1.3",
        url: "https://youtu.be/cmKLSjWi4S0",
      }),
    );
  });
});

describe("additional C1 AI lesson videos", () => {
  test("Day 8 uses the requested Wohnen und Stadtentwicklung AI video", () => {
    expect(getAdditionalLessonVideoResources("C1", 8)).toEqual([
      expect.objectContaining({
        chapter: "2.3",
        title: "C1 Day 8 · Wohnen und Stadtentwicklung · AI video",
        url: "https://youtu.be/z61nrz6yFgs?si=EgP3DygzLyd9w3q1",
      }),
    ]);
  });

  test("C1 Day 8 exposes the AI video through the shared lesson model", () => {
    const lesson = normalizeLesson({
      level: "C1",
      day: 8,
      chapter: "2.3",
      title: "Wohnen und Stadtentwicklung",
    });

    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        chapter: "2.3",
        url: "https://youtu.be/z61nrz6yFgs?si=EgP3DygzLyd9w3q1",
      }),
    );
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
