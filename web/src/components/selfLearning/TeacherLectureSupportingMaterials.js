import React from "react";
import { styles } from "../../styles";

export const isTeacherLectureResource = (resource = {}) =>
  /teacher|lecture|tutor/i.test(
    `${resource?.key || ""} ${resource?.title || ""} ${resource?.type || ""}`,
  );

const dedupeResources = (resources = []) => {
  const seen = new Set();
  return resources.filter((resource) => {
    const url = String(resource?.url || "").trim();
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
};

export const resolveTeacherLectureResources = ({ lesson = null, canonicalLesson = null } = {}) => {
  const lessonResources = lesson?.resources || {};
  const canonicalResources = canonicalLesson?.resources || {};
  const candidates = [
    lesson?.teacherVideo,
    lessonResources.teacherVideo,
    canonicalResources.teacherVideo,
    ...(Array.isArray(lessonResources.videos) ? lessonResources.videos : []),
    ...(Array.isArray(canonicalResources.videos) ? canonicalResources.videos : []),
    isTeacherLectureResource(lesson?.videoResource) ? lesson.videoResource : null,
  ];

  return dedupeResources(candidates.filter((resource) => resource?.url && isTeacherLectureResource(resource)));
};

export const removeTeacherLectureFromLesson = (lesson = null) => {
  if (!lesson) return lesson;
  const resources = lesson.resources || {};
  const nextResources = {
    ...resources,
    teacherVideo: null,
    videos: Array.isArray(resources.videos)
      ? resources.videos.filter((resource) => !isTeacherLectureResource(resource))
      : resources.videos,
  };

  return {
    ...lesson,
    teacherVideo: null,
    videoResource: isTeacherLectureResource(lesson.videoResource) ? null : lesson.videoResource,
    resources: nextResources,
  };
};

export const removeTeacherLectureFromCanonicalLesson = (canonicalLesson = null) => {
  if (!canonicalLesson) return canonicalLesson;
  const resources = canonicalLesson.resources || {};
  return {
    ...canonicalLesson,
    resources: {
      ...resources,
      teacherVideo: null,
      videos: Array.isArray(resources.videos)
        ? resources.videos.filter((resource) => !isTeacherLectureResource(resource))
        : resources.videos,
    },
  };
};

const TEACHER_LECTURE_LABELS = {
  en: {
    category: "Supporting materials",
    heading: "Teacher lecture",
    description: "The AI lesson stays embedded above. The teacher lecture is optional supporting material and opens separately.",
    fallback: "Teacher lecture",
    action: "Open teacher lecture",
  },
  sw: {
    category: "Nyenzo za ziada",
    heading: "Video ya mwalimu",
    description: "Video ya AI iko hapo juu. Tazama pia maelezo ya mwalimu kwa hiari; video hii itafunguka katika ukurasa mwingine.",
    fallback: "Video ya mwalimu",
    action: "Tazama video ya mwalimu",
  },
};

export default function TeacherLectureSupportingMaterials({ lesson = null, canonicalLesson = null, language = "en" }) {
  const labels = TEACHER_LECTURE_LABELS[language] || TEACHER_LECTURE_LABELS.en;
  const resources = resolveTeacherLectureResources({ lesson, canonicalLesson });
  if (!resources.length) return null;

  return (
    <div style={{ ...styles.container, paddingTop: 0 }} data-teacher-lecture-support="links-only">
      <section
        style={{
          ...styles.card,
          display: "grid",
          gap: 12,
          border: "1px solid #cbd5e1",
          background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        }}
      >
        <div style={{ display: "grid", gap: 5 }}>
          <span style={{ ...styles.badge, width: "fit-content", background: "#e2e8f0", color: "#334155" }}>
            {labels.category}
          </span>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{labels.heading}</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
            {labels.description}
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {resources.map((resource, index) => (
            <article
              key={resource.url}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: 13,
                background: "#ffffff",
                display: "grid",
                gap: 8,
              }}
            >
              <strong>{resource.title || `${labels.fallback} ${index + 1}`}</strong>
              {resource.description ? (
                <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>{resource.description}</p>
              ) : null}
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.linkButton, width: "fit-content" }}
              >
                {labels.action}
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
