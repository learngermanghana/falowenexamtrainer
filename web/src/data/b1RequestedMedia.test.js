import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";
import { getB1Day5RadioResource } from "./b1Day5Media";
import { getLessonRadioResource } from "./lessonRadioDictionary";

it.each([
  [6, "Leben in der Stadt oder auf dem Land? 2.6", "NPG03yU7O3E"],
  [19, "Vorstellungsgespräch 6.19", "xgtjgiQBL2k"],
  [22, "Was ist dir in einer Beziehung wichtig? 7.22", "d9vhD_MTrek"],
  [23, "Erstes Date – Typische Situationen 7.23", "76JUgui6CnY"],
])("uses the requested B1 Falowen Radio for Day %i", (day, title, youtubeId) => {
  expect(getLessonRadioResource("B1", day)).toEqual(
    expect.objectContaining({ title, youtubeId }),
  );
});

it.each([
  [24, "Konsum und Nachhaltigkeit 8.24", "mqG3AjH8mPM"],
  [25, "Online einkaufen - Rechte und Risiken 8.25", "uVfJPcRQUiA"],
])("uses the requested B1 Falowen Radio fallback for Day %i", (day, title, youtubeId) => {
  expect(getB1Day5RadioResource("B1", day)).toEqual(
    expect.objectContaining({ title, youtubeId }),
  );
});

it("uses the requested B1 Day 16 exam anxiety AI video", () => {
  expect(getAdditionalLessonVideoResources("B1", 16)).toEqual([
    expect.objectContaining({
      chapter: "5.16",
      url: "https://youtu.be/JTq-kJXh7ZQ",
    }),
  ]);
});

it("uses the requested B1 Day 19 interview AI video", () => {
  expect(getAdditionalLessonVideoResources("B1", 19)).toEqual([
    expect.objectContaining({
      chapter: "6.19",
      url: "https://youtu.be/ha-uyeX2aVw?si=21xSaYQZVyH2ha2q",
    }),
  ]);
});
