import { getCurriculumEntriesForLevel } from "./curriculumManifest";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const clean = (value = "") => String(value || "").trim();

const isTeacherResource = (resource = {}) =>
  `${resource.key || ""} ${resource.title || ""}`.toLowerCase().includes("teacher");

const normalizeExistingVideoResources = (entry = {}, day = 0) => {
  const resources = toArray(entry.videoResources || entry.video_resources || entry.videos)
    .map((resource, index) => {
      if (typeof resource === "string") {
        return {
          key: `a1-day${day}-video-${index + 1}`,
          chapter: entry.chapter || null,
          title: index === 0 ? "Teacher lecture" : "AI grammar video",
          description: "Watch this video before continuing with the grammar and workbook.",
          url: clean(resource),
        };
      }
      const url = clean(resource?.url || resource?.href || resource?.youtube_link || resource?.video);
      return url ? { ...resource, url } : null;
    })
    .filter(Boolean);

  const teacherUrl = clean(
    entry.teacher_video ||
      entry.teacherVideo ||
      entry.teacher_lecture_url ||
      entry.teacherLectureUrl ||
      entry.teacher_explanation_url ||
      entry.teacherExplanationUrl
  );
  const aiUrl = clean(
    entry.ai_grammar_video ||
      entry.aiGrammarVideo ||
      entry.ai_grammar_video_url ||
      entry.aiGrammarVideoUrl ||
      entry.ai_video ||
      entry.aiVideo
  );

  if (teacherUrl) {
    resources.push({
      key: `a1-day${day}-teacher-video`,
      chapter: entry.chapter || null,
      title: "Teacher lecture",
      description: "Recorded A1 teacher explanation for this lesson.",
      url: teacherUrl,
    });
  }
  if (aiUrl) {
    resources.push({
      key: `a1-day${day}-ai-grammar-video`,
      chapter: entry.chapter || null,
      title: "AI grammar video",
      description: "AI explanation for revision and self-study.",
      url: aiUrl,
    });
  }

  return resources;
};

const getCanonicalTeacherResourcesByDay = () => {
  const groupedByDayAndUrl = new Map();

  getCurriculumEntriesForLevel("A1")
    .filter((entry) => Number(entry?.day) > 0 && entry?.contentStatus !== "planned")
    .forEach((entry) => {
      const url = clean(entry.teacherVideo || entry.video || entry.youtube_link);
      if (!url) return;

      const day = Number(entry.day);
      const key = `${day}::${url}`;
      const current = groupedByDayAndUrl.get(key) || {
        day,
        url,
        chapters: new Set(),
        titles: new Set(),
      };
      if (clean(entry.chapter)) current.chapters.add(clean(entry.chapter));
      if (clean(entry.title || entry.topic)) current.titles.add(clean(entry.title || entry.topic));
      groupedByDayAndUrl.set(key, current);
    });

  const byDay = new Map();
  groupedByDayAndUrl.forEach(({ day, url, chapters, titles }) => {
    const chapterList = [...chapters];
    const chapter = chapterList.length === 1 ? chapterList[0] : null;
    const title = [...titles][0] || `A1 Day ${day}`;
    const resource = {
      key: `a1-day${day}-${chapter || "lesson"}-teacher-video`,
      chapter,
      title: chapter
        ? `Kapitel ${chapter} · ${title} · Teacher lecture`
        : `A1 Day ${day} · Teacher lecture`,
      description: chapter
        ? `Recorded A1 teacher explanation for Kapitel ${chapter}.`
        : "Recorded A1 teacher explanation covering this lesson.",
      url,
    };
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(resource);
  });

  return byDay;
};

const mergeUniqueResources = (...groups) => {
  const seen = new Set();
  return groups
    .flat()
    .filter(Boolean)
    .filter((resource) => {
      const url = clean(resource.url);
      if (!url || seen.has(url)) return false;
      seen.add(url);
      return true;
    })
    .sort((left, right) => Number(!isTeacherResource(left)) - Number(!isTeacherResource(right)));
};

const standardizeA1TeacherVideos = (a1 = {}) => {
  const canonicalTeachers = getCanonicalTeacherResourcesByDay();
  const days = new Set([
    ...Object.keys(a1).map(Number).filter(Number.isFinite),
    ...canonicalTeachers.keys(),
  ]);

  days.forEach((day) => {
    if (day === 0) return;
    const existing = a1[day] || {};
    const existingResources = normalizeExistingVideoResources(existing, day);
    const teacherResources = canonicalTeachers.get(day) || [];
    a1[day] = {
      ...existing,
      videoResources: mergeUniqueResources(teacherResources, existingResources),
    };
  });
};

export const applyA1LessonVideoResourceOverrides = (dictionary = {}) => {
  const a1 = dictionary.A1 || (dictionary.A1 = {});

  a1[2] = {
    videoResources: [
      {
        key: "a1-day2-kapitel-0-2-alphabet-ai-video",
        chapter: "0.2",
        title: "Kapitel 0.2 · Alphabet · AI video",
        description:
          "AI video lesson for the German alphabet, letter names, umlauts and spelling practice.",
        url: "https://youtu.be/pCQVdJGsvtk",
      },
      {
        key: "a1-day2-kapitel-1-1-pronouns-conjugation-ai-video",
        chapter: "1.1",
        title: "Kapitel 1.1 · Pronouns & Verb Conjugation · AI video",
        description:
          "AI video lesson for German subject pronouns and basic verb conjugation.",
        url: "https://youtu.be/kqagu9qsOcc",
      },
    ],
  };

  a1[3] = {
    videoResources: [
      {
        key: "a1-day3-kapitel-1-2-assignment-ai-video",
        chapter: "1.2",
        title: "Kapitel 1.2 · Assignment for day 3 · AI video",
        description:
          "AI video lesson for the Day 3 Kapitel 1.2 assignment on introducing yourself.",
        url: "https://youtu.be/LyfFDU0U_7U",
      },
    ],
  };

  // Day 4 also receives the newer "Kapitel 2 · German Numbers" resource
  // from additionalLessonVideoResources. Removing this older dictionary entry
  // prevents two different numbers videos from appearing in the lesson hub.
  a1[4] = { videoResources: [] };

  a1[5] = {
    videoResources: [
      {
        key: "a1-day5-kapitel-1-3-ai-video",
        chapter: "1.3",
        title: "A1 Day 5 · Kapitel 1.3 · AI video",
        description:
          "AI video lesson for articles, adjectives, personal information and W-questions in guided self-practice.",
        url: "https://youtu.be/z7PpiIFJCu0",
      },
    ],
  };

  a1[17] = {
    videoResources: [
      {
        key: "a1-day17-instructions-directions-ai-video",
        chapter: "11",
        title: "A1 Day 17 · Instructions and Directions · AI video",
        description:
          "AI grammar video for understanding German instructions, directions and imperative forms.",
        url: "https://youtu.be/8xybaJbs89I",
      },
    ],
  };

  a1[19] = {
    videoResources: [
      {
        key: "a1-day19-goethe-speaking-practice-ai-video",
        chapter: "13",
        title: "A1 Day 19 · Goethe A1 Speaking Practice · AI video",
        description:
          "AI-supported Goethe A1 speaking practice for preparing short, clear exam answers.",
        url: "https://youtu.be/gprnEZtMUPM",
      },
    ],
  };

  a1[21] = {
    videoResources: [
      {
        key: "a1-day21-weather-ai-video",
        chapter: "13",
        title: "A1 Day 21 · Weather · AI video",
        description:
          "AI video lesson for describing the weather and answering simple weather questions in German.",
        url: "https://youtu.be/fRYM7ojc0Yo",
      },
    ],
  };

  a1[22] = {
    videoResources: [
      {
        key: "a1-day22-health-ai-video",
        chapter: "14.1",
        title: "A1 Day 22 · Health · AI video",
        description:
          "AI video lesson for health vocabulary, body parts and describing simple symptoms in German.",
        url: "https://youtu.be/U2pns6E1_yE",
      },
    ],
  };

  a1[23] = {
    videoResources: [
      {
        key: "a1-day23-dative-accusative-verbs-ai-video",
        chapter: "14.2",
        title: "A1 Day 23 · Dative and Accusative Verbs · AI video",
        description:
          "AI video lesson for recognizing dative and accusative verbs and using the correct German cases.",
        url: "https://youtu.be/V4RxPYSPwhg",
      },
    ],
  };

  a1[24] = {
    videoResources: [
      {
        key: "a1-day24-conjunctions-ai-video",
        chapter: "5.10",
        title: "A1 Day 24 · Conjunctions · AI video",
        description:
          "AI video lesson for connecting ideas with German conjunctions in short exam-ready sentences and letters.",
        url: "https://youtu.be/gprBXwwAT-o",
      },
    ],
  };

  standardizeA1TeacherVideos(a1);
  return dictionary;
};

export const __TESTING__ = {
  getCanonicalTeacherResourcesByDay,
  mergeUniqueResources,
  normalizeExistingVideoResources,
  standardizeA1TeacherVideos,
};
