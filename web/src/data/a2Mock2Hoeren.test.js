import { A2_MOCK_2_HOEREN, A2_MOCK_2_HOEREN_QUESTIONS } from "./a2Mock2Hoeren";
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
