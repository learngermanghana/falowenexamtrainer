import React, { useMemo } from "react";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";
import { getAdditionalLessonVideoResources } from "../data/additionalLessonVideoResources";

const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();
const isInternalLink = (url = "") => String(url || "").startsWith("/");
const getExternalProps = (url = "") => (isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" });
const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const INTERNAL_RESOURCE_ROUTES = {
  B1: {
    1: {
      grammarbook_link: "/campus/course/lesson/B1/1?view=grammar",
      workbook_link: "/campus/course/lesson/B1/1?view=workbook",
    },
  },
};

const guideStyle = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 12,
  padding: 10,
  display: "grid",
  gap: 8,
};

const resourceButtonStyle = {
  ...styles.secondaryButton,
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  padding: "7px 10px",
  fontSize: 12,
  fontWeight: 800,
};

const resourceCardStyle = {
  border: "1px solid #dbeafe",
  background: "#ffffff",
  borderRadius: 10,
  padding: 9,
  display: "grid",
  gridTemplateColumns: "28px minmax(0, 1fr)",
  gap: 8,
  alignItems: "start",
};

const findEntry = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  return (courseSchedules[normalizedLevel] || []).find((lesson) => String(lesson.day) === String(day)) || null;
};

const firstResource = (entry = {}) => {
  const lesenHoeren = toArray(entry.lesen_hören).filter(Boolean);
  const schreibenSprechen = toArray(entry.schreiben_sprechen).filter(Boolean);
  return lesenHoeren[0] || schreibenSprechen[0] || {};
};

const findResourceUrl = (entry = {}, key, level = "", day = "") => {
  const internalUrl = INTERNAL_RESOURCE_ROUTES[normalizeLevel(level)]?.[Number(day || entry?.day)]?.[key];
  if (internalUrl) return internalUrl;

  const direct = entry?.[key];
  if (direct) return direct;

  const nested = [...toArray(entry?.lesen_hören), ...toArray(entry?.schreiben_sprechen)].find((resource) => resource?.[key]);
  return nested?.[key] || "";
};

const mergeVideoResources = (...groups) => {
  const seen = new Set();
  return groups.flat().filter((resource) => {
    const url = resource?.url;
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
};

const findVideo = (videos = [], keyword) => videos.find((resource) => String(resource.title || "").toLowerCase().includes(keyword));

const LessonResourceItem = ({ number, icon, title, actionLabel, url }) => {
  if (!url) return null;

  return (
    <article style={resourceCardStyle}>
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#eff6ff",
          color: "#1d4ed8",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 12,
        }}
      >
        {number}
      </span>
      <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
        <strong style={{ fontSize: 13, lineHeight: 1.25 }}>
          {icon} {title}
        </strong>
        <a href={url} {...getExternalProps(url)} style={resourceButtonStyle}>
          {actionLabel}
        </a>
      </div>
    </article>
  );
};

const WorkbookStartGuide = ({ level, day, grammarUrl, entry: suppliedEntry }) => {
  const entry = useMemo(() => suppliedEntry || findEntry(level, day), [day, level, suppliedEntry]);
  const videos = useMemo(
    () => mergeVideoResources(
      getLessonVideoResources(level, day, entry || {}),
      getAdditionalLessonVideoResources(level, day),
    ),
    [day, entry, level],
  );
  const teacherVideo = findVideo(videos, "teacher") || videos[0];
  const aiVideo = findVideo(videos, "ai") || videos.find((resource) => resource?.url !== teacherVideo?.url);
  const derivedGrammarUrl = grammarUrl || findResourceUrl(entry, "grammarbook_link", level, day);
  const primaryResource = firstResource(entry);
  const chapterText = primaryResource?.chapter ? ` Kapitel ${primaryResource.chapter}` : "";

  return (
    <section style={guideStyle}>
      <div style={{ display: "grid", gap: 3 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Supporting materials</h2>
        <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.45, fontSize: 12 }}>
          You are already in the workbook{chapterText}. Use these if you need help.
        </p>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <LessonResourceItem number="1" icon="🎬" title="Teacher lecture video" actionLabel="Watch teacher video" url={teacherVideo?.url} />
        <LessonResourceItem number="2" icon="🤖" title="AI lecture / grammar video" actionLabel="Watch AI video" url={aiVideo?.url} />
        <LessonResourceItem number="3" icon="📘" title="Grammar book" actionLabel="Open grammar book" url={derivedGrammarUrl} />
      </div>
    </section>
  );
};

export default WorkbookStartGuide;
