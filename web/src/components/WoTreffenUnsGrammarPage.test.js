import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 4 Wo/Wohin article teaching", () => {
  const grammarPage = read("./WoTreffenUnsGrammarPage.js");
  const thinkingSupport = read("./A2Days2To6ThinkingSupport.js");

  test("teaches full article forms before contractions", () => {
    [
      "in dem Café → im Café",
      "in das Café → ins Café",
      "an dem Meer → am Meer",
      "an das Meer → ans Meer",
    ].forEach((marker) => expect(grammarPage).toContain(marker));
  });

  test("shows the complete Dativ and Akkusativ article changes", () => {
    expect(grammarPage).toContain('["der", "dem", "den"]');
    expect(grammarPage).toContain('["die", "der", "die"]');
    expect(grammarPage).toContain('["das", "dem", "das"]');
    expect(grammarPage).toContain('["die (Plural)", "den (+n)", "die"]');
  });

  test("explains why See uses an den while Meer can use ans", () => {
    expect(grammarPage).toContain('Why “am See” but not “ans See”?');
    expect(grammarPage).toContain("<strong>der See</strong> is masculine");
    expect(grammarPage).toContain("<strong>das Meer</strong> is neuter");
  });

  test("thinking guide follows noun article to case to full form to contraction", () => {
    expect(thinkingSupport).toContain("Find the noun and its basic article");
    expect(thinkingSupport).toContain("Choose the full article first");
    expect(thinkingSupport).toContain("in dem → im, in das → ins, an dem → am, an das → ans");
  });
});
