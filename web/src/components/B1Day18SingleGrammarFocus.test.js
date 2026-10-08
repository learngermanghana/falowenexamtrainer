import fs from "fs";
import path from "path";
import { getB1GrammarEnglishSupport } from "./B1GrammarEnglishSupport";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("B1 Day 18 focuses on one grammar topic", () => {
  test("German notes teach only um ... zu and include one guided practice activity", () => {
    const notes = read("B1Day18WegeZumWunschberufGrammarNotesPage.js");
    expect(notes).toContain("Ein Grammatikfokus");
    expect(notes).toContain("Hauptsatz + um ... zu + Infinitiv");
    expect(notes).toContain("Mini-Übung");
    expect(notes).toContain("<B1GrammarEnglishSupport day={18} />");
    expect(notes).not.toMatch(/Relativsätze|Relativpronomen|je nachdem|Nebensätzen|Konjunktiv II/);
  });

  test("English explanation teaches the same purpose structure only", () => {
    const support = getB1GrammarEnglishSupport(18);
    expect(support.terms).toContain("um ... zu");
    expect(support.structure).toContain("infinitive");
    expect(support.example).toContain("um Berufserfahrung zu sammeln");
    expect(JSON.stringify(support)).not.toMatch(/relative clause|je nachdem|depending on/i);
  });

  test("interactive learning activity stays focused on purpose sentences", () => {
    const source = read("B1Days18To23LearningUpgrade.jsx");
    const day18 = source.split("  18: {")[1]?.split("  19: {")[0] || "";
    expect(day18).toContain("um ... zu");
    expect(day18).toContain("questions:");
    expect(day18).not.toMatch(/Relativsatz|je nachdem|weil\/dass\/wenn/);
  });
});
