import { A2_MOCK_2_HOEREN, A2_MOCK_2_HOEREN_QUESTIONS } from "./a2Mock2Hoeren";
import fs from "fs";
import path from "path";
test("A2 Mock 2 Hören has 20 numbered tasks, audio keys and intended replay rules", () => {
 expect(A2_MOCK_2_HOEREN.map(p=>p.plays)).toEqual([2,1,1,2]);
 expect(A2_MOCK_2_HOEREN_QUESTIONS.map(q=>q.number)).toEqual(Array.from({length:20},(_,i)=>i+1));
 expect(A2_MOCK_2_HOEREN.map(p=>p.audioObjectKey)).toEqual([1,2,3,4].map(n=>`a2/mock-horen-2/teil-${n}.mp3`));
});
test("answer key, corrected wording and nine unique activity choices are preserved", () => {
 expect(A2_MOCK_2_HOEREN_QUESTIONS.map(q=>q.answer)).toEqual(["c","b","b","a","b","a","b","c","d","e","c","b","b","b","b","ja","nein","nein","nein","ja"]);
 expect(A2_MOCK_2_HOEREN_QUESTIONS[11].question).toBe("Warum nimmt die Frau die Wohnung nicht?");
 expect(A2_MOCK_2_HOEREN_QUESTIONS[16].answer).toBe("nein");
 const pictures=A2_MOCK_2_HOEREN[1].pictures;
 expect(pictures.map(p=>p[0])).toEqual(["A","B","C","D","E","F","G","H","I"]);
 expect(new Set(pictures.map(p=>p[1])).size).toBe(9);
});

test("Teil 3 questions 11–15 have valid illustrated answer choices", () => {
 const teil3 = A2_MOCK_2_HOEREN.find(part => part.id === "teil-3");
 expect(teil3.questions.map(question => question.number)).toEqual([11,12,13,14,15]);
 for (const question of teil3.questions) {
  expect(question.options).toHaveLength(3);
  for (const option of question.options) {
   expect(option.imagePath).toMatch(/^\/exams\/a2\/mock-02\/teil-3\/q1[1-5]-[abc]\.svg$/);
   expect(option.imageAlt).toBe(`${option.label} illustration`);
   expect(fs.existsSync(path.resolve(process.cwd(), "public", option.imagePath.slice(1)))).toBe(true);
  }
 }
});
