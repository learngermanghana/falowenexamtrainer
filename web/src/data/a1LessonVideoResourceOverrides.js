export const applyA1LessonVideoResourceOverrides = (dictionary = {}) => {
  const a1 = dictionary.A1 || (dictionary.A1 = {});

  a1[2] = {
    videoResources: [
      {
        key: "a1-day2-kapitel-0-2-alphabet-ai-video",
        chapter: "0.2",
        title: "Kapitel 0.2 · Alphabet · AI video",
        description:
          "AI video lesson for the German alphabet, letter names, umlauts and spelling practice.",
        url: "https://youtu.be/pCQVdJGsvtk",
      },
      {
        key: "a1-day2-kapitel-1-1-pronouns-conjugation-ai-video",
        chapter: "1.1",
        title: "Kapitel 1.1 · Pronouns & Verb Conjugation · AI video",
        description:
          "AI video lesson for German subject pronouns and basic verb conjugation.",
        url: "https://youtu.be/LyfFDU0U_7U",
      },
    ],
  };

  // Day 4 also receives the newer "Kapitel 2 · German Numbers" resource
  // from additionalLessonVideoResources. Removing this older dictionary entry
  // prevents two different numbers videos from appearing in the lesson hub.
  a1[4] = { videoResources: [] };

  return dictionary;
};
