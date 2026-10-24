import B1TutorLessonPage, {
  shouldShowB1RadioEntrance,
} from "./B1TutorLessonPage";

test("B1 keeps tutor flow and only shows the radio entrance when radio exists", () => {
  expect(typeof B1TutorLessonPage).toBe("function");
  expect(
    shouldShowB1RadioEntrance({
      resources: { falowenRadio: { youtubeId: "example" } },
    }),
  ).toBe(true);
  expect(shouldShowB1RadioEntrance({ resources: {} })).toBe(false);
});
