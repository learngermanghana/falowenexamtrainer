import StandardLessonWritingCoachPage, {
  shouldMountMarkMyLetter,
} from "./StandardLessonWritingCoachPage";

test("standardized B2 and C1 Schreiben can mount Mark my letter", () => {
  expect(typeof StandardLessonWritingCoachPage).toBe("function");
  expect(shouldMountMarkMyLetter("Guided writing builder")).toBe(true);
  expect(shouldMountMarkMyLetter("Speaking builder")).toBe(false);
});
