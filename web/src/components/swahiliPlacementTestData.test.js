import { swahiliPlacementTest, swahiliPlacementQuestions, SWAHILI_PLACEMENT_STORAGE_KEY, shufflePlacementItems } from "./swahiliPlacementTestData";
import { PLACEMENT_STORAGE_KEY } from "./placementTest2026Data";

test("teacher-supplied Kiswahili A1–B2 assessment has 40 ordered questions and four choices each",()=>{
  expect(swahiliPlacementTest.sections.map(s=>s.level)).toEqual(["A1","A2","B1","B2"]);
  expect(swahiliPlacementTest.sections.map(s=>s.questions.length)).toEqual([10,10,10,10]);
  expect(swahiliPlacementQuestions).toHaveLength(40);
  expect(new Set(swahiliPlacementQuestions.map(q=>q.id)).size).toBe(40);
  expect(swahiliPlacementQuestions.map(q=>q.number)).toEqual(Array.from({length:40},(_,i)=>i+1));
  for(const q of swahiliPlacementQuestions){
    expect(q.options).toHaveLength(4);
    expect(q.text.length).toBeGreaterThan(10);
    expect(q).not.toHaveProperty("correct");
    expect(q).not.toHaveProperty("answerIndex");
  }
});
test("DOCX source samples and isolation from German browser attempts",()=>{
  expect(swahiliPlacementQuestions[0].text).toMatch(/Shikamoo/);
  expect(swahiliPlacementQuestions[0].options[0]).toBe("Marahaba");
  expect(swahiliPlacementQuestions[9].options[3]).toBe("Kwa heri");
  expect(swahiliPlacementQuestions[19].text).toMatch(/Jumatano/);
  expect(swahiliPlacementQuestions[39].options[3]).toMatch(/gharama za usafiri/);
  expect(SWAHILI_PLACEMENT_STORAGE_KEY).not.toBe(PLACEMENT_STORAGE_KEY);
  expect(swahiliPlacementTest.sections.every(s=>s.writingPrompt.length>40)).toBe(true);
});

 test("attempt shuffling is stable, non-mutating and preserves canonical answer indices", () => {
  const original = swahiliPlacementQuestions.map(q => ({...q, options:[...q.options]}));
  const orders = new Set();
  for(let i=0;i<40;i++) {
    const seed = "pt_test_attempt_"+i;
    const order = shufflePlacementItems(original.slice(0,10), seed);
    expect(order).toEqual(shufflePlacementItems(original.slice(0,10), seed));
    expect(order.map(q=>q.id).sort()).toEqual(original.slice(0,10).map(q=>q.id).sort());
    orders.add(order.map(q=>q.id).join(","));
    for(const q of order) {
      const options=shufflePlacementItems(q.options,seed+q.id);
      expect([...options].sort()).toEqual([...q.options].sort());
      expect(q.options.indexOf(options[0])).toBeGreaterThanOrEqual(0);
    }
  }
  expect(orders.size).toBeGreaterThan(1);
  expect(swahiliPlacementQuestions).toEqual(original);
});
