import teil3 from "./mockDrafts/a2-mock-03-hoeren-teil-3.json";
import teil4 from "./mockDrafts/a2-mock-03-hoeren-teil-4.json";
import { assertFullMockReady } from "./mockFactoryContract";

describe("A2 Mock 03 Hören teacher drafts (NOT published)", () => {
  test("each Teil has five unique, answered, sequential tasks", () => {
    for (const [part, first] of [[teil3, 11], [teil4, 16]]) {
      expect(part.mockId).toBe("a2-mock-03");
      expect(part.level).toBe("A2");
      expect(part.module).toBe("hoeren");
      expect(part.publicationStatus).toBe("draft-only");
      expect(part.questions).toHaveLength(5);
      expect(part.questions.map(q => q.number || Number(part.examPart) === 4 && 16 + part.questions.indexOf(q))).toHaveLength(5);
      expect(part.questions.every(q => q.answer && q.evidence)).toBe(true);
      expect(part.audioVerification).toMatch(/unverified|NOT verified/i);
      expect(part.audioObjectKey).toMatch(/^a2\/mock-hoeren\/mock-03\/teil-[34]\.mp3$/);
    }
    expect(teil3.questions.map(q => q.number)).toEqual([11,12,13,14,15]);
    expect(teil3.questions.map(q => q.answer)).toEqual(["a","b","c","b","a"]);
    expect(teil3.questions.every(q => q.options.length === 3)).toBe(true);
    expect(teil4.questions.map(q => q.answer)).toEqual(["Richtig","Richtig","Falsch","Richtig","Falsch"]);
  });

  test("Teil 4 is already repeated twice in the MP3: do not play it twice in the UI", () => {
    expect(teil4.embeddedRepetitions).toBe(2);
    expect(teil4.plays).toBe(1);
    expect(teil4.localAudioEvidence.durationSeconds).toBeGreaterThan(230);
    expect(teil4.questions[0].question).toContain("Gastronomie");
    expect(teil4.questions[0].question).not.toContain("Hotel");
  });

  test("neither content draft can authorize releasing an unverified full mock", () => {
    expect(() => assertFullMockReady({
      id:"a2-mock-03", level:"A2", title:"A2 Mock 03",
      mode:"full", status:"ready",
      sections:["Lesen","Hören","Schreiben","Sprechen"],
    })).toThrow(/cannot be published/);
  });
});
