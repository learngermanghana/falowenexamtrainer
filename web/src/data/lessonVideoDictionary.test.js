import { getLessonVideoResources } from "./lessonVideoDictionary";

const A1_DAY_2 = {
  day: 2,
  lesen_hören: [
    { chapter: "0.2", video: "https://example.com/teacher-0-2" },
    { chapter: "1.1", video: "https://example.com/teacher-1-1" },
  ],
};

describe("getLessonVideoResources", () => {
  test("A1 Day 15 uses the requested Imperatives AI grammar video", () => {
    expect(getLessonVideoResources("A1", 15)).toEqual([
      expect.objectContaining({
        key: "ai-grammar-video",
        url: "https://youtu.be/FLe36q-tONA",
      }),
    ]);
  });

  test("returns the A1 Day 2 chapter-specific AI videos beside matching generic lesson videos", () => {
    const resources = getLessonVideoResources("A1", 2, A1_DAY_2);

    expect(
      resources.map(({ chapter, url }) => ({ chapter, url })),
    ).toEqual([
      { chapter: "0.2", url: "https://example.com/teacher-0-2" },
      { chapter: "0.2", url: "https://youtu.be/pCQVdJGsvtk" },
      { chapter: "1.1", url: "https://example.com/teacher-1-1" },
      { chapter: "1.1", url: "https://youtu.be/kqagu9qsOcc" },
    ]);

    expect(
      resources.filter((resource) => resource.title.includes("Lesson / Hören")),
    ).toHaveLength(2);
    expect(
      resources.filter((resource) => resource.title.includes("AI video")),
    ).toHaveLength(2);
  });

  test("returns the configured chapter-specific AI videos when A1 Day 2 has no legacy entry", () => {
    expect(
      getLessonVideoResources("A1", 2).map(({ chapter, url }) => ({
        chapter,
        url,
      })),
    ).toEqual([
      { chapter: "0.2", url: "https://youtu.be/pCQVdJGsvtk" },
      { chapter: "1.1", url: "https://youtu.be/kqagu9qsOcc" },
    ]);
  });

  test("returns the configured A1 Day 3 Kapitel 1.2 assignment AI video", () => {
    expect(getLessonVideoResources("A1", 3)).toEqual([
      expect.objectContaining({
        chapter: "1.2",
        title: "Kapitel 1.2 · Assignment for day 3 · AI video",
        url: "https://youtu.be/LyfFDU0U_7U",
      }),
    ]);
  });

  test("returns the configured A1 Day 4 numbers AI video", () => {
    expect(getLessonVideoResources("A1", 4)).toEqual([
      expect.objectContaining({
        chapter: "2",
        title: "Kapitel 2 · Zahlen · AI video",
        url: "https://youtu.be/GyhH8zPXDy4",
      }),
    ]);
  });

  test("returns the configured A1 Day 6 family and hobbies AI video", () => {
    expect(getLessonVideoResources("A1", 6)).toEqual([
      expect.objectContaining({
        chapter: "2.3",
        title: "Kapitel 2.3 · Family and Hobbies · AI video",
        url: "https://youtu.be/XbvzygJg16E",
      }),
    ]);
  });

  test("returns the configured A1 Day 11 Understanding Time AI video", () => {
    expect(getLessonVideoResources("A1", 11)).toEqual([
      expect.objectContaining({
        chapter: "7",
        title: "A1 Day 11 · Understanding Time · AI video",
        url: "https://youtu.be/xesl04zaQ1E",
      }),
    ]);
  });

  test("returns only the configured A1 Day 12 AI video for the 24 hour clock and dates", () => {
    expect(getLessonVideoResources("A1", 12).map((resource) => resource.url)).toEqual([
      "https://youtu.be/ZE24QSbGaSo",
    ]);
  });

  test("returns the configured A1 Day 13 revision AI video", () => {
    expect(getLessonVideoResources("A1", 13)).toEqual([
      expect.objectContaining({
        chapter: "3.5",
        url: "https://youtu.be/_awD0Xbsj78",
      }),
    ]);
  });

  test("returns the configured C1 Day 4 Beziehungen und Teamarbeit AI video", () => {
    expect(getLessonVideoResources("C1", 4)).toEqual([
      expect.objectContaining({
        chapter: "1.4",
        url: "https://youtu.be/-1GtaOiI8mc",
      }),
    ]);
  });

  test("hides A2 teacher videos except Day 16 while keeping AI videos", () => {
    const entry = {
      teacher_video: "https://example.com/teacher",
      ai_grammar_video: "https://example.com/ai",
    };

    expect(
      getLessonVideoResources("A2", 9, entry).map((resource) => resource.url),
    ).toEqual(["https://example.com/ai"]);
    expect(
      getLessonVideoResources("A2", 16, entry).map((resource) => resource.url),
    ).toEqual(["https://example.com/teacher", "https://example.com/ai"]);
  });

  test("keeps scheduled generic A2 listening videos outside Day 16", () => {
    const entry = {
      chapter: "8.99",
      lesen_hören: {
        video: "https://example.com/fallback-video",
        youtube_link: "https://example.com/fallback-video",
      },
    };

    expect(getLessonVideoResources("A2", 99, entry)).toEqual([
      expect.objectContaining({
        key: "lesson-listening-video",
        title: "Lesson / Hören video",
        url: "https://example.com/fallback-video",
      }),
    ]);
  });

  test.each([
    [2, "https://youtu.be/AxSh8t71Jlo?si=1tM_ouDy_JBOayP7"],
    [3, "https://youtu.be/wV45Md6nSgY"],
    [4, "https://youtu.be/U14gkjld0ys"],
    [5, "https://youtu.be/8605_yumfoM"],
    [6, "https://youtu.be/eP4NeBmmZF8"],
    [8, "https://youtu.be/jXc0Krx6EpQ"],
    [11, "https://youtu.be/-mcgpnwRQRo"],
    [13, "https://youtu.be/derL046nbF8?si=VP2St42knZFk3NKo"],
    [14, "https://youtu.be/qWy7yMgwmvQ"],
    [16, "https://youtu.be/Yt_vBwfoDBk?si=mg5pzqUvaGMZZtyR"],
    [17, "https://youtu.be/8xybaJbs89I"],
    [18, "https://youtu.be/jdhvRlRMiIc"],
    [19, "https://youtu.be/aL_CJ75l11s?si=mQTO5LEU3SsOj5xe"],
    [20, "https://youtu.be/P_ruQxHKzPg"],
    [21, "https://youtu.be/iLnCuTEoWec"],
    [22, "https://youtu.be/xwOKasZ7nsU?si=oUw6qXJQR6tMyKH4"],
    [23, "https://youtu.be/x_zEONfBhQQ"],
    [24, "https://youtu.be/J06a4gccQJg"],
    [25, "https://youtu.be/0wi37VWPEHE"],
    [26, "https://youtu.be/qWy7yMgwmvQ"],
  ])("returns the configured A2 AI lecture for Day %i", (day, expectedUrl) => {
    expect(getLessonVideoResources("A2", day)).toEqual([
      expect.objectContaining({
        key: "ai-grammar-video",
        url: expectedUrl,
      }),
    ]);
  });
});

test("explicit AI video remains visible beside a generic lesson video", () => {
  expect(
    getLessonVideoResources("A2", 8, {
      video: "generic",
      ai_video: "explicit-ai",
    }).map(({ url }) => url),
  ).toEqual(["generic", "explicit-ai"]);
});

test("removes duplicate videos and preserves chapter ordering", () => {
  const resources = getLessonVideoResources("A1", 99, {
    lesen_hören: [
      { chapter: "2", video: "second" },
      { chapter: "1", video: "first" },
      { chapter: "1", video: "first" },
    ],
  });
  expect(resources.map(({ url }) => url)).toEqual(["second", "first"]);
});
