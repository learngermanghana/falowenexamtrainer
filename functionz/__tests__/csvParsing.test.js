const { splitCsvLine, parseCsv } = require("../app");

describe("splitCsvLine", () => {
  it("parses quoted fields containing commas", () => {
    const line = 'Teil,Level,"Question, Prompt",Tip';
    expect(splitCsvLine(line)).toEqual(["Teil", "Level", "Question, Prompt", "Tip"]);
  });

  it("handles escaped quotes within quoted fields", () => {
    const line = 'Title,"He said ""Hallo"" loudly",Type';
    expect(splitCsvLine(line)).toEqual(["Title", 'He said "Hallo" loudly', "Type"]);
  });

  it("preserves empty cells including trailing empties", () => {
    const line = "A,,C,";
    expect(splitCsvLine(line)).toEqual(["A", "", "C", ""]);
  });
});

describe("parseCsv", () => {
  it("aligns values to headers and fills missing cells with empty strings", () => {
    const csv = [
      'header1,header2,header3',
      'value1,"multi, part",',
      'value2,,"quoted ""value"""',
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      {
        header1: "value1",
        header2: "multi, part",
        header3: "",
      },
      {
        header1: "value2",
        header2: "",
        header3: 'quoted "value"',
      },
    ]);
  });
});
