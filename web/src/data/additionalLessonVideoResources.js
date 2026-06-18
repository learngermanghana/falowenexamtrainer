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
        chapter: "9_10",
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
  },
};

export const getAdditionalLessonVideoResources = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedDay = Number(day);

  return ADDITIONAL_LESSON_VIDEO_RESOURCES[normalizedLevel]?.[normalizedDay] || [];
};
