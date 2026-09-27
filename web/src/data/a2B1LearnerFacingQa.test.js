import fs from "fs";
import path from "path";
import { courseSchedules } from "./courseSchedule";
import { normalizeLesson } from "./lessonModel";
import { A2_LISTENING_MODES, getA2ListeningTask } from "./a2ListeningTasks";
import { getB1ListeningTask } from "./b1ListeningTasks";
import { getA2GrammarRoute } from "./a2GrammarRoutes";
import { getB1LessonResourceOverride } from "./b1LessonResourceOverrides";

const days = Array.from({ length: 28 }, (_, index) => index + 1);

const scheduleEntry = (level, day) =>
  (courseSchedules[level] || []).find((entry) => Number(entry.day) === day);

const answerManifest = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../../../functions/data/answerKeyManifest.json"),
    "utf8",
  ),
);

const manifestEntriesForLevel = (level) =>
  Object.values(answerManifest).filter((entry) =>
    String(entry.assignment_id || "").startsWith(`${level}-`),
  );

describe("A2 + B1 learner-facing QA · Days 1–28", () => {
  test("every A2 day exposes native Grammar and Workbook destinations", () => {
    days.forEach((day) => {
      const entry = scheduleEntry("A2", day);
      expect(entry).toBeTruthy();

      const normalized = normalizeLesson(entry, "A2");
      expect(getA2GrammarRoute({ day, chapter: entry.chapter })).toMatch(/^\/campus\/course\//);
      expect(normalized.resources.grammarBook?.url).toMatch(/^\/campus\/course\//);
      expect(normalized.resources.workbook?.url).toMatch(/^\/campus\/course\//);
      expect(normalized.resources.grammarBook?.url).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
      expect(normalized.resources.workbook?.url).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
    });
  });

  test("every B1 day exposes native Grammar and Workbook destinations", () => {
    days.forEach((day) => {
      const entry = scheduleEntry("B1", day);
      expect(entry).toBeTruthy();

      const override = getB1LessonResourceOverride(day);
      const normalized = normalizeLesson(entry, "B1");
      expect(override?.grammarBook).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(override?.workbook).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(normalized.resources.grammarBook?.url).toBe(override.grammarBook);
      expect(normalized.resources.workbook?.url).toBe(override.workbook);
    });
  });

  test("A2 course instructions match the real Hören contract", () => {
    days.forEach((day) => {
      const entry = scheduleEntry("A2", day);
      const listening = getA2ListeningTask(day);
      expect(entry?.instruction).toBeTruthy();

      if (listening?.mode === A2_LISTENING_MODES.NONE) {
        expect(entry.instruction).toContain("no Teil 4 · Hören");
        expect(entry.instruction).toContain("Teil 1–3");
      } else if (listening?.mode === A2_LISTENING_MODES.SELF_CHECK) {
        expect(entry.instruction).toContain("self-check");
        expect(entry.instruction).toContain("not submitted");
      } else {
        expect(entry.instruction).toContain("Teil 4 · Hören");
        expect(entry.instruction).toContain("Submit Teil 2 · Schreiben");
      }
    });
  });

  test("B1 course instructions match unavailable, reading-fallback, self-check and submitted Hören", () => {
    days.forEach((day) => {
      const entry = scheduleEntry("B1", day);
      const listening = getB1ListeningTask(day);
      expect(entry?.instruction).toBeTruthy();

      if (listening?.status === "unavailable") {
        expect(entry.instruction).toContain("kein Teil 4 · Hören");
      } else if (listening?.mode === "reading-fallback") {
        expect(entry.instruction).toContain("zweite Lesetext");
      } else if (listening?.submitRequired === false) {
        expect(entry.instruction).toContain("Selbstkontrolle");
        expect(entry.instruction).toContain("wird nicht eingereicht");
      } else {
        expect(entry.instruction).toContain("Teil 4 · Hören");
      }
    });
  });

  test("B1 no-Hören days do not advertise stale listening media", () => {
    [21, 23].forEach((day) => {
      const entry = scheduleEntry("B1", day);
      const resources = Array.isArray(entry?.lesen_hören)
        ? entry.lesen_hören
        : [entry?.lesen_hören].filter(Boolean);
      resources.forEach((resource) => {
        expect(String(resource?.video || "")).toBe("");
        expect(String(resource?.youtube_link || "")).toBe("");
      });
    });
  });

  test("all 28 A2 and all 28 B1 assignment manifests keep answer-sheet links", () => {
    ["A2", "B1"].forEach((level) => {
      const entries = manifestEntriesForLevel(level);
      const dayEntries = entries.filter((entry) => {
        const id = String(entry.assignment_id || "");
        return !/Tutorial|Orientation/i.test(id);
      });

      expect(dayEntries.length).toBeGreaterThanOrEqual(28);
      dayEntries.forEach((entry) => {
        expect(String(entry.answer_url || "").trim()).not.toBe("");
        expect(String(entry.sheet_url || "").trim()).not.toBe("");
      });
    });
  });
});
