"use strict";

const { getA1TutorRequestCard, tutorRequestPrompt, parseA1TutorRequestScore, CRITERIA } = require("../a1TutorSpeakingScore");
const cards = require("../../../shared/a1GoetheTeil3PictureCards.json");
const packagedCards = require("../../data/a1GoetheTeil3PictureCards.json");
const fs = require("node:fs");
const path = require("node:path");

describe("A1 Goethe tutor picture-card score contract", () => {
  test("Firebase package includes the cards and mirrors the web catalogue", () => {
    expect(packagedCards).toEqual(cards);
    const scorer = fs.readFileSync(path.join(__dirname, "../a1TutorSpeakingScore.js"), "utf8");
    expect(scorer).toContain('require("../data/a1GoetheTeil3PictureCards.json")');
    expect(scorer).not.toContain("../../shared/");
  });
  test("18 eligible Goethe Teil 3 cards share one server-owned catalogue", () => {
    expect(cards).toHaveLength(18);
    expect(new Set(cards.map(card => card.id)).size).toBe(18);
    expect(getA1TutorRequestCard("fenster").label).toBe("das Fenster");
    expect(getA1TutorRequestCard("bogus")).toBeNull();
  });

  test("the examiner asks for exactly one specific card without claiming to judge accent", () => {
    const prompt = tutorRequestPrompt(getA1TutorRequestCard("stift"));
    expect(prompt).toContain("der Stift");
    expect(prompt).toContain("0–4");
    expect(prompt).toContain("transcript");
    expect(prompt).toContain("Do NOT claim to judge pronunciation");
    expect(Object.values(CRITERIA).reduce((a, b) => a + b, 0)).toBe(10);
  });

  test("returns validated criterion marks, feedback and one corrected example", () => {
    const response = JSON.stringify({
      criteria: { request: 3.5, politeness: 2, intelligibility: 1.5, completeness: 2 },
      feedback: "Your polite request matches the card. Speak a little more clearly.",
      correction: "Können Sie bitte das Fenster öffnen?",
    });
    const result = parseA1TutorRequestScore(response, getA1TutorRequestCard("fenster"));
    expect(result).toMatchObject({
      cardId:"fenster",cardLabel:"das Fenster",score:9,maxScore:10,
      rubric:{request:3.5,politeness:2,intelligibility:1.5,completeness:2},
    });
    expect(result.correction).toContain("Fenster");
  });

  test("rejects missing and excessive marks instead of fabricating a score", () => {
    const card = getA1TutorRequestCard("stadtplan");
    expect(() => parseA1TutorRequestScore("Nice job",card)).toThrow(/structured rubric/i);
    expect(() => parseA1TutorRequestScore('{"criteria":{"request":5,"politeness":2,"intelligibility":2,"completeness":2},"feedback":"ok"}',card)).toThrow(/request score/i);
    expect(() => parseA1TutorRequestScore('{"criteria":{"request":4,"politeness":2,"intelligibility":2},"feedback":"ok"}',card)).toThrow(/completeness score/i);
    expect(() => parseA1TutorRequestScore('{"criteria":{"request":4,"politeness":2,"intelligibility":2,"completeness":2}}',card)).toThrow(/omitted feedback/i);
  });

  test("accepts fenced JSON and supplies the correct German example after marking", () => {
    const card = getA1TutorRequestCard("stadtplan");
    const result = parseA1TutorRequestScore('```json\n{"criteria":{"request":4,"politeness":2,"intelligibility":2,"completeness":2},"feedback":"Well done!"}\n```',card);
    expect(result.score).toBe(10);
    expect(result.correction).toBe(card.modelAnswer);
  });
});
