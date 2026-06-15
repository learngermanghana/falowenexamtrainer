import StandardLessonWritingCoachPage, {
  shouldMountMarkMyLetter,
} from "./StandardLessonWritingCoachPage";
import { getAdvancedWritingPhase } from "../data/advancedWritingProgression";

test("standardized B2 and C1 Schreiben can mount Mark my letter", () => {
  expect(typeof StandardLessonWritingCoachPage).toBe("function");
  expect(shouldMountMarkMyLetter("Guided writing builder")).toBe(false);
  expect(shouldMountMarkMyLetter("Speaking builder")).toBe(false);
});

test("Mark my letter starts on Day 20 for B2 and C1", () => {
  expect(getAdvancedWritingPhase("B2", 19)).toBe("guided");
  expect(getAdvancedWritingPhase("C1", 19)).toBe("guided");
  expect(getAdvancedWritingPhase("B2", 20)).toBe("full-essay");
  expect(getAdvancedWritingPhase("C1", 20)).toBe("full-essay");
});
