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
        url: "https://youtu.be/ldpOPC21nLE",
      },
    ],
  };

  a1[3] = {
    videoResources: [
      {
        key: "a1-day3-kapitel-1-2-assignment-ai-video",
        chapter: "1.2",
        title: "Kapitel 1.2 · Assignment for day 3 · AI video",
        description:
          "AI video lesson for the Day 3 Kapitel 1.2 assignment on introducing yourself.",
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

  a1[22] = {
    videoResources: [
      {
        key: "a1-day22-health-ai-video",
        chapter: "14.1",
        title: "A1 Day 22 · Health · AI video",
        description:
          "AI video lesson for health vocabulary, body parts and describing simple symptoms in German.",
        url: "https://youtu.be/U2pns6E1_yE",
      },
    ],
  };

  a1[23] = {
    videoResources: [
      {
        key: "a1-day23-dative-accusative-verbs-ai-video",
        chapter: "14.2",
        title: "A1 Day 23 · Dative and Accusative Verbs · AI video",
        description:
          "AI video lesson for recognizing dative and accusative verbs and using the correct German cases.",
        url: "https://youtu.be/V4RxPYSPwhg",
      },
    ],
  };

  a1[24] = {
    videoResources: [
      {
        key: "a1-day24-conjunctions-ai-video",
        chapter: "5.10",
        title: "A1 Day 24 · Conjunctions · AI video",
        description:
          "AI video lesson for connecting ideas with German conjunctions in short exam-ready sentences and letters.",
        url: "https://youtu.be/gprBXwwAT-o",
      },
    ],
  };

  return dictionary;
};
