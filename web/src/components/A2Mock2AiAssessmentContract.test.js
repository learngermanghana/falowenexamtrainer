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

test("Mock 2 keeps only text/assessment locally and sends ephemeral clips for transcription", () => {
 const fs = require("fs");
 const path = require("path");
 const source = fs.readFileSync(path.join(__dirname, "A2Mock2Sprechen.jsx"), "utf8");
 expect(source).toContain("persistAudio:false,transcriptionOnly:true");
 expect(source).toContain("contextType:\"A2 Mock 2 Sprechen\"");
 expect(source).toContain("[task.id]:{transcript,duration:elapsed}");
 expect(source).toContain("discardPendingAudio()");
 expect(source).not.toContain("uploadBytes(");
 expect(source).not.toContain("audioUrl:");
 expect(source).toContain('scoreA2MockSpeaking({idToken, mockId:"a2-mock-02"');
});
