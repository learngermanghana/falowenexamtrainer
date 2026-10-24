const manifest = require("../../data/answerKeyManifest.json");

describe("A1-3 authoritative marking manifest", () => {
  test("matches the six gern/mögen blanks in the replacement Teil 3", () => {
    const entries = Object.values(manifest).filter((entry) => entry.assignment_id === "A1-3");
    expect(entries).toHaveLength(1);
    expect(entries[0].answers.teil3).toEqual({
      Answer1: "gern",
      Answer2: "Magst",
      Answer3: "gern",
      Answer4: "mögen",
      Answer5: "gern",
      Answer6: "mag",
    });
    expect(Object.keys(entries[0].answers.teil1)).toHaveLength(4);
  });
});
