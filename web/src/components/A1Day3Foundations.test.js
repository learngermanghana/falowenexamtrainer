import fs from "fs";
import path from "path";

import {
  A1_DAY3_ARTICLE_GENDER_QUESTIONS,
  A1_DAY3_W_WORD_QUESTIONS,
} from "./A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy";

describe("A1 Day 3 beginner foundations", () => {
  test("article practice stays on five singular der/die/das nouns", () => {
    expect(A1_DAY3_ARTICLE_GENDER_QUESTIONS).toEqual([
      { id: "article-1", noun: "der Tisch", correct: "masculine" },
      { id: "article-2", noun: "die Frau", correct: "feminine" },
      { id: "article-3", noun: "das Buch", correct: "neuter" },
      { id: "article-4", noun: "die Schule", correct: "feminine" },
      { id: "article-5", noun: "das Auto", correct: "neuter" },
    ]);
  });

  test("W-word practice uses answer clues and includes origin with Woher", () => {
    expect(A1_DAY3_W_WORD_QUESTIONS).toHaveLength(8);
    expect(A1_DAY3_W_WORD_QUESTIONS.map((question) => question.correct)).toEqual(
      expect.arrayContaining(["Was", "Wer", "Wie", "Wo", "Woher"])
    );
    expect(A1_DAY3_W_WORD_QUESTIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ stem: "6. ___ heißt du?", response: "Ich heiße Ama.", correct: "Wie" }),
        expect.objectContaining({ stem: "7. ___ wohnst du?", response: "Ich wohne in Accra.", correct: "Wo" }),
        expect.objectContaining({ stem: "8. ___ kommst du?", response: "Ich komme aus Ghana.", correct: "Woher" }),
      ])
    );
    expect(JSON.stringify(A1_DAY3_W_WORD_QUESTIONS)).not.toMatch(/dein Job|deine Mutter|Freund oder Freundin/i);
  });

  test("lesson source explicitly teaches the beginner sequence and defers later article forms", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy.js"),
      "utf8"
    );

    expect(source).toMatch(/plural articles\s+and indefinite articles later/i);
    expect(source).toMatch(/A noun \+.*ist.*\+ adjective can be a complete statement/i);
    expect(source).toMatch(/W-word \+ conjugated verb \+ subject \/ rest/i);
    expect(source).not.toMatch(/When you mean “a \/ an”/i);
  });
});
