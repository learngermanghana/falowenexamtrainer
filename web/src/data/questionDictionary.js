import { CURRICULUM_BY_LEVEL } from "./curriculumManifest";

const normalizeSessions = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
};

const pickSuggestedLink = (entry) => {
  if (!entry) return null;

  const lesenHören = normalizeSessions(entry.lesen_hören);
  const lesenHörenWorkbook = lesenHören.find((item) => item?.workbook_link)?.workbook_link;
  const lesenHörenVideo = lesenHören.find((item) => item?.youtube_link)?.youtube_link;

  const schreibenSprechen = normalizeSessions(entry.schreiben_sprechen);
  const schreibenSprechenWorkbook = schreibenSprechen.find((item) => item?.workbook_link)?.workbook_link;

  return (
    schreibenSprechenWorkbook ||
    lesenHörenWorkbook ||
    lesenHörenVideo ||
    entry.tutorial_video_url ||
    null
  );
};

const formatChapterLabel = (entry) => {
  if (!entry) return null;
  if (entry.chapter) return `Kapitel ${entry.chapter}`;
  return entry.topic || null;
};

export const buildQuestionDictionaryFromCurriculum = (curriculumByLevel = CURRICULUM_BY_LEVEL) => {
  const entries = [];

  Object.entries(curriculumByLevel || {}).forEach(([level, levelEntries]) => {
    (levelEntries || []).forEach((entry, index) => {
      const chapterLabel = formatChapterLabel(entry);
      const topicTitle = entry.topic || chapterLabel || "Diskussion";
      const id = `${entry.assignment_id || `${level}-${entry.chapter || index}`}-${entry.mode || "default"}`
        .replace(/\s+/g, "-")
        .toLowerCase();

      entries.push({
        id,
        level,
        title: chapterLabel ? `${topicTitle} (${chapterLabel})` : topicTitle,
        question: entry.goal
          ? `Diskutiere zum Kursthema: ${entry.goal}`
          : `Starte eine Diskussion zu ${topicTitle}.`,
        instructions:
          (typeof entry.instruction === "string" && entry.instruction.trim()) ||
          (chapterLabel ? `Beziehe dich auf ${chapterLabel} im Kursbuch.` : "Nutze die Kursnotizen."),
        suggestedLink: pickSuggestedLink(entry),
      });
    });
  });

  return entries;
};

export const questionDictionary = buildQuestionDictionaryFromCurriculum();
