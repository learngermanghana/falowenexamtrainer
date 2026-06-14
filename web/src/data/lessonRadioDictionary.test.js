import { getLessonRadioResource, resolveLessonRoute } from "./lessonRadioDictionary";

test.each([
  [9, "BD663tMiWpg"],
  [15, "WbsTFqIT058"],
  [16, "6lq6uWK1wAs"],
  [26, "9OVfA1B-nuU"],
])("A2 Day %i radio remains available", (day, id) =>
  expect(getLessonRadioResource("A2", day).youtubeId).toBe(id),
);

test("radio is hidden without a dictionary entry", () =>
  expect(getLessonRadioResource("C1", 1)).toBeNull(),
);

test.each([
  ["/campus/course/lesson/A2/15", { level: "A2", day: 15 }],
  ["/campus/course/a2-day-15-mein-lieblingssport-workbook", { level: "A2", day: 15 }],
  ["/campus/course/lesson/A2/16", { level: "A2", day: 16 }],
  ["/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook", { level: "A2", day: 16 }],
  ["/campus/course/lesson/A2/26", { level: "A2", day: 26 }],
  ["/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook", { level: "A2", day: 26 }],
])("detects radio route %s", (path, expected) =>
  expect(resolveLessonRoute(path)).toEqual(expected),
);