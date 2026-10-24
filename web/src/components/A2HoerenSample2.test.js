import fs from "fs";
import path from "path";
import { A2_MOCK_2_HOEREN } from "../data/a2Mock2Hoeren";

const read = (file) => fs.readFileSync(path.join(__dirname, file), "utf8");

test("A2 listening offers a separate Sample 2 route with all four original parts", () => {
  const horen = read("HorenPage.js");
  const practice = read("ListeningPracticeSamplePage.jsx");
  expect(horen).toContain('navigate("/exams/horen/a2/sample-2")');
  expect(horen).toContain('normalizedLevel === "A2" && sampleId === "sample-2"');
  expect(practice).toContain("A2_SAMPLE_2_PARTS");
  expect(practice).toContain('sampleId === "sample-2" ? "mock-02" : "mock-01"');
  expect(practice).toContain("A2_MOCK_2_HOEREN.map");
  expect(A2_MOCK_2_HOEREN.map((part) => part.audioObjectKey))
    .toEqual([1, 2, 3, 4].map((n) => `a2/mock-horen-2/teil-${n}.mp3`));
  expect(A2_MOCK_2_HOEREN.flatMap((part) => part.questions)).toHaveLength(20);
});

test("Sample 2 retains unique matching answers and independent Exam Room result identity", () => {
  const practice = read("ListeningPracticeSamplePage.jsx");
  expect(practice).toContain('sampleId === "sample-2" && part.key === "teil2"');
  expect(practice).toContain('setId: `${normalizedLevel.toLowerCase()}-hoeren-${sampleId}`');
  expect(practice).toContain('section: "hoeren"');
});
