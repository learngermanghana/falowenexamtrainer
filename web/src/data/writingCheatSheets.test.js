import { A2_WRITING_CHEAT_SHEET, B1_WRITING_CHEAT_SHEET, B2_WRITING_CHEAT_SHEET, C1_WRITING_CHEAT_SHEET, getWritingCheatSheet } from "./writingCheatSheets";

const requiredSections = [
  {
    title: "Recommended linking expressions",
    items: [
      { phrase: "nicht nur …, sondern auch", meaning: "not only … but also" },
      { phrase: "aus diesem Grund", meaning: "for this reason" },
      { phrase: "darüber hinaus", meaning: "furthermore / beyond that" },
      { phrase: "insbesondere", meaning: "in particular / especially" },
      { phrase: "einerseits …, andererseits", meaning: "on the one hand … on the other hand" },
      { phrase: "zwar …, aber", meaning: "admittedly … but / although … but" },
      { phrase: "dennoch", meaning: "nevertheless / nonetheless" },
      { phrase: "folglich", meaning: "consequently / therefore" },
      { phrase: "insofern …, als", meaning: "insofar as" },
      { phrase: "sofern", meaning: "provided that / as long as" },
      { phrase: "während", meaning: "whereas / while" },
      { phrase: "indem", meaning: "by / by means of" },
      { phrase: "je …, desto / umso", meaning: "the … the" },
    ],
  },
  {
    title: "Useful verbs and phrases",
    items: [
      { phrase: "etwas verbessern", meaning: "to improve something" },
      { phrase: "etwas fördern", meaning: "to promote / support something" },
      { phrase: "etwas stärken", meaning: "to strengthen something" },
      { phrase: "etwas beeinträchtigen", meaning: "to impair / negatively affect something" },
      { phrase: "etwas schädigen", meaning: "to damage / harm something" },
      { phrase: "zu etwas führen", meaning: "to lead to something" },
      { phrase: "etwas verursachen", meaning: "to cause something" },
      { phrase: "etwas bewirken", meaning: "to bring about / produce an effect" },
      { phrase: "etwas ermöglichen", meaning: "to enable something" },
      { phrase: "etwas verhindern", meaning: "to prevent something" },
      { phrase: "etwas verringern / reduzieren", meaning: "to reduce something" },
      { phrase: "einer Entwicklung entgegenwirken", meaning: "to counteract a development" },
      { phrase: "Maßnahmen ergreifen", meaning: "to take measures / take action" },
      { phrase: "etwas durchführen", meaning: "to carry out / conduct something" },
      { phrase: "etwas umsetzen", meaning: "to implement / put something into practice" },
      { phrase: "einen Beitrag leisten", meaning: "to make a contribution" },
      { phrase: "sich positiv auf etwas auswirken", meaning: "to have a positive effect on something" },
      { phrase: "sich negativ auf etwas auswirken", meaning: "to have a negative effect on something" },
    ],
  },
];

test("C1_WRITING_CHEAT_SHEET contains the two required general sections", () => {
  expect(C1_WRITING_CHEAT_SHEET.map((section) => section.title)).toEqual(requiredSections.map((section) => section.title));
  expect(C1_WRITING_CHEAT_SHEET).toHaveLength(2);
});

test("C1_WRITING_CHEAT_SHEET contains every required phrase and meaning", () => {
  requiredSections.forEach((section, index) => {
    expect(C1_WRITING_CHEAT_SHEET[index].items).toEqual(section.items);
  });
});

test("C1_WRITING_CHEAT_SHEET has no duplicate phrases and includes indem exactly once", () => {
  const phrases = C1_WRITING_CHEAT_SHEET.flatMap((section) => section.items.map((item) => item.phrase));

  expect(new Set(phrases).size).toBe(phrases.length);
  expect(phrases.filter((phrase) => phrase === "indem")).toHaveLength(1);
});

test("getWritingCheatSheet returns the C1 sheet for days 1 through 28 only", () => {
  for (let day = 1; day <= 28; day += 1) {
    expect(getWritingCheatSheet("C1", day)).toBe(C1_WRITING_CHEAT_SHEET);
  }

  expect(getWritingCheatSheet("C1", 0)).toEqual([]);
  expect(getWritingCheatSheet("C1", 29)).toEqual([]);
});

test("getWritingCheatSheet returns level-specific A2, B1, B2, and C1 sheets for days 1 through 28", () => {
  const expectedByLevel = {
    A2: A2_WRITING_CHEAT_SHEET,
    B1: B1_WRITING_CHEAT_SHEET,
    B2: B2_WRITING_CHEAT_SHEET,
    C1: C1_WRITING_CHEAT_SHEET,
  };

  Object.entries(expectedByLevel).forEach(([level, expectedSheet]) => {
    for (let day = 1; day <= 28; day += 1) {
      expect(getWritingCheatSheet(level, day)).toBe(expectedSheet);
    }

    expect(getWritingCheatSheet(level, 0)).toEqual([]);
    expect(getWritingCheatSheet(level, 29)).toEqual([]);
  });
});

test("lower levels use separate cheat sheet arrays", () => {
  expect(A2_WRITING_CHEAT_SHEET).not.toBe(B1_WRITING_CHEAT_SHEET);
  expect(B1_WRITING_CHEAT_SHEET).not.toBe(B2_WRITING_CHEAT_SHEET);
  expect(B2_WRITING_CHEAT_SHEET).not.toBe(C1_WRITING_CHEAT_SHEET);
  expect(A2_WRITING_CHEAT_SHEET[0].title).toBe("A2 basic connectors");
  expect(B1_WRITING_CHEAT_SHEET[0].title).toBe("B1 connectors");
  expect(B2_WRITING_CHEAT_SHEET[0].title).toBe("B2 argument linkers");
});

test("B1 cheat sheet includes the corrected opinion text template", () => {
  const template = B1_WRITING_CHEAT_SHEET.find(
    (section) => section.id === "b1-opinion-text-template",
  );
  const templateText = template.items.map((item) => item.meaning).join(" ");

  expect(template).toEqual(expect.objectContaining({ layout: "template" }));
  expect(templateText).toContain(
    "Heutzutage ist das Thema [Thema] ein sehr wichtiges Thema in unserem Leben.",
  );
  expect(templateText).toContain(
    "[Thema] unser Leben positiv oder negativ beeinflussen kann.",
  );
  expect(templateText).toContain("Mit freundlichen Grüßen");
});

test("B2 cheat sheet upgrades the opinion template with B2 vocabulary", () => {
  const template = B2_WRITING_CHEAT_SHEET.find(
    (section) => section.id === "b2-opinion-text-template",
  );
  const templateText = template.items.map((item) => item.meaning).join(" ");

  expect(template).toEqual(expect.objectContaining({ layout: "template" }));
  expect(templateText).toContain("gewinnt heutzutage zunehmend an Bedeutung");
  expect(templateText).toContain("darf nicht außer Acht gelassen werden");
  expect(templateText).toContain("Unter Abwägung beider Seiten");
  expect(templateText).toContain("zu einem differenzierten Verständnis");
});

test("getWritingCheatSheet returns no sheet for unsupported levels", () => {
  ["A1", "C2", ""].forEach((level) => {
    expect(getWritingCheatSheet(level, 3)).toEqual([]);
  });
});