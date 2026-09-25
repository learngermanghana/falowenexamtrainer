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

test("B2 fallback paths scrub stale grammar, Radio and video resources", () => {
  const canonical = resolveCanonicalLessonForPage(
    { level: "B2", day: 2 },
    {
      resources: {
        falowenRadio: { youtubeId: "wrong" },
        grammarBook: { url: "https://drive.google.com/old-grammar" },
        workbook: { url: "/campus/course/lesson/B2/2?view=workbook" },
        aiVideo: { url: "https://youtu.be/wrong-ai" },
        videos: [{ url: "https://youtu.be/wrong-ai" }],
        resourceGroups: [{
          chapter: "1.2",
          grammarBook: { url: "https://drive.google.com/old-grammar" },
          workbook: { url: "/campus/course/lesson/B2/2?view=workbook" },
        }],
      },
    }
  );

  expect(canonical.resources.falowenRadio).toBeNull();
  expect(canonical.resources.grammarBook).toBeNull();
  expect(canonical.resources.aiVideo).toBeNull();
  expect(canonical.resources.videos).toEqual([]);
  expect(canonical.resources.workbook.url).toBe(
    "/campus/course/lesson/B2/2?view=workbook"
  );
  expect(canonical.resources.resourceGroups[0].grammarBook).toBeNull();
});

test("direct C1 workbook navigation does not recreate the Day 3 Radio override", () => {
  const canonical = resolveCanonicalLessonForPage(
    { level: "C1", day: 3 },
    {
      skipFalowenRadio: true,
      resources: {
        falowenRadio: { youtubeId: "should-not-return" },
      },
    },
  );

  expect(canonical.resources.falowenRadio).toBeNull();
});

test("legacy view labels remain available without inventing B2 media", () => {
  expect(__TESTING__.viewButtonLabel("workbook")).toBe("3. Write");
  expect(__TESTING__.viewButtonLabel("grammar")).toBe("1. Learn");
});
