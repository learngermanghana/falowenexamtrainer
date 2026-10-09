import { A2_MOCK_2_SCHREIBEN } from "../data/a2Mock2Schreiben";
import { A2_MOCK_2_SPEAKING, A2_MOCK_2_SPEAKING_RUBRIC } from "../data/a2Mock2Speaking";
test("Mock 2 has separate assessment identity and task-specific criteria",()=>{
 expect(A2_MOCK_2_SPEAKING.mockId).toBe("a2-mock-02");
 expect(A2_MOCK_2_SPEAKING_RUBRIC.assessmentIdentity).toContain("Mock 2");
 expect(A2_MOCK_2_SCHREIBEN.teil1.situation).toContain("Julia");
 expect(A2_MOCK_2_SCHREIBEN.teil2.recipient).toContain("Alpenblick");
 expect(A2_MOCK_2_SPEAKING.cards.map(c=>c.keyword)).toEqual(["Balkon","Wochenende","Arbeitszeiten","Deutschkurs"]);
 expect(A2_MOCK_2_SPEAKING.teil3.situation).toContain("Thomas");
});
