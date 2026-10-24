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

export default function TeacherLectureSupportingMaterials({ lesson = null, canonicalLesson = null }) {
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
            Supporting materials
          </span>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Teacher lecture</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
            The AI lesson stays embedded above. The teacher lecture is optional supporting material and opens separately.
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
              <strong>{resource.title || `Teacher lecture ${index + 1}`}</strong>
              {resource.description ? (
                <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>{resource.description}</p>
              ) : null}
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.linkButton, width: "fit-content" }}
              >
                Open teacher lecture
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
