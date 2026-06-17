import { getLessonRadioResource, resolveLessonRoute } from "./lessonRadioDictionary";

test.each([
  [9, "BD663tMiWpg"],
  [10, "0_iGhcuysag"],
  [11, "hsR31V7Fb4U"],
  [14, "HJ60GX0pbiI"],
  [15, "WbsTFqIT058"],
  [16, "6lq6uWK1wAs"],
  [17, "kp7KvFmaRuo"],
  [21, "LlXsNA1a8lc"],
  [22, "KR2oT-mujmI"],
  [26, "9OVfA1B-nuU"],
  [27, "XLyXDfsM-HY"],
])("A2 Day %i radio remains available", (day, id) =>
  expect(getLessonRadioResource("A2", day).youtubeId).toBe(id),
);

test("B2 Day 1 radio remains available", () =>
  expect(getLessonRadioResource("B2", 1)).toEqual(
    expect.objectContaining({
      title: "Persönliche Identität und Selbstverständnis",
      youtubeId: "0lTNin1NTgc",
    }),
  ),
);

test("C1 Day 2 Kultur und Identität radio remains available", () =>
  expect(getLessonRadioResource("C1", 2)).toEqual(
    expect.objectContaining({
      title: "Kultur und Identität",
      youtubeId: "rmaxh302FEY",
    }),
  ),
);

test("C1 Day 1 Ziele und Lernweg radio remains available", () =>
  expect(getLessonRadioResource("C1", 1)).toEqual(
    expect.objectContaining({
      title: "Ziele und Lernweg",
      youtubeId: "McNk1VTFvMk",
    }),
  ),
);

test("C1 Day 3 uses the requested Medien und Informationskompetenz radio", () =>
  expect(getLessonRadioResource("C1", 3)).toEqual(
    expect.objectContaining({
      title: "Medien und Informationskompetenz",
      youtubeId: "6IvVh9RPJ5s",
    }),
  ),
);

test.each([
  ["/campus/course/lesson/A2/15", { level: "A2", day: 15 }],
  ["/campus/course/a2-day-15-mein-lieblingssport-workbook", { level: "A2", day: 15 }],
  ["/campus/course/lesson/A2/16", { level: "A2", day: 16 }],
  ["/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook", { level: "A2", day: 16 }],
  ["/campus/course/lesson/A2/26", { level: "A2", day: 26 }],
  ["/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook", { level: "A2", day: 26 }],
  ["/campus/course/lesson/A2/27", { level: "A2", day: 27 }],
  ["/campus/course/a2-day-27-digitale-kommunikation-workbook", { level: "A2", day: 27 }],
  ["/campus/course/lesson/B2/1", { level: "B2", day: 1 }],
  ["/campus/course/b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-workbook", { level: "B2", day: 1 }],
  ["/campus/course/lesson/C1/2", { level: "C1", day: 2 }],
  ["/campus/course/c1-day-2-kultur-und-identitaet-workbook", { level: "C1", day: 2 }],
])("detects radio route %s", (path, expected) =>
  expect(resolveLessonRoute(path)).toEqual(expected),
);

test("A2 Day 10 uses the Tourismus und Traditionelle Feste Falowen Radio link", () =>
  expect(getLessonRadioResource("A2", 10)).toEqual(expect.objectContaining({
    title: "Tourismus und Traditionelle Feste 4.10",
    youtubeId: "vpSwGAtqIlU",
  })),
);
