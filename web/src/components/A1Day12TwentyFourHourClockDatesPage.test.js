import fs from "fs";
import path from "path";

const readPageSource = () =>
  fs.readFileSync(
    path.resolve(__dirname, "A1Day12TwentyFourHourClockDatesPage.js"),
    "utf8",
  );

describe("A1 Day 12 clock and dates knowledge test", () => {
  it("contains twelve balanced questions without answer placeholders", () => {
    const source = readPageSource();

    expect((source.match(/topic: "24-hour clock"/g) || [])).toHaveLength(6);
    expect((source.match(/topic: "Dates"/g) || [])).toHaveLength(6);
    expect((source.match(/id: "(?:time|date)-\d"/g) || [])).toHaveLength(12);
    expect(source).not.toContain("placeholder=");
    expect(source).toContain('data-a1-day12-knowledge-test="true"');
  });

  it("keeps the test at the bottom after the lesson summary", () => {
    const source = readPageSource();
    const summaryIndex = source.indexOf('<Section title="What to remember">');
    const testIndex = source.indexOf('<Section title="Knowledge test: 24-hour clock and dates">');

    expect(summaryIndex).toBeGreaterThan(-1);
    expect(testIndex).toBeGreaterThan(summaryIndex);
  });

  it("requires all answers and uses a nine-out-of-twelve pass mark", () => {
    const source = readPageSource();

    expect(source).toContain("const KNOWLEDGE_TEST_PASS_MARK = 9");
    expect(source).toContain("disabled={results.answered !== results.total}");
    expect(source).toContain("Check my knowledge");
    expect(source).toContain("Reset test");
  });
});
