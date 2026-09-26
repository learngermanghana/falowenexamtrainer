import fs from "fs";
import path from "path";
import { A2_READING_TASKS } from "../data/a2ReadingTasks";
import { A2_LISTENING_MODES, A2_LISTENING_TASKS } from "../data/a2ListeningTasks";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Days 23-28 assessment integrity", () => {
  const radioDictionary = read("../data/lessonRadioDictionary.js");
  const additionalRadio = read("../data/additionalA2RadioEntries.js");

  test("Day 23 keeps canonical commuting reading and separate Goethe self-check Hören", () => {
    expect(A2_READING_TASKS[23].title).toBe("Drei Wege zur Arbeit");
    expect(A2_LISTENING_TASKS[23].mode).toBe(A2_LISTENING_MODES.SELF_CHECK);
    expect(A2_LISTENING_TASKS[23].audioUrl).toContain("6DA1dYfqEZo");
    expect(additionalRadio).toContain('youtubeId: "LtARwiCljLY"');
    expect(A2_LISTENING_TASKS[23].audioUrl).not.toContain("LtARwiCljLY");
  });

  test("Day 24 keeps canonical travel reading and separate Goethe self-check Hören", () => {
    expect(A2_READING_TASKS[24].title).toBe("Welches Angebot passt?");
    expect(A2_LISTENING_TASKS[24].mode).toBe(A2_LISTENING_MODES.SELF_CHECK);
    expect(A2_LISTENING_TASKS[24].audioUrl).toContain("iPScKV6JWaA");
    expect(additionalRadio).toContain('youtubeId: "UXiBiiXwqwY"');
    expect(A2_LISTENING_TASKS[24].audioUrl).not.toContain("UXiBiiXwqwY");
  });

  test("Day 25 has no workbook Hören and does not reuse Falowen Radio as Teil 4", () => {
    expect(A2_LISTENING_TASKS[25].mode).toBe(A2_LISTENING_MODES.NONE);
    expect(A2_LISTENING_TASKS[25].audioUrl).toBe("");
    expect(additionalRadio).toContain('youtubeId: "m7nP2qE9gNg"');
  });

  test("Day 26 uses separate Goethe self-check Hören instead of its Falowen Radio", () => {
    expect(A2_LISTENING_TASKS[26].mode).toBe(A2_LISTENING_MODES.SELF_CHECK);
    expect(A2_LISTENING_TASKS[26].audioUrl).toContain("JEJZypJfrD8");
    expect(radioDictionary).toContain('youtubeId: "9OVfA1B-nuU"');
    expect(A2_LISTENING_TASKS[26].audioUrl).not.toContain("9OVfA1B-nuU");
  });

  test("Day 27 keeps graded Hören separate from Falowen Radio", () => {
    expect(A2_LISTENING_TASKS[27].mode).toBe(A2_LISTENING_MODES.GRADED);
    expect(A2_LISTENING_TASKS[27].audioUrl).toContain("JEJZypJfrD8");
    expect(A2_LISTENING_TASKS[27].questions).toHaveLength(4);
    expect(radioDictionary).toContain('youtubeId: "XLyXDfsM-HY"');
    expect(A2_LISTENING_TASKS[27].audioUrl).not.toContain("XLyXDfsM-HY");
  });

  test("Day 28 keeps graded Hören separate from Falowen Radio", () => {
    expect(A2_LISTENING_TASKS[28].mode).toBe(A2_LISTENING_MODES.GRADED);
    expect(A2_LISTENING_TASKS[28].audioUrl).toContain("Teuu287XY_M");
    expect(A2_LISTENING_TASKS[28].questions).toHaveLength(3);
    expect(additionalRadio).toContain('youtubeId: "ftnD96p9Ncg"');
    expect(A2_LISTENING_TASKS[28].audioUrl).not.toContain("ftnD96p9Ncg");
  });
});
