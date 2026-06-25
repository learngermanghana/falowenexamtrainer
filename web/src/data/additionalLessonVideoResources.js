const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();

const ADDITIONAL_LESSON_VIDEO_RESOURCES = {
  A1: {
    4: [
      {
        key: "a1-day4-german-numbers-ai-video",
        chapter: "2",
        title: "Kapitel 2 · German Numbers · AI video",
        description:
          "AI-generated lesson for German numbers, pronunciation and number formation practice.",
        url: "https://youtu.be/jb2NDRJPit0",
      },
    ],
    16: [
      {
        key: "a1-day16-food-negation-daily-life-ai-video",
        chapter: "9",
        title: "A1 Day 16 · Food and Negation + Food and Daily Life · AI video",
        description:
          "AI video lesson for food vocabulary, negation and talking about food in daily life.",
        url: "https://youtu.be/AbgxP6beek4?si=PJax7B2CUyC8PiDq",
      },
    ],
    18: [
      {
        key: "a1-day18-two-way-prepositions-directions-movement-ai-video",
        chapter: "12.1",
        title: "A1 Day 18 · Two-way Prepositions + Directions and Movement · AI video",
        description:
          "AI video lesson for two-way prepositions, directions and movement in Chapter 12.1.",
        url: "https://youtu.be/khdsxaMZN-Y",
      },
    ],
    19: [
      {
        key: "a1-day19-goethe-speaking-practice-ai-video",
        chapter: "5.9",
        title: "A1 Day 19 · Goethe Speaking Practice · AI video",
        description:
          "AI video practice for Goethe A1 Sprechen Teil 1, Teil 2 and Teil 3 with model answers.",
        url: "https://youtu.be/gprnEZtMUPM",
      },
    ],
  },
  B1: {
    0: [
      {
        key: "b1-day0-orientation-video",
        chapter: "Orientation",
        title: "B1 Day 0 · Orientation video",
        description:
          "Watch this orientation video before completing the B1 Day 0 guide and knowledge test.",
        url: "https://youtu.be/Y9slpUtONkg",
      },
    ],
  },
  B2: {
    0: [
      {
        key: "b2-day0-self-learning-onboarding-video",
        chapter: "Tutorial",
        title: "B2 Day 0 · Self-learning onboarding video",
        description:
          "Watch this onboarding video before completing the B2 Day 0 self-learning orientation and readiness check.",
        url: "https://youtu.be/Y9slpUtONkg",
      },
    ],
    3: [
      {
        key: "b2-day3-kontrast-konzession-ai-grammar-video",
        chapter: "1.3",
        title: "B2 Day 3 · Kontrast und Konzession · AI grammar video",
        description:
          "Grammar video for während, wohingegen, obwohl, trotz, zwar ... aber and other contrast and concession structures.",
        url: "https://youtu.be/cmKLSjWi4S0",
      },
    ],
  },
  C1: {
    5: [
      {
        key: "c1-day5-berufliche-entwicklung-ai-video",
        chapter: "1.5",
        title: "C1 Day 5 · Berufliche Entwicklung · AI video",
        description:
          "AI video lesson about professional development, career goals, continuing education and workplace support.",
        url: "https://youtu.be/V6xRrkILD3M",
      },
    ],
  },
};

export const getAdditionalLessonVideoResources = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedDay = Number(day);

  return ADDITIONAL_LESSON_VIDEO_RESOURCES[normalizedLevel]?.[normalizedDay] || [];
};