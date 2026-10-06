import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 22 workbook sections", () => {
  const listeningTasks = read("../data/a2ListeningTasks.js");
  const timedConfig = read("../data/a2B1TimedAssignmentBase.js");

  test("removes Teil 4 Hören from Day 22", () => {
    const day22Start = listeningTasks.indexOf("  22: {");
    const day23Start = listeningTasks.indexOf("  23: {", day22Start);
    const day22 = listeningTasks.slice(day22Start, day23Start);

    expect(day22).toContain("mode: A2_LISTENING_MODES.NONE");
    expect(day22).toContain('audioUrl: ""');
    expect(day22).toContain("questions: []");
  });

  test("keeps only Schreiben and Lesen in the 30-minute timer", () => {
    expect(timedConfig).toContain(
      '"A2-8.22": timed({ level: "A2", durationMinutes: 30, scope: "Teil 2 Schreiben and Teil 3 Lesen", timedTabs: ["schreiben", "lesen"]',
    );
  });
});
