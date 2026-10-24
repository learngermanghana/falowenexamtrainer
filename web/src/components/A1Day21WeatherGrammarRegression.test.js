import fs from "node:fs";
import path from "node:path";

describe("A1 Day 21 weather grammar", () => {
  const pagePath = path.resolve(process.cwd(), "src/components/WeatherPerfektLetterPage.js");
  const source = fs.readFileSync(pagePath, "utf8");

  test("uses the three-point weather-letter progression", () => {
    expect(source).toContain('data-a1-day21-three-point-grammar="true"');
    expect(source).toMatch(/exactly three content points/i);
    expect(source).toMatch(/Say you cannot come to the wedding/i);
    expect(source).toMatch(/Give one concrete weather reason/i);
    expect(source).toMatch(/Suggest another meeting/i);
    expect(source).toMatch(/Greeting, closing and name are letter form/i);
  });

  test("does not restore the old Day 21 secondary grammar", () => {
    expect(source).not.toMatch(/Perfekt: talking about completed actions/i);
    expect(source).not.toMatch(/Perfekt: useful, but not the Day 21 core target/i);
    expect(source).not.toMatch(/im, am and um/i);
    expect(source).not.toMatch(/Use weil to explain why/i);
    expect(source).not.toMatch(/give a weather reason with <strong>weil<\/strong>/i);
  });

  test("teaches time expressions learners can use in letters", () => {
    expect(source).toMatch(/im \+ season \/ month/i);
    expect(source).toMatch(/im Sommer/i);
    expect(source).toMatch(/im Januar/i);
    expect(source).toMatch(/am \+ day \/ date/i);
    expect(source).toMatch(/am Montag/i);
    expect(source).toMatch(/um \+ clock time/i);
    expect(source).toMatch(/um 16 Uhr/i);
  });

  test("ends the grammar page after the letter-form note", () => {
    expect(source).toMatch(/Letter form is separate/i);
    expect(source).toMatch(/fourth, fifth or sixth content point/i);
    expect(source).not.toMatch(/Sentence building/i);
    expect(source).not.toMatch(/A simple complete Day 13 email/i);
    expect(source).not.toMatch(/Knowledge check/i);
    expect(source).not.toMatch(/Must you use a weil-clause/i);
  });
});
