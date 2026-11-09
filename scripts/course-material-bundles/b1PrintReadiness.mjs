// Release gate for the B1 workbook: a structurally valid PDF can still print
// opaque browser notices over questions or omit essential writing source.
export const findB1PublicationFaults = pdfText => {
  const text = String(pdfText || "").replace(/\s+/g, " ");
  const faults = [];
  const obsolete = [
    ["online answer-saving notice", /Answer directly in the workbook|Your choice is saved automatically to Submit|Click an answer option/i],
    ["interactive answer reveal", /Lösungen anzeigen/i],
    ["teacher-side writing metadata", /Students are to write an essay|Opinion Assignment/i],
    ["incorrect Goethe forum numbering", /(?:Goethe\s+)?B1 Schreiben Teil 1\s*[·:]/i],
    ["incorrect Goethe short email numbering", /Goethe B1 Schreiben Teil 2\s*[·:]/i],
  ];
  for (const [label, regex] of obsolete) if (regex.test(text)) faults.push(label);
  const expected = [
    ["Day 1 writing points", "Nennen Sie einen Vorteil persönlicher Kontakte im Traumberuf."],
    ["Day 3 writing points", "Entschuldigen Sie sich bei Frau Wolmer"],
    ["Day 6 opinion source", "Tanja sagt, dass das Leben in der Stadt für sie besser ist"],
    ["Day 20 opinion source", "Eine gute Ausbildung hilft, einen guten Job zu finden."],
    ["Goethe discussion task", "Goethe B1 Schreiben Aufgabe 2"],
    ["Goethe short email task", "Goethe B1 Schreiben Aufgabe 3"],
    ["Day 28 climate-specific task", "Klimafreundlich leben"],
    ["Day 28 climate transport task", "Busfahren und Energiesparen"],
  ];
  for (const [label, excerpt] of expected) {
    if (!text.includes(excerpt)) faults.push("missing " + label);
  }
  return faults;
};

export const assertB1PublicationReady = text => {
  const faults = findB1PublicationFaults(text);
  if (faults.length) throw new Error("B1 prepublication text audit failed: " + faults.join("; "));
};
