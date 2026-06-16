const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();

export const getAdditionalLessonVideoResources = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedDay = Number(day);

  if (normalizedLevel === "A1" && normalizedDay === 4) {
    return [
      {
        key: "a1-day4-german-numbers-ai-video",
        chapter: "2",
        title: "Kapitel 2 · German Numbers · AI video",
        description:
          "AI-generated lesson for German numbers, pronunciation and number formation practice.",
        url: "https://youtu.be/jb2NDRJPit0",
      },
    ];
  }

  return [];
};
