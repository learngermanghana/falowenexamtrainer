import {
  getVisibleSpeakingTabs,
  normalizeLockedSpeakingLevel,
  normalizeLockedSpeakingTeil,
  resolveInitialSpeakingFilters,
} from "./speakingExamLock";

test("normalizes locked Goethe speaking filters", () => {
  expect(normalizeLockedSpeakingLevel("a1")).toBe("A1");
  expect(normalizeLockedSpeakingLevel("invalid")).toBe("");
  expect(normalizeLockedSpeakingTeil("Teil 3")).toBe("3");
  expect(normalizeLockedSpeakingTeil("7")).toBe("");
});

test("locked filters take priority over the global exam level", () => {
  expect(
    resolveInitialSpeakingFilters({
      lockedLevel: "A1",
      lockedTeil: "3",
      examLevel: "B1",
    }),
  ).toEqual({ level: "A1", teil: "3" });
});

test("exam-only embeds expose only the Goethe prompt tab", () => {
  expect(getVisibleSpeakingTabs({ examOnly: true, isCourseMode: false })).toEqual([
    { key: "exam", label: "Exam prompts" },
  ]);
});
