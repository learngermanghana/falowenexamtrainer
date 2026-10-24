import { A2_READING_TASKS } from "../data/a2ReadingTasks";
import { A2_LISTENING_MODES, A2_LISTENING_TASKS } from "../data/a2ListeningTasks";

describe("A2 Days 23-28 assessment integrity", () => {
  test("Day 23 uses the Markus commute Lesen and has no Hören", () => {
    expect(A2_READING_TASKS[23].title).toBe("Mein Weg zur Arbeit");
    expect(A2_READING_TASKS[23].questions).toHaveLength(5);
    expect(A2_LISTENING_TASKS[23].mode).toBe(A2_LISTENING_MODES.NONE);
    expect(A2_LISTENING_TASKS[23].audioUrl).toBe("");
    expect(A2_LISTENING_TASKS[23].questions).toHaveLength(0);
  });

  test("Day 24 uses travel-ad Lesen and protected graded Hören", () => {
    expect(A2_READING_TASKS[24].title).toBe("Welche Anzeige passt?");
    expect(A2_READING_TASKS[24].questions).toHaveLength(5);
    expect(A2_LISTENING_TASKS[24].mode).toBe(A2_LISTENING_MODES.GRADED);
    expect(A2_LISTENING_TASKS[24].audioKey).toBe("a2/day-24/day-24.mp3");
    expect(A2_LISTENING_TASKS[24].questions).toHaveLength(5);
  });

  test("Day 25 uses Hamburg Tagesablauf Lesen and has no Hören", () => {
    expect(A2_READING_TASKS[25].title).toBe("Mein Tagesablauf in Hamburg");
    expect(A2_READING_TASKS[25].questions).toHaveLength(5);
    expect(A2_LISTENING_TASKS[25].mode).toBe(A2_LISTENING_MODES.NONE);
    expect(A2_LISTENING_TASKS[25].audioUrl).toBe("");
    expect(A2_LISTENING_TASKS[25].questions).toHaveLength(0);
  });

  test("Day 26 uses Gefühle reactions Lesen and protected graded Hören", () => {
    expect(A2_READING_TASKS[26].title).toBe("Gefühle und Reaktionen im Gespräch");
    expect(A2_READING_TASKS[26].questions).toHaveLength(5);
    expect(A2_LISTENING_TASKS[26].mode).toBe(A2_LISTENING_MODES.GRADED);
    expect(A2_LISTENING_TASKS[26].audioKey).toBe("a2/day-26/day-26.mp3");
    expect(A2_LISTENING_TASKS[26].questions).toHaveLength(5);
  });

  test("Day 27 keeps digital-communication Lesen and protected graded Hören", () => {
    expect(A2_READING_TASKS[27].title).toBe("Digitale Mitteilungen & Online-Anzeigen");
    expect(A2_READING_TASKS[27].questions).toHaveLength(5);
    expect(A2_LISTENING_TASKS[27].mode).toBe(A2_LISTENING_MODES.GRADED);
    expect(A2_LISTENING_TASKS[27].audioKey).toBe("a2/day-27/day-27.mp3");
    expect(A2_LISTENING_TASKS[27].questions).toHaveLength(5);
  });

  test("Day 28 keeps future-plans Lesen and protected graded Hören", () => {
    expect(A2_READING_TASKS[28].title).toBe("Reisepläne für Hamburg");
    expect(A2_READING_TASKS[28].questions).toHaveLength(5);
    expect(A2_LISTENING_TASKS[28].mode).toBe(A2_LISTENING_MODES.GRADED);
    expect(A2_LISTENING_TASKS[28].audioKey).toBe("a2/day-28/day-28.mp3");
    expect(A2_LISTENING_TASKS[28].questions).toHaveLength(5);
  });
});
