import { A2_MOCK_2_SPEAKING as mock, A2_MOCK_2_SPEAKING_RUBRIC as rubric } from "./a2Mock2Speaking";
test("A2 Mock 2 speaking cards and followups are precise",()=>{
 expect(mock.cards.map(c=>c.keyword)).toEqual(["Balkon","Wochenende","Arbeitszeiten","Deutschkurs"]);
 expect(mock.teil2.points).toHaveLength(4);
 expect(mock.teil2.followups).toHaveLength(2);
 expect(mock.teil3.points).toHaveLength(4);
 expect(mock.teil3.situation).toMatch(/Thomas/);
 expect(mock.teil3.situation).toMatch(/Überraschungsparty/);
});
test("task-specific rubric does not reuse first mock",()=>{
 expect(rubric.assessmentIdentity).toMatch(/Mock 2/);
 expect(rubric.teil1).toMatch(/Deutschkurs/);
 expect(rubric.teil2).toMatch(/frequency/);
 expect(rubric.teil3).toMatch(/negotiation/);
});
