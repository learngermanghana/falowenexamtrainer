import {
  applyLiveWritingSuggestion,
  findLiveGermanWritingIssues,
} from "./liveGermanWritingChecks";

describe("live German writing checks", () => {
  test("finds lowercase sentence starts and common German nouns", () => {
    const issues = findLiveGermanWritingIssues("ich suche eine wohnung.");
    expect(issues.map(({ word, suggestion }) => [word, suggestion])).toEqual([
      ["ich", "Ich"],
      ["wohnung", "Wohnung"],
    ]);
  });

  test("suggests a definite adjective ending", () => {
    const issues = findLiveGermanWritingIssues("Das ist der schön Mann.");
    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "adjective-ending", word: "schön", suggestion: "schöne" }),
    ]));
  });

  test("waits until the current word is completed", () => {
    expect(findLiveGermanWritingIssues("Ich suche eine wohnung")).toEqual([]);
    expect(findLiveGermanWritingIssues("Ich suche eine wohnung ")).toHaveLength(1);
  });

  test("applies a suggestion without changing surrounding text", () => {
    const text = "Ich suche eine wohnung.";
    const [issue] = findLiveGermanWritingIssues(text);
    expect(applyLiveWritingSuggestion(text, issue)).toBe("Ich suche eine Wohnung.");
  });
});
