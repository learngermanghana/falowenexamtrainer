import fs from "node:fs";
import path from "node:path";

describe("A1 Day 21 weather grammar", () => {
  const pagePath = path.resolve(__dirname, "../components/WeatherPerfektLetterPage.js");
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

  test("keeps A1 sentence building and does not force a weil-clause", () => {
    expect(source).toMatch(/leider · kann · ich · nicht · kommen/i);
    expect(source).toMatch(/stark · es · regnet · sehr/i);
    expect(source).toMatch(/mein · Bus · fährt · nicht/i);
    expect(source).toMatch(/wir · uns · Sonntag · treffen · können/i);
    expect(source).toMatch(/do <strong>not<\/strong> need an advanced sentence/i);
    expect(source).toMatch(/Must you use a weil-clause/i);
  });
});
