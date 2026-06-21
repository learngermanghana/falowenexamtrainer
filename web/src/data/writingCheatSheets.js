export const C1_WRITING_CHEAT_SHEET = [
  {
    id: "recommended-linking-expressions",
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
    id: "useful-verbs-and-phrases",
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

export const getWritingCheatSheet = (level, day) => {
  const normalizedLevel = String(level || "").toUpperCase();
  const normalizedDay = Number(day);

  if (normalizedLevel === "C1" && normalizedDay >= 1 && normalizedDay <= 28) {
    return C1_WRITING_CHEAT_SHEET;
  }

  return [];
};
