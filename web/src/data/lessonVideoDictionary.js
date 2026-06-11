const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();

export const LESSON_VIDEO_DICTIONARY = {
  A1: {
    1: {
      ai_grammar_video: "https://youtu.be/5WIMkENgdGE",
    },
  },
  A2: {
    15: {
      ai_grammar_video: "https://youtu.be/uf3OJwalh6U",
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

const pickFirst = (...values) => values.find((value) => typeof value === "string" && value.trim())?.trim() || "";

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
  const url = pickFirst(source.video, source.youtube_link, source.tutorial_video_url);
  if (!url) return null;

  return {
    key: "teacher-explanation",
    title: "Teacher explanation",
    description: "Recorded class explanation from the teacher.",
    url,
  };
};

export const normalizeVideoResources = (source = {}) => {
  if (!source || typeof source !== "object") return [];

  const explicitResources = source.videoResources || source.video_resources || source.videos;
  if (Array.isArray(explicitResources)) {
    return explicitResources
      .map((resource, index) => {
        if (typeof resource === "string") {
          return {
            key: `video-${index + 1}`,
            title: index === 0 ? "Teacher explanation" : "AI grammar video",
            description: "Watch this video before you continue with the grammar and workbook.",
            url: resource,
          };
        }

        const url = pickFirst(resource?.url, resource?.href, resource?.youtube_link, resource?.video);
        if (!url) return null;

        return {
          key: resource?.key || `video-${index + 1}`,
          title: resource?.title || (index === 0 ? "Teacher explanation" : "AI grammar video"),
          description: resource?.description || "Watch this video before you continue with the grammar and workbook.",
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
    source.teacherExplanationUrl
  );
  const aiGrammarUrl = pickFirst(
    source.ai_grammar_video,
    source.aiGrammarVideo,
    source.ai_grammar_video_url,
    source.aiGrammarVideoUrl,
    source.ai_video,
    source.aiVideo
  );

  return [
    teacherUrl
      ? {
          key: "teacher-explanation",
          title: "Teacher explanation",
          description: "Recorded class explanation from the teacher.",
          url: teacherUrl,
        }
      : null,
    aiGrammarUrl
      ? {
          key: "ai-grammar-video",
          title: "AI grammar video",
          description: "Step-by-step grammar explanation for revision and self-study.",
          url: aiGrammarUrl,
        }
      : null,
  ].filter(Boolean);
};

export const getLessonVideoResources = (level, day, entry = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const dayKey = String(Number(day || entry?.day || entry?.assignmentDay || 0));
  const dictionaryEntry = LESSON_VIDEO_DICTIONARY[normalizedLevel]?.[dayKey] || {};

  const fromEntry = normalizeVideoResources(entry);
  const fromNestedLesenHoeren = normalizeVideoResources(entry?.lesen_hören);
  const fromDictionary = normalizeVideoResources(dictionaryEntry);
  const additionalResources = uniqueVideoResources(fromEntry, fromNestedLesenHoeren, fromDictionary);

  if (!additionalResources.length) return [];

  const legacyTeacherVideo = legacyTeacherVideoResource(entry) || legacyTeacherVideoResource(entry?.lesen_hören);
  return uniqueVideoResources([legacyTeacherVideo], additionalResources);
};
