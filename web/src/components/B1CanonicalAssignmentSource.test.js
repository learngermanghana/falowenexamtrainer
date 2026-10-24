import { resolveB1CanonicalAssignmentSections, resolveB1WorkbookTabs } from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";
import { getB1ListeningTask } from "../data/b1ListeningTasks";

describe("B1 canonical workbook assignment sources", () => {
  test.each(Array.from({ length: 28 }, (_, index) => index + 1))(
    "Day %i resolves Schreiben and Lesen from the canonical registries",
    (day) => {
      const canonicalWriting = getB1WritingTask(day);
      const canonicalReading = getB1ReadingTask(day);

      const resolved = resolveB1CanonicalAssignmentSections({
        day,
        writing: { title: "STALE INLINE WRITING", localOnly: true },
        reading: { title: "STALE INLINE READING", localOnly: true },
      });

      expect(canonicalWriting).toBeTruthy();
      expect(canonicalReading).toBeTruthy();
      expect(resolved.writing.title).toBe(canonicalWriting.title);
      expect(resolved.reading.title).toBe(canonicalReading.title);
      expect(resolved.writing.assignmentKey).toBe(canonicalWriting.assignmentKey);
      expect(resolved.reading.assignmentKey).toBe(canonicalReading.assignmentKey);
      expect(resolved.writing.localOnly).toBe(true);
      expect(resolved.reading.localOnly).toBe(true);
    }
  );

  test("unavailable Hören days omit Teil 4 from the workbook navigation", () => {
    for (const day of [21, 23]) {
      const tabs = resolveB1WorkbookTabs(getB1ListeningTask(day));
      expect(tabs.some((tab) => tab.key === "hoeren")).toBe(false);
    }

    const regularTabs = resolveB1WorkbookTabs(getB1ListeningTask(24));
    expect(regularTabs.some((tab) => tab.key === "hoeren")).toBe(true);
  });
});
