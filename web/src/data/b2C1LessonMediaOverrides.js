export const B2_C1_LESSON_VIDEO_OVERRIDES = Object.freeze({
  B2: Object.freeze({
    6: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "b2-day6-migration-integration-ai-video",
          chapter: "2.1",
          title: "B2 Day 6 · Migration und Integration · AI video",
          description:
            "AI video lesson for using obwohl, auch wenn and trotzdem when discussing migration and integration.",
          url: "https://youtu.be/BJHleTU9ycY",
        }),
      ]),
    }),
  }),
  C1: Object.freeze({
    10: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day10-passiv-modalpassiv-ai-video",
          chapter: "2.5",
          title: "C1 Day 10 · Passiv und Modalpassiv · AI video",
          description:
            "AI video lesson for using Passiv and Modalpassiv to evaluate integration and society in a differentiated way.",
          url: "https://youtu.be/y2AK9UHVKN8",
        }),
      ]),
    }),
  }),
});

export const B2_C1_LESSON_RADIO_OVERRIDES = Object.freeze({
  B2: Object.freeze({
    5: Object.freeze({
      key: "b2-day5-bildung-lernen-falowen-radio",
      title: "Bildung und Lernen 1.5",
      youtubeId: "xSrh7VYNgrM",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf das Thema Bildung und Lernen ein. Danach gehst du weiter zum Lernteil.",
    }),
  }),
});

const mergeVideoResources = (current = [], incoming = []) => {
  const incomingKeys = new Set(incoming.map((resource) => resource?.key).filter(Boolean));
  const incomingUrls = new Set(incoming.map((resource) => resource?.url).filter(Boolean));

  return [
    ...current.filter(
      (resource) =>
        !incomingKeys.has(resource?.key) && !incomingUrls.has(resource?.url),
    ),
    ...incoming,
  ];
};

export const applyB2C1LessonVideoOverrides = (dictionary = {}) => {
  Object.entries(B2_C1_LESSON_VIDEO_OVERRIDES).forEach(
    ([level, dayOverrides]) => {
      if (!dictionary[level]) dictionary[level] = {};

      Object.entries(dayOverrides).forEach(([day, override]) => {
        const current = dictionary[level][day] || {};
        const currentResources = Array.isArray(current.videoResources)
          ? current.videoResources
          : [];
        const overrideResources = Array.isArray(override.videoResources)
          ? override.videoResources
          : [];

        dictionary[level][day] = {
          ...current,
          ...override,
          videoResources: mergeVideoResources(
            currentResources,
            overrideResources,
          ),
        };
      });
    },
  );

  return dictionary;
};

export const getB2C1RadioResource = (level = "", day = 0) => {
  const normalizedLevel = String(level || "")
    .trim()
    .toUpperCase();
  return B2_C1_LESSON_RADIO_OVERRIDES[normalizedLevel]?.[Number(day)] || null;
};
