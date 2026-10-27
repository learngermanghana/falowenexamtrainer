import fs from "fs";
import path from "path";
import { A1_MOCK_7_LISTENING } from "./a1Mock7Listening";
import { getMockExam } from "./mockExamCatalog";

test("A1 Mock 07 Hören has the uploaded 6/4/5 questions without solutions", () => {
  expect(Object.keys(A1_MOCK_7_LISTENING)).toEqual(["teil1", "teil2", "teil3"]);
  [1, 2, 3].forEach((number, index) => {
    const part = A1_MOCK_7_LISTENING[`teil${number}`];
    expect(part.questions).toHaveLength([6, 4, 5][index]);
    expect(part.plays).toBe([2, 1, 2][index]);
    expect(part.audioObjectKey).toBe(`a1/mock-hoeren/mock-07/teil-${number}.mp3`);
    part.questions.forEach((q, i) => {
      expect(q.number).toBe(i + 1);
      expect(q).not.toHaveProperty("answer");
      expect(q).not.toHaveProperty("correctIndex");
      expect(q).not.toHaveProperty("evidence");
      if (number === 2) expect(typeof q.statement).toBe("string");
      else expect(q.options.map(o => o.id)).toEqual(["a", "b", "c"]);
    });
  });
  expect(A1_MOCK_7_LISTENING.teil1.questions[0].question).toBe("Wie kommen Tim und Anna in die Sprachschule?");
  expect(A1_MOCK_7_LISTENING.teil3.questions[4].question).toBe("Warum ruft Anna von der Personalabteilung an?");
});

test("A1 Mock 07 remains a four-module /100 exam alongside upgraded Mock 08", () => {
  expect(getMockExam("a1-final-07")).toMatchObject({
    level: "A1", mode: "full", status: "preview",
    questionSetId: "a1-mock-07",
    sections: ["Lesen", "Hören", "Schreiben", "Sprechen"],
  });
  expect(getMockExam("a1-final-08")).toMatchObject({
    mode: "full", sections: ["Lesen", "Hören", "Schreiben", "Sprechen"],
  });
  const page = fs.readFileSync(path.resolve(__dirname, "../components/A1FinalMockExamPage.jsx"), "utf8");
  expect(page).toContain("A1_MOCK_7_LISTENING");
  expect(page).toContain('"a1-mock-07", "a1-mock-08"].includes(mockId)');
});
