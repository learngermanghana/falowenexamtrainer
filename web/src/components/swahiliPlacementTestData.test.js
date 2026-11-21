import { swahiliPlacementTest, swahiliPlacementQuestions, SWAHILI_PLACEMENT_STORAGE_KEY } from "./swahiliPlacementTestData";
import { PLACEMENT_STORAGE_KEY } from "./placementTest2026Data";

test("teacher-supplied Kiswahili A1–B1 assessment has 30 ordered questions and four choices each",()=>{
  expect(swahiliPlacementTest.sections.map(s=>s.level)).toEqual(["A1","A2","B1"]);
  expect(swahiliPlacementTest.sections.map(s=>s.questions.length)).toEqual([10,10,10]);
  expect(swahiliPlacementQuestions).toHaveLength(30);
  expect(new Set(swahiliPlacementQuestions.map(q=>q.id)).size).toBe(30);
  expect(swahiliPlacementQuestions.map(q=>q.number)).toEqual(Array.from({length:30},(_,i)=>i+1));
  for(const q of swahiliPlacementQuestions){
    expect(q.options).toHaveLength(4);
    expect(q.text.length).toBeGreaterThan(15);
    expect(q).not.toHaveProperty("correct");
    expect(q).not.toHaveProperty("answerIndex");
  }
});
test("PDF source samples and isolation from German browser attempts",()=>{
  expect(swahiliPlacementQuestions[0].text).toMatch(/Shikamoo/);
  expect(swahiliPlacementQuestions[0].options[1]).toBe("Marahaba");
  expect(swahiliPlacementQuestions[9].options[2]).toBe("Kwa heri");
  expect(swahiliPlacementQuestions[19].text).toMatch(/Saa tatu za usiku/);
  expect(swahiliPlacementQuestions[29].options[1]).toMatch(/Gharama za sasa/);
  expect(SWAHILI_PLACEMENT_STORAGE_KEY).not.toBe(PLACEMENT_STORAGE_KEY);
});
