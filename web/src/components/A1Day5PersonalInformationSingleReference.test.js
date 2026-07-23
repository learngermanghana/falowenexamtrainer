import fs from "node:fs";
import path from "node:path";

const readComponent = (name) =>
  fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A1 Day 5 personal-information reference", () => {
  test("keeps one bilingual starter block and no duplicate German-only list", () => {
    const day5Source = readComponent("A1Day5IntroducingYourselfArticlesWorkbookPage.js");
    const contributionSource = readComponent("PersonalInformationContributionBox.js");

    expect(day5Source).not.toContain("const personalInfoPrompts");
    expect((day5Source.match(/<PersonalInformationContributionBox/g) || [])).toHaveLength(1);

    expect(contributionSource).toContain("English meaning and German sentence starters");
    expect(contributionSource).toContain("Use the English meaning to understand each item, then write your answer in German.");

    [
      "Familienname",
      "Vorname",
      "Herkunft",
      "Geburtsort",
      "Adresse",
      "Postleitzahl",
      "Telefonnummer",
      "Familienstand",
      "Kinder",
      "Alter",
    ].forEach((label) => {
      expect(contributionSource).toContain(`label: \"${label}\"`);
    });
  });
});
