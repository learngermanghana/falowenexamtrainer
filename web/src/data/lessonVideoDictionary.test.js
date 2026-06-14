import { getLessonVideoResources } from "./lessonVideoDictionary";

const A1_DAY_2 = {
  day: 2,
  ai_grammar_video: "https://example.com/ai-day-2",
  lesen_hören: [
    { chapter: "0.2", video: "https://example.com/teacher-0-2" },
    { chapter: "1.1", video: "https://example.com/teacher-1-1" },
  ],
};

describe("getLessonVideoResources", () => {
  test("returns every nested teacher video and the available AI video for A1", () => {
    const resources = getLessonVideoResources("A1", 2, A1_DAY_2);

    expect(resources.map((resource) => resource.url)).toEqual([
      "https://example.com/teacher-0-2",
      "https://example.com/teacher-1-1",
      "https://example.com/ai-day-2",
    ]);
    expect(
      resources.filter((resource) => resource.title.includes("Teacher")),
    ).toHaveLength(2);
  });

  test("hides teacher videos but keeps available AI videos from A2 through C1", () => {
    const entry = {
      teacher_video: "https://example.com/teacher",
      ai_grammar_video: "https://example.com/ai",
      lesen_hören: [{ video: "https://example.com/nested-teacher" }],
    };

    expect(
      getLessonVideoResources("A2", 9, entry).map((resource) => resource.url),
    ).toEqual(["https://example.com/ai"]);
  });

  test("uses the scheduled generic video as an AI fallback when no AI video is configured", () => {
    const entry = {
      chapter: "9.23",
      lesen_hören: {
        video: "https://example.com/day-23-video",
        youtube_link: "https://example.com/day-23-video",
      },
    };

    expect(getLessonVideoResources("A2", 23, entry)).toEqual([
      expect.objectContaining({
        key: "ai-grammar-video",
        chapter: "9.23",
        url: "https://example.com/day-23-video",
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
    [11, "https://youtu.be/qPZ44s10O04?si=S0eysGDwS30WrGZ-"],
    [13, "https://youtu.be/derL046nbF8?si=VP2St42knZFk3NKo"],
    [14, "https://youtu.be/qWy7yMgwmvQ"],
    [16, "https://youtu.be/Yt_vBwfoDBk?si=mg5pzqUvaGMZZtyR"],
    [18, "https://youtu.be/jdhvRlRMiIc"],
    [19, "https://youtu.be/aL_CJ75l11s?si=mQTO5LEU3SsOj5xe"],
    [20, "https://youtu.be/P_ruQxHKzPg"],
    [22, "https://youtu.be/xwOKasZ7nsU?si=oUw6qXJQR6tMyKH4"],
    [23, "https://youtu.be/x_zEONfBhQQ"],
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

test("explicit AI video takes priority over a generic legacy video", () => {
  expect(getLessonVideoResources("A2", 8, { video: "generic", ai_video: "explicit-ai" }).map(({ url }) => url)).toEqual(["explicit-ai"]);
});

test("removes duplicate videos and preserves chapter ordering", () => {
  const resources = getLessonVideoResources("A1", 99, { lesen_hören: [
    { chapter: "2", video: "second" },
    { chapter: "1", video: "first" },
    { chapter: "1", video: "first" },
  ]});
  expect(resources.map(({ url }) => url)).toEqual(["second", "first"]);
});