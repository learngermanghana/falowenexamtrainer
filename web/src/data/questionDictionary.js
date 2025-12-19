import { courseSchedules } from "./courseSchedule";

const normalizeSessions = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
};

const pickSuggestedLink = (session) => {
  if (!session) return null;

  const lesenHören = normalizeSessions(session.lesen_hören);
  const lesenHörenWorkbook = lesenHören.find((item) => item?.workbook_link)?.workbook_link;
  const lesenHörenVideo = lesenHören.find((item) => item?.youtube_link)?.youtube_link;

  const schreibenSprechen = normalizeSessions(session.schreiben_sprechen);
  const schreibenSprechenWorkbook = schreibenSprechen.find((item) => item?.workbook_link)?.workbook_link;

  return (
    lesenHörenWorkbook || schreibenSprechenWorkbook || lesenHörenVideo || session.tutorial_video_url || null
  );
};

const formatChapterLabel = (session) => {
  if (!session) return null;
  if (session.chapter) return `Kapitel ${session.chapter}`;
  return session.topic || null;
};

export const buildQuestionDictionaryFromSchedule = (schedules = courseSchedules) => {
  const entries = [];

  Object.entries(schedules || {}).forEach(([level, sessions]) => {
    (sessions || []).forEach((session) => {
      const baseId = `${level}-tag${session.day ?? "x"}-${
        session.chapter || session.topic || "frage"
      }`
        .replace(/\s+/g, "-")
        .toLowerCase();

      const chapterLabel = formatChapterLabel(session);
      const topicTitle = session.topic || chapterLabel || "Diskussion";
      const instructions =
        (typeof session.instruction === "string" && session.instruction.trim()) ||
        (chapterLabel ? `Beziehe dich auf ${chapterLabel} im Kursbuch.` : "Nutze die Kursnotizen.");

      entries.push({
        id: baseId,
        level,
        title: chapterLabel ? `${topicTitle} (${chapterLabel})` : topicTitle,
        question: session.goal
          ? `Diskutiere zum Kursthema: ${session.goal}`
          : `Starte eine Diskussion zu ${topicTitle}.`,
        instructions,
        suggestedLink: pickSuggestedLink(session),
      });
    });
  });

  return entries;
};

export const questionDictionary = buildQuestionDictionaryFromSchedule();
