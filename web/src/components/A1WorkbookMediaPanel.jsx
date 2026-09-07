import React, { useMemo } from "react";
import { A1_ASSIGNMENT_REGISTRY } from "../data/a1AssignmentRegistry";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";

const clean = (value = "") => String(value || "").trim();
const normalizeChapter = (value = "") => clean(value).toLowerCase();

const resourceLooksLikeTeacher = (resource = {}) =>
  /teacher|tutor lecture/i.test(`${resource.key || ""} ${resource.title || ""}`);

const resourceLooksLikeAi = (resource = {}) =>
  /\bai\b|ai[-_ ]?grammar|ai[-_ ]?video/i.test(`${resource.key || ""} ${resource.title || ""}`);

const chaptersForDay = (day) =>
  Object.values(A1_ASSIGNMENT_REGISTRY)
    .filter((assignment) => Number(assignment.day) === Number(day))
    .map((assignment) => normalizeChapter(assignment.chapter));

const chapterMatches = (resource, chapter, day) => {
  const expected = normalizeChapter(chapter);
  if (!expected) return true;

  const actual = normalizeChapter(resource?.chapter);
  if (!actual) return chaptersForDay(day).length <= 1;
  if (actual === expected) return true;

  return actual
    .split(/[^0-9.]+/)
    .map((part) => normalizeChapter(part))
    .filter(Boolean)
    .includes(expected);
};

const dedupeByUrl = (resources = []) => {
  const seen = new Set();
  return resources.filter((resource) => {
    const url = clean(resource?.url);
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
};

export const getYouTubeVideoId = (url = "") => {
  const value = clean(url);
  if (!value) return "";

  try {
    const parsed = new URL(value);
    if (parsed.hostname === "youtu.be") return clean(parsed.pathname.split("/").filter(Boolean)[0]);
    if (/youtube\.com$/i.test(parsed.hostname) || /\.youtube\.com$/i.test(parsed.hostname)) {
      if (parsed.pathname === "/watch") return clean(parsed.searchParams.get("v"));
      const parts = parsed.pathname.split("/").filter(Boolean);
      const markerIndex = parts.findIndex((part) => ["embed", "shorts", "live"].includes(part));
      if (markerIndex >= 0) return clean(parts[markerIndex + 1]);
    }
  } catch {
    return "";
  }

  return "";
};

export const getA1WorkbookMediaResources = ({ day, chapter } = {}) => {
  const numericDay = Number(day || 0);
  if (!numericDay) return [];

  const exactTeacherResources = getA1TeacherVideoResources(numericDay)
    .filter((resource) => chapterMatches(resource, chapter, numericDay));
  const lessonResources = getLessonVideoResources("A1", numericDay, {}) || [];
  const fallbackTeacherResources = exactTeacherResources.length
    ? []
    : lessonResources.filter(
      (resource) => resourceLooksLikeTeacher(resource) && chapterMatches(resource, chapter, numericDay),
    );
  const teacherResources = [...exactTeacherResources, ...fallbackTeacherResources].map((resource) => ({
    ...resource,
    kind: "teacher",
    label: "Teacher lecture",
  }));

  const teacherUrls = new Set(teacherResources.map((resource) => clean(resource.url)));
  const aiResources = lessonResources
    .filter((resource) => resourceLooksLikeAi(resource) && chapterMatches(resource, chapter, numericDay))
    .filter((resource) => !teacherUrls.has(clean(resource?.url)))
    .map((resource) => ({ ...resource, kind: "ai", label: "AI revision" }));

  return dedupeByUrl([...teacherResources, ...aiResources]);
};

const A1WorkbookMediaPanel = ({ day, chapter }) => {
  const resources = useMemo(
    () => getA1WorkbookMediaResources({ day, chapter }),
    [day, chapter],
  );

  if (!resources.length) return null;

  return (
    <section
      data-a1-workbook-media="true"
      aria-label="A1 lesson videos"
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
      }}
    >
      {resources.map((resource, index) => {
        const videoId = getYouTubeVideoId(resource.url);
        return (
          <article
            key={resource.key || `${resource.kind}-${resource.url}-${index}`}
            style={{
              background: "#ffffff",
              border: resource.kind === "teacher" ? "2px solid #2563eb" : "1px solid #cbd5e1",
              borderRadius: 16,
              boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
              display: "grid",
              gap: 10,
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            <div style={{ padding: "14px 14px 0", display: "grid", gap: 4 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  color: resource.kind === "teacher" ? "#1d4ed8" : "#475569",
                }}
              >
                {resource.label}
              </span>
              <strong style={{ fontSize: 16, color: "#0f172a" }}>
                {resource.title || (resource.kind === "teacher" ? "Teacher lecture" : "AI explanation")}
              </strong>
              {resource.description ? (
                <span style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>{resource.description}</span>
              ) : null}
            </div>

            {videoId ? (
              <div style={{ aspectRatio: "16 / 9", width: "100%", background: "#0f172a" }}>
                <iframe
                  title={`${resource.label} · A1 Day ${day}`}
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ border: 0, width: "100%", height: "100%", display: "block" }}
                />
              </div>
            ) : (
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                style={{ padding: "0 14px 14px", color: "#1d4ed8", fontWeight: 800 }}
              >
                Open video
              </a>
            )}
          </article>
        );
      })}
    </section>
  );
};

export default A1WorkbookMediaPanel;
