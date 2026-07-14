const COMBINED_DAY16_TEACHER_VIDEO_URL = "https://youtu.be/1iW2E4Pw6-M";

export const applyA1Day16LessonResourceFixes = (dictionary = {}) => {
  const day16 = dictionary?.A1?.[16];
  if (!day16) return dictionary;

  const resources = Array.isArray(day16.videoResources)
    ? day16.videoResources
    : [];

  day16.videoResources = resources.filter(
    (resource) => String(resource?.url || "").trim() !== COMBINED_DAY16_TEACHER_VIDEO_URL,
  );

  return dictionary;
};

export const __TESTING__ = {
  COMBINED_DAY16_TEACHER_VIDEO_URL,
};
