const B1_RESOURCE_OVERRIDES = Object.freeze({
  1: Object.freeze({
    chapter: "1.1",
    grammarBook: "/campus/course/lesson/B1/1?view=grammar",
    workbook: "/campus/course/lesson/B1/1?view=workbook",
    aiVideo: "https://youtu.be/_mmAtSzWbNo",
  }),
  2: Object.freeze({
    chapter: "1.2",
    grammarBook: "/campus/course/lesson/B1/2?view=grammar",
    workbook: "/campus/course/lesson/B1/2?view=workbook",
    aiVideo: "https://youtu.be/Skl0FjF5JBg",
  }),
});

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export const getB1LessonResourceOverride = (day) =>
  B1_RESOURCE_OVERRIDES[Number(day)] || null;

export const applyB1LessonResourceOverride = (lesson, day = lesson?.day) => {
  if (!lesson || typeof lesson !== "object") return lesson;
  const resolvedDay = Number(day ?? lesson.day ?? lesson.assignmentDay);
  const override = getB1LessonResourceOverride(resolvedDay);
  if (!override) return lesson;

  lesson.grammarbook_link = override.grammarBook;
  lesson.grammar_link = override.grammarBook;
  lesson.grammarPage = override.grammarBook;
  lesson.workbook_link = override.workbook;
  lesson.workbookRoute = override.workbook;

  if (override.aiVideo) {
    lesson.ai_grammar_video = override.aiVideo;
    lesson.aiGrammarVideo = override.aiVideo;
  }

  const resources = [
    ...toArray(lesson.lesen_hören),
    ...toArray(lesson.schreiben_sprechen),
  ];

  resources.forEach((resource) => {
    if (!resource || typeof resource !== "object") return;
    const resourceChapter = String(resource.chapter || lesson.chapter || "").trim();
    if (resourceChapter && resourceChapter !== override.chapter) return;

    resource.grammarbook_link = override.grammarBook;
    resource.grammar_link = override.grammarBook;
    resource.grammarPage = override.grammarBook;
    resource.workbook_link = override.workbook;
    resource.workbookRoute = override.workbook;
    if (override.aiVideo) {
      resource.ai_grammar_video = override.aiVideo;
      resource.aiGrammarVideo = override.aiVideo;
    }
  });

  return lesson;
};

export const applyB1LessonVideoOverrides = (dictionary = {}) => {
  const b1 = dictionary.B1 || (dictionary.B1 = {});
  const dayOne = getB1LessonResourceOverride(1);
  const dayTwo = getB1LessonResourceOverride(2);

  b1[1] = {
    ...(b1[1] || {}),
    videoResources: [
      {
        key: "b1-day1-traumwelten-ai-grammar-video",
        chapter: dayOne.chapter,
        title: "B1 Day 1 · Traumwelten · AI grammar video",
        description:
          "AI grammar explanation for Präsens and Perfekt in the topic Traumwelten.",
        url: dayOne.aiVideo,
      },
    ],
  };

  b1[2] = {
    ...(b1[2] || {}),
    videoResources: [
      {
        key: "b1-day2-freunde-fuers-leben-ai-grammar-video",
        chapter: dayTwo.chapter,
        title: "B1 Day 2 · Freunde fürs Leben · AI grammar video",
        description:
          "AI grammar explanation for talking about friendship and past experiences.",
        url: dayTwo.aiVideo,
      },
    ],
  };

  return dictionary;
};

export const B1_LESSON_RESOURCE_OVERRIDES = B1_RESOURCE_OVERRIDES;
