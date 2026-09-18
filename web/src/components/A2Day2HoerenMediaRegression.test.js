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
const answerManifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../../functions/data/answerKeyManifest.json"), "utf8"),
);

const extractQuestionBlock = (source, constantName, nextConstantName) => {
  const start = source.indexOf(`const ${constantName} = [`);
  const end = source.indexOf(`const ${nextConstantName} = [`, start);
  return source.slice(start, end);
};

describe("A2 Day 2 Personen beschreiben Hören media regression", () => {
  it("keeps the Day 2 workbook at seven Lesen and five Hören questions", () => {
    const lesenBlock = extractQuestionBlock(workbook, "readingQuestions", "listeningQuestions");
    const hoerenStart = workbook.indexOf("const listeningQuestions = [");
    const hoerenEnd = workbook.indexOf("export default function", hoerenStart);
    const hoerenBlock = workbook.slice(hoerenStart, hoerenEnd);

    expect((lesenBlock.match(/stem:/g) || [])).toHaveLength(7);
    expect((hoerenBlock.match(/stem:/g) || [])).toHaveLength(5);
    expect(workbook).toContain('hoerenAudioUrl="https://youtu.be/5ttnGcZWo-Q"');
    expect(workbook).toContain("Warum lernt der Sprecher Deutsch?");
    expect(workbook).toContain("Welche Methoden benutzt der Sprecher zum Lernen?");
    expect(workbook).toContain("Wie oft übt der Sprecher Deutsch?");
    expect(workbook).toContain("Mit wem übt der Sprecher zusätzlich Deutsch?");
    expect(workbook).toContain("Wie lange übt der Sprecher jeden Tag Deutsch?");
    expect(workbook).toContain("die fünf Hörverstehen-Fragen");
  });

  it("keeps the A2-1.2 marking manifest aligned to seven plus five", () => {
    const answers = answerManifest["A2 1.2 Personen Beschreiben"]?.answers;
    expect(Object.keys(answers?.teil3 || {})).toHaveLength(7);
    expect(Object.keys(answers?.teil4 || {})).toHaveLength(5);
    expect(answers?.teil4?.Answer4).toContain("Mit Freunden");
    expect(answers?.teil4?.Answer5).toContain("Eine Stunde");
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
