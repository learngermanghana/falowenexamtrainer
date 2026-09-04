// Teacher/tutor lecture registry for A2, B1, B2 and C1.
//
// Every level has a ready-made Day 1–28 slot. To add a lecture, replace only
// the empty tutor_lecture_video string for that day with the YouTube URL.
// Empty slots are ignored by the app and do not render empty cards.
//
// A1 remains in web/src/data/a1TeacherVideoResources.js because A1 can have
// multiple teacher videos for the same day/chapter.

const TEACHER_LECTURE_VIDEO_ENTRIES = {
  A2: {
    1: [{ chapter: "1.1", tutor_lecture_video: "" }],
    2: [{ chapter: "1.2", topic: "Personen beschreiben", tutor_lecture_video: "https://youtu.be/iB-yVVqI1DQ" }],
    3: [{ chapter: "1.3", topic: "A2 Day 3", tutor_lecture_video: "https://youtu.be/Sc6TPEyyzA0" }],
    4: [{ chapter: "2.4", tutor_lecture_video: "" }],
    5: [{ chapter: "2.5", topic: "A2 Day 5", tutor_lecture_video: "https://youtu.be/0ZddddnHvuI" }],
    6: [{ chapter: "3.6", topic: "Möbel und Räume kennenlernen", tutor_lecture_video: "https://youtu.be/eBs5Xrpc_nQ" }],
    7: [{ chapter: "3.7", tutor_lecture_video: "" }],
    8: [{ chapter: "3.8", topic: "Rezepte und Essen", tutor_lecture_video: "https://youtu.be/diUTkWdqT_0" }],
    9: [{ chapter: "4.9", topic: "Urlaub", tutor_lecture_video: "https://youtu.be/iKKyQRbuc-8" }],
    10: [{ chapter: "4.10", tutor_lecture_video: "" }],
    11: [{ chapter: "4.11", tutor_lecture_video: "" }],
    12: [{ chapter: "5.12", tutor_lecture_video: "" }],
    13: [{ chapter: "5.13", tutor_lecture_video: "" }],
    14: [{ chapter: "5.14", topic: "Beruf und Karriere", tutor_lecture_video: "https://youtu.be/hGK64aXtARk" }],
    15: [{ chapter: "6.15", tutor_lecture_video: "" }],
    16: [{ chapter: "6.16", topic: "Wohlbefinden und Entspannung", tutor_lecture_video: "https://youtu.be/t_9HDdZbbEA" }],
    17: [{ chapter: "6.17", tutor_lecture_video: "" }],
    18: [{ chapter: "7.18", tutor_lecture_video: "" }],
    19: [{ chapter: "7.19", tutor_lecture_video: "" }],
    20: [{ chapter: "7.20", tutor_lecture_video: "" }],
    21: [{ chapter: "8.21", tutor_lecture_video: "" }],
    22: [{ chapter: "8.22", tutor_lecture_video: "" }],
    23: [{ chapter: "9.23", tutor_lecture_video: "" }],
    24: [{ chapter: "9.24", tutor_lecture_video: "" }],
    25: [{ chapter: "9.25", tutor_lecture_video: "" }],
    26: [{ chapter: "10.26", tutor_lecture_video: "" }],
    27: [{ chapter: "10.27", tutor_lecture_video: "" }],
    28: [{ chapter: "10.28", tutor_lecture_video: "" }],
  },
  B1: {
    1: [{ chapter: "1.1", tutor_lecture_video: "" }],
    2: [{ chapter: "1.2", topic: "Freunde fürs Leben", tutor_lecture_video: "https://youtu.be/Br-ISFAAfoI" }],
    3: [{ chapter: "1.3", topic: "Erfolgsgeschichten", tutor_lecture_video: "https://youtu.be/qosa1oXKZE4" }],
    4: [{ chapter: "2.4", topic: "Wohnung suchen", tutor_lecture_video: "https://youtu.be/FiC2obM4qHU" }],
    5: [{ chapter: "2.5", topic: "Der Besichtigungstermin", tutor_lecture_video: "https://youtu.be/OJmM8BUTN3k" }],
    6: [{ chapter: "2.6", topic: "Leben in der Stadt oder auf dem Land?", tutor_lecture_video: "https://youtu.be/7e6yi6_OM2c" }],
    7: [{ chapter: "3.7", tutor_lecture_video: "" }],
    8: [{ chapter: "3.8", topic: "B1 Day 8", tutor_lecture_video: "https://youtu.be/GuQcUitfvQA" }],
    9: [{ chapter: "3.9", tutor_lecture_video: "" }],
    10: [{ chapter: "4.10", tutor_lecture_video: "" }],
    11: [{ chapter: "4.11", tutor_lecture_video: "" }],
    12: [{ chapter: "4.12", tutor_lecture_video: "" }],
    13: [{ chapter: "4.13", tutor_lecture_video: "" }],
    14: [{ chapter: "5.14", tutor_lecture_video: "" }],
    15: [{ chapter: "5.15", tutor_lecture_video: "" }],
    16: [{ chapter: "5.16", tutor_lecture_video: "" }],
    17: [{ chapter: "5.17", tutor_lecture_video: "" }],
    18: [{ chapter: "6.18", tutor_lecture_video: "" }],
    19: [{ chapter: "6.19", tutor_lecture_video: "" }],
    20: [{ chapter: "6.20", tutor_lecture_video: "" }],
    21: [{ chapter: "7.21", tutor_lecture_video: "" }],
    22: [{ chapter: "7.22", tutor_lecture_video: "" }],
    23: [{ chapter: "7.23", tutor_lecture_video: "" }],
    24: [{ chapter: "8.24", tutor_lecture_video: "" }],
    25: [{ chapter: "8.25", tutor_lecture_video: "" }],
    26: [{ chapter: "9.26", tutor_lecture_video: "" }],
    27: [{ chapter: "10.27", tutor_lecture_video: "" }],
    28: [{ chapter: "10.28", tutor_lecture_video: "" }],
  },
  B2: {
    1: [{ chapter: "1.1", tutor_lecture_video: "" }],
    2: [{ chapter: "1.2", tutor_lecture_video: "" }],
    3: [{ chapter: "1.3", tutor_lecture_video: "" }],
    4: [{ chapter: "1.4", tutor_lecture_video: "" }],
    5: [{ chapter: "1.5", tutor_lecture_video: "" }],
    6: [{ chapter: "2.1", tutor_lecture_video: "" }],
    7: [{ chapter: "2.2", tutor_lecture_video: "" }],
    8: [{ chapter: "2.3", tutor_lecture_video: "" }],
    9: [{ chapter: "2.4", tutor_lecture_video: "" }],
    10: [{ chapter: "2.5", tutor_lecture_video: "" }],
    11: [{ chapter: "3.1", tutor_lecture_video: "" }],
    12: [{ chapter: "3.2", tutor_lecture_video: "" }],
    13: [{ chapter: "3.3", tutor_lecture_video: "" }],
    14: [{ chapter: "3.4", tutor_lecture_video: "" }],
    15: [{ chapter: "3.5", tutor_lecture_video: "" }],
    16: [{ chapter: "4.1", tutor_lecture_video: "" }],
    17: [{ chapter: "4.2", tutor_lecture_video: "" }],
    18: [{ chapter: "4.3", tutor_lecture_video: "" }],
    19: [{ chapter: "4.4", tutor_lecture_video: "" }],
    20: [{ chapter: "4.5", tutor_lecture_video: "" }],
    21: [{ chapter: "5.1", tutor_lecture_video: "" }],
    22: [{ chapter: "5.2", tutor_lecture_video: "" }],
    23: [{ chapter: "5.3", tutor_lecture_video: "" }],
    24: [{ chapter: "5.4", tutor_lecture_video: "" }],
    25: [{ chapter: "5.5", tutor_lecture_video: "" }],
    26: [{ chapter: "6.1", tutor_lecture_video: "" }],
    27: [{ chapter: "6.2", tutor_lecture_video: "" }],
    28: [{ chapter: "6.3", tutor_lecture_video: "" }],
  },
  C1: {
    1: [{ chapter: "1.1", tutor_lecture_video: "" }],
    2: [{ chapter: "1.2", tutor_lecture_video: "" }],
    3: [{ chapter: "1.3", tutor_lecture_video: "" }],
    4: [{ chapter: "1.4", tutor_lecture_video: "" }],
    5: [{ chapter: "1.5", tutor_lecture_video: "" }],
    6: [{ chapter: "2.1", tutor_lecture_video: "" }],
    7: [{ chapter: "2.2", tutor_lecture_video: "" }],
    8: [{ chapter: "2.3", tutor_lecture_video: "" }],
    9: [{ chapter: "2.4", tutor_lecture_video: "" }],
    10: [{ chapter: "2.5", tutor_lecture_video: "" }],
    11: [{ chapter: "3.1", tutor_lecture_video: "" }],
    12: [{ chapter: "3.2", tutor_lecture_video: "" }],
    13: [{ chapter: "3.3", tutor_lecture_video: "" }],
    14: [{ chapter: "3.4", tutor_lecture_video: "" }],
    15: [{ chapter: "3.5", tutor_lecture_video: "" }],
    16: [{ chapter: "4.1", tutor_lecture_video: "" }],
    17: [{ chapter: "4.2", tutor_lecture_video: "" }],
    18: [{ chapter: "4.3", tutor_lecture_video: "" }],
    19: [{ chapter: "4.4", tutor_lecture_video: "" }],
    20: [{ chapter: "4.5", tutor_lecture_video: "" }],
    21: [{ chapter: "5.1", tutor_lecture_video: "" }],
    22: [{ chapter: "5.2", tutor_lecture_video: "" }],
    23: [{ chapter: "5.3", tutor_lecture_video: "" }],
    24: [{ chapter: "5.4", tutor_lecture_video: "" }],
    25: [{ chapter: "5.5", tutor_lecture_video: "" }],
    26: [{ chapter: "6.1", tutor_lecture_video: "" }],
    27: [{ chapter: "6.2", tutor_lecture_video: "" }],
    28: [{ chapter: "6.3", tutor_lecture_video: "" }],
  },
};

const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();
const clean = (value = "") => String(value || "").trim();
const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const teacherLectureUrl = (entry = {}) =>
  clean(
    entry.url ||
      entry.href ||
      entry.youtube_link ||
      entry.video ||
      entry.tutor_lecture_video ||
      entry.tutorLectureVideo ||
      entry.tutor_lecture_video_url ||
      entry.tutorLectureVideoUrl ||
      entry.tutor_lecture_url ||
      entry.tutorLectureUrl ||
      entry.teacher_video ||
      entry.teacherVideo ||
      entry.teacher_lecture_url ||
      entry.teacherLectureUrl,
  );

export const getTeacherLectureVideoResources = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const dayNumber = Number(day || 0);
  const entries = toArray(TEACHER_LECTURE_VIDEO_ENTRIES[normalizedLevel]?.[dayNumber]);

  return entries
    .map((entry, index) => {
      const url = teacherLectureUrl(entry);
      if (!url) return null;
      const chapter = clean(entry.chapter);
      const topic = clean(entry.topic || entry.title) || `${normalizedLevel} Day ${dayNumber}`;

      return {
        key: `${normalizedLevel.toLowerCase()}-day${dayNumber}-${chapter || index + 1}-teacher-lecture-video`,
        chapter: chapter || null,
        title: chapter ? `Kapitel ${chapter} · Teacher lecture video` : "Teacher lecture video",
        description: `Recorded tutor lecture for ${topic}.`,
        url,
      };
    })
    .filter(Boolean);
};

export const hasTeacherLectureVideoResources = (level, day) =>
  getTeacherLectureVideoResources(level, day).length > 0;

export const TEACHER_LECTURE_VIDEO_RESOURCES = TEACHER_LECTURE_VIDEO_ENTRIES;
