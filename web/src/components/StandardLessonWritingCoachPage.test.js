import StandardLessonWritingCoachPage, {
  __TESTING__,
  resolveCanonicalLessonForPage,
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

test("B2 Day 2 has different in-app grammar and workbook links", () => {
  const canonical = resolveCanonicalLessonForPage(
    { level: "B2", day: 2 },
    {
      resources: {
        grammarBook: { url: "https://drive.google.com/old-grammar" },
        workbook: { url: "https://drive.google.com/old-workbook" },
      },
    }
  );

  expect(canonical.resources.grammarBook.url).toBe(
    "/campus/course/lesson/B2/2?view=grammar"
  );
  expect(canonical.resources.workbook.url).toBe(
    "/campus/course/lesson/B2/2?view=workbook"
  );
  expect(canonical.resources.workbook.url).not.toBe(
    canonical.resources.grammarBook.url
  );
});

test("B2 workbook and grammar links open their correct existing lesson stages", () => {
  expect(__TESTING__.viewButtonLabel("workbook")).toBe("3. Write");
  expect(__TESTING__.viewButtonLabel("grammar")).toBe("1. Learn");
});
