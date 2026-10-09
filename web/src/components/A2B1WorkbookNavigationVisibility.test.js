import fs from "fs";
import path from "path";

const read = (file) => fs.readFileSync(path.resolve(__dirname, file), "utf8");

describe("A2/B1 workbook sticky navigation and speaking containment", () => {
  it("keeps shared A2/B1 navigation sticky while scrolling", () => {
    const source = read("StandardWorkbookComponents.js");
    expect(source).toContain('position: legacyGrammarContext ? "sticky" : "relative"');
    expect(source).toContain('top: legacyGrammarContext ? 0 : undefined');
  });
  it("hides speaking chat outside Teil 1 including Lesen and Schreiben", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "../../public/course-speaking-chat-cleanup.js"), "utf8");
    expect(source).toContain("isSpeakingViewInactive");
    expect(source).toContain('["sprechen", "teil1", "workbook", "radio"]');
    expect(source).toContain("selectedTabs.length");
    expect(source).toContain("if (isSpeakingViewInactive()) return hideA2B1GrammarSpeakingChat()");
  });
});
