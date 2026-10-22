import fs from "fs";
import path from "path";
import teil3 from "./mockDrafts/a2-mock-03-hoeren-teil-3.json";
import teil4 from "./mockDrafts/a2-mock-03-hoeren-teil-4.json";
import { assertFullMockReady } from "./mockFactoryContract";

describe("A2 Mock 03 Hören teacher drafts (NOT published)", () => {
  test("five distinct Teil 3 dialogues have five numbered questions and audio-grounded answers", () => {
    expect(teil3.mockId).toBe("a2-mock-03");
    expect(teil3.publicationStatus).toBe("draft-only");
    expect(teil3.audioObjectKey).toBe("a2/mock-hoeren/mock-03/teil-3.mp3");
    expect(teil3.questions.map(q => q.number)).toEqual([11, 12, 13, 14, 15]);
    expect(teil3.questions.map(q => q.answer)).toEqual(["b", "c", "a", "b", "c"]);
    expect(teil3.transcriptEvidence).toHaveLength(5);
    expect(teil3.plays).toBe(1);
    expect(teil3.embeddedRepetitions).toBe(1);
    expect(teil3.localAudioEvidence.durationSeconds).toBeGreaterThan(105);
    expect(teil3.localAudioEvidence.durationSeconds).toBeLessThan(108);
    expect(teil3.localAudioEvidence.bytes).toBe(1279584);
    expect(teil3.localAudioEvidence.sha256).toMatch(/^[0-9a-f]{64}$/);
    for (const question of teil3.questions.filter(q => q.displayMode === "pictures")) {
      for (const option of question.options) {
        expect(option.imagePath).toMatch(/^\/exams\/a2\/mock-03\/[a-z0-9-]+\.svg$/);
        const onDisk = path.resolve(process.cwd(), "public", option.imagePath.replace(/^\//, ""));
        expect(fs.existsSync(onDisk)).toBe(true);
      }
    }

    for (const [i, question] of teil3.questions.entries()) {
      expect(question.scene).toBe(i+1);
      expect(question.evidence.length).toBeGreaterThan(20);
      expect(question.options.map(option => option.id)).toEqual(["a","b","c"]);
      expect(new Set(question.options.map(option => option.label)).size).toBe(3);
      expect(question.options.some(option => option.id === question.answer)).toBe(true);
      if (question.displayMode === "pictures") {
        expect(question.options.every(option => option.photoSpec?.length > 10)).toBe(true);
      }
    }
    expect(teil3.questions[0].evidence).toMatch(/zwanzig Uhr/);
    expect(teil3.questions[1].evidence).toMatch(/fünfzehn Uhr/);
    expect(teil3.questions[2].evidence).toMatch(/rote Jacke/);
    expect(teil3.questions[3].evidence).toMatch(/neben den Birnen/);
    expect(teil3.questions[4].evidence).toMatch(/zwölf Uhr dreißig/);
    // Previous false draft based on another recording must never return.
    expect(JSON.stringify(teil3.questions)).not.toMatch(/Tomaten|Pullover zurückgeben|Mittwoch im Park|Samstag schließt/);
  });

  test("Teil 4's corrected answer and double playback remain unchanged", () => {
    expect(teil4.audioObjectKey).toBe("a2/mock-hoeren/mock-03/teil-4.mp3");
    expect(teil4.publicationStatus).toBe("draft-only");
    expect(teil4.questions).toHaveLength(5);
    expect(teil4.questions.every(question=>Boolean(question.answer && question.evidence))).toBe(true);
    expect(teil4.questions.map(q => q.answer)).toEqual(["Richtig","Richtig","Falsch","Richtig","Falsch"]);
    expect(teil4.embeddedRepetitions).toBe(2);
    expect(teil4.plays).toBe(1);
    expect(teil4.localAudioEvidence.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(teil4.questions[0].question).toContain("Gastronomie");
    expect(teil4.questions[0].question).not.toContain("Hotel");
  });

  test("teacher-only drafts must never authorize full A2 Mock 3 publication", () => {
    expect(teil3.audioVerification).toMatch(/NOT verified/);
    expect(teil4.audioVerification).toMatch(/NOT verified/);
    expect(() => assertFullMockReady({
      id:"a2-mock-03", level:"A2", title:"A2 Mock 03",
      mode:"full", status:"ready",
      sections:["Lesen","Hören","Schreiben","Sprechen"],
    })).toThrow(/cannot be published/);
  });
});
