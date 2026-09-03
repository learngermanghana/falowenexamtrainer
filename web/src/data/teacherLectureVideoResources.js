const TEACHER_LECTURE_VIDEO_ENTRIES = {
  // A1 teacher lecture videos are already managed in a1TeacherVideoResources.js.
  // Add future A2/B1 teacher lecture videos here.
  // Format:
  // LEVEL: {
  //   DAY_NUMBER: [
  //     { chapter: "chapter", topic: "Lesson title", url: "https://youtu.be/..." },
  //   ],
  // },
  A2: {
    2: [
      {
        chapter: "1.2",
        topic: "Personen beschreiben",
        url: "https://youtu.be/iB-yVVqI1DQ",
      },
    ],
    3: [
      {
        chapter: "1.3",
        topic: "A2 Day 3",
        url: "https://youtu.be/Sc6TPEyyzA0",
      },
    ],
    5: [
      {
        chapter: "1.5",
        topic: "A2 Day 5",
        url: "https://youtu.be/0ZddddnHvuI",
      },
    ],
    6: [
      {
        chapter: "3.6",
        topic: "Möbel und Räume kennenlernen",
        url: "https://youtu.be/eBs5Xrpc_nQ",
      },
    ],
    8: [
      {
        chapter: "3.8",
        topic: "Rezepte und Essen",
        url: "https://youtu.be/diUTkWdqT_0",
      },
    ],
    9: [
      {
        chapter: "4.9",
        topic: "Urlaub",
        url: "https://youtu.be/iKKyQRbuc-8",
      },
    ],
    14: [
      {
        chapter: "5.14",
        topic: "Beruf und Karriere",
        tutor_lecture_video: "https://youtu.be/hGK64aXtARk",
      },
    ],
    16: [
      {
        chapter: "6.16",
        topic: "Wohlbefinden und Entspannung",
        url: "https://youtu.be/t_9HDdZbbEA",
      },
    ],
  },
  B1: {
    2: [
      {
        chapter: "1.2",
        topic: "Freunde fürs Leben",
        url: "https://youtu.be/Br-ISFAAfoI",
      },
    ],
    3: [
      {
        chapter: "1.3",
        topic: "Erfolgsgeschichten",
        url: "https://youtu.be/qosa1oXKZE4",
      },
    ],
    4: [
      {
        chapter: "2.4",
        topic: "Wohnung suchen",
        url: "https://youtu.be/FiC2obM4qHU",
      },
    ],
    5: [
      {
        chapter: "2.5",
        topic: "Der Besichtigungstermin",
        url: "https://youtu.be/OJmM8BUTN3k",
      },
    ],
    6: [
      {
        chapter: "2.6",
        topic: "Leben in der Stadt oder auf dem Land?",
        url: "https://youtu.be/7e6yi6_OM2c",
      },
    ],
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
