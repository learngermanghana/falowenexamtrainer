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

  a1[19] = {
    videoResources: [
      {
        key: "a1-day19-goethe-speaking-practice-ai-video",
        chapter: "13",
        title: "A1 Day 19 · Goethe A1 Speaking Practice · AI video",
        description:
          "AI-supported Goethe A1 speaking practice for preparing short, clear exam answers.",
        url: "https://youtu.be/gprnEZtMUPM",
      },
    ],
  };

  a1[21] = {
    videoResources: [
      {
        key: "a1-day21-weather-ai-video",
        chapter: "14",
        title: "A1 Day 21 · Weather · AI video",
        description:
          "AI video lesson for describing the weather and answering simple weather questions in German.",
        url: "https://youtu.be/fRYM7ojc0Yo",
      },
    ],
  };

  return dictionary;
};
