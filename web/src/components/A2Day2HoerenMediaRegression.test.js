import fs from "fs";
import path from "path";

const readFromWeb = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

const workbook = readFromWeb("A2Day2PersonenBeschreibenWorkbookPage.js");
const teacherResources = readFromWeb("../data/teacherLectureVideoResources.js");
const buildPatch = fs.readFileSync(
  path.resolve(__dirname, "../../../scripts/patchRequestedTeacherVideosAug6.mjs"),
  "utf8",
);

describe("A2 Day 2 Personen beschreiben Hören media regression", () => {
  it("keeps the original Teil 4 Hören video with its three original questions", () => {
    expect(workbook).toContain('hoerenAudioUrl="https://youtu.be/5ttnGcZWo-Q"');
    expect(workbook).toContain("Warum lernt der Sprecher Deutsch?");
    expect(workbook).toContain("Welche Methoden benutzt der Sprecher zum Lernen?");
    expect(workbook).toContain("Wie oft übt der Sprecher Deutsch?");
    expect(workbook).toContain("B. Weil er in Deutschland arbeiten möchte.");
    expect(workbook).toContain("C. Sprachkurse, Online-Apps und das Üben mit Freunden.");
    expect(workbook).toContain("A. Jeden Tag eine Stunde.");
  });

  it("keeps the teacher lecture separate from Teil 4 Hören", () => {
    expect(teacherResources).toContain('chapter: "1.2"');
    expect(teacherResources).toContain('topic: "Personen beschreiben"');
    expect(teacherResources).toContain('url: "https://youtu.be/iB-yVVqI1DQ"');
    expect(workbook).not.toContain('hoerenAudioUrl="https://youtu.be/iB-yVVqI1DQ"');
  });

  it("does not rewrite the A2 Day 2 Hören video during builds", () => {
    expect(buildPatch).not.toContain("A2Day2PersonenBeschreibenWorkbookPage.js");
    expect(buildPatch).not.toContain("5ttnGcZWo-Q");
    expect(buildPatch).not.toContain("iB-yVVqI1DQ");
  });
});
