const normalizeLevel = (level = "") =>
  String(level || "")
    .trim()
    .toUpperCase();

const A1_DAY0_ORIENTATION_VIDEO_RESOURCE = {
  key: "a1-day0-orientation-video",
  title: "A1 Orientation AI video",
  description:
    "Watch this A1 orientation video first, then continue with the Day 0 guide and workbook.",
  url: "https://youtu.be/qPwxBYlu3CE",
};

const A2_DAY0_ORIENTATION_VIDEO_RESOURCE = {
  key: "a2-day0-orientation-video",
  title: "A2 Day 0 orientation video",
  description:
    "Watch this A2 orientation video first, then continue with the Day 0 guide and workbook.",
  url: "https://youtu.be/mY0ArOMOV9Y",
};

export const LESSON_VIDEO_DICTIONARY = {
  A1: {
    0: {
      videoResources: [A1_DAY0_ORIENTATION_VIDEO_RESOURCE],
    },
    1: {
      ai_grammar_video: "https://youtu.be/5WIMkENgdGE",
    },
    2: {
      videoResources: [
        {
          key: "ai-grammar-video",
          chapter: "0.2",
          title: "Kapitel 0.2 AI grammar video",
          description:
            "AI video lesson for German alphabet revision and self-study.",
          url: "https://youtu.be/pCQVdJGsvtk",
        },
      ],
    },
    14: {
      ai_grammar_video: "https://youtu.be/Wkj1-TnNUxY",
    },
    16: {
      videoResources: [
        {
          key: "teacher-video-lecture",
          chapter: "9_10",
          title: "Teacher video lecture",
          description: "Recorded A1 video lecture for this lesson.",
          url: "https://youtu.be/1iW2E4Pw6-M",
        },
      ],
    },
    20: {
      ai_grammar_video: "https://youtu.be/mTwDMOAEMTU",
    },
  },
  A2: {
    0: {
      videoResources: [A2_DAY0_ORIENTATION_VIDEO_RESOURCE],
    },
    1: {
      ai_grammar_video: "https://youtu.be/HMEs3mEKdrk?si=VYK4VjV9Da2_AzU0",
    },
    2: {
      ai_grammar_video: "https://youtu.be/AxSh8t71Jlo?si=1tM_ouDy_JBOayP7",
    },
    9: {
      ai_grammar_video: "https://youtu.be/8Eqzb0rK-Cc",
    },
    10: {
      ai_grammar_video: "https://youtu.be/Jgrhl9m89ME",
    },
    11: {
      ai_grammar_video: "https://youtu.be/qPZ44s10O04?si=S0eysGDwS30WrGZ-",
    },
    13: {
      ai_grammar_video: "https://youtu.be/derL046nbF8?si=VP2St42knZFk3NKo",
    },
    15: {
      ai_grammar_video: "https://youtu.be/uf3OJwalh6U",
    },
    16: {
      ai_grammar_video: "https://youtu.be/Yt_vBwfoDBk?si=mg5pzqUvaGMZZtyR",
    },
    19: {
      ai_grammar_video: "https://youtu.be/aL_CJ75l11s?si=mQTO5LEU3SsOj5xe",
    },
    22: {
      ai_grammar_video: "https://youtu.be/xwOKasZ7nsU?si=oUw6qXJQR6tMyKH4",
    },
    27: {
      ai_grammar_video: "https://youtu.be/5vmLAg1aWq8",
    },
    28: {
      ai_grammar_video: "https://www.youtube.com/watch?v=1iW2E4Pw6-M",
    },
  },
  B1: {
    1: {
      ai_grammar_video: "https://youtu.be/_mmAtSzWbNo",
    },
  },
  B2: {},
  C1: {},
};

const pickFirst = (...values) =>
  values.find((value) => typeof value === "string" && value.trim())?.trim() ||
  "";

const uniqueVideoResources = (...groups) => {
  const seen = new Set();
  return groups
    .flat()
    .filter(Boolean)
    .filter((resource) => {
      const key = resource.url;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const legacyTeacherVideoResource = (source = {}) => {
  const url = pickFirst(
    source.video,
    source.youtube_link,
    source.tutorial_video_url,
  );
  if (!url) return null;

  return {
    key: "teacher-explanation",
    chapter: source.chapter || null,
    title: "Teacher explanation",
    description: "Recorded class explanation from the teacher.",
    url,
  };
};

export const normalizeVideoResources = (source = {}) => {
  if (!source || typeof source !== "object") return [];

  const explicitResources =
    source.videoResources || source.video_resources || source.videos;
  if (Array.isArray(explicitResources)) {
    return explicitResources
      .map((resource, index) => {
        if (typeof resource === "string") {
          return {
            key: `video-${index + 1}`,
            chapter: source.chapter || null,
            title: index === 0 ? "Teacher explanation" : "AI grammar video",
            description:
              "Watch this video before you continue with the grammar and workbook.",
            url: resource,
          };
        }

        const url = pickFirst(
          resource?.url,
          resource?.href,
          resource?.youtube_link,
          resource?.video,
        );
        if (!url) return null;

        return {
          key: resource?.key || `video-${index + 1}`,
          chapter: resource?.chapter || source.chapter || null,
          title:
            resource?.title ||
            (index === 0 ? "Teacher explanation" : "AI grammar video"),
          description:
            resource?.description ||
            "Watch this video before you continue with the grammar and workbook.",
          url,
        };
      })
      .filter(Boolean);
  }

  const teacherUrl = pickFirst(
    source.teacher_video,
    source.teacherVideo,
    source.teacher_lecture_url,
    source.teacherLectureUrl,
    source.teacher_explanation_url,
    source.teacherExplanationUrl,
  );
  const aiGrammarUrl = pickFirst(
    source.ai_grammar_video,
    source.aiGrammarVideo,
    source.ai_grammar_video_url,
    source.aiGrammarVideoUrl,
    source.ai_video,
    source.aiVideo,
  );

  return [
    teacherUrl
      ? {
          key: "teacher-explanation",
          chapter: source.chapter || null,
          title: "Teacher explanation",
          description: "Recorded class explanation from the teacher.",
          url: teacherUrl,
        }
      : null,
    aiGrammarUrl
      ? {
          key: "ai-grammar-video",
          chapter: source.chapter || null,
          title: "AI grammar video",
          description:
            "Step-by-step grammar explanation for revision and self-study.",
          url: aiGrammarUrl,
        }
      : null,
  ].filter(Boolean);
};

const isTeacherVideoResource = (resource = {}) => {
  const label = `${resource.key || ""} ${resource.title || ""}`.toLowerCase();
  return label.includes("teacher");
};

const toResourceArray = (value) =>
  Array.isArray(value) ? value : value ? [value] : [];

const lessonResourceEntries = (entry = {}) => {
  const nestedResources = [
    ...toResourceArray(entry?.schreiben_sprechen),
    ...toResourceArray(entry?.lesen_hören),
  ].filter(Boolean);

  if (!nestedResources.length) return [entry];
  return nestedResources.map((resource) => ({
    ...resource,
    chapter: resource?.chapter || entry?.chapter || null,
  }));
};

const sortVideoResourcesByLessonOrder = (resources = [], entries = []) => {
  const chapterOrder = new Map();
  entries.forEach((entry, index) => {
    const chapter = String(entry?.chapter || "").trim();
    if (chapter && !chapterOrder.has(chapter)) chapterOrder.set(chapter, index);
  });

  const typeRank = (resource = {}) => (isTeacherVideoResource(resource) ? 0 : 1);
  const chapterRank = (resource = {}) => {
    const chapter = String(resource.chapter || "").trim();
    return chapterOrder.has(chapter) ? chapterOrder.get(chapter) : 999;
  };

  return [...resources].sort(
    (a, b) =>
      chapterRank(a) - chapterRank(b) || typeRank(a) - typeRank(b),
  );
};

export const getLessonVideoResources = (level, day, entry = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const dayKey = String(Number(day || entry?.day || entry?.assignmentDay || 0));
  const showTeacherVideos = normalizedLevel === "A1" && dayKey !== "0";
  const dictionaryEntry =
    LESSON_VIDEO_DICTIONARY[normalizedLevel]?.[dayKey] || {};
  const entries = lessonResourceEntries(entry);

  const explicitResources = entries.flatMap((resource) =>
    normalizeVideoResources(resource),
  );
  const legacyTeacherVideos = entries
    .map(legacyTeacherVideoResource)
    .filter(Boolean);
  const dictionaryResources = normalizeVideoResources(dictionaryEntry);
  const allResources = uniqueVideoResources(
    legacyTeacherVideos,
    explicitResources,
    dictionaryResources,
  );
  const visibleResources = showTeacherVideos
    ? allResources
    : allResources.filter((resource) => !isTeacherVideoResource(resource));

  return sortVideoResourcesByLessonOrder(visibleResources, entries);
};
