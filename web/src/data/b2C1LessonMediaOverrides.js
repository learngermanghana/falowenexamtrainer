export const B2_C1_LESSON_VIDEO_OVERRIDES = Object.freeze({
  B2: Object.freeze({}),
  C1: Object.freeze({}),
});

export const B2_C1_LESSON_RADIO_OVERRIDES = Object.freeze({
  B2: Object.freeze({}),
  C1: Object.freeze({}),
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
