import { C1_DAY3_WRITING_CHEAT_SHEET } from "./CompactC1LessonPage";

test("C1 Day 3 writing cheat sheet is grouped into recommended links and useful C1 phrases", () => {
  expect(C1_DAY3_WRITING_CHEAT_SHEET.map((section) => section.title)).toEqual([
    "Recommended linking expressions",
    "Useful verbs and phrases",
  ]);

  expect(C1_DAY3_WRITING_CHEAT_SHEET[0].items).toEqual([
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
  ]);

  expect(C1_DAY3_WRITING_CHEAT_SHEET[1].items).toContainEqual({
    phrase: "Maßnahmen ergreifen",
    meaning: "to take measures / take action",
  });
  expect(C1_DAY3_WRITING_CHEAT_SHEET[1].items).toContainEqual({
    phrase: "etwas durchführen",
    meaning: "to carry out / conduct something",
  });
  expect(C1_DAY3_WRITING_CHEAT_SHEET[1].items).toContainEqual({
    phrase: "etwas umsetzen",
    meaning: "to implement / put something into practice",
  });
});

test("C1 Day 3 writing cheat sheet does not duplicate expressions or teach machen as the primary C1 writing verb", () => {
  const phrases = C1_DAY3_WRITING_CHEAT_SHEET.flatMap((section) => section.items.map((item) => item.phrase));

  expect(new Set(phrases).size).toBe(phrases.length);
  expect(phrases.filter((phrase) => phrase === "indem")).toHaveLength(1);
  expect(phrases).not.toContain("machen");
});
