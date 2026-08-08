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
    1: [
      {
        chapter: "1.1",
        topic: "A2 Day 1",
        url: "https://youtu.be/70AgN5VKeqc",
      },
    ],
    2: [
      {
        chapter: "1.2",
        topic: "Personen beschreiben",
        url: "https://youtu.be/iB-yVVqI1DQ",
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
  B1: {},
};

const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();
const clean = (value = "") => String(value || "").trim();
const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export const getTeacherLectureVideoResources = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const dayNumber = Number(day || 0);
  const entries = toArray(TEACHER_LECTURE_VIDEO_ENTRIES[normalizedLevel]?.[dayNumber]);

  return entries
    .map((entry, index) => {
      const url = clean(entry.url || entry.href || entry.youtube_link || entry.video);
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