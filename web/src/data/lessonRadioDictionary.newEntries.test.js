import { getLessonRadioResource } from "./lessonRadioDictionary";

test.each([
  [3, "Dinge und Personen vergleichen 1.3", "wpGj-ZcZVv0"],
  [5, "Was machst du in deiner Freizeit? 2.5", "NWRCe0wCSb4"],
  [6, "Möbel und Räume kennenlernen 3.6", "ql8aR2F6tfU"],
  [7, "Eine Wohnung suchen (Übung) 3.7", "ScU6w8VQgNg"],
  [8, "Rezepte und Essen (Exercise) 3.8", "dC8nKSyCE8g"],
  [4, "Wo möchten wir uns treffen? 2.4", "JsZBblW70C8"],
  [23, "Wie kommst du zur Schule / zur Arbeit? 9.23", "LtARwiCljLY"],
  [24, "Einen Urlaub planen 9.24", "UXiBiiXwqwY"],
  [25, "Tagesablauf (Exercise) 9.25", "m7nP2qE9gNg"],
  [28, "Über die Zukunft sprechen 10.28", "ftnD96p9Ncg"],
])("A2 Day %i uses the requested Falowen Radio link", (day, title, youtubeId) => {
  expect(getLessonRadioResource("A2", day)).toEqual(
    expect.objectContaining({ title, youtubeId }),
  );
});
