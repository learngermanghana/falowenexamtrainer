import { getLessonRadioResource } from "./lessonRadioDictionary";

test.each([
  [23, "Wie kommst du zur Schule / zur Arbeit? 9.23", "LtARwiCljLY"],
  [24, "Einen Urlaub planen 9.24", "UXiBiiXwqwY"],
  [25, "Tagesablauf (Exercise) 9.25", "m7nP2qE9gNg"],
  [28, "Über die Zukunft sprechen 10.28", "ftnD96p9Ncg"],
])("A2 Day %i uses the requested Falowen Radio link", (day, title, youtubeId) => {
  expect(getLessonRadioResource("A2", day)).toEqual(
    expect.objectContaining({ title, youtubeId }),
  );
});
